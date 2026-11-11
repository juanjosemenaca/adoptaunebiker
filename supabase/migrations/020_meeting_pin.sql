-- Dedicated Adopta project only. Do not apply to the ERP database.

alter table public.rides
  add column if not exists meeting_lat double precision,
  add column if not exists meeting_lng double precision;
