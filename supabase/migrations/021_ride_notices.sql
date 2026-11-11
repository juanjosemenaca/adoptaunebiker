-- Dedicated Adopta project only. Do not apply to the ERP database.
-- Host edits/cancels a ride: enrolled riders get an admin inbox notice.

alter table public.admin_threads drop constraint if exists admin_threads_kind_check;
alter table public.admin_threads add constraint admin_threads_kind_check
  check (kind in ('idea', 'sugerencia', 'queja', 'propuesta', 'otro', 'aviso'));

alter table public.admin_messages
  add column if not exists from_admin boolean not null default false;

create or replace function public.open_admin_thread(p_subject text, p_kind text, p_body text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  tid uuid;
begin
  if auth.uid() is null or public.is_admin() then
    raise exception 'not allowed';
  end if;
  if p_kind not in ('idea', 'sugerencia', 'queja', 'propuesta', 'otro') then
    raise exception 'bad kind';
  end if;
  insert into public.admin_threads (member_id, subject, kind)
  values (auth.uid(), trim(p_subject), p_kind)
  returning id into tid;
  insert into public.admin_messages (thread_id, author_id, body, from_admin)
  values (tid, auth.uid(), trim(p_body), false);
  return tid;
end;
$$;

create or replace function public.touch_admin_thread_on_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_admin() or new.from_admin then
    update public.admin_threads
    set updated_at = now(),
        unread_for_member = true,
        unread_for_admin = false
    where id = new.thread_id;
  else
    update public.admin_threads
    set updated_at = now(),
        unread_for_admin = true,
        unread_for_member = false
    where id = new.thread_id;
  end if;
  return new;
end;
$$;

create or replace function public.notify_ride_members(p_ride_id uuid, p_change text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  n int := 0;
  ride_title text;
  ride_host uuid;
  admin_id uuid;
  tid uuid;
  subj text;
  msg text;
  rider uuid;
begin
  if auth.uid() is null then
    raise exception 'not allowed';
  end if;
  if p_change not in ('updated', 'cancelled') then
    raise exception 'bad change';
  end if;

  select title, host_id into ride_title, ride_host
  from public.rides
  where id = p_ride_id;
  if ride_host is null then
    return 0;
  end if;
  if ride_host is distinct from auth.uid() then
    raise exception 'not allowed';
  end if;

  select p.id into admin_id
  from public.profiles p
  where p.kind = 'admin'
  order by p.created_at asc
  limit 1;
  if admin_id is null then
    admin_id := ride_host;
  end if;

  subj := left(trim(ride_title), 120);
  if char_length(subj) < 2 then
    subj := 'Salida';
  end if;

  if p_change = 'updated' then
    msg := 'La salida «' || replace(trim(ride_title), '»', '') || '» ha sido modificada.';
  else
    msg := 'La salida «' || replace(trim(ride_title), '»', '') || '» ha sido eliminada.';
  end if;

  for rider in
    select distinct j.rider_id
    from public.ride_join_requests j
    where j.ride_id = p_ride_id
      and j.status in ('accepted', 'pending')
  loop
    insert into public.admin_threads (
      member_id, subject, kind, unread_for_admin, unread_for_member
    )
    values (rider, subj, 'aviso', false, true)
    returning id into tid;

    insert into public.admin_messages (thread_id, author_id, body, from_admin)
    values (tid, admin_id, msg, true);

    n := n + 1;
  end loop;

  return n;
end;
$$;

revoke all on function public.notify_ride_members(uuid, text) from public, anon;
grant execute on function public.notify_ride_members(uuid, text) to authenticated;
grant execute on function public.open_admin_thread(text, text, text) to authenticated;
