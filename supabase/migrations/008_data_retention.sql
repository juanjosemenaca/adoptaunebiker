-- Dedicated Adopta project only. Do not apply to the ERP database.
-- Reviewable retention schema. Do not run this against an unrelated project.

alter table public.signup_requests
  add column if not exists rejected_at timestamptz;

alter table public.signup_requests
  add column if not exists retention_hold boolean not null default false;

alter table public.signup_requests
  add column if not exists accepted_member_id uuid references public.profiles (id) on delete set null;

alter table public.signup_requests
  add column if not exists anonymized_at timestamptz;

alter table public.profiles
  add column if not exists deactivated_at timestamptz;

alter table public.profiles
  add column if not exists retention_hold boolean not null default false;

comment on column public.signup_requests.rejected_at is
  'Set when the request becomes rejected. The six-month clock starts here, not at created_at.';
comment on column public.signup_requests.retention_hold is
  'If true, the purge must leave this row (legal hold, security or an open claim).';
comment on column public.signup_requests.accepted_member_id is
  'Member created from this accepted request. Used to anonymize the application when that member is purged.';
comment on column public.signup_requests.anonymized_at is
  'When personal fields were stripped. The row stays as an admission record without contact data.';
comment on column public.profiles.deactivated_at is
  'Set when member_status becomes inactive. Cleared on reactivation.';
comment on column public.profiles.retention_hold is
  'If true, the purge must leave this profile (legal hold, security or an open claim).';

update public.signup_requests
set rejected_at = now()
where rejected_at is null
  and (inbox_status = 'rejected' or status = 'rejected')
  and inbox_status is distinct from 'accepted'
  and status is distinct from 'approved';

update public.profiles
set deactivated_at = now()
where deactivated_at is null
  and member_status = 'inactive';

update public.signup_requests r
set accepted_member_id = p.id
from public.profiles p
where r.accepted_member_id is null
  and (r.inbox_status = 'accepted' or r.status = 'approved')
  and p.email is not null
  and lower(p.email) = lower(r.email);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.kind = 'admin'
  );
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated, service_role;

create or replace function public.touch_signup_rejected_at()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    if auth.role() is distinct from 'service_role' and not public.is_admin() then
      new.inbox_status := coalesce(new.inbox_status, 'unread');
      if new.inbox_status not in ('unread', 'read') then
        new.inbox_status := 'unread';
      end if;
      new.status := 'pending';
      new.rejected_at := null;
      new.retention_hold := false;
      new.accepted_member_id := null;
      new.anonymized_at := null;
    end if;
    if (new.inbox_status = 'rejected' or new.status = 'rejected')
       and new.inbox_status is distinct from 'accepted'
       and new.status is distinct from 'approved' then
      new.rejected_at := coalesce(new.rejected_at, now());
    end if;
    return new;
  end if;

  if new.inbox_status = 'rejected' or new.status = 'rejected' then
    if new.inbox_status is distinct from 'accepted' and new.status is distinct from 'approved' then
      if (old.inbox_status is distinct from 'rejected' and old.status is distinct from 'rejected')
         or new.rejected_at is null then
        new.rejected_at := coalesce(new.rejected_at, now());
      end if;
    else
      new.rejected_at := null;
    end if;
  else
    new.rejected_at := null;
  end if;
  return new;
end;
$$;

drop trigger if exists signup_requests_rejected_at on public.signup_requests;
create trigger signup_requests_rejected_at
  before insert or update of inbox_status, status, rejected_at
  on public.signup_requests
  for each row
  execute function public.touch_signup_rejected_at();

create or replace function public.touch_signup_accepted_member()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.inbox_status = 'accepted' or new.status = 'approved' then
    if new.accepted_member_id is null and new.email is not null then
      select p.id
        into new.accepted_member_id
      from public.profiles p
      where p.email is not null
        and lower(p.email) = lower(new.email)
      limit 1;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists signup_requests_accepted_member on public.signup_requests;
create trigger signup_requests_accepted_member
  before insert or update of inbox_status, status, email
  on public.signup_requests
  for each row
  execute function public.touch_signup_accepted_member();

