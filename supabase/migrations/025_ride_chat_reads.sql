-- Dedicated Adopta project only. Do not apply to the ERP database.
-- Last time a member opened the group chat of a ride, for intranet alerts.

create table if not exists public.ride_chat_reads (
  user_id uuid not null references public.profiles (id) on delete cascade,
  ride_id uuid not null references public.rides (id) on delete cascade,
  seen_at timestamptz not null default now(),
  primary key (user_id, ride_id)
);

create index if not exists ride_chat_reads_ride_idx on public.ride_chat_reads (ride_id);

alter table public.ride_chat_reads enable row level security;

drop policy if exists "own ride chat reads" on public.ride_chat_reads;
create policy "own ride chat reads" on public.ride_chat_reads
  for all
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and (
      public.is_ride_host(ride_id)
      or public.is_accepted_on_ride(ride_id)
    )
  );

grant select, insert, update, delete on public.ride_chat_reads to authenticated;
