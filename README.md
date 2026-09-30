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

El dominio [adoptaunebiker.com](https://adoptaunebiker.com) está en DonDominio. Next.js no se sirve desde el parking de DonDominio: hay que alojar la app (Vercel) y apuntar el DNS.

En DonDominio → Dominios → `adoptaunebiker.com` → **Zona DNS**:

| Tipo | Host | Destino / valor |
| --- | --- | --- |
| A | `@` (o vacío) | `76.76.21.21` (o la IP que muestre Vercel) |
| CNAME | `www` | `cname.vercel-dns.com` (o el CNAME que muestre Vercel) |

Borra el ANAME de parking y el CNAME de `www` que apunta a `parkingsrv0.dondominio.com` para que no choquen.

SSL lo emite Vercel cuando el DNS ya apunta.
