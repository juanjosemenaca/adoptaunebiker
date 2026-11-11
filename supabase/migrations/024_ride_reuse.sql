-- Dedicated Adopta project only. Do not apply to the ERP database.
-- Hosts can fully delete a cancelled ride. Anyone in the group can hide one from their lists.

grant delete on public.rides to authenticated;

drop policy if exists "hosts delete cancelled rides" on public.rides;
create policy "hosts delete cancelled rides" on public.rides
  for delete using (
    auth.uid() = host_id
    and status = 'cancelled'
  );

create table if not exists public.ride_dismissals (
  user_id uuid not null references public.profiles (id) on delete cascade,
  ride_id uuid not null references public.rides (id) on delete cascade,
  purged boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (user_id, ride_id)
);

alter table public.ride_dismissals enable row level security;

drop policy if exists "own ride dismissals" on public.ride_dismissals;
create policy "own ride dismissals" on public.ride_dismissals
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update, delete on public.ride_dismissals to authenticated;
