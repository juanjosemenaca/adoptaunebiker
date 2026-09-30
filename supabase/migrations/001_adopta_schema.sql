-- Schema for a dedicated Adopta un eBiker Supabase project.
-- Do not apply this to unrelated databases.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  slug text not null unique,
  display_name text not null,
  role text not null check (role in ('mentor', 'ebiker')),
  discipline text not null check (discipline in ('mtb', 'carretera', 'gravel')),
  city text not null,
  bike text,
  bio text,
  looking_for text,
  tags text[] not null default '{}',
  km_month integer not null default 0,
  years integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.adoptions (
  id uuid primary key default gen_random_uuid(),
  from_id uuid not null references public.profiles (id) on delete cascade,
  to_id uuid not null references public.profiles (id) on delete cascade,
  message text,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz not null default now(),
  constraint adoptions_distinct check (from_id <> to_id),
  constraint adoptions_unique_pair unique (from_id, to_id)
);

alter table public.profiles enable row level security;
alter table public.adoptions enable row level security;

create policy "profiles are readable" on public.profiles
  for select using (true);

create policy "users insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "users update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "adoptions readable by participants" on public.adoptions
  for select using (auth.uid() = from_id or auth.uid() = to_id);

create policy "users create adoptions" on public.adoptions
  for insert with check (auth.uid() = from_id);

create policy "recipient updates adoption" on public.adoptions
  for update using (auth.uid() = to_id);
