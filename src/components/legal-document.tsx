import type { LegalCopy, LegalDoc, LegalSection } from "@/i18n/types";

function Section({
  section,
  pendingLabel,
}: {
  section: LegalSection;
  pendingLabel: string;
}) {
  return (
    <section className="mt-12 border-t border-line pt-8">
      <h2 className="text-lg font-semibold tracking-tight text-bone">{section.title}</h2>
      {section.pending ? (
        <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-sodium">{pendingLabel}</p>
      ) : null}
      <div className="mt-4 space-y-4 text-sm leading-7 text-mist">
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
      </div>
      {section.items?.length ? (
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-mist">
          {section.items.map((item) => (
            <li key={item.slice(0, 48)}>{item}</li>
          ))}
        </ul>
      ) : null}
      {section.table ? (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border border-line text-left text-xs leading-6 text-mist">
            <caption className="mb-3 text-left text-[10px] uppercase tracking-[0.18em] text-sodium">
              {section.table.caption}
            </caption>
            <thead className="bg-panel text-bone">
              <tr>
                {section.table.headers.map((header) => (
                  <th key={header} scope="col" className="border-b border-line px-3 py-2 font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.table.rows.map((row) => (
                <tr key={row.join("|").slice(0, 64)}>
                  {row.map((cell, index) => (
                    <td key={`${row[0]}-${index}`} className="border-t border-line px-3 py-2 align-top">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}

export function LegalDocument({ copy, doc }: { copy: LegalCopy; doc: LegalDoc }) {
  return (
    <article className="mx-auto max-w-3xl">
      <p className="border border-sodium/40 bg-rubber p-4 text-sm leading-7 text-bone">
        <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-sodium">
          {copy.pendingLabel}
        </span>
        {copy.reviewBanner}
      </p>
      <h1 className="display mt-8 text-5xl text-bone sm:text-7xl">{doc.title}</h1>
      <div className="mt-6 space-y-4 text-base leading-8 text-mist">
        {doc.intro.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
      </div>
      {doc.sections.map((section) => (
        <Section key={section.title} section={section} pendingLabel={copy.pendingLabel} />
      ))}
      <p className="mt-12 text-xs leading-6 text-mist">{copy.updatedNote}</p>
    </article>
  );
}
