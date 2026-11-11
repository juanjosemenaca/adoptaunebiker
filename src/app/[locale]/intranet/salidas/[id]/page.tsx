import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { answerRideRequestAction, cancelRideRequestAction } from "@/app/ride-actions";
import { MeetingPinView } from "@/components/meeting-pin-view";
import { RideAlbumForm } from "@/components/ride-album-form";
import { RideHostActions } from "@/components/ride-host-actions";
import { RideKeepActions } from "@/components/ride-keep-actions";
import { RideChatForm } from "@/components/ride-chat-form";
import { RideJoinForm } from "@/components/ride-join-form";
import { dateLocale } from "@/i18n/config";
import { fill, getDictionary } from "@/i18n/get-dictionary";
import { hrefs } from "@/lib/paths";
import { listRideHides } from "@/lib/ride-dismissals";
import { listRideKeeps } from "@/lib/ride-keeps";
import {
  canAddRideAlbum,
  canArchiveRide,
  canCommentOnRide,
  canManageHostedRide,
  canRequestRideSpot,
  canReuseRide,
  canSeeRideChat,
  durationLabel,
  getRide,
  isRideFull,
  isRidePast,
  isUpcomingRide,
  listRideJoinRequests,
  listRideMessages,
  rideStamp,
} from "@/lib/rides";
import { getSession } from "@/lib/session";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const ride = await getRide(id);
  return {
    title: ride?.title ?? getDictionary(locale).intranet.groupRides.title,
    robots: { index: false, follow: false },
  };
}

