-- A design family is a versioned design system. The DESIGN.md text is stored
-- verbatim because it is the contract the plan generator reads: the prose
-- sections, the Do's and Don'ts and the motion grammar are what produce quality.
-- `tokens` is the same frontmatter parsed for the renderer.
--
-- A build records design_family_id + design_family_version, so any page can be
-- reproduced exactly from the family that produced it.

CREATE TABLE IF NOT EXISTS design_families (
  id            TEXT    NOT NULL,              -- 'bento-noir'
  version       INTEGER NOT NULL,              -- 1, 2, 3 …
  name          TEXT    NOT NULL,              -- 'Bento Noir'

  design_md     TEXT    NOT NULL,              -- the full DESIGN.md, verbatim
  tokens        TEXT    NOT NULL CHECK (json_valid(tokens)),
  section_order TEXT    NOT NULL CHECK (json_valid(section_order)),

  status        TEXT    NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('draft', 'live', 'retired')),

  created_at    INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at    INTEGER NOT NULL DEFAULT (unixepoch()),

  PRIMARY KEY (id, version)
);

CREATE INDEX IF NOT EXISTS idx_design_families_status
  ON design_families(status);

-- The newest live version of each family. This is what the builder selects from.
CREATE VIEW IF NOT EXISTS live_design_families AS
SELECT df.*
FROM design_families df
JOIN (
  SELECT id, MAX(version) AS version
  FROM design_families
  WHERE status = 'live'
  GROUP BY id
) newest
  ON df.id = newest.id
 AND df.version = newest.version;
