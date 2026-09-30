"use client";

import { useEffect } from "react";

export function LandOnInicio() {
  useEffect(() => {
    const nav = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    const params = new URLSearchParams(window.location.search);
    const seccion = params.get("seccion");

    if (nav?.type === "reload") {
      history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
      if (window.location.hash || seccion) {
        params.delete("seccion");
        const qs = params.toString();
        history.replaceState(null, "", window.location.pathname + (qs ? `?${qs}` : ""));
      }
      return;
    }

    const id = seccion || window.location.hash.replace("#", "");
    if (!id) return;
    window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView();
      if (seccion) {
        params.delete("seccion");
        const qs = params.toString();
        history.replaceState(
          null,
          "",
          `${window.location.pathname}${qs ? `?${qs}` : ""}#${id}`,
        );
      }
    });
  }, []);

  return null;
}
