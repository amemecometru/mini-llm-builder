-- 008_seed_stock_images.sql — seed for stock_images (llm-mini-builder)
-- 26 rows, all verified 2026-11-26: HEAD on each
-- https://images.unsplash.com/photo-<id>?w=1400&q=80 returned 200 image/jpeg,
-- and each image was visually inspected (contact sheets) before its alt/role/tag
-- was assigned. No photo ID was invented.
-- Sources: Unsplash image IDs found in indexed pages (GitHub diffs, business
-- sites embedding Unsplash, and curated Unsplash ID lists), then HEAD-verified.
-- Photographer names were NOT retrievable: unsplash.com is blocked for direct
-- fetch in this environment, so credit is source-only ('Unsplash') — no
-- photographer name was invented.
-- NOTE: only 1 genuine 'before' photo could be verified (a construction site
-- in progress). Two 'before' rows are missing — do not pad them with
-- work/person photos mislabelled as before. Total is 26, not 28.
-- Roles: hero 6, work 10, person 6, before 1, after 3.
-- Apply: npx wrangler d1 execute dipdesigns-db --remote --file sql/008_seed_stock_images.sql

INSERT INTO stock_images (id, url, alt, role, tag, credit) VALUES
  ('landscape-hero-1', 'https://images.unsplash.com/photo-1598817368048-c2948b983acf?w=1400&q=80', 'Modern house with a manicured lawn and garden', 'hero', 'landscaping', 'Unsplash'),
  ('landscape-hero-2', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&q=80', 'Open field at sunset', 'hero', 'landscaping', 'Unsplash'),
  ('landscape-hero-3', 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=1400&q=80', 'Waterfall over green cliffs at sunset', 'hero', 'landscaping', 'Unsplash'),
  ('landscape-hero-4', 'https://images.unsplash.com/photo-1642541744624-7a2a89545a32?w=1400&q=80', 'Manicured lawn with trimmed hedges and a garden path', 'hero', 'landscaping', 'Unsplash'),
  ('trades-hero-1', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80', 'Mountain peaks above clouds at sunset', 'hero', 'trades', 'Unsplash'),
  ('trades-hero-2', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80', 'Modern house exterior at dusk with a lawn and tree', 'hero', 'trades', 'Unsplash'),
  ('landscape-work-1', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1400&q=80', 'Garden trowel and soil for planting', 'work', 'landscaping', 'Unsplash'),
  ('landscape-work-2', 'https://images.unsplash.com/photo-1692958964030-1c58f4962d45?w=1400&q=80', 'Aerial view of a formal garden with a circular fountain', 'work', 'landscaping', 'Unsplash'),
  ('landscape-work-3', 'https://images.unsplash.com/photo-1485793997698-baba81bf21ab?w=1400&q=80', 'Hedge-lined garden path', 'work', 'landscaping', 'Unsplash'),
  ('landscape-work-4', 'https://images.unsplash.com/photo-1517237680353-0276536284ca?w=1400&q=80', 'Stone courtyard with arches and potted plants', 'work', 'landscaping', 'Unsplash'),
  ('electrical-work-1', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1400&q=80', 'Server racks with network cables in a dark room', 'work', 'electrical', 'Unsplash'),
  ('electrical-work-2', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&q=80', 'Close-up of a circuit board', 'work', 'electrical', 'Unsplash'),
  ('trades-work-1', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80', 'Tradesperson using a power drill', 'work', 'trades', 'Unsplash'),
  ('trades-work-2', 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1400&q=80', 'Architect reviewing building plans', 'work', 'trades', 'Unsplash'),
  ('trades-work-3', 'https://images.unsplash.com/photo-1529220502050-f15e570c634e?w=1400&q=80', 'Yellow wet floor caution sign on a tiled floor', 'work', 'trades', 'Unsplash'),
  ('trades-work-4', 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1400&q=80', 'Bright office with a laptop on a long desk by large windows', 'work', 'trades', 'Unsplash'),
  ('electrical-person-1', 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=1400&q=80', 'Electrician in a hard hat and safety glasses at an electrical panel', 'person', 'electrical', 'Unsplash'),
  ('trades-person-1', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&q=80', 'Team working together at laptops around a table', 'person', 'trades', 'Unsplash'),
  ('trades-person-2', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1400&q=80', 'Smiling woman in a red top, portrait', 'person', 'trades', 'Unsplash'),
  ('trades-person-3', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400&q=80', 'Smiling man in a white t-shirt, portrait', 'person', 'trades', 'Unsplash'),
  ('trades-person-4', 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1400&q=80', 'Woman holding an orange folder, smiling', 'person', 'trades', 'Unsplash'),
  ('trades-person-5', 'https://images.unsplash.com/photo-1540593318873-4daf6e6e95e9?w=1400&q=80', 'Woman relaxing on a sofa at home with a cat', 'person', 'trades', 'Unsplash'),
  ('construction-before-1', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&q=80', 'Construction workers on a building site with steel rebar', 'before', 'trades', 'Unsplash'),
  ('plumbing-after-1', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1400&q=80', 'Modern bathroom with a glass shower and double vanity', 'after', 'plumbing', 'Unsplash'),
  ('plumbing-after-2', 'https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=1400&q=80', 'Modern bathroom with a bathtub and floating vanity', 'after', 'plumbing', 'Unsplash'),
  ('kitchen-after-1', 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1400&q=80', 'Bright white kitchen with an island', 'after', 'trades', 'Unsplash');
