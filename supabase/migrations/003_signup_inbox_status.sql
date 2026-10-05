-- Dedicated Adopta project only. Do not apply to the ERP database.

alter table public.signup_requests
  add column if not exists inbox_status text not null default 'unread';

alter table public.signup_requests
  drop constraint if exists signup_requests_inbox_status_check;

alter table public.signup_requests
  add constraint signup_requests_inbox_status_check
  check (inbox_status in ('unread', 'read', 'in_analysis', 'rejected', 'accepted'));

drop policy if exists "admins update signup requests" on public.signup_requests;
create policy "admins update signup requests"
  on public.signup_requests
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

drop policy if exists "admins delete signup requests" on public.signup_requests;
create policy "admins delete signup requests"
  on public.signup_requests
  for delete
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.kind = 'admin'
    )
  );

grant update, delete on public.signup_requests to authenticated;
