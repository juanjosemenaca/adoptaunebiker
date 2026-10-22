# Analítica (Google Tag Manager)

El contenedor **GTM-MX2JCJFR** está en el código. El script y el iframe de Google Tag Manager solo se renderizan si `adopta.privacy` tiene `analytics=1`.

«Aceptar todas» marca esa categoría. «Rechazar las opcionales» o guardar la casilla desmarcada la deja en `0`. Sin consentimiento no se pide `googletagmanager.com`.

Puedes sustituir el contenedor con `NEXT_PUBLIC_GTM_ID` (formato `GTM-…`). Vaciar esa variable lo apaga. No hace falta un `G-…` en Vercel: las etiquetas de medición se configuran dentro de GTM.

Comprobar:

1. Sin banner resuelto no hay `gtm.js` ni `ns.html`.
2. Rechazar opcionales: sigue sin script.
3. Aceptar analítica: aparece `gtm.js?id=GTM-MX2JCJFR` y el iframe `ns.html`.
4. Volver a «Configurar cookies» y desmarcar analítica: `router.refresh()` quita el script.

Si más adelante se añade un `NEXT_PUBLIC_GA_MEASUREMENT_ID` (`G-…`) y no hay GTM, se usa el `gtag.js` directo de GA4. Con GTM activo no se carga ese `gtag` en paralelo, para no contar dos veces.
