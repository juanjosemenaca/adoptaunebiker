-- Dedicated Adopta project only. Do not apply to the ERP database.

alter table public.rides
  add column if not exists surface text,
  add column if not exists host_bike text not null default '',
  add column if not exists photo_paths text[] not null default '{}',
  add column if not exists distance_km integer,
  add column if not exists elevation_m integer,
  add column if not exists route_url text not null default '';

update public.rides
set surface = case discipline
  when 'carretera' then 'asfalto'
  when 'mtb' then 'tierra'
  when 'gravel' then 'mixto'
  else coalesce(nullif(surface, ''), 'mixto')
end
where surface is null or surface not in ('asfalto', 'tierra', 'mixto');

update public.rides set surface = 'mixto' where surface is null;
alter table public.rides alter column surface set default 'mixto';
alter table public.rides alter column surface set not null;

alter table public.rides drop constraint if exists rides_surface_check;
alter table public.rides add constraint rides_surface_check
  check (surface in ('asfalto', 'tierra', 'mixto'));

alter table public.rides drop constraint if exists rides_level_check;
update public.rides set level = 'dura' where level = 'media';
alter table public.rides add constraint rides_level_check
  check (level in ('suave', 'dura', 'exigente'));

alter table public.profiles
  add column if not exists bikes text[] not null default '{}';

update public.profiles
set bikes = array[btrim(bike)]
where coalesce(btrim(bike), '') <> ''
  and cardinality(coalesce(bikes, '{}')) = 0;

insert into storage.buckets (id, name, public)
values ('ride-photos', 'ride-photos', true)
on conflict (id) do update set public = true;

drop policy if exists "ride-photos public read" on storage.objects;
create policy "ride-photos public read"
  on storage.objects for select
  using (bucket_id = 'ride-photos');

drop policy if exists "ride-photos own insert" on storage.objects;
create policy "ride-photos own insert"
  on storage.objects for insert
  with check (
    bucket_id = 'ride-photos'
    and split_part(name, '/', 1) = auth.uid()::text
  );

drop policy if exists "ride-photos own update" on storage.objects;
create policy "ride-photos own update"
  on storage.objects for update
  using (
    bucket_id = 'ride-photos'
    and split_part(name, '/', 1) = auth.uid()::text
  );

drop policy if exists "ride-photos own delete" on storage.objects;
create policy "ride-photos own delete"
  on storage.objects for delete
  using (
    bucket_id = 'ride-photos'
    and split_part(name, '/', 1) = auth.uid()::text
  );
