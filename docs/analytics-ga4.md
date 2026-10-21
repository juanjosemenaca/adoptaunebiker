# Google Analytics 4

Hoy **no está activo**. Falta `NEXT_PUBLIC_GA_MEASUREMENT_ID` (formato `G-…` de este sitio, no de otro proyecto).

El script solo se renderiza si hay un ID válido **y** `adopta.privacy` tiene `analytics=1`. «Aceptar todas» marca esa categoría; «Rechazar las opcionales» o guardar la casilla desmarcada la deja en `0`. Sin ID, aceptar no carga `gtag.js`.

Cuando exista el ID real:

1. En Vercel (`temporary-express-oxygen-2mqwgeo`), variable de producción `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
2. Redesplegar. No hace falta cambiar cookies guardadas a mano.
3. Comprobar que sin banner resuelto no hay `googletagmanager`.
4. Rechazar opcionales: sigue sin script.
5. Aceptar analítica: aparece `gtag/js?id=G-…` y un solo `gtag('config'`.
6. Volver a «Configurar cookies» y desmarcar analítica: `router.refresh()` quita el script y se pone `ga-disable-G-…`.

No usar un ID inventado ni el de otro dominio.
