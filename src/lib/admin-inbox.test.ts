import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  canReplyToThread,
  groupInboxByMember,
  parseAdminInboxDraft,
  parseInboxDraft,
  parseInboxReply,
  threadIsUnread,
} from "./admin-inbox-helpers.ts";

describe("admin inbox draft", () => {
  it("requires a subject, kind and body", () => {
    assert.deepEqual(parseInboxDraft({ subject: "a", kind: "idea", body: "hola" }), { error: "subject" });
    assert.deepEqual(parseInboxDraft({ subject: "Una idea", kind: "spam", body: "hola" }), { error: "kind" });
    assert.deepEqual(parseInboxDraft({ subject: "Una idea", kind: "idea", body: "   " }), { error: "body" });
    assert.deepEqual(parseInboxDraft({ subject: "Ruta al Garraf", kind: "propuesta", body: "¿Y si hacemos un domingo suave?" }), {
      subject: "Ruta al Garraf",
      kind: "propuesta",
      body: "¿Y si hacemos un domingo suave?",
    });
    assert.deepEqual(parseInboxDraft({ subject: "Salida", kind: "aviso", body: "ha sido modificada" }), {
      error: "kind",
    });
  });

  it("keeps replies inside length and open threads", () => {
    assert.deepEqual(parseInboxReply("  "), { error: "body" });
    assert.deepEqual(parseInboxReply("Vale, lo vemos."), { body: "Vale, lo vemos." });
    assert.equal(canReplyToThread("open"), true);
    assert.equal(canReplyToThread("closed"), false);
  });

  it("marks unread for the other side", () => {
    const thread = { unreadForAdmin: true, unreadForMember: false };
    assert.equal(threadIsUnread(thread, true), true);
    assert.equal(threadIsUnread(thread, false), false);
  });

  it("lets admin write to a member and groups history by person", () => {
    assert.deepEqual(parseAdminInboxDraft({ memberId: "nope", subject: "Hola", body: "Qué tal" }), {
      error: "member",
    });
    const memberId = "11111111-1111-4111-8111-111111111111";
    assert.deepEqual(parseAdminInboxDraft({ memberId, subject: "Hola", body: "Te escribimos desde administración." }), {
      memberId,
      subject: "Hola",
      body: "Te escribimos desde administración.",
      kind: "aviso",
    });
    const folders = groupInboxByMember([
      {
        id: "t1",
        memberId,
        memberName: "Ana",
        subject: "Uno",
        kind: "aviso",
        status: "open",
        unreadForAdmin: true,
        unreadForMember: false,
        createdAt: "2026-11-01T08:00:00.000Z",
        updatedAt: "2026-11-11T10:00:00.000Z",
      },
      {
        id: "t2",
        memberId,
        memberName: "Ana",
        subject: "Dos",
        kind: "idea",
        status: "open",
        unreadForAdmin: false,
        unreadForMember: true,
        createdAt: "2026-11-02T08:00:00.000Z",
        updatedAt: "2026-11-10T10:00:00.000Z",
      },
    ]);
    assert.equal(folders.length, 1);
    assert.equal(folders[0]?.threadCount, 2);
    assert.equal(folders[0]?.unread, 1);
    assert.equal(folders[0]?.updatedAt, "2026-11-11T10:00:00.000Z");
  });
});
