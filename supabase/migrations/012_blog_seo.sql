-- Dedicated Adopta project only. Do not apply to the ERP database.

alter table public.blog_posts
  add column if not exists seo_title text not null default '',
  add column if not exists meta_description text not null default '';
