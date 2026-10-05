"use client";

import { useActionState } from "react";
import { deleteSignupRequestAction, rejectSignupRequestAction } from "@/app/actions";
import type { SignupInboxStatus } from "@/lib/types";
import type { Dictionary } from "@/i18n/types";

type State = { error?: string };

export function SignupRequestToolbar({
  id,
  locale,
  status,
  t,
}: {
  id: string;
  locale: string;
  status: SignupInboxStatus;
  t: Dictionary;
}) {
  const [rejectState, rejectAction] = useActionState(
    async (_prev: State, formData: FormData): Promise<State> => {
      const result = await rejectSignupRequestAction(formData);
      return result ?? {};
    },
    {},
  );
  const [deleteState, deleteAction] = useActionState(
    async (_prev: State, formData: FormData): Promise<State> => {
      const result = await deleteSignupRequestAction(formData);
      return result ?? {};
    },
    {},
  );

  const closed = status === "rejected" || status === "accepted";

  return (
    <div className="mt-10 space-y-4">
      <section className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          disabled
          title={t.admin.approveSoon}
          className="min-h-11 cursor-not-allowed bg-line px-4 text-xs font-semibold uppercase tracking-[0.16em] text-mist"
        >
          {t.admin.approve}
        </button>
        <form
          action={rejectAction}
          onSubmit={(event) => {
            if (closed) {
              event.preventDefault();
              return;
            }
            if (!window.confirm(t.admin.rejectConfirm)) event.preventDefault();
          }}
        >
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="locale" value={locale} />
          <button
            type="submit"
            disabled={closed}
            className="min-h-11 border border-line px-4 text-xs font-semibold uppercase tracking-[0.16em] text-bone disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t.admin.reject}
          </button>
        </form>
        <form
          action={deleteAction}
          onSubmit={(event) => {
            if (!window.confirm(t.admin.deleteConfirm)) event.preventDefault();
          }}
        >
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="locale" value={locale} />
          <button
            type="submit"
            className="min-h-11 border border-sodium px-4 text-xs font-semibold uppercase tracking-[0.16em] text-sodium"
          >
            {t.admin.delete}
          </button>
        </form>
      </section>
      {rejectState.error ? <p className="text-sm text-sodium">{rejectState.error}</p> : null}
      {deleteState.error ? <p className="text-sm text-sodium">{deleteState.error}</p> : null}
      <p className="max-w-xl text-sm leading-6 text-mist">{t.admin.approveSoon}</p>
    </div>
  );
}
