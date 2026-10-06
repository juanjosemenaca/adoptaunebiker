"use client";

import { useActionState } from "react";
import { changePasswordAction } from "@/app/actions";
import type { Dictionary } from "@/i18n/types";

type State = { error?: string };

export function ChangePasswordForm({
  locale,
  t,
}: {
  locale: string;
  t: Dictionary;
}) {
  const [state, action, pending] = useActionState(
    async (_prev: State, formData: FormData): Promise<State> => {
      const result = await changePasswordAction(formData);
      return result ?? {};
    },
    {},
  );

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="locale" value={locale} />
      <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
        {t.forms.newPassword}
        <input
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          className="mt-2 min-h-11 w-full border border-line bg-asphalt px-3 py-2 text-sm text-bone"
        />
      </label>
      <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
        {t.forms.confirmPassword}
        <input
          name="confirm"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          className="mt-2 min-h-11 w-full border border-line bg-asphalt px-3 py-2 text-sm text-bone"
        />
      </label>
      {state.error ? <p className="text-sm text-sodium">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="min-h-11 w-full bg-sodium px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-bone disabled:opacity-60"
      >
        {pending ? t.forms.changingPassword : t.forms.changePassword}
      </button>
    </form>
  );
}
