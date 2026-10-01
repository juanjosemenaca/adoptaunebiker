export function AdminSoon({
  kicker,
  title,
  lead,
  soon,
}: {
  kicker: string;
  title: string;
  lead: string;
  soon: string;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.28em] text-volt">{kicker}</p>
      <h1 className="display mt-3 text-6xl sm:text-7xl">{title}</h1>
      <p className="mt-4 max-w-xl text-mist">{lead}</p>
      <p className="mt-12 max-w-xl border border-line bg-rubber p-5 text-sm leading-7 text-mist">
        {soon}
      </p>
    </div>
  );
}
