import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

export const paths = {
  home: "/",
  comunidad: "/comunidad",
  principiante: "/principiante",
  veterano: "/veterano",
  entrar: "/entrar",
  intranet: "/intranet",
  admin: "/admin",
  adminMembers: "/admin/miembros",
  adminMeetups: "/admin/quedadas",
  adminRequests: "/admin/solicitudes",
  adminRequest: (id: string) => `/admin/solicitudes?ver=${id}`,
  explorar: "/intranet/explorar",
  cuenta: "/intranet/cuenta",
  rider: (slug: string) => `/intranet/rider/${slug}`,
} as const;

export const publicSectionKeys = [
  { key: "community" as const, id: "comunidad" },
  { key: "beginner" as const, id: "principiante" },
  { key: "veteran" as const, id: "veterano" },
  { key: "how" as const, id: "entrar" },
  { key: "code" as const, id: "codigo" },
  { key: "faq" as const, id: "faq" },
] as const;

export function hrefs(locale: string) {
  const lang: Locale = isLocale(locale) ? locale : defaultLocale;
  const base = `/${lang}`;
  return {
    home: base,
    comunidad: `${base}/comunidad`,
    principiante: `${base}/principiante`,
    veterano: `${base}/veterano`,
    entrar: `${base}/entrar`,
    intranet: `${base}/intranet`,
    admin: `${base}/admin`,
    adminMembers: `${base}/admin/miembros`,
    adminMeetups: `${base}/admin/quedadas`,
    adminRequests: `${base}/admin/solicitudes`,
    adminRequest: (id: string) => `${base}/admin/solicitudes?ver=${id}`,
    explorar: `${base}/intranet/explorar`,
    cuenta: `${base}/intranet/cuenta`,
    rider: (slug: string) => `${base}/intranet/rider/${slug}`,
  };
}

export function adminNav(locale: string) {
  const links = hrefs(locale);
  return [
    { href: links.admin, key: "controlPanel" as const },
    { href: links.adminMembers, key: "members" as const },
    { href: links.adminMeetups, key: "meetups" as const },
    { href: links.adminRequests, key: "requests" as const },
  ];
}

export function intranetNav(locale: string) {
  const links = hrefs(locale);
  return [
    { href: links.intranet, key: "panel" as const },
    { href: links.explorar, key: "peloton" as const },
    { href: links.cuenta, key: "account" as const },
  ];
}

export function anchors() {
  return {
    home: "#inicio",
    community: "#comunidad",
    beginner: "#principiante",
    veteran: "#veterano",
    how: "#entrar",
    join: "#crear-plaza",
    code: "#codigo",
    faq: "#faq",
  };
}

export function landingSection(
  locale: string,
  section: string,
  next?: string | null,
) {
  const lang: Locale = isLocale(locale) ? locale : defaultLocale;
  const qs = new URLSearchParams({ seccion: section });
  if (next) qs.set("next", next);
  return `/${lang}?${qs.toString()}`;
}

export function stripLocale(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] && isLocale(parts[0])) {
    const rest = parts.slice(1).join("/");
    return rest ? `/${rest}` : "/";
  }
  return pathname || "/";
}

export function withLocale(locale: string, path: string) {
  const lang: Locale = isLocale(locale) ? locale : defaultLocale;
  if (!path || path === "/") return `/${lang}`;
  if (path.startsWith(`/${lang}/`) || path === `/${lang}`) return path;
  const naked = stripLocale(path);
  return naked === "/" ? `/${lang}` : `/${lang}${naked}`;
}

export function loginHref(locale: string, next?: string | null) {
  const links = hrefs(locale);
  if (!next) return links.entrar;
  const qs = new URLSearchParams({ next });
  return `${links.entrar}?${qs.toString()}`;
}

export function safeIntranetPath(
  value: string | null | undefined,
  locale: string = defaultLocale,
) {
  const lang: Locale = isLocale(locale) ? locale : defaultLocale;
  if (value && value.includes("/admin")) return withLocale(lang, value);
  if (value && value.includes("/intranet")) return withLocale(lang, value);
  return `/${lang}/intranet`;
}
