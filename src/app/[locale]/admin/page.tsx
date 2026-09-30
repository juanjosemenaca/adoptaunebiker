import { logoutCommunity } from "@/app/actions";
import { getDictionary } from "@/i18n/get-dictionary";
import { listSignupRequests } from "@/lib/signup-requests";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const requests = await listSignupRequests();
  const dateLocale = locale === "en" ? "en-GB" : locale;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.28em] text-volt">{t.admin.kicker}</p>
      <h1 className="display mt-3 text-6xl sm:text-7xl">{t.admin.title}</h1>
      <p className="mt-4 max-w-xl text-mist">{t.admin.lead}</p>
      <form action={logoutCommunity} className="mt-6">
        <input type="hidden" name="locale" value={locale} />
        <button
          type="submit"
          className="px-4 py-2 text-xs uppercase tracking-[0.18em] text-mist"
        >
          {t.intranet.logout}
        </button>
      </form>

      {requests.length === 0 ? (
        <p className="mt-12 text-mist">{t.admin.empty}</p>
      ) : (
        <ul className="mt-12 space-y-4">
          {requests.map((item) => (
            <li key={item.id} className="border border-line bg-rubber p-5 sm:p-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-sodium">
                {t.admin.received}{" "}
                {new Date(item.createdAt).toLocaleString(dateLocale, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
              <h2 className="display mt-3 text-3xl">{item.name}</h2>
              <p className="mt-2 text-sm text-mist">
                {item.email} · {item.city} ·{" "}
                {item.role === "mentor" ? t.roles.mentor : t.roles.beginner} ·{" "}
                {t.disciplines[item.discipline]}
              </p>
              {item.bike ? (
                <p className="mt-3 text-sm text-bone">{t.forms.bike}: {item.bike}</p>
              ) : null}
              {item.bio ? <p className="mt-2 text-sm leading-7 text-mist">{item.bio}</p> : null}
              {item.lookingFor ? (
                <p className="mt-2 text-sm text-mist">
                  {t.forms.looking}: {item.lookingFor}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
