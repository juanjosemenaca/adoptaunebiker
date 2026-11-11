"use client";

import { useActionState, useRef, useState } from "react";
import { removeAvatarAction, uploadAvatarAction } from "@/app/actions";
import { ConfirmSubmit } from "@/components/confirm-submit";
import type { Dictionary } from "@/i18n/types";
import { avatarInitials } from "@/lib/avatar";

type State = { error?: string };

export function ProfilePhotoForm({
  url,
  name,
  locale,
  t,
}: {
  url: string;
  name: string;
  locale: string;
  t: Dictionary;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadState, upload, uploading] = useActionState(
    async (_prev: State, formData: FormData): Promise<State> => {
      const result = await uploadAvatarAction(formData);
      return result ?? {};
    },
    {},
  );
  const [removeState, remove, removing] = useActionState(
    async (_prev: State, formData: FormData): Promise<State> => {
      const result = await removeAvatarAction(formData);
      return result ?? {};
    },
    {},
  );
  const pending = uploading || removing;
  const shown = preview || url;
  const error = uploadState.error || removeState.error;

  return (
    <div className="mt-8 flex flex-wrap items-center gap-5">
      <form action={upload} className="flex flex-wrap items-center gap-5">
        <input type="hidden" name="locale" value={locale} />
        <input
          ref={inputRef}
          type="file"
          name="photo"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            setPreview(file ? URL.createObjectURL(file) : null);
            if (file) event.currentTarget.form?.requestSubmit();
          }}
        />
        <button
          type="button"
          disabled={pending}
          onClick={() => inputRef.current?.click()}
          aria-label={url ? t.intranet.photoChange : t.intranet.photoAdd}
          className="relative h-24 w-24 overflow-hidden rounded-full border border-line bg-panel text-lg font-semibold text-volt disabled:opacity-60"
        >
          {shown ? (
            <img src={shown} alt="" className="h-full w-full object-cover" />
          ) : (
            avatarInitials(name)
          )}
        </button>
        <div>
          <button
            type="button"
            disabled={pending}
            onClick={() => inputRef.current?.click()}
            className="text-xs font-semibold uppercase tracking-[0.16em] text-sodium disabled:opacity-60"
          >
            {pending ? t.intranet.photoSaving : url ? t.intranet.photoChange : t.intranet.photoAdd}
          </button>
          <p className="mt-2 max-w-sm text-sm leading-6 text-mist">{t.intranet.photoLead}</p>
        </div>
      </form>
      {url ? (
        <form action={remove}>
          <input type="hidden" name="locale" value={locale} />
          <ConfirmSubmit
            message={t.intranet.photoRemoveConfirm}
            className="text-xs uppercase tracking-[0.16em] text-mist disabled:opacity-60"
          >
            {t.intranet.photoRemove}
          </ConfirmSubmit>
        </form>
      ) : null}
      {error ? <p className="w-full text-sm text-sodium">{error}</p> : null}
    </div>
  );
}
