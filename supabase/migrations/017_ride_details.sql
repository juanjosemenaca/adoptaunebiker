-- Dedicated Adopta project only. Do not apply to the ERP database.

alter table public.rides
  add column if not exists distance_km integer
    check (distance_km is null or (distance_km >= 5 and distance_km <= 400)),
  add column if not exists elevation_m integer
    check (elevation_m is null or (elevation_m >= 0 and elevation_m <= 8000)),
  add column if not exists route_url text not null default '';
