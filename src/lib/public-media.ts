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
  road: {
    src: "/media/discipline-road.jpg",
    alt: "Ciclista de carretera de espaldas en el asfalto",
  },
  gravel: {
    src: "/media/discipline-gravel.jpg",
    alt: "Rueda de gravel levantando polvo en un camino",
  },
  mtb: {
    src: "/media/discipline-mtb.jpg",
    alt: "Cubierta de MTB sobre roca",
  },
  electric: {
    src: "/media/discipline-electric.jpg",
    alt: "Rueda de bicicleta eléctrica al atardecer",
  },
} as const;

export type PublicMediaSlot = keyof typeof publicMedia;
