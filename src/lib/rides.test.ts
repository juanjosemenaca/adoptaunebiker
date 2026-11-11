import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { googleMapsEmbedUrl, googleMapsOpenUrl, parseMapsPin } from "./meeting-pin.ts";
import { todayDayKey } from "./ride-calendar.ts";
import {
  canAddRideAlbum,
  canArchiveRide,
  canCancelHostedRide,
  canCommentOnRide,
  canHardDeleteRide,
  canManageHostedRide,
  canRequestRideSpot,
  canReuseRide,
  canSeeRideChat,
  checkTrackFile,
  isRideFull,
  joinedRideIds,
  madridDateParts,
  matchesRideFilters,
  parseRideDraft,
  parseRideFilters,
  parseRideLink,
  parseRideView,
  rideMark,
  isUpcomingRide,
  partitionMyRides,
  splitUpcomingPast,
} from "./ride-helpers.ts";

describe("ride filters", () => {
  it("parses query strings and ignores junk", () => {
    assert.deepEqual(
      parseRideFilters({
        from: "2026-11-20",
        to: ["2026-11-22"],
        modalidad: "tierra",
        ritmo: "suave",
        lugar: "  Collserola  ",
      }),
      {
        from: "2026-11-20",
        to: "2026-11-22",
        surface: "tierra",
        level: "suave",
        place: "Collserola",
      },
    );
    assert.deepEqual(parseRideFilters({ from: "nope", modalidad: "bmx" }), {});
    assert.equal(parseRideView({ vista: "lista" }), "list");
    assert.equal(parseRideView({}), "calendar");
  });

  it("matches by Madrid day, surface and place text", () => {
    const ride = {
      startsAt: "2026-11-20T08:00:00.000Z",
      surface: "tierra" as const,
      level: "dura" as const,
      place: "Collserola, Barcelona",
    };
    assert.equal(matchesRideFilters(ride, { from: "2026-11-20", to: "2026-11-20" }), true);
    assert.equal(matchesRideFilters(ride, { from: "2026-11-21" }), false);
    assert.equal(matchesRideFilters(ride, { surface: "asfalto" }), false);
    assert.equal(matchesRideFilters(ride, { place: "coll" }), true);
    assert.equal(matchesRideFilters(ride, { place: "garraf" }), false);
  });
});