export default async function RideDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const session = await getSession();
  if (!session) return null;
  const t = getDictionary(locale);
  const links = hrefs(locale);
  const lang = dateLocale[locale as keyof typeof dateLocale] ?? locale;
  const ride = await getRide(id);
  if (!ride) notFound();

  const requests = await listRideJoinRequests(ride.id);
  const accepted = requests.filter((item) => item.status === "accepted");
  const pending = requests.filter((item) => item.status === "pending");
  const mine = requests.find((item) => item.riderId === session.id) ?? null;
  const isHost = ride.hostId === session.id;
  const past = isRidePast(ride.startsAt);
  const done = !isUpcomingRide(ride);
  const ridden = past && ride.status !== "cancelled";
  const canManage = canManageHostedRide(session.id, ride);
  const canChat = canSeeRideChat(session.id, ride.hostId, mine?.status ?? null);
  const hides = await listRideHides();
  const canReuse = canReuseRide({
    userId: session.id,
    hostId: ride.hostId,
    status: ride.status,
    joinStatus: mine?.status ?? null,
    startsAt: ride.startsAt,
  });
  const canArchive = canArchiveRide({
    userId: session.id,
    hostId: ride.hostId,
    status: ride.status,
    joinStatus: mine?.status ?? null,
    startsAt: ride.startsAt,
  });
  const canPurge =
    canChat &&
    (ride.status === "cancelled" || hides.dismissed.has(ride.id)) &&
    !hides.purged.has(ride.id);
  const afterActions = canReuse || canArchive || canPurge;
  const canComment = canCommentOnRide({
    userId: session.id,
    hostId: ride.hostId,
    status: ride.status,
    joinStatus: mine?.status ?? null,
  });
  const canAlbum = canAddRideAlbum({
    userId: session.id,
    hostId: ride.hostId,
    status: ride.status,
    joinStatus: mine?.status ?? null,
    startsAt: ride.startsAt,
  });
  const messages = canChat ? await listRideMessages(ride.id) : [];
  const keeps = canChat ? await listRideKeeps(ride.id) : [];
  const albumPhotos = keeps.filter((item) => item.kind === "photo");
  const albumTracks = keeps.filter((item) => item.kind !== "photo");
  const full = isRideFull(ride.acceptedCount, ride.maxRiders);
  const canAsk = canRequestRideSpot({
    userId: session.id,
    hostId: ride.hostId,
    status: ride.status,
    joinStatus: mine?.status ?? null,
    acceptedCount: ride.acceptedCount,
    maxRiders: ride.maxRiders,
    startsAt: ride.startsAt,
  });
  const statusLabel = {
    pending: t.intranet.pending,
    accepted: t.intranet.accepted,
    declined: t.intranet.declined,
    cancelled: t.intranet.groupRides.cancelled,
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.28em] text-sodium">
        {t.intranet.groupRides.title}
      </p>
      {canManage ? (
        <div className="mt-6">
          <RideHostActions
            rideId={ride.id}
            locale={locale}
            editHref={links.rideEdit(ride.id)}
            t={t}
          />
        </div>
      ) : null}
      {afterActions ? (
        <div className="mt-6">
          <RideKeepActions
            rideId={ride.id}
            locale={locale}
            reuseHref={links.rideReuse(ride.id)}
            canReuse={canReuse}
            canArchive={canArchive}
            canPurge={canPurge}
            t={t}
          />
        </div>
      ) : null}
      <h1 className="display mt-6 text-6xl">{ride.title}</h1>
      <p className="mt-4 text-mist">
        {rideStamp(ride.startsAt, lang)} · {durationLabel(ride.durationMin)}
        {ride.distanceKm
          ? ` · ${fill(t.intranet.groupRides.distanceKm, { n: ride.distanceKm })}`
          : ""}
        {ride.elevationM != null && ride.elevationM > 0
          ? ` · ${fill(t.intranet.groupRides.elevationM, { n: ride.elevationM })}`
          : ""}
      </p>
      <p className="mt-2 text-sm text-mist">
        {t.surfaces[ride.surface]} · {t.rideLevels[ride.level]}
        {ride.hostBike ? ` · ${ride.hostBike}` : ""}
      </p>
      <p className="mt-4 text-bone">{ride.place}</p>
      {ride.meetingLat != null && ride.meetingLng != null ? (
        <MeetingPinView
          pin={{ lat: ride.meetingLat, lng: ride.meetingLng }}
          label={ride.meetingPoint}
          openLabel={t.intranet.groupRides.meetingOpen}
          locale={locale}
        />
      ) : ride.meetingPoint ? (
        <MeetingPinView
          pin={null}
          label={ride.meetingPoint}
          openLabel={t.intranet.groupRides.meetingOpen}
          locale={locale}
        />
      ) : null}
      {ride.routeUrl ? (
        <p className="mt-2">
          <a
            href={ride.routeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-sodium hover:text-bone"
          >
            {t.intranet.groupRides.openRoute}
          </a>
        </p>
      ) : null}
      <p className="mt-4 text-sm text-mist">
        {fill(t.intranet.groupRides.hostedBy, { name: ride.hostName || t.intranet.cyclist })}
        {" · "}
        {ride.status === "cancelled"
          ? t.intranet.groupRides.cancelled
          : past
            ? t.intranet.groupRides.done
            : full
              ? t.intranet.groupRides.full
              : ride.maxRiders
                ? `${accepted.length + 1}/${ride.maxRiders}`
                : fill(t.intranet.groupRides.spots, { n: accepted.length + 1 })}
      </p>
      {ride.photoUrls.length > 0 ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {ride.photoUrls.map((src) => (
            <img key={src} src={src} alt="" className="h-48 w-full object-cover" />
          ))}
        </div>
      ) : null}
      {ride.notes ? (
        <p className="mt-6 whitespace-pre-wrap text-sm leading-7 text-bone/85">{ride.notes}</p>
      ) : null}

      <section className="mt-12">
        <h2 className="display text-4xl">
          {done ? t.intranet.groupRides.whoWent : t.intranet.groupRides.whoGoes}
        </h2>
        <ul className="mt-4 divide-y divide-line border border-line bg-rubber">
          <li className="px-4 py-3 text-sm text-bone">
            {ride.hostName || t.intranet.cyclist}
          </li>
          {accepted.map((item) => (
            <li key={item.id} className="px-4 py-3 text-sm text-bone">
              {item.riderName || t.intranet.cyclist}
            </li>
          ))}
        </ul>
      </section>

      {isHost && !done ? (
        <section className="mt-12">
          <h2 className="display text-4xl">{t.intranet.groupRides.pendingInbox}</h2>
          {pending.length === 0 ? (
            <p className="mt-3 text-sm text-mist">{t.intranet.groupRides.emptyPending}</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {pending.map((item) => (
                <li key={item.id} className="border border-line bg-rubber p-4">
                  <p className="text-sm text-bone">{item.riderName || t.intranet.cyclist}</p>
                  {item.message ? <p className="mt-2 text-sm text-mist">{item.message}</p> : null}
                  {canManage ? (
                    <div className="mt-4 flex gap-2">
                      <form action={answerRideRequestAction}>
                        <input type="hidden" name="requestId" value={item.id} />
                        <input type="hidden" name="rideId" value={ride.id} />
                        <input type="hidden" name="status" value="accepted" />
                        <input type="hidden" name="locale" value={locale} />
                        <button
                          type="submit"
                          className="bg-volt px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-bone"
                        >
                          {t.intranet.accept}
                        </button>
                      </form>
                      <form action={answerRideRequestAction}>
                        <input type="hidden" name="requestId" value={item.id} />
                        <input type="hidden" name="rideId" value={ride.id} />
                        <input type="hidden" name="status" value="declined" />
                        <input type="hidden" name="locale" value={locale} />
                        <button
                          type="submit"
                          className="border border-line px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-mist"
                        >
                          {t.intranet.no}
                        </button>
                      </form>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      {!isHost && !done ? (
        <section className="mt-12 border border-line bg-rubber p-5">
          {mine ? (
            <>
              <p className="text-sm text-bone">
                {mine.status === "pending"
                  ? t.intranet.groupRides.requestSent
                  : statusLabel[mine.status]}
              </p>
              {mine.message ? <p className="mt-2 text-sm text-mist">{mine.message}</p> : null}
              {mine.status === "pending" ? (
                <form action={cancelRideRequestAction} className="mt-4">
                  <input type="hidden" name="requestId" value={mine.id} />
                  <input type="hidden" name="rideId" value={ride.id} />
                  <input type="hidden" name="locale" value={locale} />
                  <button
                    type="submit"
                    className="text-[11px] uppercase tracking-[0.16em] text-mist hover:text-bone"
                  >
                    {t.intranet.groupRides.cancelRequest}
                  </button>
                </form>
              ) : null}
            </>
          ) : canAsk ? (
            <RideJoinForm rideId={ride.id} locale={locale} t={t} />
          ) : ride.status !== "open" ? (
            <p className="text-sm text-mist">{t.intranet.groupRides.cancelled}</p>
          ) : full ? (
            <p className="text-sm text-mist">{t.intranet.groupRides.full}</p>
          ) : null}
        </section>
      ) : null}

      {canChat && ridden ? (
        <section className="mt-12">
          <h2 className="display text-4xl">{t.intranet.groupRides.albumTitle}</h2>
          <p className="mt-3 text-sm text-mist">{t.intranet.groupRides.albumLead}</p>
          {albumPhotos.length > 0 ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {albumPhotos.map((item) => (
                <figure key={item.id} className="border border-line bg-rubber">
                  <img src={item.url} alt="" className="h-48 w-full object-cover" />
                  <figcaption className="px-3 py-2 text-[11px] text-mist">
                    {item.authorName || t.intranet.cyclist}
                    {item.caption ? ` · ${item.caption}` : ""}
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : null}
          {albumTracks.length > 0 ? (
            <ul className="mt-4 divide-y divide-line border border-line bg-rubber">
              {albumTracks.map((item) => (
                <li key={item.id} className="px-4 py-3">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-sodium hover:text-bone"
                  >
                    {item.kind === "link"
                      ? t.intranet.groupRides.openRoute
                      : t.intranet.groupRides.openTrack}
                  </a>
                  <p className="mt-1 text-[11px] text-mist">
                    {item.authorName || t.intranet.cyclist}
                    {item.caption ? ` · ${item.caption}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          ) : null}
          {albumPhotos.length === 0 && albumTracks.length === 0 ? (
            <p className="mt-4 text-sm text-mist">{t.intranet.groupRides.albumEmpty}</p>
          ) : null}
          {canAlbum ? <RideAlbumForm rideId={ride.id} locale={locale} t={t} /> : null}
        </section>
      ) : null}

      {canChat ? (
        <section className="mt-12">
          <h2 className="display text-4xl">
            {ridden ? t.intranet.groupRides.commentsTitle : t.intranet.groupRides.chatTitle}
          </h2>
          <p className="mt-3 text-sm text-mist">
            {ridden ? t.intranet.groupRides.commentsHint : t.intranet.groupRides.chatHint}
          </p>
          <ul className="mt-4 space-y-3">
            {messages.map((message) => (
              <li key={message.id} className="border border-line bg-rubber p-4">
                <p className="text-[10px] uppercase tracking-[0.16em] text-mist">
                  {message.authorName || t.intranet.cyclist} · {rideStamp(message.createdAt, lang)}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-bone">{message.body}</p>
              </li>
            ))}
          </ul>
          {canComment ? (
            <RideChatForm
              rideId={ride.id}
              locale={locale}
              t={t}
              label={ridden ? t.intranet.groupRides.commentsTitle : t.intranet.groupRides.chatTitle}
              placeholder={
                ridden ? t.intranet.groupRides.commentsPlaceholder : t.intranet.groupRides.chatPlaceholder
              }
            />
          ) : null}
        </section>
      ) : null}

      {canManage ? (
        <div className="mt-12">
          <RideHostActions
            rideId={ride.id}
            locale={locale}
            editHref={links.rideEdit(ride.id)}
            t={t}
          />
        </div>
      ) : null}
      {afterActions ? (
        <div className="mt-12">
          <RideKeepActions
            rideId={ride.id}
            locale={locale}
            reuseHref={links.rideReuse(ride.id)}
            canReuse={canReuse}
            canArchive={canArchive}
            canPurge={canPurge}
            t={t}
          />
        </div>
      ) : null}
    </div>
  );
}
