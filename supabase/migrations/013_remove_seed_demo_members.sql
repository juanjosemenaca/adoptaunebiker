-- Dedicated Adopta project only. Do not apply to the ERP database.
-- Removes the seed demo riders (Núria Valls, Leo Andrade). Keeps Administración.

delete from auth.identities
where user_id in (
  '22222222-2222-2222-2222-222222222222'::uuid,
  '33333333-3333-3333-3333-333333333333'::uuid
);

delete from auth.users
where id in (
  '22222222-2222-2222-2222-222222222222'::uuid,
  '33333333-3333-3333-3333-333333333333'::uuid
)
or lower(email) in ('veterano@adopta.local', 'ebiker@adopta.local');

delete from public.profiles
where kind = 'user'
  and (
    id in (
      '22222222-2222-2222-2222-222222222222'::uuid,
      '33333333-3333-3333-3333-333333333333'::uuid
    )
    or lower(coalesce(email, '')) in ('veterano@adopta.local', 'ebiker@adopta.local')
  );
