import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { BlogArticleSummary } from "babylovegrowth-next-js-blog";
import { articlesForLocale, pageHref, paginate, parsePage } from "./blog.ts";

function article(partial: Partial<BlogArticleSummary>): BlogArticleSummary {
  return {
    id: 1,
    title: "Ruta",
    slug: "ruta",
    hero_image_url: "",
    languageCode: "es",
    meta_description: "",
    excerpt: "",
    orgWebsite: "",
    created_at: "",
    updated_at: "",
    published_at: "",
    published: true,
    seedKeyword: null,
    keywords: [],
    ...partial,
  };
}

describe("blog helpers", () => {
  it("parses page numbers and ignores junk", () => {
    assert.equal(parsePage("3"), 3);
    assert.equal(parsePage(["2"]), 2);
    assert.equal(parsePage("nope"), 1);
    assert.equal(parsePage(undefined), 1);
  });

  it("paginates and builds page hrefs", () => {
    const items = Array.from({ length: 13 }, (_, index) => index + 1);
    const first = paginate(items, 1);
    assert.deepEqual(first.items, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    assert.equal(first.info.totalPages, 2);
    assert.equal(first.info.hasNext, true);
    assert.equal(pageHref("/es/blog", 1), "/es/blog");
    assert.equal(pageHref("/es/blog", 2), "/es/blog?page=2");
  });

  it("keeps locale-matching articles, or all if none match", () => {
    const mixed = [article({ id: 1, languageCode: "es" }), article({ id: 2, languageCode: "en-GB" })];
    assert.deepEqual(
      articlesForLocale(mixed, "en").map((item) => item.id),
      [2],
    );
    assert.deepEqual(
      articlesForLocale([article({ id: 3, languageCode: "es" })], "fr").map((item) => item.id),
      [3],
    );
  });
});
