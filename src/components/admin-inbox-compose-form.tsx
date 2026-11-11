"use client";

import { useActionState } from "react";
import { createAdminInboxThreadAction } from "@/app/inbox-actions";
import { rideActionClass } from "@/components/confirm-submit";
import type { Dictionary } from "@/i18n/types";

type State = { error?: string };

export function AdminInboxComposeForm({
  locale,
  t,
  members,
  defaultMemberId = "",
}: {
  locale: string;
  t: Dictionary;
  members: Array<{ id: string; name: string }>;
  defaultMemberId?: string;
}) {
  const [state, action, pending] = useActionState(
    async (_prev: State, formData: FormData): Promise<State> => {
      const result = await createAdminInboxThreadAction(formData);
      return result ?? {};
    },
    {},
  );
  const fieldClass = "mt-2 min-h-11 w-full border border-line bg-asphalt px-3 py-2 text-sm text-bone";

  return (
    <form action={action} className="mt-8 space-y-4 border border-line bg-rubber p-5 sm:p-6">
      <input type="hidden" name="locale" value={locale} />
      <p className="text-[10px] uppercase tracking-[0.18em] text-mist">{t.admin.inboxNew}</p>
      <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
        {t.admin.inboxPickMember}
        <select name="memberId" required defaultValue={defaultMemberId} className={fieldClass}>
          <option value="" disabled>
            {t.admin.inboxMemberHint}
          </option>
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
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
          rows={6}
          maxLength={2000}
          placeholder={t.intranet.inbox.bodyHint}
          className={fieldClass}
        />
      </label>
      {state.error ? <p className="text-sm text-sodium">{state.error}</p> : null}
      <button type="submit" disabled={pending} className={`${rideActionClass} disabled:opacity-50`}>
        {pending ? t.intranet.inbox.sending : t.intranet.inbox.send}
      </button>
    </form>
  );
}
