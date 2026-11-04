-- Dedicated Adopta project only. Do not apply to the ERP database.

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  locale text not null default 'es',
  title text not null,
  subtitle text not null default '',
  body text not null default '',
  cover_url text not null default '',
  cover_path text not null default '',
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles (id) on delete set null
);

create table if not exists public.blog_assets (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.blog_posts (id) on delete cascade,
  kind text not null check (kind in ('image', 'video', 'file')),
  name text not null,
  path text not null,
  url text not null,
  mime text not null default '',
  size integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists blog_posts_published_idx
  on public.blog_posts (published, published_at desc);

create index if not exists blog_assets_post_idx
  on public.blog_assets (post_id);

create or replace function public.touch_blog_posts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists blog_posts_touch_updated_at on public.blog_posts;
create trigger blog_posts_touch_updated_at
  before update on public.blog_posts
  for each row execute function public.touch_blog_posts_updated_at();

alter table public.blog_posts enable row level security;
alter table public.blog_assets enable row level security;

drop policy if exists "blog posts public read published" on public.blog_posts;
create policy "blog posts public read published" on public.blog_posts
  for select using (published = true);

drop policy if exists "blog posts admin all" on public.blog_posts;
create policy "blog posts admin all" on public.blog_posts
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "blog assets public read published" on public.blog_assets;
create policy "blog assets public read published" on public.blog_assets
  for select using (
    exists (
      select 1 from public.blog_posts p
      where p.id = post_id and p.published = true
    )
  );

drop policy if exists "blog assets admin all" on public.blog_assets;
create policy "blog assets admin all" on public.blog_assets
  for all using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('blog', 'blog', true)
on conflict (id) do update set public = true;

drop policy if exists "blog storage public read" on storage.objects;
create policy "blog storage public read"
  on storage.objects for select
  using (bucket_id = 'blog');

drop policy if exists "blog storage admin write" on storage.objects;
create policy "blog storage admin write"
  on storage.objects for insert
  with check (bucket_id = 'blog' and public.is_admin());

drop policy if exists "blog storage admin update" on storage.objects;
create policy "blog storage admin update"
  on storage.objects for update
  using (bucket_id = 'blog' and public.is_admin());

drop policy if exists "blog storage admin delete" on storage.objects;
create policy "blog storage admin delete"
  on storage.objects for delete
  using (bucket_id = 'blog' and public.is_admin());
