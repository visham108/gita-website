-- ============================================================================
-- Made-to-order support.
-- The seller sources copies per order rather than holding inventory, so stock
-- must not gate sales. track_stock = false means: never block a purchase on
-- stock, never decrement on payment, never restock on cancel. stock_qty is
-- then meaningless for that product and the UI says "Made to order".
--
-- Default stays TRUE so nothing changes for products that DO track inventory.
-- ============================================================================

alter table public.products
  add column if not exists track_stock boolean not null default true;

-- ---------------------------------------------------------------------------
-- Payment capture: decrement only tracked products.
-- Otherwise identical to before — atomic, idempotent, first-caller-wins.
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
     and p.id = oi.product_id
     and p.track_stock;          -- made-to-order items are untouched

  return true;
end;
$$;

-- ---------------------------------------------------------------------------
-- Cancellation: restock only tracked products, and only when stock was
-- actually deducted (paid/packed). Pending orders never deducted anything.
-- ---------------------------------------------------------------------------
create or replace function public.cancel_order(p_order_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_prev text;
begin
  select status into v_prev
    from public.orders
   where id = p_order_id
   for update;

  if v_prev is null or v_prev not in ('pending', 'paid', 'packed') then
    return false;
  end if;

  update public.orders set status = 'cancelled' where id = p_order_id;

  if v_prev in ('paid', 'packed') then
    update public.products p
       set stock_qty = p.stock_qty + oi.qty
      from public.order_items oi
     where oi.order_id = p_order_id
       and p.id = oi.product_id
       and p.track_stock;        -- made-to-order items are untouched
  end if;

  return true;
end;
$$;

revoke all on function public.mark_order_paid(text, text) from public, anon, authenticated;
grant execute on function public.mark_order_paid(text, text) to service_role;
revoke all on function public.cancel_order(uuid) from public, anon, authenticated;
grant execute on function public.cancel_order(uuid) to service_role;

-- ---------------------------------------------------------------------------
-- The two physical editions are made to order.
-- ---------------------------------------------------------------------------
update public.products set track_stock = false where id in ('hardcover', 'paperback');
