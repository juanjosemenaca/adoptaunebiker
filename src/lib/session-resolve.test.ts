import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  parseLegacySessionCookie,
  profileAccountKind,
  resolveMemberSession,
} from "./session-resolve.ts";

const forgedAdminCookie = encodeURIComponent(
  JSON.stringify({
    id: "admin",
    slug: "administracion",
    name: "Administración",
    role: "mentor",
    discipline: "carretera",
    city: "—",
    kind: "admin",
    email: "admin@adopta.local",
  }),
);

const memberProfile = {
  id: "member-1",
  slug: "ana",
  name: "Ana",
  role: "mentor" as const,
  discipline: "carretera" as const,
  city: "Barcelona",
  bike: "",
  bio: "",
  lookingFor: "",
  kind: "user" as const,
  memberStatus: "active" as const,
};

describe("forged adopta.session cookie", () => {
  it("does not grant access in a production compilation", () => {
    assert.equal(
      resolveMemberSession({
        profile: null,
        cookieValue: forgedAdminCookie,
        nodeEnv: "production",
      }),
      null,
    );
  });

  it("does not override a real Supabase profile in production", () => {
    const session = resolveMemberSession({
      profile: memberProfile,
      cookieValue: forgedAdminCookie,
      nodeEnv: "production",
    });
    assert.equal(session?.id, "member-1");
    assert.equal(session?.kind, "user");
  });

  it("is readable only in development", () => {
    const session = resolveMemberSession({
      profile: null,
      cookieValue: forgedAdminCookie,
      nodeEnv: "development",
    });
    assert.equal(session?.kind, "admin");
    assert.equal(parseLegacySessionCookie(forgedAdminCookie)?.kind, "admin");
  });
});

describe("admin kind", () => {
  it("comes from the profile kind, not from a well-known email", () => {
    assert.equal(profileAccountKind("admin"), "admin");
    assert.equal(profileAccountKind("user"), "user");
    assert.equal(profileAccountKind("admin@adopta.local"), "user");
  });
});

describe("inactive members", () => {
  it("are rejected even if a demo cookie is present", () => {
    assert.equal(
      resolveMemberSession({
        profile: { ...memberProfile, memberStatus: "inactive" },
        cookieValue: forgedAdminCookie,
        nodeEnv: "development",
      }),
      null,
    );
  });
});
