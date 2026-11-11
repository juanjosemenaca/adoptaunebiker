-- Dedicated Adopta project only. Do not apply to the ERP database.

alter table public.profiles
  add column if not exists bike_garage jsonb not null default '[]'::jsonb;

update public.profiles as p
set bike_garage = seeded.garage
from (
  select
    id,
    coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', gen_random_uuid()::text,
            'name', btrim(name),
            'kind', 'muscular',
            'note', '',
            'photoPath', '',
            'photoUrl', ''
          )
        )
        from unnest(
          case
            when bikes is not null and cardinality(bikes) > 0 then bikes
            when coalesce(btrim(bike), '') <> '' then array[btrim(bike)]
            else array[]::text[]
          end
        ) as name
        where btrim(coalesce(name, '')) <> ''
      ),
      '[]'::jsonb
    ) as garage
  from public.profiles
) as seeded
where p.id = seeded.id
  and p.bike_garage = '[]'::jsonb
  and seeded.garage <> '[]'::jsonb;

insert into storage.buckets (id, name, public)
values ('bike-photos', 'bike-photos', true)
on conflict (id) do update set public = true;

drop policy if exists "bike-photos public read" on storage.objects;
create policy "bike-photos public read"
  on storage.objects for select
  using (bucket_id = 'bike-photos');

drop policy if exists "bike-photos own insert" on storage.objects;
create policy "bike-photos own insert"
  on storage.objects for insert
  with check (
    bucket_id = 'bike-photos'
    and split_part(name, '/', 1) = auth.uid()::text
  );

drop policy if exists "bike-photos own update" on storage.objects;
create policy "bike-photos own update"
  on storage.objects for update
  using (
    bucket_id = 'bike-photos'
    and split_part(name, '/', 1) = auth.uid()::text
  );

drop policy if exists "bike-photos own delete" on storage.objects;
create policy "bike-photos own delete"
  on storage.objects for delete
  using (
    bucket_id = 'bike-photos'
    and split_part(name, '/', 1) = auth.uid()::text
  );
