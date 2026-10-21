# Conservación de datos (seis meses)

La función SQL y la ruta HTTP están implementadas. El primer ciclo semanal es de **simulación** hasta que exista `RETENTION_PURGE_APPLY=1` y se haya revisado un dry-run. Las filas ya rechazadas o inactivas empiezan el plazo en el momento de aplicar la migración, no en `created_at`.

No aplicar este SQL al proyecto ERP.

## Regla operativa

| Categoría | Acción | Evento que inicia el plazo |
|---|---|---|
| Solicitud rechazada | Eliminar a los seis meses | `rejected_at` |
| Solicitud pendiente | Conservar | Sin decisión humana no se borra |
| Solicitud aceptada con miembro | Conservar los datos personales mientras exista la plaza | Aceptación. Al purgar el miembro se anonimiza la solicitud |
| Solicitud aceptada huérfana | Anonimizar a los seis meses | `created_at` si no hay perfil con el mismo correo |
| Cuenta activa | Conservar | El plazo no empieza |
| Cuenta inactiva (`kind = user`) | Eliminar a los seis meses | `deactivated_at` |
| Administrador | Conservar siempre | Si no queda ningún admin, la función aborta |
| `retention_hold = true` | Conservar / no anonimizar | Obligación legal, seguridad o reclamación |

Al anonimizar una solicitud aceptada se sustituyen nombre, correo, ciudad, bici, bio y texto. Queda la fila como constancia de admisión, sin datos de contacto.

## Seguridad

- El DELETE revalida estado, tipo, fecha, hold y que no sea admin.
- `FOR UPDATE` + `pg_advisory_xact_lock(872314)`.
- Confirmación SQL: `p_confirm = 'purge'`. Sin eso no hay borrado, aunque se llame con service role.
- Los usuarios no pueden cambiar `kind`, `member_status`, `retention_hold` ni las fechas de baja.
- `009_protect_last_admin.sql` impide borrar o degradar al último administrador, también fuera del purge.
- Dry-run y apply usan el mismo SELECT; el apply vuelve a comprobar la fila.

## Tarea

- HTTP: `GET` o `POST /api/retention/purge` con `Authorization: Bearer $RETENTION_CRON_SECRET` (o `CRON_SECRET` de Vercel).
- GET semanal (lunes 04:00 UTC): simulación, salvo `RETENTION_PURGE_APPLY=1`.
- Apply real: `POST` con cuerpo `{"confirm":"purge"}`. Los query params no bastan.
- Respuesta: recuentos y `entityId` (UUID), sin correos ni nombres.
- Un apply escribe en logs solo recuentos.

## Dry-run (sin borrar)

No activar `RETENTION_PURGE_APPLY`. El valor `true` no habilita el apply; solo `1` lo haría.

El cron de Vercel llama `GET /api/retention/purge` y envía `Authorization: Bearer $CRON_SECRET` si el plan lo inyecta. El endpoint también acepta `RETENTION_CRON_SECRET`. Si ambos faltan, la petición queda en 401 y no hay simulación.

Cuando existan `SUPABASE_SERVICE_ROLE_KEY` y uno de esos secretos:

```bash
curl -sS -X GET "$ORIGIN/api/retention/purge" \
  -H "Authorization: Bearer $RETENTION_CRON_SECRET"
```

La respuesta debe tener `dryRun: true` y `applied: false`. Guarda `candidates` (UUID y motivo). No debe haber `entityType=member` de cuentas activas o `kind=admin`, ni filas con hold.

PITR/backup: confirmarlo en el panel de Supabase del proyecto `yuhfjmlekblutmymtavm`. Este repositorio no lo puede afirmar.

## Último administrador (009)

La 009 no se vuelve a aplicar desde aquí. En el SQL editor de Adopta, solo lectura:

```sql
select tgname
from pg_trigger
where tgrelid = 'public.profiles'::regclass
  and tgname in ('profiles_protect_last_admin_upd', 'profiles_protect_last_admin_del');

select count(*) filter (where kind = 'admin') as admins
from public.profiles;
```

Deben existir esos dos triggers. No borrar ni degradar al último admin real para probarlo.

La 009 cuenta otros administradores sin bloqueo. Dos degradaciones concurrentes de dos admins distintos podrían, en teoría, dejar el sistema a cero. No se ha reproducido aquí. Un 010 con `pg_advisory_xact_lock` sobre el mismo espacio que el purge (o un `SELECT … FOR UPDATE` de las filas admin) lo cerraría; no se aplica en este paso.

## Recuperación

No hay papelera. Restaurar solo con backup o PITR de Supabase, si el instante anterior al DELETE sigue cubierto. Antes de un apply hay que guardar el listado de candidatos del dry-run y marcar holds. El PITR no está confirmado desde este entorno.
