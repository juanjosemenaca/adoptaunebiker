export const paths = {
  home: "/",
  comunidad: "/comunidad",
  principiante: "/principiante",
  veterano: "/veterano",
  entrar: "/entrar",
  intranet: "/intranet",
  explorar: "/intranet/explorar",
  cuenta: "/intranet/cuenta",
  rider: (slug: string) => `/intranet/rider/${slug}`,
} as const;

export const publicSections = [
  {
    href: paths.home,
    n: "01",
    nav: "Inicio",
    title: "Adopta un eBiker",
    kicker: "La idea",
  },
  {
    href: paths.comunidad,
    n: "02",
    nav: "Comunidad",
    title: "Quiénes somos",
    kicker: "Quiénes somos",
  },
  {
    href: paths.principiante,
    n: "03",
    nav: "Principiante",
    title: "Qué es un principiante",
    kicker: "Quién empieza",
  },
  {
    href: paths.veterano,
    n: "04",
    nav: "Veterano",
    title: "Qué es un veterano",
    kicker: "Quién comparte",
  },
  {
    href: paths.entrar,
    n: "05",
    nav: "Cómo funciona",
    title: "Cómo funciona",
    kicker: "La plaza",
  },
] as const;

export function safeIntranetPath(value: string | null | undefined) {
  if (value && value.startsWith("/intranet")) return value;
  return paths.intranet;
}
