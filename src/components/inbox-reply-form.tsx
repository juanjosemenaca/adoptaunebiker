"use client";

import { useActionState } from "react";
import { sendInboxMessageAction } from "@/app/inbox-actions";
import type { Dictionary } from "@/i18n/types";

type State = { error?: string };

export function InboxReplyForm({
  threadId,
  locale,
  t,
}: {
  threadId: string;
  locale: string;
  t: Dictionary;
}) {
  const [state, action, pending] = useActionState(
    async (_prev: State, formData: FormData): Promise<State> => {
      const result = await sendInboxMessageAction(formData);
      return result ?? {};
    },
    {},
  );

  return (
    <form action={action} className="mt-6 space-y-3">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="threadId" value={threadId} />
      <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
        {t.intranet.inbox.reply}
        <textarea
          name="body"
          rows={4}
          required
          maxLength={2000}
          placeholder={t.intranet.inbox.replyHint}
          className="mt-2 w-full border border-line bg-asphalt px-3 py-2 text-sm text-bone"
        />
      </label>
      {state.error ? <p className="text-sm text-sodium">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="bg-sodium px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-bone disabled:opacity-60"
      >
        {pending ? t.intranet.inbox.sending : t.intranet.inbox.send}
      </button>
    </form>
  );
}