create or replace function public.protect_signup_retention_columns()
returns trigger
language plpgsql
as $$
begin
  if auth.role() = 'service_role' then
    return new;
  end if;
  if tg_op = 'UPDATE' and not public.is_admin() then
    new.rejected_at := old.rejected_at;
    new.retention_hold := old.retention_hold;
    new.accepted_member_id := old.accepted_member_id;
    new.anonymized_at := old.anonymized_at;
    new.status := old.status;
    new.inbox_status := old.inbox_status;
  end if;
  if tg_op = 'UPDATE' and public.is_admin() then
    if new.inbox_status is not distinct from old.inbox_status
       and new.status is not distinct from old.status then
      new.rejected_at := old.rejected_at;
    end if;
    new.anonymized_at := old.anonymized_at;
  end if;
  return new;
end;
$$;

drop trigger if exists signup_requests_protect_retention on public.signup_requests;
create trigger signup_requests_protect_retention
  before update on public.signup_requests
  for each row
  execute function public.protect_signup_retention_columns();

create or replace function public.touch_profile_deactivated_at()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    if auth.role() is distinct from 'service_role' then
      new.kind := coalesce(new.kind, 'user');
      if new.kind is distinct from 'admin' then
        new.kind := 'user';
      end if;
      if not public.is_admin() then
        new.kind := 'user';
        new.member_status := 'active';
        new.retention_hold := false;
        new.deactivated_at := null;
      end if;
    end if;
    if new.member_status = 'inactive' then
      new.deactivated_at := coalesce(new.deactivated_at, now());
    else
      new.deactivated_at := null;
    end if;
    return new;
  end if;

  if new.member_status = 'inactive' then
    if old.member_status is distinct from 'inactive' then
      new.deactivated_at := now();
    else
      new.deactivated_at := coalesce(new.deactivated_at, now());
    end if;
  else
    new.deactivated_at := null;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_deactivated_at on public.profiles;
create trigger profiles_deactivated_at
  before insert or update of member_status
  on public.profiles
  for each row
  execute function public.touch_profile_deactivated_at();

create or replace function public.protect_profile_retention_columns()
returns trigger
language plpgsql
as $$
begin
  if auth.role() = 'service_role' then
    return new;
  end if;

  if tg_op = 'INSERT' then
    if not public.is_admin() then
      new.kind := 'user';
      new.member_status := coalesce(new.member_status, 'active');
      if new.member_status is distinct from 'active' then
        new.member_status := 'active';
      end if;
      new.retention_hold := false;
      new.deactivated_at := null;
    end if;
    return new;
  end if;

  if not public.is_admin() then
    new.kind := old.kind;
    new.member_status := old.member_status;
    new.retention_hold := old.retention_hold;
    new.deactivated_at := old.deactivated_at;
    return new;
  end if;

  new.kind := old.kind;
  if new.member_status is not distinct from old.member_status then
    new.deactivated_at := old.deactivated_at;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_protect_retention on public.profiles;
create trigger profiles_protect_retention
  before insert or update on public.profiles
  for each row
  execute function public.protect_profile_retention_columns();

