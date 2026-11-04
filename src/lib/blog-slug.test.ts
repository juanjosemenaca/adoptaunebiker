import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { recommendedBlogPath, slugFromUrl } from "./blog-slug.ts";

describe("blog slug", () => {
  it("turns a title into a slug", () => {
    assert.equal(slugFromUrl("Compañeros para salir en bici"), "companeros-para-salir-en-bici");
  });

  it("accepts a recommended /blog/ path", () => {
    assert.equal(slugFromUrl("/blog/companeros-salir-bici-barcelona"), "companeros-salir-bici-barcelona");
    assert.equal(recommendedBlogPath("/blog/companeros-salir-bici-barcelona"), "/blog/companeros-salir-bici-barcelona");
  });

  it("falls back to the title when the URL is empty", () => {
    assert.equal(slugFromUrl("", "Ruta por Barcelona"), "ruta-por-barcelona");
  });
});