describe("ride draft", () => {
  it("requires a future start, title and place", () => {
    const start = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const ok = parseRideDraft({
      title: "Domingo suave",
      startsAtIso: start,
      durationMin: "180",
      surface: "asfalto",
      hostBike: "Tarmac",
      level: "suave",
      place: "Garraf",
    });
    assert.equal(ok.ok, true);

    const past = parseRideDraft({
      title: "Ayer",
      startsAtIso: "2020-01-01T09:00:00.000Z",
      durationMin: "180",
      surface: "asfalto",
      hostBike: "Tarmac",
      level: "suave",
      place: "Garraf",
    });
    assert.deepEqual(past, { ok: false, error: "start" });

    const short = parseRideDraft({
      title: "No",
      startsAtIso: start,
      durationMin: "180",
      surface: "asfalto",
      hostBike: "Tarmac",
      level: "suave",
      place: "Garraf",
    });
    assert.deepEqual(short, { ok: false, error: "title" });
  });

  it("accepts date, time, km, climbing and a route link", () => {
    const ok = parseRideDraft({
      title: "Garraf suave",
      startDate: "2027-03-20",
      startTime: "08:30",
      durationMin: "180",
      surface: "asfalto",
      hostBike: "Tarmac",
      level: "suave",
      place: "Garraf",
      distanceKm: "72",
      elevationM: "900",
      routeUrl: "https://www.komoot.com/tour/1",
    });
    assert.equal(ok.ok, true);
    if (ok.ok) {
      assert.equal(ok.draft.distanceKm, 72);
      assert.equal(ok.draft.elevationM, 900);
      assert.equal(ok.draft.routeUrl.startsWith("https://"), true);
    }
    assert.deepEqual(
      parseRideDraft({
        title: "Garraf suave",
        startDate: "2027-03-20",
        startTime: "08:30",
        durationMin: "180",
        surface: "asfalto",
        hostBike: "Tarmac",
        level: "suave",
        place: "Garraf",
        distanceKm: "2",
      }),
      { ok: false, error: "distance" },
    );
    assert.deepEqual(
      parseRideDraft({
        title: "Garraf suave",
        startDate: "2027-03-20",
        startTime: "08:30",
        durationMin: "180",
        surface: "asfalto",
        hostBike: "Tarmac",
        level: "suave",
        place: "Garraf",
        routeUrl: "ftp://files.example.com/ruta",
      }),
      { ok: false, error: "routeUrl" },
    );
  });

  it("keeps a meeting pin from the map or a Google Maps link", () => {
    const fromMap = parseRideDraft({
      title: "Garraf suave",
      startDate: "2027-03-20",
      startTime: "08:30",
      durationMin: "180",
      surface: "asfalto",
      hostBike: "Tarmac",
      level: "suave",
      place: "Garraf",
      meetingPoint: "Parking del Garraf",
      meetingLat: "41.2531",
      meetingLng: "1.9034",
    });
    assert.equal(fromMap.ok, true);
    if (fromMap.ok) {
      assert.equal(fromMap.draft.meetingPoint, "Parking del Garraf");
      assert.equal(fromMap.draft.meetingLat, 41.2531);
      assert.equal(fromMap.draft.meetingLng, 1.9034);
    }
    const fromLink = parseRideDraft({
      title: "Garraf suave",
      startDate: "2027-03-20",
      startTime: "08:30",
      durationMin: "180",
      surface: "asfalto",
      hostBike: "Tarmac",
      level: "suave",
      place: "Garraf",
      meetingMaps: "https://www.google.com/maps?q=41.3874,2.1686",
    });
    assert.equal(fromLink.ok, true);
    if (fromLink.ok) {
      assert.equal(fromLink.draft.meetingLat, 41.3874);
      assert.equal(fromLink.draft.meetingLng, 2.1686);
    }
    assert.deepEqual(
      parseRideDraft({
        title: "Garraf suave",
        startDate: "2027-03-20",
        startTime: "08:30",
        durationMin: "180",
        surface: "asfalto",
        hostBike: "Tarmac",
        level: "suave",
        place: "Garraf",
        meetingMaps: "https://maps.app.goo.gl/nocoords",
      }),
      { ok: false, error: "meetingPin" },
    );
  });
});

describe("meeting pin", () => {
  it("reads Google Maps place and query links", () => {
    assert.deepEqual(parseMapsPin("https://www.google.com/maps/place/X/@41.40363,2.1744,17z"), {
      lat: 41.40363,
      lng: 2.1744,
    });
    assert.deepEqual(parseMapsPin("https://maps.google.com/?q=41.3874,2.1686"), {
      lat: 41.3874,
      lng: 2.1686,
    });
    assert.deepEqual(parseMapsPin("41.3874, 2.1686"), { lat: 41.3874, lng: 2.1686 });
    assert.equal(parseMapsPin("https://maps.app.goo.gl/abc"), null);
    assert.equal(
      googleMapsEmbedUrl({ lat: 41.2531, lng: 1.9034 }, "", "es").includes("41.2531"),
      true,
    );
    assert.equal(googleMapsOpenUrl(null, "Parking del Garraf").includes("Parking"), true);
  });
});

