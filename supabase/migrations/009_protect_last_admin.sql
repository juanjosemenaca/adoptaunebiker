-- Dedicated Adopta project only. Do not apply to the ERP database.
-- Corrective: keep at least one administrator even if a dashboard or service-role
-- delete happens outside purge_expired_personal_data.

create or replace function public.protect_last_admin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admins integer;
begin
  if tg_op = 'DELETE' then
    if old.kind = 'admin' then
      select count(*) into v_admins
      from public.profiles
      where kind = 'admin'
        and id is distinct from old.id;
      if v_admins < 1 then
        raise exception 'last_admin_missing';
      end if;
    end if;
    return old;
  end if;

  if old.kind = 'admin' and new.kind is distinct from 'admin' then
    select count(*) into v_admins
    from public.profiles
    where kind = 'admin'
      and id is distinct from old.id;
    if v_admins < 1 then
      raise exception 'last_admin_missing';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_protect_last_admin_upd on public.profiles;
create trigger profiles_protect_last_admin_upd
  before update of kind on public.profiles
  for each row
  execute function public.protect_last_admin();

drop trigger if exists profiles_protect_last_admin_del on public.profiles;
create trigger profiles_protect_last_admin_del
  before delete on public.profiles
  for each row
  execute function public.protect_last_admin();

revoke all on function public.protect_last_admin() from public, anon, authenticated;

comment on function public.protect_last_admin() is
  'Blocks deleting or demoting the last administrator, including service-role and Auth cascade deletes.';
