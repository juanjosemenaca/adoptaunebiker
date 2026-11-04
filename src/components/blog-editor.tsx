"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import {
  deleteBlogAssetAction,
  deleteBlogPostAction,
  saveBlogPostAction,
  uploadBlogAssetAction,
} from "@/app/actions";
import type { Dictionary } from "@/i18n/types";
import { locales, localeName, type Locale } from "@/i18n/config";
import type { BlogPost } from "@/lib/blog-admin";
import { recommendedBlogPath, slugFromUrl } from "@/lib/blog-slug";
import { hrefs } from "@/lib/paths";

const fieldClass = "mt-2 min-h-11 w-full border border-line bg-asphalt px-3 py-2 text-sm text-bone";
const btnClass =
  "inline-flex min-h-11 items-center justify-center px-4 text-[11px] font-semibold tracking-[0.16em] uppercase";

export function BlogEditor({
  post,
  locale,
  t,
}: {
  post?: BlogPost;
  locale: Locale;
  t: Dictionary;
}) {
  const router = useRouter();
  const links = hrefs(locale);
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const [title, setTitle] = useState(post?.title ?? "");
  const [subtitle, setSubtitle] = useState(post?.subtitle ?? "");
  const [seoTitle, setSeoTitle] = useState(post?.seoTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(post?.metaDescription ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));
  const [body, setBody] = useState(post?.body ?? "");
  const [published, setPublished] = useState(post?.published ?? false);
  const [postLocale, setPostLocale] = useState<Locale>(post?.locale ?? locale);
  const [publishedAt, setPublishedAt] = useState(toInputDate(post?.publishedAt));
  const [coverUrl, setCoverUrl] = useState(post?.coverUrl ?? "");
  const [assets, setAssets] = useState(post?.assets ?? []);

  const dateValue = useMemo(() => publishedAt, [publishedAt]);

  function run(task: () => Promise<{ error?: string } | void>) {
    setError("");
    setOk(false);
    start(async () => {
      const result = await task();
      if (result && "error" in result && result.error) {
        setError(result.error);
        return;
      }
      setOk(true);
      router.refresh();
    });
  }

  function save() {
    const data = new FormData();
    if (post) data.set("id", post.id);
    data.set("locale", locale);
    data.set("postLocale", postLocale);
    data.set("title", title);
    data.set("subtitle", subtitle);
    data.set("seoTitle", seoTitle);
    data.set("metaDescription", metaDescription);
    data.set("slug", slug);
    data.set("body", body);
    data.set("publishedAt", dateValue);
    if (published) data.set("published", "1");
    run(() => saveBlogPostAction(data));
  }

  function upload(file: File, asCover = false) {
    if (!post) {
      setError(t.admin.blogSaveFirst);
      return;
    }
    const data = new FormData();
    data.set("id", post.id);
    data.set("locale", locale);
    data.set("file", file);
    if (asCover) data.set("asCover", "1");
    run(async () => {
      const result = await uploadBlogAssetAction(data);
      if (result.error) return result;
      if (asCover && result.url) setCoverUrl(result.url);
      if (!asCover && result.url && result.kind) {
        setAssets((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            postId: post.id,
            kind: result.kind,
            name: result.name ?? file.name,
            path: "",
            url: result.url,
            mime: file.type,
            size: file.size,
          },
        ]);
      }
      if (result.kind === "image" && result.url) {
        setBody((current) => `${current.trim()}\n\n![${file.name}](${result.url})\n`);
      }
      if (result.kind === "video" && result.url) {
        setBody((current) => `${current.trim()}\n\n![video](${result.url})\n`);
      }
    });
  }

  function removeAsset(assetId: string) {
    if (!post) return;
    const data = new FormData();
    data.set("id", post.id);
    data.set("locale", locale);
    data.set("assetId", assetId);
    run(async () => {
      const result = await deleteBlogAssetAction(data);
      if (result.error) return result;
      if (assetId === "cover") setCoverUrl("");
      else setAssets((current) => current.filter((asset) => asset.id !== assetId));
    });
  }

  return (
    <div className="mt-10 space-y-6">
      {error ? <p className="border border-line bg-rubber px-4 py-3 text-sm text-[#8a2b2b]">{error}</p> : null}
      {ok ? <p className="border border-line bg-rubber px-4 py-3 text-sm text-mist">{t.admin.blogSaved}</p> : null}

      <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
        {t.admin.blogTitleField}
        <input
          value={title}
          onChange={(event) => {
            const next = event.target.value;
            setTitle(next);
            if (!slugTouched) setSlug(slugFromUrl(next));
          }}
          className={fieldClass}
          required
        />
      </label>
      <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
        {t.admin.blogSubtitle}
        <input value={subtitle} onChange={(event) => setSubtitle(event.target.value)} className={fieldClass} />
      </label>

      <div className="space-y-5 border border-line bg-rubber px-4 py-5">
        <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
          {t.admin.blogSeoTitle}
          <input
            value={seoTitle}
            onChange={(event) => setSeoTitle(event.target.value)}
            placeholder={title ? `${title} · Adopta un eBiker` : ""}
            className={fieldClass}
          />
          <span className="mt-2 flex items-center justify-between gap-3 text-[11px] normal-case tracking-normal text-mist">
            <span>{t.admin.blogSeoTitleHint}</span>
            <span>{seoTitle.length}/60</span>
          </span>
          <CopyField value={seoTitle.trim() || `${title} · Adopta un eBiker`} copy={t.admin.blogCopy} copied={t.admin.blogCopied} />
        </label>
        <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
          {t.admin.blogMetaDescription}
          <textarea
            value={metaDescription}
            onChange={(event) => setMetaDescription(event.target.value)}
            rows={3}
            placeholder={subtitle}
            className={`${fieldClass} min-h-24`}
          />
          <span className="mt-2 flex items-center justify-between gap-3 text-[11px] normal-case tracking-normal text-mist">
            <span>{t.admin.blogMetaHint}</span>
            <span>{metaDescription.length}/160</span>
          </span>
          <CopyField
            value={metaDescription.trim() || subtitle}
            copy={t.admin.blogCopy}
            copied={t.admin.blogCopied}
          />
        </label>
        <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
          {t.admin.blogUrl}
          <span className={`${fieldClass} flex items-center gap-0`}>
            <span className="shrink-0 text-mist">/blog/</span>
            <input
              value={slug}
              onChange={(event) => {
                setSlugTouched(true);
                setSlug(event.target.value.replace(/^\/+/, "").replace(/^blog\/+/i, ""));
              }}
              onBlur={() => setSlug(slugFromUrl(slug, title))}
              className="min-h-11 w-full bg-transparent px-1 py-2 text-sm text-bone outline-none"
            />
          </span>
          <CopyField value={recommendedBlogPath(slug || title)} copy={t.admin.blogCopy} copied={t.admin.blogCopied} />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
          {t.admin.blogDate}
          <input
            type="datetime-local"
            value={dateValue}
            onChange={(event) => setPublishedAt(event.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
          {t.nav.language}
          <select
            value={postLocale}
            onChange={(event) => setPostLocale(event.target.value as Locale)}
            className={fieldClass}
          >
            {locales.map((item) => (
              <option key={item} value={item}>
                {localeName[item]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-end gap-3 pb-2 text-[10px] uppercase tracking-[0.18em] text-mist">
          <input
            type="checkbox"
            checked={published}
            onChange={(event) => setPublished(event.target.checked)}
            className="size-4 accent-[var(--volt)]"
          />
          {t.admin.blogPublished}
        </label>
      </div>

      <div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-mist">{t.admin.blogCover}</p>
        {coverUrl ? (
          <div className="mt-3 overflow-hidden border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverUrl} alt="" className="max-h-64 w-full object-cover" />
          </div>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-2">
          <label className={`${btnClass} cursor-pointer border border-line bg-rubber text-bone`}>
            {t.admin.blogUpload}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) upload(file, true);
                event.target.value = "";
              }}
            />
          </label>
          {coverUrl ? (
            <button type="button" className={`${btnClass} text-mist`} onClick={() => removeAsset("cover")}>
              {t.admin.delete}
            </button>
          ) : null}
        </div>
      </div>

      <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
        {t.admin.blogBody}
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={16}
          className={`${fieldClass} min-h-72 font-mono text-[13px] leading-6`}
        />
        <span className="mt-2 block text-[11px] normal-case tracking-normal text-mist">{t.admin.blogBodyHint}</span>
      </label>

      <div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-mist">{t.admin.blogMedia}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <label className={`${btnClass} cursor-pointer bg-sodium text-bone`}>
            {t.admin.blogAddImage}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) upload(file);
                event.target.value = "";
              }}
            />
          </label>
          <label className={`${btnClass} cursor-pointer border border-line bg-rubber text-bone`}>
            {t.admin.blogAddVideo}
            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) upload(file);
                event.target.value = "";
              }}
            />
          </label>
          <label className={`${btnClass} cursor-pointer border border-line bg-rubber text-bone`}>
            {t.admin.blogAddFile}
            <input
              type="file"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) upload(file);
                event.target.value = "";
              }}
            />
          </label>
        </div>
        {assets.length > 0 ? (
          <ul className="mt-4 divide-y divide-line border border-line bg-rubber">
            {assets.map((asset) => (
              <li key={asset.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                <a href={asset.url} className="truncate text-bone hover:underline" rel="noopener noreferrer">
                  {asset.name}
                </a>
                <button type="button" className="text-[11px] uppercase tracking-[0.16em] text-mist" onClick={() => removeAsset(asset.id)}>
                  {t.admin.delete}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" disabled={pending} onClick={save} className={`${btnClass} bg-sodium text-bone`}>
          {pending ? t.admin.blogSaving : t.admin.blogSave}
        </button>
        {post ? (
          <a href={`${links.blog}/${post.slug}`} className={`${btnClass} border border-line text-mist`}>
            {t.admin.blogView}
          </a>
        ) : null}
        {post ? (
          <button
            type="button"
            disabled={pending}
            className={`${btnClass} text-[#8a2b2b]`}
            onClick={() => {
              if (!window.confirm(t.admin.blogDeleteConfirm)) return;
              const data = new FormData();
              data.set("id", post.id);
              data.set("locale", locale);
              run(() => deleteBlogPostAction(data));
            }}
          >
            {t.admin.delete}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function CopyField({ value, copy, copied }: { value: string; copy: string; copied: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className={`${btnClass} mt-2 w-full border border-line bg-asphalt text-mist`}
      onClick={async () => {
        if (!value.trim()) return;
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
          window.setTimeout(() => setDone(false), 1600);
        } catch {
          /* ignore */
        }
      }}
    >
      {done ? copied : copy}
    </button>
  );
}

function toInputDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
