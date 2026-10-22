/**
 * Provisional public photographs in /public/media.
 * Replace the files and keep these keys to swap images later.
 * They are design photos, not portraits of community members.
 */
export const publicMedia = {
  hero: {
    src: "/media/hero.jpg",
    alt: "Ciclistas con bicicletas en un mirador sobre la ciudad",
  },
  beginner: {
    src: "/media/beginner.jpg",
    alt: "Ciclista de carretera de espaldas",
  },
  veteran: {
    src: "/media/veteran.jpg",
    alt: "Ciclista de carretera de perfil",
  },
  close: {
    src: "/media/close.jpg",
    alt: "Carretera de montaña al atardecer",
  },
} as const;

export type PublicMediaSlot = keyof typeof publicMedia;
