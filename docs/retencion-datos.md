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
- Dry-run y apply usan el mismo SELECT; el apply vuelve a comprobar la fila.

## Tarea

- HTTP: `GET` o `POST /api/retention/purge` con `Authorization: Bearer $RETENTION_CRON_SECRET` (o `CRON_SECRET` de Vercel).
- GET semanal (lunes 04:00 UTC): simulación, salvo `RETENTION_PURGE_APPLY=1`.
- Apply real: `POST` con cuerpo `{"confirm":"purge"}`. Los query params no bastan.
- Respuesta: recuentos y `entityId` (UUID), sin correos ni nombres.
- Un apply escribe en logs solo recuentos.

## Recuperación

No hay papelera. Restaurar solo con backup o PITR de Supabase, si el instante anterior al DELETE sigue cubierto. Antes de un apply hay que guardar el listado de candidatos del dry-run y marcar holds.
