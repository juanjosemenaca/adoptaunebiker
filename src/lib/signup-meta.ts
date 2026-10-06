import { isDiscipline, isPractice, parsePracticeList } from "@/lib/labels";
import type { Dictionary } from "@/i18n/types";
import type { Discipline, Practice, Role } from "@/lib/types";

const META_V2 = /^\[\[v2\|([^|]*)\|([^|]*)\|([^\]]*)\]\]/;
const META_V1 = /^\[\[v1\|([^|]+)\|([^\]]*)\]\]/;

export type SignupMeta = {
  veteranIn: Practice[];
  beginnerIn: Practice[];
  interestedIn: Discipline[];
  practice: Practice | null;
  lookingFor: string;
};

export function encodeSignupMeta(
  veteranIn: Practice[],
  beginnerIn: Practice[],
  interestedIn: Discipline[],
  lookingFor: string,
) {
  const meta = `[[v2|${veteranIn.join(",")}|${beginnerIn.join(",")}|${interestedIn.join(",")}]]`;
  return lookingFor ? `${meta}${lookingFor}` : meta;
}

export function decodeSignupMeta(lookingFor: string): SignupMeta {
  const v2 = lookingFor.match(META_V2);
  if (v2) {
    const veteranIn = parsePracticeList(v2[1].split(","));
    const beginnerIn = parsePracticeList(v2[2].split(",")).filter(
      (item) => !veteranIn.includes(item),
    );
    return {
      veteranIn,
      beginnerIn,
      interestedIn: v2[3]
        .split(",")
        .map((item) => item.trim())
        .filter(isDiscipline),
      practice: veteranIn[0] ?? beginnerIn[0] ?? null,
      lookingFor: lookingFor.slice(v2[0].length),
    };
  }

  const v1 = lookingFor.match(META_V1);
  if (v1) {
    const practice = isPractice(v1[1]) ? v1[1] : null;
    return {
      veteranIn: [],
      beginnerIn: [],
      interestedIn: v1[2]
        .split(",")
        .map((item) => item.trim())
        .filter(isDiscipline),
      practice,
      lookingFor: lookingFor.slice(v1[0].length),
    };
  }

  return {
    veteranIn: [],
    beginnerIn: [],
    interestedIn: [],
    practice: null,
    lookingFor,
  };
}

export function hydrateSignupLevels(input: {
  role: Role;
  practice?: Practice | null;
  veteranIn?: Practice[];
  beginnerIn?: Practice[];
  meta: SignupMeta;
}) {
  let veteranIn = parsePracticeList(input.veteranIn ?? input.meta.veteranIn);
  let beginnerIn = parsePracticeList(input.beginnerIn ?? input.meta.beginnerIn).filter(
    (item) => !veteranIn.includes(item),
  );

  if (!veteranIn.length && !beginnerIn.length) {
    const practice =
      input.practice && isPractice(input.practice) ? input.practice : input.meta.practice;
    if (practice) {
      if (input.role === "ebiker") beginnerIn = [practice];
      else veteranIn = [practice];
    }
  }

  return {
    veteranIn,
    beginnerIn,
    practice: veteranIn[0] ?? beginnerIn[0] ?? null,
  };
}

export function practiceLabel(t: Dictionary, practice: Practice) {
  if (practice === "ebike") return t.forms.ebike;
  return t.disciplines[practice];
}

export function practiceListLabel(t: Dictionary, items: Practice[]) {
  return items.map((item) => practiceLabel(t, item)).join(", ");
}

export function interestedLabel(t: Dictionary, interestedIn: Discipline[]) {
  return interestedIn.map((item) => t.disciplines[item]).join(", ");
}
