"use client";

import { useActionState } from "react";
import { resetMemberPasswordAction, setMemberStatusAction } from "@/app/actions";
import type { Dictionary } from "@/i18n/types";
import type { MemberStatus } from "@/lib/types";

type State = { error?: string };

export function MemberToolbar({
  id,
  locale,
  status,
  t,
}: {
  id: string;
  locale: string;
  status: MemberStatus;
  t: Dictionary;
}) {
  const [statusState, statusAction, statusPending] = useActionState(
    async (_prev: State, formData: FormData): Promise<State> => {
      const result = await setMemberStatusAction(formData);
      return result ?? {};
    },
    {},
  );
  const [resetState, resetAction, resetPending] = useActionState(
    async (_prev: State, formData: FormData): Promise<State> => {
      const result = await resetMemberPasswordAction(formData);
      return result ?? {};
    },
    {},
  );

  const inactive = status === "inactive";
  const nextStatus: MemberStatus = inactive ? "active" : "inactive";
  const busy = statusPending || resetPending;

  return (
    <div className="mt-10 space-y-6">
      <section className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <form
          action={statusAction}
          onSubmit={(event) => {
            if (busy) {
              event.preventDefault();
              return;
            }
            const ok = window.confirm(
              inactive ? t.admin.memberActivateConfirm : t.admin.memberDeactivateConfirm,
            );
            if (!ok) event.preventDefault();
          }}
        >
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="status" value={nextStatus} />
          <button
            type="submit"
            disabled={busy}
            className={`min-h-11 px-4 text-xs font-semibold uppercase tracking-[0.16em] disabled:cursor-not-allowed disabled:opacity-50 ${
              inactive
                ? "bg-sodium text-bone"
                : "border border-sodium text-sodium"
            }`}
          >
            {statusPending ? "…" : inactive ? t.admin.memberActivate : t.admin.memberDeactivate}
          </button>
        </form>
        <form
          action={resetAction}
          onSubmit={(event) => {
            if (busy) {
              event.preventDefault();
              return;
            }
            if (!window.confirm(t.admin.memberResetConfirm)) event.preventDefault();
          }}
        >
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="locale" value={locale} />
          <button
            type="submit"
            disabled={busy}
            className="min-h-11 border border-line px-4 text-xs font-semibold uppercase tracking-[0.16em] text-bone disabled:cursor-not-allowed disabled:opacity-50"
          >
            {resetPending ? "…" : t.admin.memberResetPassword}
          </button>
        </form>
      </section>
      {statusState.error ? <p className="text-sm text-sodium">{statusState.error}</p> : null}
      {resetState.error ? <p className="text-sm text-sodium">{resetState.error}</p> : null}
    </div>
  );
}
