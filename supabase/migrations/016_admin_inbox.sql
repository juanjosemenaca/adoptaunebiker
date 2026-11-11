-- Member ↔ admin mailbox. Run on the Adopta project only.

create table if not exists public.admin_threads (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.profiles (id) on delete cascade,
  subject text not null,
  kind text not null check (kind in ('idea', 'sugerencia', 'queja', 'propuesta', 'otro')),
  status text not null default 'open' check (status in ('open', 'closed')),
  unread_for_admin boolean not null default true,
  unread_for_member boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint admin_thread_subject check (char_length(trim(subject)) between 2 and 120)
);

create table if not exists public.admin_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.admin_threads (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  constraint admin_message_body check (char_length(trim(body)) between 1 and 2000)
);

create index if not exists admin_threads_member_idx on public.admin_threads (member_id, updated_at desc);
create index if not exists admin_threads_admin_unread_idx on public.admin_threads (unread_for_admin, updated_at desc);
create index if not exists admin_messages_thread_idx on public.admin_messages (thread_id, created_at);

alter table public.admin_threads enable row level security;
alter table public.admin_messages enable row level security;

revoke all on table public.admin_threads from public, anon;
revoke all on table public.admin_messages from public, anon;
grant select, insert, update on table public.admin_threads to authenticated;
grant select, insert on table public.admin_messages to authenticated;

drop policy if exists "members read own admin threads" on public.admin_threads;
create policy "members read own admin threads"
  on public.admin_threads for select
  using (member_id = auth.uid() or public.is_admin());

drop policy if exists "members insert own admin threads" on public.admin_threads;
create policy "members insert own admin threads"
  on public.admin_threads for insert
  with check (member_id = auth.uid() and not public.is_admin());

drop policy if exists "admins update admin threads" on public.admin_threads;
create policy "admins update admin threads"
  on public.admin_threads for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "read admin messages of visible threads" on public.admin_messages;
create policy "read admin messages of visible threads"
  on public.admin_messages for select
  using (
    exists (
      select 1 from public.admin_threads t
      where t.id = thread_id
        and (t.member_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "write admin messages of open threads" on public.admin_messages;
create policy "write admin messages of open threads"
  on public.admin_messages for insert
  with check (
    author_id = auth.uid()
    and exists (
      select 1 from public.admin_threads t
      where t.id = thread_id
        and t.status = 'open'
        and (t.member_id = auth.uid() or public.is_admin())
    )
  );

create or replace function public.touch_admin_thread_on_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_admin() then
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

drop trigger if exists admin_messages_touch_thread on public.admin_messages;
create trigger admin_messages_touch_thread
  after insert on public.admin_messages
  for each row execute function public.touch_admin_thread_on_message();

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
  insert into public.admin_threads (member_id, subject, kind)
  values (auth.uid(), trim(p_subject), p_kind)
  returning id into tid;
  insert into public.admin_messages (thread_id, author_id, body)
  values (tid, auth.uid(), trim(p_body));
  return tid;
end;
$$;

create or replace function public.mark_admin_thread_read(target uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_admin() then
    update public.admin_threads
    set unread_for_admin = false
    where id = target;
  else
    update public.admin_threads
    set unread_for_member = false
    where id = target and member_id = auth.uid();
  end if;
end;
$$;

create or replace function public.set_admin_thread_status(target uuid, next_status text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not allowed';
  end if;
  if next_status not in ('open', 'closed') then
    raise exception 'bad status';
  end if;
  update public.admin_threads
  set status = next_status, updated_at = now()
  where id = target;
end;
$$;

revoke all on function public.open_admin_thread(text, text, text) from public, anon;
revoke all on function public.mark_admin_thread_read(uuid) from public, anon;
revoke all on function public.set_admin_thread_status(uuid, text) from public, anon;
grant execute on function public.open_admin_thread(text, text, text) to authenticated;
grant execute on function public.mark_admin_thread_read(uuid) to authenticated;
grant execute on function public.set_admin_thread_status(uuid, text) to authenticated;
