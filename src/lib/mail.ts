import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { DEMO_PASSWORD } from "@/lib/auth";

const copy: Record<
  Locale,
  { subject: string; text: (name: string, email: string, loginUrl: string) => string }
> = {
  es: {
    subject: "Tu plaza en Adopta un e-biker",
    text: (name, email, loginUrl) =>
      [
        `Hola ${name},`,
        "",
        "Tu solicitud de alta ha sido aceptada. Ya tienes plaza en Adopta un e-biker.",
        "",
        `Usuario: ${email}`,
        `Clave: ${DEMO_PASSWORD}`,
        "",
        `Entra aquí: ${loginUrl}`,
        "",
        `La primera vez que entres tendrás que cambiar la clave. No dejes ${DEMO_PASSWORD} como clave definitiva.`,
        "",
        "Adopta un e-biker",
      ].join("\n"),
  },
  ca: {
    subject: "La teva plaça a Adopta un e-biker",
    text: (name, email, loginUrl) =>
      [
        `Hola ${name},`,
        "",
        "La teva sol·licitud d’alta ha estat acceptada. Ja tens plaça a Adopta un e-biker.",
        "",
        `Usuari: ${email}`,
        `Clau: ${DEMO_PASSWORD}`,
        "",
        `Entra aquí: ${loginUrl}`,
        "",
        `El primer cop que entris hauràs de canviar la clau. No deixis ${DEMO_PASSWORD} com a clau definitiva.`,
        "",
        "Adopta un e-biker",
      ].join("\n"),
  },
  en: {
    subject: "Your place in Adopta un e-biker",
    text: (name, email, loginUrl) =>
      [
        `Hi ${name},`,
        "",
        "Your join request has been accepted. You now have a place in Adopta un e-biker.",
        "",
        `Username: ${email}`,
        `Password: ${DEMO_PASSWORD}`,
        "",
        `Sign in here: ${loginUrl}`,
        "",
        `The first time you enter you will have to change the password. Do not keep ${DEMO_PASSWORD} as your final password.`,
        "",
        "Adopta un e-biker",
      ].join("\n"),
  },
  fr: {
    subject: "Ta place dans Adopta un e-biker",
    text: (name, email, loginUrl) =>
      [
        `Bonjour ${name},`,
        "",
        "Ta demande d’inscription a été acceptée. Tu as maintenant une place dans Adopta un e-biker.",
        "",
        `Identifiant : ${email}`,
        `Mot de passe : ${DEMO_PASSWORD}`,
        "",
        `Entre ici : ${loginUrl}`,
        "",
        `La première fois, tu devras changer le mot de passe. Ne garde pas ${DEMO_PASSWORD} comme mot de passe définitif.`,
        "",
        "Adopta un e-biker",
      ].join("\n"),
  },
  de: {
    subject: "Dein Platz bei Adopta un e-biker",
    text: (name, email, loginUrl) =>
      [
        `Hallo ${name},`,
        "",
        "Deine Aufnahme-Anfrage wurde angenommen. Du hast jetzt einen Platz bei Adopta un e-biker.",
        "",
        `Benutzer: ${email}`,
        `Passwort: ${DEMO_PASSWORD}`,
        "",
        `Hier anmelden: ${loginUrl}`,
        "",
        `Beim ersten Login musst du das Passwort ändern. Lass ${DEMO_PASSWORD} nicht als endgültiges Passwort.`,
        "",
        "Adopta un e-biker",
      ].join("\n"),
  },
};

function siteUrl() {
  const value = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://adoptaunebiker.com").trim();
  return value.replace(/\/$/, "") || "https://adoptaunebiker.com";
}

export function memberLoginUrl(locale: string) {
  const lang = isLocale(locale) ? locale : defaultLocale;
  return `${siteUrl()}/${lang}/entrar`;
}

function sendResendEmail(input: { to: string; subject: string; text: string }) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return Promise.resolve({ sent: false as const, reason: "missing" as const });

  const from =
    process.env.ADOPTA_MAIL_FROM?.trim() || "Adopta un e-biker <hola@adoptaunebiker.com>";

  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject: input.subject,
      text: input.text,
    }),
  }).then(async (response) => {
    if (!response.ok) {
      const detail = await response.text();
      console.error("[sendResendEmail]", response.status, detail);
      return { sent: false as const, reason: "failed" as const };
    }
    return { sent: true as const };
  });
}

