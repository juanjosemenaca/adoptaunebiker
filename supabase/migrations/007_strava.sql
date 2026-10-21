-- Dedicated Adopta project only. Do not apply to the ERP database.

create table if not exists public.strava_accounts (
  member_id uuid primary key references public.profiles (id) on delete cascade,
  athlete_id bigint not null,
  access_token text not null,
  refresh_token text not null,
  expires_at timestamptz not null,
  athlete_name text,
  connected_at timestamptz not null default now(),
  synced_at timestamptz,
  constraint strava_accounts_athlete_unique unique (athlete_id)
);

create table if not exists public.strava_activities (
  id bigint primary key,
  member_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  sport_type text,
  distance_m numeric,
  elevation_m numeric,
  moving_time_s integer,
  start_at timestamptz,
  summary_polyline text,
  strava_url text,
  private boolean not null default false,
  synced_at timestamptz not null default now()
);

create index if not exists strava_activities_member_start_idx
  on public.strava_activities (member_id, start_at desc);

alter table public.strava_accounts enable row level security;
alter table public.strava_activities enable row level security;

revoke all on table public.strava_accounts from public, anon, authenticated;
revoke all on table public.strava_activities from public, anon, authenticated;
grant select on table public.strava_activities to authenticated;

drop policy if exists "members read strava activities" on public.strava_activities;
create policy "members read strava activities"
  on public.strava_activities
  for select
  using (
    auth.uid() is not null
    and (
      private = false
      or member_id = auth.uid()
    )
  );

create or replace function public.save_strava_account(
  p_athlete_id bigint,
  p_access_token text,
  p_refresh_token text,
  p_expires_at timestamptz,
  p_athlete_name text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not_signed_in';
  end if;

  if exists (
    select 1
    from public.strava_accounts
    where athlete_id = p_athlete_id
      and member_id <> auth.uid()
  ) then
    raise exception 'athlete_taken';
  end if;

  insert into public.strava_accounts (
    member_id,
    athlete_id,
    access_token,
    refresh_token,
    expires_at,
    athlete_name,
    connected_at
  )
  values (
    auth.uid(),
    p_athlete_id,
    p_access_token,
    p_refresh_token,
    p_expires_at,
    nullif(trim(p_athlete_name), ''),
    now()
  )
  on conflict (member_id) do update
    set athlete_id = excluded.athlete_id,
        access_token = excluded.access_token,
        refresh_token = excluded.refresh_token,
        expires_at = excluded.expires_at,
        athlete_name = excluded.athlete_name;
end;
$$;

create or replace function public.strava_account_for_me()
returns table (
  member_id uuid,
  athlete_id bigint,
  access_token text,
  refresh_token text,
  expires_at timestamptz,
  athlete_name text,
  connected_at timestamptz,
  synced_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return;
  end if;

  return query
    select
      a.member_id,
      a.athlete_id,
      a.access_token,
      a.refresh_token,
      a.expires_at,
      a.athlete_name,
      a.connected_at,
      a.synced_at
    from public.strava_accounts a
    where a.member_id = auth.uid();
end;
$$;

create or replace function public.clear_strava_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not_signed_in';
  end if;

  delete from public.strava_activities where member_id = auth.uid();
  delete from public.strava_accounts where member_id = auth.uid();
end;
$$;

create or replace function public.replace_strava_activities(activities jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not_signed_in';
  end if;

  delete from public.strava_activities where member_id = auth.uid();

  insert into public.strava_activities (
    id,
    member_id,
    name,
    sport_type,
    distance_m,
    elevation_m,
    moving_time_s,
    start_at,
    summary_polyline,
    strava_url,
    private,
    synced_at
  )
  select
    (item->>'id')::bigint,
    auth.uid(),
    coalesce(nullif(trim(item->>'name'), ''), 'Salida'),
    nullif(item->>'sport_type', ''),
    nullif(item->>'distance_m', '')::numeric,
    nullif(item->>'elevation_m', '')::numeric,
    nullif(item->>'moving_time_s', '')::integer,
    nullif(item->>'start_at', '')::timestamptz,
    nullif(item->>'summary_polyline', ''),
    nullif(item->>'strava_url', ''),
    coalesce((item->>'private')::boolean, false),
    now()
  from jsonb_array_elements(coalesce(activities, '[]'::jsonb)) as item
  where (item->>'id') ~ '^[0-9]+$'
  limit 40;

  update public.strava_accounts
  set synced_at = now()
  where member_id = auth.uid();
end;
$$;

-- The Next.js server calls these RPCs with the member JWT (anon key + auth.uid()).
-- Revoking EXECUTE from authenticated would break connect/sync/disconnect unless
-- a service-role client impersonates the user. This app does not ship a browser
-- supabase-js client; PostgREST still accepts any caller who presents a member JWT.
revoke all on function public.save_strava_account(bigint, text, text, timestamptz, text) from public, anon;
revoke all on function public.strava_account_for_me() from public, anon;
revoke all on function public.clear_strava_account() from public, anon;
revoke all on function public.replace_strava_activities(jsonb) from public, anon;

grant execute on function public.save_strava_account(bigint, text, text, timestamptz, text) to authenticated;
grant execute on function public.strava_account_for_me() to authenticated;
grant execute on function public.clear_strava_account() to authenticated;
grant execute on function public.replace_strava_activities(jsonb) to authenticated;
