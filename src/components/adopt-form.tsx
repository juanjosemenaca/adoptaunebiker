"use client";

import { useActionState } from "react";
import { requestAdoption } from "@/app/actions";

type State = { error?: string; ok?: boolean };

export function AdoptForm({
  toId,
  toName,
}: {
  toId: string;
  toName: string;
}) {
  const [state, action, pending] = useActionState(
    async (_prev: State, formData: FormData): Promise<State> =>
      requestAdoption(formData),
    {},
  );

  if (state.ok) {
    return (
      <p className="mt-4 text-sm text-volt">
        Petición enviada. Si {toName.split(" ")[0]} acepta, el vínculo queda
        abierto.
      </p>
    );
  }

  return (
    <form action={action} className="mt-4 space-y-4">
      <input type="hidden" name="toId" value={toId} />
      <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
        Recado
        <textarea
          name="message"
          rows={4}
          maxLength={280}
          placeholder="Dónde sales, qué modalidad, qué te da respeto."
          className="mt-2 w-full border border-line bg-asphalt px-3 py-2 text-sm text-bone"
        />
      </label>
      {state.error ? <p className="text-sm text-sodium">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-sodium px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-bone disabled:opacity-60"
      >
        {pending ? "Enviando…" : "Pedir adopción"}
      </button>
    </form>
  );
}
