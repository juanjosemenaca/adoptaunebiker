import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mergeIntranetNotices } from "./intranet-notices-helpers.ts";

describe("intranet notices", () => {
  it("puts join requests first, then chat, then admin inbox", () => {
    const notices = mergeIntranetNotices({
      inbox: [{ id: "t1", subject: "Cambio de hora", at: "2026-11-12T10:00:00.000Z" }],
      chats: [{ rideId: "r2", rideTitle: "Garraf", at: "2026-11-12T12:00:00.000Z" }],
      joins: [
        {
          id: "j1",
          rideId: "r1",
          rideTitle: "Tibidabo",
          riderName: "Eva",
          at: "2026-11-12T09:00:00.000Z",
        },
      ],
    });
    assert.deepEqual(
      notices.map((item) => item.kind),
      ["join", "chat", "inbox"],
    );
    assert.equal(notices[0]?.targetId, "r1");
    assert.equal(notices[0]?.name, "Eva");
  });

  it("sorts the same kind by newest first", () => {
    const notices = mergeIntranetNotices({
      joins: [],
      chats: [],
      inbox: [
        { id: "old", subject: "Antes", at: "2026-11-01T10:00:00.000Z" },
        { id: "new", subject: "Ahora", at: "2026-11-12T10:00:00.000Z" },
      ],
    });
    assert.equal(notices[0]?.targetId, "new");
    assert.equal(notices[1]?.targetId, "old");
  });
});
