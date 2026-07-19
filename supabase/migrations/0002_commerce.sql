-- ============================================================================
-- Commerce schema: catalog, orders, order lines.
-- Prices are integers in PAISE (₹399.00 = 39900) — no floating point money.
-- Writes happen only server-side (service_role); customers read their own
-- orders; the catalog is public.
-- ============================================================================

create table if not exists public.products (
  id          text primary key,               -- "hardcover" | "paperback" | ...
  type        text not null,                  -- display label
  title       text not null,
  price_paise integer not null check (price_paise >= 0),
  tag         text,
  features    jsonb not null default '[]',
  format      text not null default 'physical' check (format in ('physical', 'digital')),
  active      boolean not null default true,  -- shown on the site
  stock_qty   integer not null default 0 check (stock_qty >= 0),
  created_at  timestamptz not null default now()
);

create sequence if not exists public.order_no_seq start 1001;

create table if not exists public.orders (
  id                  uuid primary key default gen_random_uuid(),
  order_no            bigint not null unique default nextval('public.order_no_seq'),
  user_id             uuid references auth.users (id) on delete set null,
  email               text not null,
  phone               text,
  status              text not null default 'pending'
                      check (status in ('pending','paid','packed','shipped','delivered','cancelled','refunded')),
  amount_paise        integer not null check (amount_paise >= 0),   -- grand total
  shipping_paise      integer not null default 0,
  razorpay_order_id   text unique,
  razorpay_payment_id text,
  awb                 text,
  tracking_url        text,
  gift                boolean not null default false,
  gift_note           text,
  ship_name           text,
  ship_address        text,
  ship_city           text,
  ship_state          text,
  ship_pincode        text,
  created_at          timestamptz not null default now(),
  paid_at             timestamptz
);

create table if not exists public.order_items (
  order_id         uuid not null references public.orders (id) on delete cascade,
  product_id       text not null references public.products (id),
  qty              integer not null check (qty > 0),
  unit_price_paise integer not null,           -- price snapshot at purchase time
  title            text not null,              -- title snapshot
  primary key (order_id, product_id)
);

create index if not exists orders_user_idx on public.orders (user_id);
create index if not exists orders_rzp_idx on public.orders (razorpay_order_id);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Catalog: anyone may read active products; only the server writes.
drop policy if exists "catalog read" on public.products;
create policy "catalog read" on public.products for select using (active = true);

-- Orders: signed-in customers see their own; guests are served by the server
-- (service_role) via email + order number lookup. No client-side writes.
drop policy if exists "own orders" on public.orders;
create policy "own orders" on public.orders for select using (auth.uid() = user_id);

drop policy if exists "own order items" on public.order_items;
create policy "own order items" on public.order_items for select
  using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));

-- Privileges (this project strips default grants — every role is explicit).
grant select on public.products to anon, authenticated;
grant select on public.orders, public.order_items to authenticated;
grant select, insert, update, delete
  on public.products, public.orders, public.order_items to service_role;
grant usage on sequence public.order_no_seq to service_role;

-- ---------------------------------------------------------------------------
-- Atomic, idempotent payment capture: flips pending→paid and decrements stock
-- in ONE transaction. Safe under webhook replays and double callbacks — only
-- the first caller transitions the order; everyone else gets 'false'.
-- ---------------------------------------------------------------------------
create or replace function public.mark_order_paid(p_rzp_order_id text, p_payment_id text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
begin
  update public.orders
     set status = 'paid',
         razorpay_payment_id = p_payment_id,
         paid_at = now()
   where razorpay_order_id = p_rzp_order_id
     and status = 'pending'
  returning id into v_order_id;

  if v_order_id is null then
    return false; -- already handled (or unknown order)
  end if;

  update public.products p
     set stock_qty = greatest(p.stock_qty - oi.qty, 0)
    from public.order_items oi
   where oi.order_id = v_order_id
     and p.id = oi.product_id;

  return true;
end;
$$;

revoke all on function public.mark_order_paid(text, text) from public, anon, authenticated;
grant execute on function public.mark_order_paid(text, text) to service_role;

-- ---------------------------------------------------------------------------
-- Seed: the four editions. PLACEHOLDER INR prices and stock — set the real
-- numbers before go-live (update these rows; the site reads live values).
-- Digital formats exist in the catalog but are not purchasable at launch.
-- ---------------------------------------------------------------------------
insert into public.products (id, type, title, price_paise, tag, features, format, active, stock_qty) values
  ('hardcover', 'Hardcover', 'Bhagavad-gītā As It Is — Complete Hardcover', 39900, 'Most loved',
   '["Complete edition: all 700 verses","Full purports by Śrīla Prabhupāda","Sewn binding with color plates","Lies flat for study"]',
   'physical', true, 20),
  ('paperback', 'Paperback', 'Bhagavad-gītā As It Is — Paperback', 19900, null,
   '["Same complete, unabridged text","Travel-friendly format","Perfect first copy","Ideal for gifting"]',
   'physical', true, 30),
  ('ebook', 'eBook', 'Bhagavad-gītā As It Is — eBook', 9900, 'Coming soon',
   '["EPUB and Kindle formats","Full-text search","Linked word-for-word meanings","Instant delivery"]',
   'digital', true, 0),
  ('audiobook', 'Audiobook', 'Bhagavad-gītā As It Is — Audiobook', 14900, 'Coming soon',
   '["Complete unabridged narration","Sanskrit verses recited","Listen anywhere","Instant delivery"]',
   'digital', true, 0)
on conflict (id) do nothing;
