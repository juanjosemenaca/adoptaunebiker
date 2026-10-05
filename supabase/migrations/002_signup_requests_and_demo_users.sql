-- Dedicated Adopta project only.

alter table public.profiles
  add column if not exists kind text not null default 'user';

alter table public.profiles
  drop constraint if exists profiles_kind_check;

alter table public.profiles
  add constraint profiles_kind_check check (kind in ('admin', 'user'));

alter table public.profiles
  add column if not exists email text;

create unique index if not exists profiles_email_unique
  on public.profiles (lower(email))
  where email is not null;

create table if not exists public.signup_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  city text not null,
  role text not null check (role in ('mentor', 'ebiker')),
  discipline text not null check (discipline in ('mtb', 'carretera', 'gravel')),
  bike text,
  bio text,
  looking_for text,
  locale text not null default 'es',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected'))
);

create unique index if not exists signup_requests_pending_email
  on public.signup_requests (lower(email))
  where status = 'pending';

alter table public.signup_requests enable row level security;

drop policy if exists "anyone inserts signup requests" on public.signup_requests;
create policy "anyone inserts signup requests"
  on public.signup_requests
  for insert
  with check (true);

drop policy if exists "admins read signup requests" on public.signup_requests;
create policy "admins read signup requests"
  on public.signup_requests
  for select
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.kind = 'admin'
    )
  );

create or replace function public.seed_demo_account(
  account_id uuid,
  account_email text,
  account_password text,
  account_slug text,
  account_name text,
  account_kind text,
  account_role text,
  account_discipline text,
  account_city text,
  account_bike text,
  account_bio text,
  account_looking text
) returns void
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
begin
  if exists (select 1 from auth.users where email = account_email) then
    return;
  end if;

  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) values (
    '00000000-0000-0000-0000-000000000000',
    account_id,
    'authenticated',
    'authenticated',
    account_email,
    crypt(account_password, gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', account_name),
    now(),
    now(),
    '',
    '',
    '',
    ''
  );

  insert into auth.identities (
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  ) values (
    account_id,
    jsonb_build_object('sub', account_id::text, 'email', account_email),
    'email',
    account_id::text,
    now(),
    now(),
    now()
  );

  insert into public.profiles (
    id,
    slug,
    display_name,
    role,
    discipline,
    city,
    bike,
    bio,
    looking_for,
    tags,
    kind,
    email
  ) values (
    account_id,
    account_slug,
    account_name,
    account_role,
    account_discipline,
    account_city,
    account_bike,
    account_bio,
    account_looking,
    array[account_discipline],
    account_kind,
    account_email
  );
end;
$$;

select public.seed_demo_account(
  '11111111-1111-1111-1111-111111111111',
  'admin@adopta.local',
  'adopta',
  'administracion',
  'Administración',
  'admin',
  'mentor',
  'carretera',
  '—',
  '',
  '',
  ''
);

select public.seed_demo_account(
  '22222222-2222-2222-2222-222222222222',
  'veterano@adopta.local',
  'adopta',
  'nuria-valls',
  'Núria Valls',
  'user',
  'mentor',
  'gravel',
  'Barcelona',
  'Canyon Grizl',
  'Llevo años de gravel por Collserola y el Penedès. Si vienes con e-gravel, te enseño a leer la pista, no a ir a palos.',
  'eBikers de gravel que quieran salir entre semana, sin ego.'
);

select public.seed_demo_account(
  '33333333-3333-3333-3333-333333333333',
  'ebiker@adopta.local',
  'adopta',
  'leo-andrade',
  'Leo Andrade',
  'user',
  'ebiker',
  'mtb',
  'Madrid',
  'Specialized Turbo Levo',
  'Me aficioné a la e-MTB este año. Guadarrama todavía me parece un muro.',
  'Un veterano de MTB para salidas a Navacerrada.'
);

grant usage on schema public to anon, authenticated;
grant select on public.profiles to anon, authenticated;
grant insert, update on public.profiles to authenticated;
grant insert on public.signup_requests to anon, authenticated;
grant select on public.signup_requests to authenticated;

revoke all on function public.seed_demo_account(
  uuid, text, text, text, text, text, text, text, text, text, text, text
) from public, anon, authenticated;