create or replace function public.anonymize_accepted_signup(p_request_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.signup_requests
  set
    name = 'anonymized',
    email = 'anonymized+' || id::text || '@invalid.local',
    city = '—',
    bike = null,
    bio = null,
    looking_for = null,
    anonymized_at = now()
  where id = p_request_id
    and retention_hold = false
    and anonymized_at is null
    and (inbox_status = 'accepted' or status = 'approved');
end;
$$;

revoke all on function public.anonymize_accepted_signup(uuid) from public, anon, authenticated;
grant execute on function public.anonymize_accepted_signup(uuid) to service_role;

create or replace function public.purge_expired_personal_data(
  p_dry_run boolean default true,
  p_confirm text default null
)
returns table (
  action text,
  entity_type text,
  entity_id uuid,
  reason text
)
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_admin_count integer;
  v_request_id uuid;
  v_member_id uuid;
  v_reason text;
  v_deleted integer;
begin
  if p_dry_run is not true and p_confirm is distinct from 'purge' then
    raise exception 'confirm_required';
  end if;

  perform pg_advisory_xact_lock(872314);

  perform 1
  from public.profiles
  where kind = 'admin'
  for update;

  select count(*) into v_admin_count
  from public.profiles
  where kind = 'admin';

  if v_admin_count < 1 then
    raise exception 'last_admin_missing';
  end if;

  for v_request_id, v_reason in
    select r.id, 'rejected_older_than_six_months'
    from public.signup_requests r
    where (r.inbox_status = 'rejected' or r.status = 'rejected')
      and r.inbox_status is distinct from 'accepted'
      and r.status is distinct from 'approved'
      and r.rejected_at is not null
      and r.rejected_at <= now() - interval '6 months'
      and r.retention_hold = false
    for update of r
  loop
    action := case when p_dry_run then 'would_delete' else 'deleted' end;
    entity_type := 'signup_request';
    entity_id := v_request_id;
    reason := v_reason;
    if p_dry_run is not true then
      delete from public.signup_requests
      where id = v_request_id
        and (inbox_status = 'rejected' or status = 'rejected')
        and inbox_status is distinct from 'accepted'
        and status is distinct from 'approved'
        and rejected_at is not null
        and rejected_at <= now() - interval '6 months'
        and retention_hold = false;
      get diagnostics v_deleted = row_count;
      if v_deleted = 0 then
        continue;
      end if;
    end if;
    return next;
  end loop;

  for v_member_id, v_reason in
    select p.id, 'inactive_older_than_six_months'
    from public.profiles p
    where p.kind = 'user'
      and p.member_status = 'inactive'
      and p.deactivated_at is not null
      and p.deactivated_at <= now() - interval '6 months'
      and p.retention_hold = false
    for update of p
  loop
    action := case when p_dry_run then 'would_delete' else 'deleted' end;
    entity_type := 'member';
    entity_id := v_member_id;
    reason := v_reason;
    if p_dry_run is not true then
      select count(*) into v_admin_count
      from public.profiles
      where kind = 'admin';
      if v_admin_count < 1 then
        raise exception 'last_admin_missing';
      end if;

      perform public.anonymize_accepted_signup(s.id)
      from public.signup_requests s
      where s.retention_hold = false
        and s.anonymized_at is null
        and (s.inbox_status = 'accepted' or s.status = 'approved')
        and (
          s.accepted_member_id = v_member_id
          or exists (
            select 1
            from public.profiles p
            where p.id = v_member_id
              and p.email is not null
              and lower(p.email) = lower(s.email)
          )
        );

      delete from auth.users u
      using public.profiles p
      where u.id = p.id
        and p.id = v_member_id
        and p.kind = 'user'
        and p.member_status = 'inactive'
        and p.deactivated_at is not null
        and p.deactivated_at <= now() - interval '6 months'
        and p.retention_hold = false;
      get diagnostics v_deleted = row_count;
      if v_deleted = 0 then
        continue;
      end if;
    end if;
    return next;
  end loop;

  for v_request_id, v_reason in
    select r.id, 'accepted_orphan_anonymize'
    from public.signup_requests r
    where (r.inbox_status = 'accepted' or r.status = 'approved')
      and r.anonymized_at is null
      and r.retention_hold = false
      and r.accepted_member_id is null
      and not exists (
        select 1
        from public.profiles p
        where p.email is not null
          and lower(p.email) = lower(r.email)
      )
      and r.created_at <= now() - interval '6 months'
    for update of r
  loop
    action := case when p_dry_run then 'would_anonymize' else 'anonymized' end;
    entity_type := 'signup_request';
    entity_id := v_request_id;
    reason := v_reason;
    if p_dry_run is not true then
      perform public.anonymize_accepted_signup(v_request_id);
    end if;
    return next;
  end loop;
end;
$$;

comment on function public.purge_expired_personal_data(boolean, text) is
  'Deletes rejected applications and inactive member accounts older than six months. Default is dry-run. Real deletes require p_confirm = purge. Never touches active accounts, admins, pending applications, or rows with retention_hold. Accepted applications are anonymized when the member is purged.';

drop function if exists public.purge_expired_personal_data(boolean);

revoke all on function public.purge_expired_personal_data(boolean, text) from public, anon, authenticated;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    grant execute on function public.purge_expired_personal_data(boolean, text) to service_role;
  end if;
end
$$;

revoke all on function public.touch_signup_rejected_at() from public, anon, authenticated;
revoke all on function public.touch_signup_accepted_member() from public, anon, authenticated;
revoke all on function public.protect_signup_retention_columns() from public, anon, authenticated;
revoke all on function public.touch_profile_deactivated_at() from public, anon, authenticated;
revoke all on function public.protect_profile_retention_columns() from public, anon, authenticated;
