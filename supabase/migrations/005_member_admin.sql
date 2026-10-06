-- Dedicated Adopta project only. Do not apply to the ERP database.

alter table public.profiles
  add column if not exists member_status text not null default 'active';

alter table public.profiles
  drop constraint if exists profiles_member_status_check;

alter table public.profiles
  add constraint profiles_member_status_check
  check (member_status in ('active', 'inactive'));

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

create or replace function public.reset_member_password(member_id uuid)
returns void
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
begin
  if auth.uid() is null or not exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.kind = 'admin'
  ) then
    raise exception 'not_admin';
  end if;

  if not exists (
    select 1
    from public.profiles
    where id = member_id
      and kind = 'user'
  ) then
    raise exception 'member_missing';
  end if;

  update auth.users
  set encrypted_password = crypt('adopta', gen_salt('bf')),
      updated_at = now()
  where id = member_id;

  update public.profiles
  set must_change_password = true
  where id = member_id;
end;
$$;

revoke all on function public.reset_member_password(uuid) from public, anon;
grant execute on function public.reset_member_password(uuid) to authenticated;
