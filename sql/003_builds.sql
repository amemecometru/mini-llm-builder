-- 003_builds.sql
-- Target: clawdyclaw-db (8cabecfe-12ee-4af5-8227-24ea2b37619f)
-- The funnel. See sql/README.md for the state machine.
--
--   queued → building → ready → chosen → checkout → paid → onboarding → live
--                          ↘ abandoned            ↘ failed
--
-- Gates are enforced server-side:
--   four windows are shown only at `ready`
--   checkout is created only at `chosen`
--   client_details accepts writes only at `paid` or `onboarding`

CREATE TABLE IF NOT EXISTS build_jobs (
  id                    TEXT    PRIMARY KEY,
  client_query          TEXT    NOT NULL,

  business_model_id     TEXT    REFERENCES business_models(id),
  design_family_id      TEXT,
  design_family_version INTEGER,

  status                TEXT    NOT NULL DEFAULT 'queued'
                        CHECK (status IN (
                          'queued', 'building', 'ready', 'chosen',
                          'checkout', 'paid', 'onboarding', 'live',
                          'abandoned', 'failed'
                        )),

  brief_json            TEXT    CHECK (brief_json IS NULL OR json_valid(brief_json)),
  error                 TEXT,

  created_at            INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at            INTEGER NOT NULL DEFAULT (unixepoch()),

  FOREIGN KEY (design_family_id, design_family_version)
    REFERENCES design_families(id, version)
);

CREATE INDEX IF NOT EXISTS idx_build_jobs_status
  ON build_jobs(status, created_at);

-- Exactly four variants per job, indices 0..3. The four windows read from here.
CREATE TABLE IF NOT EXISTS build_variants (
  id             TEXT    PRIMARY KEY,
  job_id         TEXT    NOT NULL REFERENCES build_jobs(id) ON DELETE CASCADE,
  variant_index  INTEGER NOT NULL CHECK (variant_index BETWEEN 0 AND 3),

  directive_json TEXT    NOT NULL CHECK (json_valid(directive_json)),
  plan_json      TEXT    CHECK (plan_json IS NULL OR json_valid(plan_json)),

  status         TEXT    NOT NULL DEFAULT 'pending'
                         CHECK (status IN ('pending', 'ready', 'failed')),
  chosen         INTEGER NOT NULL DEFAULT 0 CHECK (chosen IN (0, 1)),

  created_at     INTEGER NOT NULL DEFAULT (unixepoch()),

  UNIQUE (job_id, variant_index)
);

-- A job can have at most one chosen variant.
CREATE UNIQUE INDEX IF NOT EXISTS idx_build_variants_one_chosen
  ON build_variants(job_id) WHERE chosen = 1;

CREATE INDEX IF NOT EXISTS idx_build_variants_job
  ON build_variants(job_id, variant_index);

-- What the client buys after choosing. Site + hosting + domain + business email.
CREATE TABLE IF NOT EXISTS packages (
  id              TEXT    PRIMARY KEY,
  name            TEXT    NOT NULL,
  tagline         TEXT    NOT NULL DEFAULT '',
  price_cents     INTEGER NOT NULL,
  currency        TEXT    NOT NULL DEFAULT 'usd',
  interval        TEXT    NOT NULL DEFAULT 'one_time'
                          CHECK (interval IN ('one_time', 'monthly', 'yearly')),
  includes        TEXT    NOT NULL DEFAULT '[]' CHECK (json_valid(includes)),
  stripe_price_id TEXT,
  active          INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
  sort            INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS orders (
  id                 TEXT    PRIMARY KEY,
  job_id             TEXT    NOT NULL REFERENCES build_jobs(id),
  variant_id         TEXT    REFERENCES build_variants(id),
  package_id         TEXT    NOT NULL REFERENCES packages(id),

  stripe_session_id  TEXT    UNIQUE,
  stripe_customer_id TEXT,

  amount_cents       INTEGER NOT NULL,
  currency           TEXT    NOT NULL DEFAULT 'usd',
  status             TEXT    NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  paid_at            INTEGER,

  created_at         INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_orders_job
  ON orders(job_id);

-- The details step, moved behind the paywall.
-- Only writable once the job is `paid` or `onboarding`.
CREATE TABLE IF NOT EXISTS client_details (
  job_id         TEXT    PRIMARY KEY REFERENCES build_jobs(id) ON DELETE CASCADE,

  business_name  TEXT    NOT NULL DEFAULT '',
  phone          TEXT,
  email          TEXT,
  address        TEXT,
  hours          TEXT,

  services_json  TEXT    NOT NULL DEFAULT '[]' CHECK (json_valid(services_json)),
  process_json   TEXT    NOT NULL DEFAULT '[]' CHECK (json_valid(process_json)),
  proof_json     TEXT    NOT NULL DEFAULT '{}' CHECK (json_valid(proof_json)),
  images_json    TEXT    NOT NULL DEFAULT '[]' CHECK (json_valid(images_json)),

  updated_at     INTEGER NOT NULL DEFAULT (unixepoch())
);

-- Funnel analytics: which designs convert, where clients abandon.
CREATE TABLE IF NOT EXISTS build_events (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id     TEXT    NOT NULL REFERENCES build_jobs(id) ON DELETE CASCADE,
  event      TEXT    NOT NULL,   -- queued|built|previewed|chosen|checkout_started|paid|abandoned
  meta       TEXT    NOT NULL DEFAULT '{}' CHECK (json_valid(meta)),
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_build_events_job
  ON build_events(job_id, created_at);
