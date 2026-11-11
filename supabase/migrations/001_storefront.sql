-- ============================================================
-- Merkey storefront — Supabase migration
-- Project: bowjrgqjazopkecfdfub
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor).
-- Additive and backward-compatible with the stock/POS admin app.
-- ============================================================

-- 1) Categories: add the slug used by the storefront
alter table public.categories add column if not exists slug text;
create unique index if not exists categories_slug_key on public.categories(slug);

-- 2) Products: storefront fields
alter table public.products
  add column if not exists image_url        text,
  add column if not exists gallery          text[]  default '{}',
  add column if not exists compare_at_price numeric,
  add column if not exists is_featured      boolean not null default false,
  add column if not exists is_new           boolean not null default false,
  add column if not exists is_active        boolean not null default true,
  add column if not exists features         text[]  default '{}';

-- 3) Public read (RLS) for the storefront
alter table public.products   enable row level security;
alter table public.categories enable row level security;

drop policy if exists "storefront read products" on public.products;
create policy "storefront read products" on public.products
  for select to anon, authenticated
  using (is_active = true);

drop policy if exists "storefront read categories" on public.categories;
create policy "storefront read categories" on public.categories
  for select to anon, authenticated
  using (true);

-- 4) Public storage bucket for product images
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "storefront read product images" on storage.objects;
create policy "storefront read product images" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'product-images');

-- 5) Backfill category slugs (adjust the matching to your real category names)
-- update public.categories set slug = 'ronde'        where slug is null and lower(name) like '%ronde%';
-- update public.categories set slug = 'jft'          where slug is null and lower(name) like '%jft%';
-- update public.categories set slug = 'lumierebleue' where slug is null and lower(name) like '%bleu%';
-- update public.categories set slug = 'photogrey'    where slug is null and lower(name) like '%photogrey%';

-- 6) Newsletter subscribers (public insert, no public read)
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

drop policy if exists "storefront subscribe" on public.newsletter_subscribers;
create policy "storefront subscribe" on public.newsletter_subscribers
  for insert to anon, authenticated
  with check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$');

-- ============================================================
-- PHASE 3 (orders) — run later, not required for catalog display
-- ============================================================
-- create table if not exists public.orders (
--   id uuid primary key default gen_random_uuid(),
--   reference text unique not null,
--   customer_name text not null,
--   customer_phone text not null,
--   customer_city text,
--   note text,
--   subtotal numeric(12,2) not null default 0,
--   shipping numeric(12,2) not null default 0,
--   total numeric(12,2) not null default 0,
--   promo_code text,
--   status text not null default 'pending',
--   created_at timestamptz not null default now()
-- );
-- create table if not exists public.order_items (
--   id uuid primary key default gen_random_uuid(),
--   order_id uuid not null references public.orders(id) on delete cascade,
--   product_id uuid references public.products(id),
--   product_name text not null,
--   unit_price numeric(12,2) not null,
--   quantity int not null check (quantity > 0),
--   line_total numeric(12,2) not null
-- );
-- alter table public.orders enable row level security;
-- alter table public.order_items enable row level security;