describe("ride access", () => {
  it("counts the host in aforo and opens chat after accept", () => {
    assert.equal(isRideFull(0, null), false);
    assert.equal(isRideFull(0, 2), false);
    assert.equal(isRideFull(1, 2), true);
    assert.equal(canSeeRideChat("host", "host", null), true);
    assert.equal(canSeeRideChat("a", "host", "pending"), false);
    assert.equal(canSeeRideChat("a", "host", "accepted"), true);
    const soon = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const ago = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    assert.equal(
      canRequestRideSpot({
        userId: "a",
        hostId: "host",
        status: "open",
        joinStatus: null,
        acceptedCount: 0,
        maxRiders: 4,
        startsAt: soon,
      }),
      true,
    );
    assert.equal(
      canRequestRideSpot({
        userId: "host",
        hostId: "host",
        status: "open",
        joinStatus: null,
        acceptedCount: 0,
        maxRiders: 4,
        startsAt: soon,
      }),
      false,
    );
    assert.equal(
      canRequestRideSpot({
        userId: "a",
        hostId: "host",
        status: "cancelled",
        joinStatus: null,
        acceptedCount: 0,
        maxRiders: null,
        startsAt: soon,
      }),
      false,
    );
    assert.equal(
      canRequestRideSpot({
        userId: "a",
        hostId: "host",
        status: "open",
        joinStatus: null,
        acceptedCount: 0,
        maxRiders: 4,
        startsAt: ago,
      }),
      false,
    );
    assert.equal(canManageHostedRide("host", { hostId: "host", status: "open" }), true);
    assert.equal(canManageHostedRide("a", { hostId: "host", status: "open" }), false);
    assert.equal(canManageHostedRide("host", { hostId: "host", status: "cancelled" }), false);
    assert.equal(
      canManageHostedRide("host", { hostId: "host", status: "open", startsAt: ago }),
      false,
    );
    assert.equal(canCancelHostedRide("host", { hostId: "host", status: "open" }), true);
    assert.equal(canCancelHostedRide("host", { hostId: "host", status: "cancelled" }), false);
    assert.equal(canHardDeleteRide("host", { hostId: "host", status: "cancelled" }), true);
    assert.equal(canHardDeleteRide("host", { hostId: "host", status: "open" }), false);
    assert.equal(
      canReuseRide({
        userId: "a",
        hostId: "host",
        status: "open",
        joinStatus: "accepted",
        startsAt: ago,
      }),
      true,
    );
    assert.equal(
      canReuseRide({
        userId: "a",
        hostId: "host",
        status: "cancelled",
        joinStatus: "accepted",
        startsAt: soon,
      }),
      true,
    );
    assert.equal(
      canArchiveRide({
        userId: "a",
        hostId: "host",
        status: "open",
        joinStatus: "accepted",
        startsAt: ago,
      }),
      true,
    );
    assert.equal(
      canArchiveRide({
        userId: "a",
        hostId: "host",
        status: "cancelled",
        joinStatus: "accepted",
        startsAt: ago,
      }),
      false,
    );
    assert.equal(canCommentOnRide({ userId: "a", hostId: "host", status: "open", joinStatus: "accepted" }), true);
    assert.equal(canCommentOnRide({ userId: "a", hostId: "host", status: "cancelled", joinStatus: "accepted" }), false);
    assert.equal(
      canAddRideAlbum({
        userId: "a",
        hostId: "host",
        status: "open",
        joinStatus: "accepted",
        startsAt: ago,
      }),
      true,
    );
    assert.equal(
      canAddRideAlbum({
        userId: "host",
        hostId: "host",
        status: "open",
        joinStatus: null,
        startsAt: ago,
      }),
      true,
    );
    assert.equal(
      canAddRideAlbum({
        userId: "a",
        hostId: "host",
        status: "open",
        joinStatus: "accepted",
        startsAt: soon,
      }),
      false,
    );
    assert.equal(
      canAddRideAlbum({
        userId: "a",
        hostId: "host",
        status: "open",
        joinStatus: "pending",
        startsAt: ago,
      }),
      false,
    );
    assert.equal(checkTrackFile({ type: "application/gpx+xml", size: 1200, name: "ruta.gpx" }), null);
    assert.equal(checkTrackFile({ type: "text/plain", size: 1200, name: "ruta.txt" }), "type");
    assert.equal(parseRideLink("https://www.wikiloc.com/x").ok, true);
    assert.equal(parseRideLink("ftp://x").ok, false);
  });

  it("splits Madrid date and time for the edit form", () => {
    assert.deepEqual(madridDateParts("2026-11-20T07:00:00.000Z"), { date: "2026-11-20", time: "08:00" });
    assert.deepEqual(madridDateParts("nope"), { date: "", time: "" });
  });

  it("colors hosted rides over joined over open", () => {
    const joined = joinedRideIds([
      { rideId: "a", status: "accepted" },
      { rideId: "b", status: "pending" },
      { rideId: "c", status: "declined" },
    ]);
    assert.equal(rideMark({ id: "a", hostId: "me" }, "me", joined), "hosted");
    assert.equal(rideMark({ id: "a", hostId: "other" }, "me", joined), "joined");
    assert.equal(rideMark({ id: "b", hostId: "other" }, "me", joined), "joined");
    assert.equal(rideMark({ id: "c", hostId: "other" }, "me", joined), "open");
  });
});

