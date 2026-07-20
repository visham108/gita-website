-- ============================================================================
-- Phase 4 (seller admin): atomic order cancellation.
-- Mirrors mark_order_paid's discipline — one transaction, replay-safe.
-- Cancelling a PAID/PACKED order puts its stock back (it was decremented at
-- payment capture); cancelling a PENDING order touches no stock.
-- ============================================================================

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
    return false; -- already cancelled/shipped/refunded, or unknown order
  end if;

  update public.orders set status = 'cancelled' where id = p_order_id;

  if v_prev in ('paid', 'packed') then
    update public.products p
       set stock_qty = p.stock_qty + oi.qty
      from public.order_items oi
     where oi.order_id = p_order_id
       and p.id = oi.product_id;
  end if;

  return true;
end;
$$;

revoke all on function public.cancel_order(uuid) from public, anon, authenticated;
grant execute on function public.cancel_order(uuid) to service_role;
