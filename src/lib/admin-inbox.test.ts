import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  canReplyToThread,
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
});
