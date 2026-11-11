import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { avatarExt, avatarInitials, checkAvatarFile } from "./avatar.ts";

describe("avatar file", () => {
  it("accepts jpeg png webp under 2 MB", () => {
    assert.equal(checkAvatarFile({ type: "image/jpeg", size: 1200, name: "a.jpg" }), null);
    assert.equal(checkAvatarFile({ type: "image/png", size: 1200, name: "a.png" }), null);
    assert.equal(checkAvatarFile({ type: "image/webp", size: 1200, name: "a.webp" }), null);
    assert.equal(avatarExt("image/jpeg", "shot.JPEG"), "jpg");
  });

  it("rejects empty, gif and oversized files", () => {
    assert.equal(checkAvatarFile(null), "missing");
    assert.equal(checkAvatarFile({ type: "image/jpeg", size: 0, name: "a.jpg" }), "missing");
    assert.equal(checkAvatarFile({ type: "image/gif", size: 1200, name: "a.gif" }), "type");
    assert.equal(checkAvatarFile({ type: "image/jpeg", size: 3 * 1024 * 1024, name: "a.jpg" }), "size");
  });

  it("builds initials from the display name", () => {
    assert.equal(avatarInitials("juan jose"), "JJ");
    assert.equal(avatarInitials("Lara"), "L");
    assert.equal(avatarInitials("  "), "?");
  });
});
