CREATE TABLE IF NOT EXISTS stock_images (
  id     TEXT PRIMARY KEY,          -- 'plumber-hero-1'
  url    TEXT NOT NULL,             -- images.unsplash.com/photo-...?w=1400&q=80
  alt    TEXT NOT NULL DEFAULT '',  -- 'Plumber fitting a water heater'
  role   TEXT NOT NULL DEFAULT 'work',   -- hero | work | person | before | after
  tag    TEXT NOT NULL DEFAULT 'trades', -- business_models.id
  credit TEXT NOT NULL DEFAULT ''   -- 'Jane Doe — https://unsplash.com/photos/abc'
);

CREATE INDEX IF NOT EXISTS idx_stock_images_role_tag ON stock_images(role, tag);
