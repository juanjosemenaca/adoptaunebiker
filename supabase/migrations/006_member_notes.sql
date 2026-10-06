-- Dedicated Adopta project only. Do not apply to the ERP database.

drop policy if exists "admins update all profiles" on public.profiles;
create policy "admins update all profiles"
  on public.profiles
  for update
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.kind = 'admin'
    )
  )
  with check (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.kind = 'admin'
    )
  );

create table if not exists public.member_notes (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.profiles (id) on delete cascade,
  author_id uuid references public.profiles (id) on delete set null,
  author_name text not null,
  body text not null,
  created_at timestamptz not null default now(),
  constraint member_notes_body_check check (char_length(trim(body)) > 0)
);

create index if not exists member_notes_member_created_idx
  on public.member_notes (member_id, created_at desc);

alter table public.member_notes enable row level security;

drop policy if exists "admins read member notes" on public.member_notes;
create policy "admins read member notes"
  on public.member_notes
  for select
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.kind = 'admin'
    )
  );

drop policy if exists "admins insert member notes" on public.member_notes;
create policy "admins insert member notes"
  on public.member_notes
  for insert
  with check (
    author_id = auth.uid()
    and exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.kind = 'admin'
    )
  );

drop policy if exists "admins delete member notes" on public.member_notes;
create policy "admins delete member notes"
  on public.member_notes
  for delete
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.kind = 'admin'
    )
  );
