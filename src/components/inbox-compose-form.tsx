"use client";

import { useActionState } from "react";
import { createInboxThreadAction } from "@/app/inbox-actions";
import type { Dictionary } from "@/i18n/types";
import { MEMBER_INBOX_KINDS } from "@/lib/admin-inbox-helpers";

type State = { error?: string };

export function InboxComposeForm({ locale, t }: { locale: string; t: Dictionary }) {
  const [state, action, pending] = useActionState(
    async (_prev: State, formData: FormData): Promise<State> => {
      const result = await createInboxThreadAction(formData);
      return result ?? {};
    },
    {},
  );
  const fieldClass = "mt-2 min-h-11 w-full border border-line bg-asphalt px-3 py-2 text-sm text-bone";

  return (
    <form action={action} className="mt-8 space-y-4 border border-line bg-rubber p-5 sm:p-6">
      <input type="hidden" name="locale" value={locale} />
      <p className="text-[10px] uppercase tracking-[0.18em] text-mist">{t.intranet.inbox.newTitle}</p>
      <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
        {t.intranet.inbox.kind}
        <select name="kind" required defaultValue="" className={fieldClass}>
          <option value="" disabled>
            {t.intranet.inbox.kindPick}
          </option>
          {MEMBER_INBOX_KINDS.map((kind) => (
            <option key={kind} value={kind}>
              {t.intranet.inbox.kinds[kind]}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
        {t.intranet.inbox.subject}
        <input
          name="subject"
          required
          minLength={2}
          maxLength={120}
          placeholder={t.intranet.inbox.subjectHint}
          className={fieldClass}
        />
      </label>
      <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
        {t.intranet.inbox.body}
        <textarea
          name="body"
          required
          rows={5}
          maxLength={2000}
          placeholder={t.intranet.inbox.bodyHint}
          className={fieldClass}
        />
      </label>
      {state.error ? <p className="text-sm text-sodium">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="min-h-11 bg-sodium px-4 text-xs font-semibold uppercase tracking-[0.16em] text-bone disabled:opacity-50"
      >
        {pending ? t.intranet.inbox.sending : t.intranet.inbox.send}
      </button>
    </form>
  );
}
