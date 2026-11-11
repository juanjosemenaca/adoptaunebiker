-- Dedicated Adopta project only. Do not apply to the ERP database.
-- Admins can open threads to a member and delete old ones.

grant delete on table public.admin_threads to authenticated;

drop policy if exists "admins delete admin threads" on public.admin_threads;
create policy "admins delete admin threads"
  on public.admin_threads for delete
  using (public.is_admin());

create or replace function public.open_admin_thread_to_member(
  p_member_id uuid,
  p_subject text,
  p_kind text,
  p_body text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  tid uuid;
  member_kind text;
begin
  if auth.uid() is null or not public.is_admin() then
    raise exception 'not allowed';
  end if;
  if p_kind not in ('aviso', 'otro') then
    raise exception 'bad kind';
  end if;

  select kind into member_kind from public.profiles where id = p_member_id;
  if member_kind is null or member_kind = 'admin' then
    raise exception 'not allowed';
  end if;

  insert into public.admin_threads (
    member_id, subject, kind, unread_for_admin, unread_for_member
  )
  values (p_member_id, trim(p_subject), p_kind, false, true)
  returning id into tid;

  insert into public.admin_messages (thread_id, author_id, body, from_admin)
  values (tid, auth.uid(), trim(p_body), true);

  return tid;
end;
$$;

create or replace function public.delete_admin_thread(target uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not allowed';
  end if;
  delete from public.admin_threads where id = target;
end;
$$;

revoke all on function public.open_admin_thread_to_member(uuid, text, text, text) from public, anon;
revoke all on function public.delete_admin_thread(uuid) from public, anon;
grant execute on function public.open_admin_thread_to_member(uuid, text, text, text) to authenticated;
grant execute on function public.delete_admin_thread(uuid) to authenticated;
