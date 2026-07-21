-- Reset the order-number sequence so the first REAL order is BG-1001.
-- Safe only because the orders table is empty (all test orders were deleted
-- on 2026-07-21). Do NOT run this once real orders exist — it would hand out
-- order numbers that collide with issued ones.
alter sequence public.order_no_seq restart with 1001;
