import type { Metadata } from "next";
import Link from "next/link";
import { logoutCommunity, respondBond } from "@/app/actions";
import { getDictionary } from "@/i18n/get-dictionary";
import { hrefs } from "@/lib/paths";
import { getBonds, getSession, listRiders } from "@/lib/session";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: getDictionary(locale).intranet.account, robots: { index: false, follow: false } };
}

export default async function CuentaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();
  if (!session) return null;
  const t = getDictionary(locale);
  const links = hrefs(locale);
  const statusLabel = {
    pending: t.intranet.pending,
    accepted: t.intranet.accepted,
    declined: t.intranet.declined,
  };

  const riders = await listRiders();
  const bonds = await getBonds();
  const byId = new Map(riders.map((rider) => [rider.id, rider]));
  const incoming = bonds.filter((bond) => bond.toId === session.id);
  const outgoing = bonds.filter((bond) => bond.fromId === session.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.28em] text-sodium">
        {t.intranet.plaza}
      </p>
      <h1 className="display mt-3 text-6xl">{session.name}</h1>
      <p className="mt-3 text-mist">
        {session.role === "mentor" ? t.roles.mentor : t.roles.beginner} ·{" "}
        {t.disciplines[session.discipline]} · {session.city} · {session.bike}
      </p>
      <p className="mt-6 max-w-xl text-sm leading-7 text-bone/85">{session.bio}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={links.rider(session.slug)}
          className="border border-line px-4 py-2 text-xs uppercase tracking-[0.18em] text-bone"
        >
          {t.intranet.card}
        </Link>
        <form action={logoutCommunity}>
          <input type="hidden" name="locale" value={locale} />
          <button
            type="submit"
            className="px-4 py-2 text-xs uppercase tracking-[0.18em] text-mist"
          >
            {t.intranet.logout}
          </button>
        </form>
      </div>

      <section className="mt-12">
        <h2 className="display text-4xl">{t.intranet.incoming}</h2>
        {incoming.length === 0 ? (
          <p className="mt-3 text-sm text-mist">{t.intranet.nobody}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {incoming.map((bond) => {
              const other = byId.get(bond.fromId);
              return (
                <li key={bond.id} className="border border-line bg-rubber p-4">
                  <p className="text-sm">
                    <Link
                      href={other ? links.rider(other.slug) : links.explorar}
                      className="text-sodium"
                    >
                      {other?.name ?? t.intranet.cyclist}
                    </Link>{" "}
                    · {statusLabel[bond.status]}
                  </p>
                  {bond.message ? (
                    <p className="mt-2 text-sm text-mist">{bond.message}</p>
                  ) : null}
                  {bond.status === "pending" ? (
                    <div className="mt-4 flex gap-2">
                      <form action={respondBond}>
                        <input type="hidden" name="id" value={bond.id} />
                        <input type="hidden" name="status" value="accepted" />
                        <input type="hidden" name="locale" value={locale} />
                        <button
                          type="submit"
                          className="bg-volt px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-bone"
                        >
                          {t.intranet.accept}
                        </button>
                      </form>
                      <form action={respondBond}>
                        <input type="hidden" name="id" value={bond.id} />
                        <input type="hidden" name="status" value="declined" />
                        <input type="hidden" name="locale" value={locale} />
                        <button
                          type="submit"
                          className="border border-line px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-mist"
                        >
                          {t.intranet.no}
                        </button>
                      </form>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <h2 className="display text-4xl">{t.intranet.outgoing}</h2>
        {outgoing.length === 0 ? (
          <p className="mt-3 text-sm text-mist">
            {t.intranet.noneYet}{" "}
            <Link href={links.explorar} className="text-sodium">
              {t.nav.peloton}
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {outgoing.map((bond) => {
              const other = byId.get(bond.toId);
              return (
                <li key={bond.id} className="border border-line bg-rubber p-4">
                  <p className="text-sm">
                    <Link
                      href={other ? links.rider(other.slug) : links.explorar}
                      className="text-sodium"
                    >
                      {other?.name ?? t.intranet.cyclist}
                    </Link>{" "}
                    · {statusLabel[bond.status]}
                  </p>
                  {bond.message ? (
                    <p className="mt-2 text-sm text-mist">{bond.message}</p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
