"use client";

import { useActionState } from "react";
import { addMemberNoteAction, deleteMemberNoteAction } from "@/app/actions";
import type { Dictionary } from "@/i18n/types";
import { memberStamp } from "@/lib/stamp";

type Note = {
  id: string;
  body: string;
  authorName: string;
  createdAt: string;
};

type State = { error?: string };

export function MemberNotes({
  memberId,
  locale,
  notes,
  t,
}: {
  memberId: string;
  locale: string;
  notes: Note[];
  t: Dictionary;
}) {
  const [addState, addAction, addPending] = useActionState(
    async (_prev: State, formData: FormData): Promise<State> => {
      const result = await addMemberNoteAction(formData);
      return result ?? {};
    },
    {},
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    async (_prev: State, formData: FormData): Promise<State> => {
      const result = await deleteMemberNoteAction(formData);
      return result ?? {};
    },
    {},
  );

  const busy = addPending || deletePending;

  return (
    <section className="mt-10 space-y-6">
      <div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-mist">{t.admin.memberNotesTitle}</p>
        <p className="mt-2 text-sm leading-6 text-mist">{t.admin.memberNotesLead}</p>
      </div>

      <form action={addAction} className="space-y-3 border border-line bg-rubber p-5 sm:p-6">
        <input type="hidden" name="id" value={memberId} />
        <input type="hidden" name="locale" value={locale} />
        <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
          {t.admin.memberNoteLabel}
          <textarea
            name="body"
            required
            rows={4}
            maxLength={2000}
            placeholder={t.admin.memberNotePlaceholder}
            className="mt-2 w-full border border-line bg-asphalt px-3 py-2 text-sm text-bone"
          />
        </label>
        {addState.error ? <p className="text-sm text-sodium">{addState.error}</p> : null}
        <button
          type="submit"
          disabled={busy}
          className="min-h-11 bg-sodium px-4 text-xs font-semibold uppercase tracking-[0.16em] text-bone disabled:opacity-50"
        >
          {addPending ? t.admin.memberNoteAdding : t.admin.memberNoteAdd}
        </button>
      </form>

      {notes.length === 0 ? (
        <p className="text-sm text-mist">{t.admin.memberNotesEmpty}</p>
      ) : (
        <ul className="space-y-3">
          {notes.map((note) => (
            <li key={note.id} className="border border-line bg-rubber p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-mist">
                  {note.authorName || "—"}
                  {note.createdAt ? ` · ${memberStamp(note.createdAt)}` : ""}
                </p>
                <form
                  action={deleteAction}
                  onSubmit={(event) => {
                    if (busy) {
                      event.preventDefault();
                      return;
                    }
                    if (!window.confirm(t.admin.memberNoteDeleteConfirm)) event.preventDefault();
                  }}
                >
                  <input type="hidden" name="id" value={memberId} />
                  <input type="hidden" name="noteId" value={note.id} />
                  <input type="hidden" name="locale" value={locale} />
                  <button
                    type="submit"
                    disabled={busy}
                    className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sodium disabled:opacity-50"
                  >
                    {t.admin.delete}
                  </button>
                </form>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-bone">{note.body}</p>
            </li>
          ))}
        </ul>
      )}
      {deleteState.error ? <p className="text-sm text-sodium">{deleteState.error}</p> : null}
    </section>
  );
}
