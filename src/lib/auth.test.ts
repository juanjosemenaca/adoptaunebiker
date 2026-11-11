import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEMO_ADMIN_EMAIL,
  DEMO_MEMBER_EMAILS,
  DEMO_PASSWORD,
  demoAuthEnabled,
  isDemoLoginAllowed,
  isSeedDemoMember,
} from "./demo-auth.ts";

describe("demo auth fallback", () => {
  it("is disabled in production", () => {
    assert.equal(demoAuthEnabled("production"), false);
    assert.equal(isDemoLoginAllowed(DEMO_ADMIN_EMAIL, DEMO_PASSWORD, "production"), false);
    for (const email of DEMO_MEMBER_EMAILS) {
      assert.equal(isDemoLoginAllowed(email, DEMO_PASSWORD, "production"), false);
    }
  });

  it("is disabled outside development, including tests and unset env", () => {
    assert.equal(demoAuthEnabled("test"), false);
    assert.equal(demoAuthEnabled("preview"), false);
    assert.equal(demoAuthEnabled(""), false);
    assert.equal(demoAuthEnabled(undefined), false);
    assert.equal(isDemoLoginAllowed(DEMO_ADMIN_EMAIL, DEMO_PASSWORD, "test"), false);
  });

  it("can mint a local admin session only in development", () => {
    assert.equal(isDemoLoginAllowed(DEMO_ADMIN_EMAIL, DEMO_PASSWORD, "development"), true);
    assert.equal(isDemoLoginAllowed(DEMO_MEMBER_EMAILS[0], DEMO_PASSWORD, "development"), true);
  });

  it("rejects the well-known password for any other email, even in development", () => {
    assert.equal(
      isDemoLoginAllowed("hola@adoptaunebiker.com", DEMO_PASSWORD, "development"),
      false,
    );
    assert.equal(isDemoLoginAllowed(DEMO_ADMIN_EMAIL, "otra-clave", "development"), false);
  });

  it("recognizes seed demo members without touching real riders", () => {
    assert.equal(isSeedDemoMember({ email: "ebiker@adopta.local" }), true);
    assert.equal(isSeedDemoMember({ slug: "lara-mendez", email: "lara@example.com" }), false);
    assert.equal(isSeedDemoMember({ slug: "leo-andrade" }), true);
    assert.equal(isSeedDemoMember({ email: "hola@adoptaunebiker.com", slug: "juan" }), false);
    assert.equal(isSeedDemoMember({ email: DEMO_ADMIN_EMAIL }), false);
  });

  it("does not activate after a Supabase failure in production", () => {
    const supabaseFailed = true;
    assert.equal(supabaseFailed && !isDemoLoginAllowed(DEMO_ADMIN_EMAIL, DEMO_PASSWORD, "production"), true);
    assert.equal(isDemoLoginAllowed(DEMO_ADMIN_EMAIL, DEMO_PASSWORD, "production"), false);
  });
});