export async function sendMemberWelcomeEmail(input: {
  to: string;
  name: string;
  locale: string;
}) {
  const lang = isLocale(input.locale) ? input.locale : defaultLocale;
  const message = copy[lang];
  return sendResendEmail({
    to: input.to,
    subject: message.subject,
    text: message.text(input.name, input.to, memberLoginUrl(lang)),
  });
}

const resetCopy: Record<
  Locale,
  { subject: string; text: (name: string, email: string, loginUrl: string) => string }
> = {
  es: {
    subject: "Tu clave en Adopta un e-biker",
    text: (name, email, loginUrl) =>
      [
        `Hola ${name},`,
        "",
        "Hemos restablecido tu clave de acceso.",
        "",
        `Usuario: ${email}`,
        `Clave: ${DEMO_PASSWORD}`,
        "",
        `Entra aquí: ${loginUrl}`,
        "",
        `La primera vez que entres tendrás que cambiar la clave. No dejes ${DEMO_PASSWORD} como clave definitiva.`,
        "",
        "Adopta un e-biker",
      ].join("\n"),
  },
  ca: {
    subject: "La teva clau a Adopta un e-biker",
    text: (name, email, loginUrl) =>
      [
        `Hola ${name},`,
        "",
        "Hem restablert la teva clau d’accés.",
        "",
        `Usuari: ${email}`,
        `Clau: ${DEMO_PASSWORD}`,
        "",
        `Entra aquí: ${loginUrl}`,
        "",
        `El primer cop que entris hauràs de canviar la clau. No deixis ${DEMO_PASSWORD} com a clau definitiva.`,
        "",
        "Adopta un e-biker",
      ].join("\n"),
  },
  en: {
    subject: "Your password in Adopta un e-biker",
    text: (name, email, loginUrl) =>
      [
        `Hi ${name},`,
        "",
        "We have reset your sign-in password.",
        "",
        `Username: ${email}`,
        `Password: ${DEMO_PASSWORD}`,
        "",
        `Sign in here: ${loginUrl}`,
        "",
        `The first time you enter you will have to change the password. Do not keep ${DEMO_PASSWORD} as your final password.`,
        "",
        "Adopta un e-biker",
      ].join("\n"),
  },
  fr: {
    subject: "Ton mot de passe dans Adopta un e-biker",
    text: (name, email, loginUrl) =>
      [
        `Bonjour ${name},`,
        "",
        "Nous avons réinitialisé ton mot de passe.",
        "",
        `Identifiant : ${email}`,
        `Mot de passe : ${DEMO_PASSWORD}`,
        "",
        `Entre ici : ${loginUrl}`,
        "",
        `La première fois, tu devras changer le mot de passe. Ne garde pas ${DEMO_PASSWORD} comme mot de passe définitif.`,
        "",
        "Adopta un e-biker",
      ].join("\n"),
  },
  de: {
    subject: "Dein Passwort bei Adopta un e-biker",
    text: (name, email, loginUrl) =>
      [
        `Hallo ${name},`,
        "",
        "Wir haben dein Passwort zurückgesetzt.",
        "",
        `Benutzer: ${email}`,
        `Passwort: ${DEMO_PASSWORD}`,
        "",
        `Hier anmelden: ${loginUrl}`,
        "",
        `Beim ersten Login musst du das Passwort ändern. Lass ${DEMO_PASSWORD} nicht als endgültiges Passwort.`,
        "",
        "Adopta un e-biker",
      ].join("\n"),
  },
};

export async function sendMemberResetEmail(input: {
  to: string;
  name: string;
  locale: string;
}) {
  if (!input.to) return { sent: false as const, reason: "missing" as const };
  const lang = isLocale(input.locale) ? input.locale : defaultLocale;
  const message = resetCopy[lang];
  return sendResendEmail({
    to: input.to,
    subject: message.subject,
    text: message.text(input.name, input.to, memberLoginUrl(lang)),
  });
}
