#!/usr/bin/env node
/**
 * Generates the business_models seed from data/business-types.json.
 *
 *   node scripts/seed.mjs            # write sql/002_seed_business_types.sql
 *   node scripts/seed.mjs --check    # validate only, write nothing
 *
 * Adding a business type = adding one object to the JSON array.
 * No new SQL file, no hand-written INSERT.
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = join(root, "data/business-types.json");
const outPath = join(root, "sql/002_seed_business_types.sql");
const checkOnly = process.argv.includes("--check");

/* ------------------------------------------------------------------ */
/* load                                                                */
/* ------------------------------------------------------------------ */

let types;
try {
  types = JSON.parse(readFileSync(dataPath, "utf8"));
} catch (err) {
  console.error(`Could not read ${dataPath}`);
  console.error(err.message);
  process.exit(1);
}

if (!Array.isArray(types)) {
  console.error("business-types.json must be a JSON array");
  process.exit(1);
}

/* ------------------------------------------------------------------ */
/* validate                                                            */
/* ------------------------------------------------------------------ */

const errors = [];
const seen = new Set();
const MONEY = /\$\s?\d/;

for (const [i, t] of types.entries()) {
  const where = `[${i}] ${t?.id ?? "(no id)"}`;

  if (!t || typeof t !== "object") {
    errors.push(`${where}: not an object`);
    continue;
  }
  if (!t.id || !/^[a-z0-9-]{2,60}$/.test(t.id)) {
    errors.push(`${where}: id must be kebab-case`);
  } else if (seen.has(t.id)) {
    errors.push(`${where}: duplicate id`);
  } else {
    seen.add(t.id);
  }
  if (!t.name || typeof t.name !== "string") errors.push(`${where}: name required`);

  for (const field of ["keywords", "typical_services", "typical_process", "typical_faq", "image_suggestions"]) {
    if (!Array.isArray(t[field]) || t[field].length === 0) {
      errors.push(`${where}: ${field} must be a non-empty array`);
    }
  }

  if (!Array.isArray(t.typical_pricing) || t.typical_pricing.length === 0) {
    errors.push(`${where}: typical_pricing must be a non-empty array`);
  } else {
    for (const p of t.typical_pricing) {
      if (!p?.item || !p?.model) errors.push(`${where}: pricing needs item and model`);
      if (MONEY.test(String(p?.model ?? ""))) {
        errors.push(`${where}: pricing model must not contain an amount`);
      }
    }
  }

  // FAQ is questions only — no answers.
  for (const q of t.typical_faq ?? []) {
    if (typeof q !== "string") errors.push(`${where}: faq entries must be strings`);
    if (MONEY.test(q)) errors.push(`${where}: faq must not contain an amount`);
  }

  if (!t.door_type) errors.push(`${where}: door_type required`);
  if (!t.notes) errors.push(`${where}: notes required`);
}

if (errors.length) {
  console.error(`\n${errors.length} problem(s):\n`);
  for (const e of errors) console.error("  -", e);
  process.exit(1);
}

console.log(`Validated ${types.length} business types.`);

if (checkOnly) process.exit(0);

/* ------------------------------------------------------------------ */
/* emit                                                                */
/* ------------------------------------------------------------------ */

const q = (value) => `'${String(value).replace(/'/g, "''")}'`;
const j = (value) => q(JSON.stringify(value));

const rows = types
  .map(
    (t) => `(${[
      q(t.id),
      q(t.name),
      j(t.keywords),
      j(t.typical_services),
      j(t.typical_process),
      j(t.typical_pricing),
      j(t.typical_faq),
      q(t.door_type),
      j(t.image_suggestions),
      q(t.notes),
      q(t.tone ?? ""),
      j(t.trust_signals ?? []),
      j(t.customer_worries ?? []),
      j(t.cta_language ?? []),
      j(t.sections_priority ?? []),
      j(t.proof_types ?? []),
    ].join(", ")})`,
  )
  .join(",\n");

const sql = `-- GENERATED FILE — do not edit by hand.
-- Source: data/business-types.json
-- Regenerate: node scripts/seed.mjs
-- Records: ${types.length}

INSERT OR REPLACE INTO business_models
(id, name, keywords, typical_services, typical_process, typical_pricing,
 typical_faq, door_type, image_suggestions, notes,
 tone, trust_signals, customer_worries, cta_language, sections_priority, proof_types)
VALUES
${rows};
`;

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, sql, "utf8");

console.log(`Wrote ${outPath} (${types.length} records, ${sql.length} bytes)`);
console.log(`
Apply it:

  npx wrangler d1 execute llm-mini-designs --remote --file=./sql/002_seed_business_types.sql

Verify:

  npx wrangler d1 execute llm-mini-designs --remote --command "SELECT COUNT(*) AS n FROM business_models"
`);
