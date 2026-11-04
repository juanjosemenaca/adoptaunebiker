import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { excerptFrom, markdownToHtml } from "./blog-markdown.ts";

describe("blog markdown", () => {
  it("renders headings, lists and emphasis", () => {
    const html = markdownToHtml("## Ruta\n\nSalimos **juntos**.\n\n- Casco\n- Agua");
    assert.match(html, /<h2>/);
    assert.match(html, /<strong>juntos<\/strong>/);
    assert.match(html, /<ul>/);
    assert.match(html, /<li>Casco<\/li>/);
  });

  it("only keeps http image and link urls", () => {
    const html = markdownToHtml("![foto](javascript:alert(1))\n[ok](https://adoptaunebiker.com)");
    assert.doesNotMatch(html, /javascript:/);
    assert.match(html, /href="https:\/\/adoptaunebiker.com"/);
  });

  it("builds an excerpt from subtitle or body", () => {
    assert.equal(excerptFrom("Salida corta", "texto largo"), "Salida corta");
    assert.ok(excerptFrom("", "## Hola mundo").includes("Hola"));
  });
});
