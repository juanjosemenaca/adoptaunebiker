"use client";

import { useActionState } from "react";
import { loginCommunity } from "@/app/actions";
import type { Dictionary } from "@/i18n/types";

type State = { error?: string };

export function LoginForm({
  next,
  locale,
  t,
}: {
  next: string;
  locale: string;
  t: Dictionary;
}) {
  const [state, action, pending] = useActionState(
    async (_prev: State, formData: FormData): Promise<State> => {
      const result = await loginCommunity(formData);
      return result ?? {};
    },
    {},
  );

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="next" value={next} />
      <input type="hidden" name="locale" value={locale} />
      <fieldset>
        <legend className="text-[10px] uppercase tracking-[0.18em] text-mist">
          {t.login.kind}
        </legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="flex cursor-pointer flex-col border border-line bg-rubber p-4 has-[:checked]:border-sodium">
            <span className="flex items-center gap-2 text-sm font-semibold text-bone">
              <input type="radio" name="kind" value="user" required defaultChecked />
              {t.login.user}
            </span>
            <span className="mt-2 text-sm leading-6 text-mist">{t.login.userHint}</span>
          </label>
          <label className="flex cursor-pointer flex-col border border-line bg-rubber p-4 has-[:checked]:border-sodium">
            <span className="flex items-center gap-2 text-sm font-semibold text-bone">
              <input type="radio" name="kind" value="admin" />
              {t.login.admin}
            </span>
            <span className="mt-2 text-sm leading-6 text-mist">{t.login.adminHint}</span>
          </label>
        </div>
      </fieldset>
      <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
        {t.forms.email}
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-2 w-full border border-line bg-asphalt px-3 py-2 text-sm text-bone"
        />
      </label>
      <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
        {t.forms.password}
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-2 w-full border border-line bg-asphalt px-3 py-2 text-sm text-bone"
        />
      </label>
      {state.error ? <p className="text-sm text-sodium">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-sodium px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-bone disabled:opacity-60"
      >
        {pending ? t.forms.entering : t.forms.enterIntranet}
      </button>
    </form>
  );
}