describe("upcoming vs past", () => {
  it("puts cancelled and started rides in past", () => {
    const now = new Date("2026-11-11T12:00:00.000Z");
    assert.equal(
      isUpcomingRide({ startsAt: "2026-11-20T08:00:00.000Z", status: "open" }, now),
      true,
    );
    assert.equal(
      isUpcomingRide({ startsAt: "2026-11-01T08:00:00.000Z", status: "open" }, now),
      false,
    );
    assert.equal(
      isUpcomingRide({ startsAt: "2026-11-20T08:00:00.000Z", status: "cancelled" }, now),
      false,
    );
    const split = splitUpcomingPast(
      [
        { id: "past", startsAt: "2026-11-01T08:00:00.000Z", status: "open" as const },
        { id: "soon", startsAt: "2026-11-20T08:00:00.000Z", status: "open" as const },
        { id: "later", startsAt: "2026-12-01T08:00:00.000Z", status: "open" as const },
        { id: "off", startsAt: "2026-11-22T08:00:00.000Z", status: "cancelled" as const },
      ],
      now,
    );
    assert.deepEqual(
      split.upcoming.map((item) => item.id),
      ["soon", "later"],
    );
    assert.deepEqual(
      split.past.map((item) => item.id),
      ["off", "past"],
    );
  });

  it("puts hosted upcoming, accepted going and done rides together", () => {
    const now = new Date("2026-11-11T12:00:00.000Z");
    const hostedSoon = { id: "host-soon", startsAt: "2026-11-20T08:00:00.000Z", status: "open" as const };
    const hostedDone = { id: "host-done", startsAt: "2026-11-01T08:00:00.000Z", status: "open" as const };
    const hostedOff = { id: "host-off", startsAt: "2026-11-22T08:00:00.000Z", status: "cancelled" as const };
    const going = { id: "go", startsAt: "2026-11-18T08:00:00.000Z", status: "open" as const };
    const gone = { id: "gone", startsAt: "2026-10-20T08:00:00.000Z", status: "open" as const };
    const joinedOff = { id: "join-off", startsAt: "2026-11-09T08:00:00.000Z", status: "cancelled" as const };
    const waiting = { id: "wait", startsAt: "2026-11-22T08:00:00.000Z", status: "open" as const };
    const parts = partitionMyRides(
      [hostedSoon, hostedDone, hostedOff],
      [
        { status: "accepted", ride: going },
        { status: "accepted", ride: gone },
        { status: "accepted", ride: joinedOff },
        { status: "pending", ride: waiting },
        { status: "declined", ride: { id: "no", startsAt: "2026-11-19T08:00:00.000Z", status: "open" } },
      ],
      now,
    );
    assert.deepEqual(
      parts.hostedUpcoming.map((item) => item.id),
      ["host-soon"],
    );
    assert.deepEqual(
      parts.going.map((item) => item.id),
      ["go"],
    );
    assert.deepEqual(
      parts.pending.map((item) => item.id),
      ["wait"],
    );
    assert.deepEqual(
      parts.done.map((item) => item.id),
      ["host-done", "gone"],
    );
    assert.deepEqual(
      parts.removed.map((item) => item.id),
      ["host-off", "join-off"],
    );
    const hidden = partitionMyRides(
      [hostedSoon, hostedDone, hostedOff],
      [
        { status: "accepted", ride: going },
        { status: "accepted", ride: gone },
        { status: "accepted", ride: joinedOff },
      ],
      now,
      { dismissed: new Set(["gone"]), purged: new Set(["join-off"]) },
    );
    assert.deepEqual(
      hidden.done.map((item) => item.id),
      ["host-done"],
    );
    assert.deepEqual(
      hidden.removed.map((item) => item.id),
      ["host-off", "gone"],
    );
  });
});

describe("calendar today", () => {
  it("uses the Madrid calendar day", () => {
    assert.equal(todayDayKey(new Date("2026-11-11T10:00:00.000Z")), "2026-11-11");
    assert.equal(todayDayKey(new Date("2026-11-10T23:30:00.000Z")), "2026-11-11");
  });
});
