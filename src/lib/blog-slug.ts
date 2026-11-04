import { slugify } from "babylovegrowth-next-js-blog";

export function slugFromUrl(raw: string, fallbackTitle = "") {
  const trimmed = raw.trim().replace(/^\/+/, "").replace(/^blog\/+/i, "");
  return slugify(trimmed) || slugify(fallbackTitle);
}

export function recommendedBlogPath(slug: string) {
  const clean = slugFromUrl(slug);
  return clean ? `/blog/${clean}` : "/blog/";
}
