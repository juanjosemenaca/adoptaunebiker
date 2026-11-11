-- Dedicated Adopta project only. Do not apply to the ERP database.
-- After a ride, host and accepted riders can leave photos, tracks and links.

create table if not exists public.ride_keeps (
  id uuid primary key default gen_random_uuid(),
  ride_id uuid not null references public.rides (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  kind text not null check (kind in ('photo', 'track', 'link')),
  path text not null default '',
  url text not null default '',
  caption text not null default '',
  created_at timestamptz not null default now(),
  constraint ride_keeps_payload check (
    (kind = 'link' and path = '' and url ~ '^https?://')
    or (kind in ('photo', 'track') and path <> '')
  ),
  constraint ride_keeps_caption check (char_length(caption) <= 280)
);

create index if not exists ride_keeps_ride_idx on public.ride_keeps (ride_id, created_at);

alter table public.ride_keeps enable row level security;

drop policy if exists "group reads ride keeps" on public.ride_keeps;
create policy "group reads ride keeps" on public.ride_keeps
  for select using (
    public.is_admin()
    or public.is_ride_host(ride_id)
    or public.is_accepted_on_ride(ride_id)
  );

drop policy if exists "group writes ride keeps" on public.ride_keeps;
create policy "group writes ride keeps" on public.ride_keeps
  for insert with check (
    auth.uid() = author_id
    and (
      public.is_ride_host(ride_id)
      or public.is_accepted_on_ride(ride_id)
    )
    and exists (
      select 1 from public.rides r
      where r.id = ride_id
        and r.status = 'open'
        and r.starts_at < now()
    )
  );

grant select, insert on public.ride_keeps to authenticated;

insert into storage.buckets (id, name, public)
values ('ride-tracks', 'ride-tracks', true)
on conflict (id) do update set public = true;

drop policy if exists "ride-tracks public read" on storage.objects;
create policy "ride-tracks public read"
  on storage.objects for select
  using (bucket_id = 'ride-tracks');

drop policy if exists "ride-tracks own insert" on storage.objects;
create policy "ride-tracks own insert"
  on storage.objects for insert
  with check (
    bucket_id = 'ride-tracks'
    and split_part(name, '/', 1) = auth.uid()::text
  );

drop policy if exists "ride-tracks own update" on storage.objects;
create policy "ride-tracks own update"
  on storage.objects for update
  using (
    bucket_id = 'ride-tracks'
    and split_part(name, '/', 1) = auth.uid()::text
  );

drop policy if exists "ride-tracks own delete" on storage.objects;
create policy "ride-tracks own delete"
  on storage.objects for delete
  using (
    bucket_id = 'ride-tracks'
    and split_part(name, '/', 1) = auth.uid()::text
  );
