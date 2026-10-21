"use client";

import { useActionState } from "react";
import { loginCommunity } from "@/app/actions";

type State = { error?: string };

export function LoginForm({
  next,
  locale,
  labels,
}: {
  next: string;
  locale: string;
  labels: {
    email: string;
    password: string;
    entering: string;
    enterIntranet: string;
  };
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
      <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
        {labels.email}
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-2 min-h-11 w-full border border-line bg-asphalt px-3 py-2 text-sm text-bone"
        />
      </label>
      <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
        {labels.password}
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-2 min-h-11 w-full border border-line bg-asphalt px-3 py-2 text-sm text-bone"
        />
      </label>
      {state.error ? <p className="text-sm text-sodium">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="min-h-11 w-full bg-sodium px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-bone disabled:opacity-60"
      >
        {pending ? labels.entering : labels.enterIntranet}
      </button>
    </form>
  );
}
