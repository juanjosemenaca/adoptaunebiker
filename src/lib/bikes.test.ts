import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  parseGarageFields,
  parseMemberBikes,
  parseMemberGarage,
  primaryBike,
  serializeGarage,
} from "./bikes.ts";

describe("member bikes", () => {
  it("trims, drops junk and keeps unique names", () => {
    assert.deepEqual(
      parseMemberBikes(["  Levo  ", "levo", "x", "Grizl", ""]),
      ["Levo", "Grizl"],
    );
    assert.equal(primaryBike(["Levo", "Grizl"]), "Levo");
    assert.equal(primaryBike([], "Tarmac"), "Tarmac");
  });

  it("builds a garage from names when there is no json yet", () => {
    const garage = parseMemberGarage([], ["Bh Merida", "x", "Bh Merida"]);
    assert.equal(garage.length, 1);
    assert.equal(garage[0]?.name, "Bh Merida");
    assert.equal(garage[0]?.kind, "muscular");
    assert.equal(garage[0]?.photoPath, "");
  });

  it("keeps kind, note and photo and drops duplicate names", () => {
    const garage = parseMemberGarage([
      {
        id: "a",
        name: "Levo",
        kind: "ebike",
        note: "2022",
        photoPath: "uid/a/p.jpg",
        photoUrl: "https://example/p.jpg",
      },
      { id: "b", name: "levo", kind: "muscular" },
    ]);
    assert.equal(garage.length, 1);
    assert.equal(garage[0]?.kind, "ebike");
    assert.equal(garage[0]?.note, "2022");
    assert.equal(garage[0]?.photoPath, "uid/a/p.jpg");
  });

  it("parses form fields in order", () => {
    const garage = parseGarageFields({
      ids: ["1", "2"],
      names: ["Grizl", "x"],
      kinds: ["muscular", "ebike"],
      notes: ["carbon", ""],
      photoPaths: ["p1", ""],
      photoUrls: ["u1", ""],
    });
    assert.equal(garage.length, 1);
    assert.equal(garage[0]?.name, "Grizl");
    assert.equal(garage[0]?.note, "carbon");
    assert.equal(serializeGarage(garage)[0]?.photoPath, "p1");
  });
});
