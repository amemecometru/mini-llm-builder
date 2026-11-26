-- 001_schema.sql
-- Target: clawdyclaw-db (8cabecfe-12ee-4af5-8227-24ea2b37619f)
-- Runs on an empty database. No dependencies.
--
-- business_models is a TYPE LIBRARY, not client data.
-- typical_* fields are scope guidance and are NEVER rendered as facts.
-- No dollar amounts are stored. Pricing is structure only.

CREATE TABLE IF NOT EXISTS business_models (
  id                 TEXT    PRIMARY KEY,
  name               TEXT    NOT NULL,

  -- matching
  keywords           TEXT    NOT NULL DEFAULT '[]' CHECK (json_valid(keywords)),

  -- scope guidance (arrays of objects, never plain strings)
  typical_services   TEXT    NOT NULL DEFAULT '[]' CHECK (json_valid(typical_services)),
  typical_process    TEXT    NOT NULL DEFAULT '[]' CHECK (json_valid(typical_process)),
  typical_pricing    TEXT    NOT NULL DEFAULT '[]' CHECK (json_valid(typical_pricing)),
  typical_faq        TEXT    NOT NULL DEFAULT '[]' CHECK (json_valid(typical_faq)),

  -- door: quote-form | booking-form | order-online | call-now | walk-in | signup
  door_type          TEXT    NOT NULL DEFAULT 'quote-form',

  image_suggestions  TEXT    NOT NULL DEFAULT '[]' CHECK (json_valid(image_suggestions)),
  notes              TEXT    NOT NULL DEFAULT '',

  -- support layer: drives the plan generator, never rendered as fact
  tone               TEXT    NOT NULL DEFAULT '',
  trust_signals      TEXT    NOT NULL DEFAULT '[]' CHECK (json_valid(trust_signals)),
  customer_worries   TEXT    NOT NULL DEFAULT '[]' CHECK (json_valid(customer_worries)),
  cta_language       TEXT    NOT NULL DEFAULT '[]' CHECK (json_valid(cta_language)),
  sections_priority  TEXT    NOT NULL DEFAULT '[]' CHECK (json_valid(sections_priority)),
  proof_types        TEXT    NOT NULL DEFAULT '[]' CHECK (json_valid(proof_types)),

  created_at         INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at         INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_business_models_name
  ON business_models(name);
