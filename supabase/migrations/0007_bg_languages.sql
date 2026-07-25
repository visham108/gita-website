-- ============================================================================
-- Bhagavad-gītā in every language on the Marathon 2025 sheet.
--
-- Adds a language dimension to the catalog and turns the single English edition
-- into a full Bhagavad-gītā range: 13 languages in the standard binding, plus a
-- Deluxe binding in Hindi and English (the only two the sheet prices).
--
-- Prices are the Marathon 2025 sheet (₹, ×100 = paise). They are editable in
-- /admin without a redeploy, so treat these as the starting numbers.
--
-- The catalog is intentionally per-SKU: cart, orders, emails and the admin
-- dashboard all key off product id, so each edition "just works" once it exists.
-- `book` is carried now (all rows are 'bhagavad-gita') so other titles from the
-- sheet can be added later without another schema change.
-- ============================================================================

alter table public.products add column if not exists book     text;
alter table public.products add column if not exists language text;
alter table public.products add column if not exists binding  text
  check (binding is null or binding in ('standard', 'deluxe'));

-- The existing English edition becomes English / Standard. We KEEP its id
-- ('hardcover') rather than renaming it, because past order_items reference it
-- by foreign key. Price moves from the old ₹399 to the sheet's ₹270.
update public.products set
  type        = 'English · Standard',
  title       = 'Bhagavad-gītā As It Is — English (Standard)',
  price_paise = 27000,
  tag         = 'Most loved',
  book        = 'bhagavad-gita',
  language    = 'English',
  binding     = 'standard',
  features    = '["Complete edition — all 700 verses","Original Sanskrit, word-for-word meanings & translation","Full purports by Śrīla Prabhupāda","Sewn hardback binding"]'
where id = 'hardcover';

-- The remaining standard-binding languages.
insert into public.products (id, type, title, price_paise, tag, features, format, active, stock_qty, track_stock, book, language, binding) values
  ('bg-hindi',     'Hindi · Standard',     'Bhagavad-gītā As It Is — Hindi (Standard)',     21000, null, '["Complete edition — all 700 verses","Original Sanskrit, word-for-word meanings & translation","Full purports by Śrīla Prabhupāda","Sewn hardback binding"]', 'physical', true, 0, false, 'bhagavad-gita', 'Hindi', 'standard'),
  ('bg-assamese',  'Assamese · Standard',  'Bhagavad-gītā As It Is — Assamese (Standard)',  29000, null, '["Complete edition — all 700 verses","Original Sanskrit, word-for-word meanings & translation","Full purports by Śrīla Prabhupāda","Sewn hardback binding"]', 'physical', true, 0, false, 'bhagavad-gita', 'Assamese', 'standard'),
  ('bg-bengali',   'Bengali · Standard',   'Bhagavad-gītā As It Is — Bengali (Standard)',   23000, null, '["Complete edition — all 700 verses","Original Sanskrit, word-for-word meanings & translation","Full purports by Śrīla Prabhupāda","Sewn hardback binding"]', 'physical', true, 0, false, 'bhagavad-gita', 'Bengali', 'standard'),
  ('bg-gujarati',  'Gujarati · Standard',  'Bhagavad-gītā As It Is — Gujarati (Standard)',  24000, null, '["Complete edition — all 700 verses","Original Sanskrit, word-for-word meanings & translation","Full purports by Śrīla Prabhupāda","Sewn hardback binding"]', 'physical', true, 0, false, 'bhagavad-gita', 'Gujarati', 'standard'),
  ('bg-kannada',   'Kannada · Standard',   'Bhagavad-gītā As It Is — Kannada (Standard)',   28000, null, '["Complete edition — all 700 verses","Original Sanskrit, word-for-word meanings & translation","Full purports by Śrīla Prabhupāda","Sewn hardback binding"]', 'physical', true, 0, false, 'bhagavad-gita', 'Kannada', 'standard'),
  ('bg-malayalam', 'Malayalam · Standard', 'Bhagavad-gītā As It Is — Malayalam (Standard)', 33000, null, '["Complete edition — all 700 verses","Original Sanskrit, word-for-word meanings & translation","Full purports by Śrīla Prabhupāda","Sewn hardback binding"]', 'physical', true, 0, false, 'bhagavad-gita', 'Malayalam', 'standard'),
  ('bg-marathi',   'Marathi · Standard',   'Bhagavad-gītā As It Is — Marathi (Standard)',   21000, null, '["Complete edition — all 700 verses","Original Sanskrit, word-for-word meanings & translation","Full purports by Śrīla Prabhupāda","Sewn hardback binding"]', 'physical', true, 0, false, 'bhagavad-gita', 'Marathi', 'standard'),
  ('bg-nepali',    'Nepali · Standard',    'Bhagavad-gītā As It Is — Nepali (Standard)',    23000, null, '["Complete edition — all 700 verses","Original Sanskrit, word-for-word meanings & translation","Full purports by Śrīla Prabhupāda","Sewn hardback binding"]', 'physical', true, 0, false, 'bhagavad-gita', 'Nepali', 'standard'),
  ('bg-odia',      'Odia · Standard',      'Bhagavad-gītā As It Is — Odia (Standard)',      30000, null, '["Complete edition — all 700 verses","Original Sanskrit, word-for-word meanings & translation","Full purports by Śrīla Prabhupāda","Sewn hardback binding"]', 'physical', true, 0, false, 'bhagavad-gita', 'Odia', 'standard'),
  ('bg-tamil',     'Tamil · Standard',     'Bhagavad-gītā As It Is — Tamil (Standard)',     27000, null, '["Complete edition — all 700 verses","Original Sanskrit, word-for-word meanings & translation","Full purports by Śrīla Prabhupāda","Sewn hardback binding"]', 'physical', true, 0, false, 'bhagavad-gita', 'Tamil', 'standard'),
  ('bg-telugu',    'Telugu · Standard',    'Bhagavad-gītā As It Is — Telugu (Standard)',    25000, null, '["Complete edition — all 700 verses","Original Sanskrit, word-for-word meanings & translation","Full purports by Śrīla Prabhupāda","Sewn hardback binding"]', 'physical', true, 0, false, 'bhagavad-gita', 'Telugu', 'standard'),
  ('bg-urdu',      'Urdu · Standard',      'Bhagavad-gītā As It Is — Urdu (Standard)',      30000, null, '["Complete edition — all 700 verses","Original Sanskrit, word-for-word meanings & translation","Full purports by Śrīla Prabhupāda","Sewn hardback binding"]', 'physical', true, 0, false, 'bhagavad-gita', 'Urdu', 'standard'),
  ('bg-hindi-deluxe',   'Hindi · Deluxe',   'Bhagavad-gītā As It Is — Hindi (Deluxe)',   40000, 'Deluxe', '["Everything in the standard edition","Premium deluxe binding","A keepsake edition, ideal for gifting"]', 'physical', true, 0, false, 'bhagavad-gita', 'Hindi', 'deluxe'),
  ('bg-english-deluxe', 'English · Deluxe', 'Bhagavad-gītā As It Is — English (Deluxe)', 50000, 'Deluxe', '["Everything in the standard edition","Premium deluxe binding","A keepsake edition, ideal for gifting"]', 'physical', true, 0, false, 'bhagavad-gita', 'English', 'deluxe')
on conflict (id) do nothing;
