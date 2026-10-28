-- Dedicated Adopta project only. Do not apply to the ERP database.
-- Public join inserts run as anon. The 008 insert trigger calls is_admin(),
-- but EXECUTE was revoked from anon, so every alta failed with 42501.

grant execute on function public.is_admin() to anon;

create or replace function public.touch_signup_rejected_at()
returns trigger
language plpgsql
security definer
set search_path = public
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
