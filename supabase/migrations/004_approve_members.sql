-- Dedicated Adopta project only. Do not apply to the ERP database.

alter table public.profiles
  add column if not exists last_name text;

alter table public.profiles
  add column if not exists country text;

alter table public.profiles
  add column if not exists veteran_in text[] not null default '{}';

alter table public.profiles
  add column if not exists beginner_in text[] not null default '{}';

alter table public.profiles
  add column if not exists interested_in text[] not null default '{}';

alter table public.profiles
  add column if not exists must_change_password boolean not null default false;

create or replace function public.adopta_slug(input text)
returns text
language sql
immutable
as $$
  select nullif(
    trim(both '-' from regexp_replace(
      regexp_replace(
        lower(translate(
          coalesce(input, ''),
          'ÁÀÄÂÃÉÈËÊÍÌÏÎÓÒÖÔÕÚÙÜÛÑÇáàäâãéèëêíìïîóòöôõúùüûñç',
          'AAAAAEEEEIIIIOOOOOUUUUNCaaaaaeeeeiiiiooooouuuunc'
        )),
        '[^a-z0-9]+',
        '-',
        'g'
      ),
      '-{2,}',
      '-',
      'g'
    )),
    ''
  );
$$;

create or replace function public.approve_signup_request(
  request_id uuid,
  member_display_name text,
  member_last_name text,
  member_country text,
  member_city text,
  member_role text,
  member_discipline text,
  member_veteran_in text[],
  member_beginner_in text[],
  member_interested_in text[],
  member_bike text,
  member_bio text,
  member_looking_for text
) returns uuid
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  v_email text;
  v_name text;
  v_last text;
  v_city text;
  v_country text;
  v_role text;
  v_discipline text;
  v_slug text;
  v_user_id uuid;
  v_existing uuid;
  v_instance uuid;
begin
  if auth.uid() is null or not exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.kind = 'admin'
  ) then
    raise exception 'not_admin';
  end if;

  if member_role not in ('mentor', 'ebiker') then
    raise exception 'invalid_role';
  end if;

  if member_discipline not in ('mtb', 'carretera', 'gravel') then
    raise exception 'invalid_discipline';
  end if;

  select email into v_email
  from public.signup_requests
  where id = request_id;

  if v_email is null then
    raise exception 'request_missing';
  end if;

  v_email := lower(trim(v_email));
  v_name := nullif(trim(member_display_name), '');
  v_last := coalesce(nullif(trim(member_last_name), ''), '');
  v_city := coalesce(nullif(trim(member_city), ''), '—');
  v_country := nullif(trim(member_country), '');
  v_role := member_role;
  v_discipline := member_discipline;

  if v_name is null then
    raise exception 'invalid_name';
  end if;

  select id into v_existing
  from public.profiles
  where email is not null
    and lower(email) = v_email
  limit 1;

  if v_existing is not null then
    update public.signup_requests
    set inbox_status = 'accepted',
        status = 'approved'
    where id = request_id;
    return v_existing;
  end if;

  if exists (select 1 from auth.users where lower(email) = v_email) then
    raise exception 'email_taken';
  end if;

  v_slug := coalesce(public.adopta_slug(trim(v_name || ' ' || v_last)), 'ciclista');
  if exists (select 1 from public.profiles where slug = v_slug) then
    v_slug := v_slug || '-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8);
  end if;

  v_user_id := gen_random_uuid();
  v_instance := '00000000-0000-0000-0000-000000000000'::uuid;

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
    v_instance,
    v_user_id,
    'authenticated',
    'authenticated',
    v_email,
    crypt('adopta', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', v_name, 'last_name', v_last),
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
    v_user_id,
    jsonb_build_object('sub', v_user_id::text, 'email', v_email),
    'email',
    v_user_id::text,
    now(),
    now(),
    now()
  );

  insert into public.profiles (
    id,
    slug,
    display_name,
    last_name,
    role,
    discipline,
    city,
    country,
    bike,
    bio,
    looking_for,
    tags,
    kind,
    email,
    veteran_in,
    beginner_in,
    interested_in,
    must_change_password
  ) values (
    v_user_id,
    v_slug,
    v_name,
    nullif(v_last, ''),
    v_role,
    v_discipline,
    v_city,
    v_country,
    nullif(trim(coalesce(member_bike, '')), ''),
    nullif(trim(coalesce(member_bio, '')), ''),
    nullif(trim(coalesce(member_looking_for, '')), ''),
    case
      when coalesce(array_length(member_interested_in, 1), 0) > 0 then member_interested_in
      else array[v_discipline]
    end,
    'user',
    v_email,
    coalesce(member_veteran_in, '{}'),
    coalesce(member_beginner_in, '{}'),
    coalesce(member_interested_in, '{}'),
    true
  );

  update public.signup_requests
  set inbox_status = 'accepted',
      status = 'approved'
  where id = request_id;

  return v_user_id;
end;
$$;

revoke all on function public.adopta_slug(text) from public, anon;
grant execute on function public.adopta_slug(text) to authenticated;

revoke all on function public.approve_signup_request(
  uuid, text, text, text, text, text, text, text[], text[], text[], text, text, text
) from public, anon;

grant execute on function public.approve_signup_request(
  uuid, text, text, text, text, text, text, text[], text[], text[], text, text, text
) to authenticated;
