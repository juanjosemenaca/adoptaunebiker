import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { wouldRemoveLastAdmin } from "./last-admin.ts";

describe("last administrator policy", () => {
  it("blocks deleting or demoting the only administrator", () => {
    assert.equal(wouldRemoveLastAdmin(0, "delete_admin"), true);
    assert.equal(wouldRemoveLastAdmin(0, "demote_admin"), true);
  });

  it("allows deleting or demoting an administrator when another remains", () => {
    assert.equal(wouldRemoveLastAdmin(1, "delete_admin"), false);
    assert.equal(wouldRemoveLastAdmin(2, "demote_admin"), false);
  });

  it("does not treat member updates as an admin-loss", () => {
    assert.equal(wouldRemoveLastAdmin(0, "delete_user"), false);
    assert.equal(wouldRemoveLastAdmin(0, "update_user"), false);
  });
});
