import type { Metadata } from "next";
import { RiderCard } from "@/components/rider-card";
import { fill, getDictionary } from "@/i18n/get-dictionary";
import { disciplines, isDiscipline } from "@/lib/labels";
import { hrefs } from "@/lib/paths";
import { listRiders } from "@/lib/session";
import type { Role } from "@/lib/types";

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);
  return { title: t.intranet.pelotonTitle, description: t.intranet.pelotonLead, robots: { index: false, follow: false } };
}

export default async function ExplorarPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    q?: string;
    ciudad?: string;
    rol?: string;
    modalidad?: string;
  }>;
}) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const links = hrefs(locale);
  const query = await searchParams;
  const q = (one(query.q) ?? "").trim().toLowerCase();
  const ciudad = one(query.ciudad) ?? "";
  const rol = one(query.rol) ?? "";
  const modalidad = one(query.modalidad) ?? "";
  const all = await listRiders();
  const cityOptions = [...new Set(all.map((rider) => rider.city))].sort((a, b) =>
    a.localeCompare(b, locale),
  );

  const filtered = all.filter((rider) => {
    const matchQ =
      !q ||
      `${rider.name} ${rider.city} ${rider.bike} ${rider.bio} ${rider.discipline} ${rider.tags.join(" ")}`
        .toLowerCase()
        .includes(q);
    const matchCity = !ciudad || rider.city === ciudad;
    const matchRole = !rol || rider.role === (rol as Role);
    const matchDiscipline =
      !modalidad || (isDiscipline(modalidad) && rider.discipline === modalidad);
    return matchQ && matchCity && matchRole && matchDiscipline;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.28em] text-sodium">
        {t.intranet.kicker}
      </p>
      <h1 className="display mt-3 text-6xl sm:text-7xl">{t.intranet.pelotonTitle}</h1>
      <p className="mt-4 max-w-xl text-mist">{t.intranet.pelotonLead}</p>

      <form
        method="get"
        action={links.explorar}
        className="mt-8 grid gap-3 border border-line bg-rubber p-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
          {t.intranet.search}
          <input
            name="q"
            defaultValue={q}
            placeholder={t.intranet.searchHint}
            className="mt-2 w-full border border-line bg-asphalt px-3 py-2 text-sm text-bone"
          />
        </label>
        <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
          {t.intranet.city}
          <select
            name="ciudad"
            defaultValue={ciudad}
            className="mt-2 w-full border border-line bg-asphalt px-3 py-2 text-sm text-bone"
          >
            <option value="">{t.intranet.all}</option>
            {cityOptions.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
          {t.intranet.role}
          <select
            name="rol"
            defaultValue={rol}
            className="mt-2 w-full border border-line bg-asphalt px-3 py-2 text-sm text-bone"
          >
            <option value="">{t.intranet.everyone}</option>
            <option value="mentor">{t.roles.mentors}</option>
            <option value="ebiker">{t.roles.beginners}</option>
          </select>
        </label>
        <label className="block text-[10px] uppercase tracking-[0.18em] text-mist">
          {t.intranet.discipline}
          <select
            name="modalidad"
            defaultValue={modalidad}
            className="mt-2 w-full border border-line bg-asphalt px-3 py-2 text-sm text-bone"
          >
            <option value="">{t.intranet.all}</option>
            {disciplines.map((item) => (
              <option key={item} value={item}>
                {t.disciplines[item]}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="self-end bg-sodium px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-bone"
        >
          {t.intranet.filter}
        </button>
      </form>

      <p className="mt-6 text-xs uppercase tracking-[0.18em] text-mist">
        {fill(t.intranet.count, { n: filtered.length })}
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {filtered.map((rider) => (
          <RiderCard key={rider.id} rider={rider} locale={locale} t={t} />
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="mt-10 text-mist">{t.intranet.none}</p>
      ) : null}
    </div>
  );
}
