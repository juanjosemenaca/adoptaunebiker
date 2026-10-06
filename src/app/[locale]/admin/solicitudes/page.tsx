import Link from "next/link";
import { notFound } from "next/navigation";
import { SignupRequestToolbar } from "@/components/signup-request-toolbar";
import { fill, getDictionary } from "@/i18n/get-dictionary";
import { hrefs } from "@/lib/paths";
import { inboxStatusLabel } from "@/lib/signup-inbox";
import { interestedLabel, practiceListLabel } from "@/lib/signup-meta";
import {
  listSignupRequests,
  markSignupRequestRead,
} from "@/lib/signup-requests";
import { isSignupInboxStatus, SIGNUP_INBOX_STATUSES } from "@/lib/types";

export default async function AdminRequestsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ estado?: string; ver?: string; alta?: string; correo?: string }>;
}) {
  const { locale } = await params;
  const query = await searchParams;
  const t = getDictionary(locale);
  const links = hrefs(locale);
  const dateLocale = locale === "en" ? "en-GB" : locale;

  if (query.ver) {
    const item = await markSignupRequestRead(query.ver);
    if (!item) notFound();

    const fields = [
      { label: t.forms.lastName, value: item.lastName || "—" },
      { label: t.forms.email, value: item.email },
      { label: t.forms.city, value: item.city },
      { label: t.forms.veteranIn, value: practiceListLabel(t, item.veteranIn) || "—" },
      { label: t.forms.beginnerIn, value: practiceListLabel(t, item.beginnerIn) || "—" },
      { label: t.forms.interestedIn, value: interestedLabel(t, item.interestedIn) || "—" },
      { label: t.forms.bike, value: item.bike || "—" },
      { label: t.forms.ride, value: item.bio || "—" },
      { label: t.forms.looking, value: item.lookingFor || "—" },
      { label: t.admin.requestLocale, value: item.locale },
    ];
    const fullName = [item.name, item.lastName].filter(Boolean).join(" ");
    const approved = query.alta === "ok";
    const mailNote =
      query.correo === "ok"
        ? fill(t.admin.mailSent, { email: item.email })
        : query.correo === "fail"
          ? fill(t.admin.mailFailed, { email: item.email })
          : "";

    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p className="text-[11px] uppercase tracking-[0.28em] text-volt">{t.admin.kicker}</p>
        <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-sodium">
          {inboxStatusLabel(t, item.inboxStatus)} · {t.admin.received}{" "}
          {new Date(item.createdAt).toLocaleString(dateLocale, {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
        <h1 className="display mt-3 text-6xl sm:text-7xl">{fullName}</h1>
        <p className="mt-4 text-mist">{t.admin.detailTitle}</p>
        {approved ? (
          <p role="status" className="mt-6 max-w-xl border border-volt bg-rubber p-4 text-sm leading-7 text-bone">
            {t.admin.approveOk}
            {mailNote ? ` ${mailNote}` : ""}
          </p>
        ) : null}

        <dl className="mt-10 space-y-5 border border-line bg-rubber p-5 sm:p-6">
          {fields.map((field) => (
            <div key={field.label}>
              <dt className="text-[10px] uppercase tracking-[0.18em] text-mist">{field.label}</dt>
              <dd className="mt-2 text-sm leading-7 text-bone">{field.value}</dd>
            </div>
          ))}
        </dl>

        <SignupRequestToolbar id={item.id} locale={locale} status={item.inboxStatus} t={t} />

        <Link
          href={links.adminRequests}
          className="mt-10 inline-flex min-h-11 items-center text-xs font-semibold uppercase tracking-[0.2em] text-sodium"
        >
          {t.admin.backToRequests}
        </Link>
      </div>
    );
  }

  const requests = await listSignupRequests();
  const filter = query.estado && isSignupInboxStatus(query.estado) ? query.estado : null;
  const visible = filter ? requests.filter((item) => item.inboxStatus === filter) : requests;

  const filters = [
    { href: links.adminRequests, label: t.admin.statusAll, active: !filter },
    ...SIGNUP_INBOX_STATUSES.map((status) => ({
      href: `${links.adminRequests}?estado=${status}`,
      label: inboxStatusLabel(t, status),
      active: filter === status,
    })),
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.28em] text-volt">{t.admin.kicker}</p>
      <h1 className="display mt-3 text-6xl sm:text-7xl">{t.admin.title}</h1>
      <p className="mt-4 max-w-xl text-mist">{t.admin.lead}</p>

      <ul className="mt-10 flex flex-wrap gap-2">
        {filters.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`inline-flex min-h-11 items-center px-3 text-xs font-semibold uppercase tracking-[0.16em] ${
                item.active
                  ? "bg-sodium text-bone"
                  : "border border-line text-bone hover:border-sodium"
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {requests.length === 0 ? (
        <p className="mt-12 text-mist">{t.admin.empty}</p>
      ) : visible.length === 0 ? (
        <p className="mt-12 text-mist">{t.admin.emptyFilter}</p>
      ) : (
        <ul className="mt-12 space-y-4">
          {visible.map((item) => (
            <li key={item.id} className="border border-line bg-rubber p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-sodium">
                  {inboxStatusLabel(t, item.inboxStatus)}
                </p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-mist">
                  {t.admin.received}{" "}
                  {new Date(item.createdAt).toLocaleString(dateLocale, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
              <h2
                className={`display mt-3 text-3xl ${item.inboxStatus === "unread" ? "text-bone" : "text-mist"}`}
              >
                {[item.name, item.lastName].filter(Boolean).join(" ")}
              </h2>
              <p className="mt-2 text-sm text-mist">
                {item.email} · {item.city}
                {item.veteranIn.length
                  ? ` · ${t.forms.veteranIn} ${practiceListLabel(t, item.veteranIn)}`
                  : ""}
                {item.beginnerIn.length
                  ? ` · ${t.forms.beginnerIn} ${practiceListLabel(t, item.beginnerIn)}`
                  : ""}
                {item.interestedIn.length
                  ? ` · ${t.forms.interestedIn} ${interestedLabel(t, item.interestedIn)}`
                  : ""}
              </p>
              <Link
                href={links.adminRequest(item.id)}
                className="mt-5 inline-flex min-h-11 items-center text-xs font-semibold uppercase tracking-[0.2em] text-sodium"
              >
                {t.admin.open}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
