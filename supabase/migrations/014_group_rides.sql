-- Dedicated Adopta project only. Do not apply to the ERP database.

create table if not exists public.rides (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  starts_at timestamptz not null,
  duration_min integer not null default 180
    check (duration_min >= 30 and duration_min <= 1440),
  discipline text not null check (discipline in ('mtb', 'carretera', 'gravel')),
  bike_kind text not null check (bike_kind in ('muscular', 'ebike', 'mixto')),
  level text not null check (level in ('suave', 'media', 'exigente')),
  place text not null,
  meeting_point text not null default '',
  notes text not null default '',
  max_riders integer check (max_riders is null or max_riders >= 2),
  status text not null default 'open' check (status in ('open', 'cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.ride_join_requests (
  id uuid primary key default gen_random_uuid(),
  ride_id uuid not null references public.rides (id) on delete cascade,
  rider_id uuid not null references public.profiles (id) on delete cascade,
  message text not null default '',
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'declined', 'cancelled')),
  created_at timestamptz not null default now(),
  constraint ride_join_unique unique (ride_id, rider_id)
);

create table if not exists public.ride_messages (
  id uuid primary key default gen_random_uuid(),
  ride_id uuid not null references public.rides (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  constraint ride_message_body check (char_length(trim(body)) between 1 and 2000)
);

create index if not exists rides_starts_at_idx on public.rides (starts_at);
create index if not exists rides_discipline_idx on public.rides (discipline);
create index if not exists rides_host_idx on public.rides (host_id);
create index if not exists rides_status_starts_idx on public.rides (status, starts_at);
create index if not exists ride_join_ride_idx on public.ride_join_requests (ride_id);
create index if not exists ride_join_rider_idx on public.ride_join_requests (rider_id);
create index if not exists ride_join_status_idx on public.ride_join_requests (status);
create index if not exists ride_messages_ride_idx on public.ride_messages (ride_id, created_at);

create or replace function public.is_ride_host(target uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.rides
    where id = target and host_id = auth.uid()
  );
$$;

create or replace function public.is_accepted_on_ride(target uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.ride_join_requests
    where ride_id = target
      and rider_id = auth.uid()
      and status = 'accepted'
  );
$$;

create or replace function public.has_ride_request(target uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.ride_join_requests
    where ride_id = target and rider_id = auth.uid()
  );
$$;

revoke all on function public.is_ride_host(uuid) from public, anon;
revoke all on function public.is_accepted_on_ride(uuid) from public, anon;
revoke all on function public.has_ride_request(uuid) from public, anon;
grant execute on function public.is_ride_host(uuid) to authenticated;
grant execute on function public.is_accepted_on_ride(uuid) to authenticated;
grant execute on function public.has_ride_request(uuid) to authenticated;

alter table public.rides enable row level security;
alter table public.ride_join_requests enable row level security;
alter table public.ride_messages enable row level security;

drop policy if exists "members read rides" on public.rides;
create policy "members read rides" on public.rides
  for select using (
    auth.uid() is not null
    and (
      public.is_admin()
      or status = 'open'
      or host_id = auth.uid()
      or public.has_ride_request(id)
    )
  );

drop policy if exists "members create rides" on public.rides;
create policy "members create rides" on public.rides
  for insert with check (
    auth.uid() = host_id
    and not public.is_admin()
  );

drop policy if exists "hosts update rides" on public.rides;
create policy "hosts update rides" on public.rides
  for update using (auth.uid() = host_id)
  with check (auth.uid() = host_id);

drop policy if exists "members read join requests" on public.ride_join_requests;
create policy "members read join requests" on public.ride_join_requests
  for select using (
    auth.uid() is not null
    and (
      public.is_admin()
      or rider_id = auth.uid()
      or public.is_ride_host(ride_id)
      or status = 'accepted'
    )
  );

drop policy if exists "members request ride spots" on public.ride_join_requests;
create policy "members request ride spots" on public.ride_join_requests
  for insert with check (
    auth.uid() = rider_id
    and not public.is_admin()
    and not public.is_ride_host(ride_id)
    and exists (
      select 1 from public.rides r
      where r.id = ride_id and r.status = 'open'
    )
  );

drop policy if exists "hosts answer join requests" on public.ride_join_requests;
create policy "hosts answer join requests" on public.ride_join_requests
  for update using (
    public.is_ride_host(ride_id) and status = 'pending'
  )
  with check (
    public.is_ride_host(ride_id) and status in ('accepted', 'declined')
  );

drop policy if exists "riders cancel join requests" on public.ride_join_requests;
create policy "riders cancel join requests" on public.ride_join_requests
  for update using (
    rider_id = auth.uid() and status = 'pending'
  )
  with check (
    rider_id = auth.uid() and status = 'cancelled'
  );

drop policy if exists "group reads ride messages" on public.ride_messages;
create policy "group reads ride messages" on public.ride_messages
  for select using (
    public.is_admin()
    or public.is_ride_host(ride_id)
    or public.is_accepted_on_ride(ride_id)
  );

drop policy if exists "group writes ride messages" on public.ride_messages;
create policy "group writes ride messages" on public.ride_messages
  for insert with check (
    auth.uid() = author_id
    and (
      public.is_ride_host(ride_id)
      or public.is_accepted_on_ride(ride_id)
    )
    and exists (
      select 1 from public.rides r
      where r.id = ride_id and r.status = 'open'
    )
  );

grant select, insert, update on public.rides to authenticated;
grant select, insert, update on public.ride_join_requests to authenticated;
grant select, insert on public.ride_messages to authenticated;
