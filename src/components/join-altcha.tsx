"use client";

import { useEffect, useRef } from "react";

const widgetLanguage: Record<string, string> = {
  es: "es-es",
  ca: "ca",
  en: "en",
  fr: "fr-fr",
  de: "de",
};

export function JoinAltcha({ locale }: { locale: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;

    void (async () => {
      await Promise.all([
        import("altcha"),
        import("altcha/i18n/ca"),
        import("altcha/i18n/de"),
        import("altcha/i18n/en"),
        import("altcha/i18n/es-es"),
        import("altcha/i18n/fr-fr"),
      ]);
      if (cancelled || !hostRef.current) return;
      const widget = document.createElement("altcha-widget");
      widget.setAttribute("challenge", "/api/altcha");
      widget.setAttribute(
        "configuration",
        JSON.stringify({ hideFooter: true, hideLogo: true }),
      );
      widget.setAttribute("display", "standard");
      widget.setAttribute("language", widgetLanguage[locale] ?? "es-es");
      widget.setAttribute("name", "altcha");
      widget.setAttribute("type", "checkbox");
      hostRef.current.replaceChildren(widget);
      void widget.configure({ hideFooter: true, hideLogo: true });
    })();

    return () => {
      cancelled = true;
      host.replaceChildren();
    };
  }, [locale]);

  return <div ref={hostRef} className="public-join-altcha public-join-wide" />;
}
