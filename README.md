# Adopta un eBiker

Comunidad web que conecta a quien se acaba de aficionar a la bici eléctrica (MTB, carretera o gravel) con veteranos de esas tres modalidades.

La web pública explica la idea. La intranet es donde eBikers y veteranos entran, se ven y se adoptan. No hay sección de rutas: eso ya lo cubren apps especializadas.

## Arranque

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Qué hay ahora

- Web pública en cuatro partes: qué es, eBiker, veterano, cómo entrar
- Intranet con login, pelotón y peticiones de adopción
- Esquema SQL en `supabase/migrations` para un proyecto Supabase **dedicado**

El Supabase que hay enlazado en Cursor es de otro producto. No se ha escrito nada ahí.

## Dominio (DonDominio)

El dominio [adoptaunebiker.com](https://adoptaunebiker.com) está en DonDominio y **ya apunta a Vercel** (`76.76.21.21` y `www` → `cname.vercel-dns.com`).

## Indexación (Google Search Console)

La web publica `https://adoptaunebiker.com/robots.txt` y `https://adoptaunebiker.com/sitemap.xml`. El sitemap lista la portada en `es`, `ca`, `en`, `fr` y `de`. Login, intranet y administración van con `noindex`.

1. En [Google Search Console](https://search.google.com/search-console) añade la propiedad **Prefijo de URL** `https://adoptaunebiker.com`.
2. Elige verificación por **etiqueta HTML**. Copia el valor `content` (un token largo).
3. En Vercel → Settings → Environment Variables define `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` con ese token y vuelve a desplegar.
4. En Search Console pulsa **Verificar** y, después, **Sitemaps** → añade `sitemap.xml`.

