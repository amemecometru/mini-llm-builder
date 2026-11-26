/**
 * Load data/business-types.json into the business_models table.
 *
 * The JSON is the authoring source. The table is what the pipeline reads.
 * Without this, matchBusinessModel() returns null on every build and the
 * prompt says "no business type reference matched" — which is why every
 * page comes out generic.
 *
 * Unknown section ids in sections_priority are dropped and reported, because
 * validatePlan rejects them and the build retries into a 502.
 */
import { readFileSync, writeFileSync } from "node:fs";

const SECTIONS = [
  "hero", "services", "process", "proof", "team",
  "partners", "guide", "validations", "door", "footer",
];

const types = JSON.parse(readFileSync("data/business-types.json", "utf8"));

const esc = (s) => "'" + String(s ?? "").replace(/'/g, "''") + "'";
const json = (v) => esc(JSON.stringify(v ?? []));

const rows = [];
const warnings = [];

for (const t of types) {
  if (!t.id) {
    warnings.push(`skipped entry with no id: ${JSON.stringify(t).slice(0, 60)}`);
    continue;
  }

  let priority = Array.isArray(t.sections_priority) ? t.sections_priority : [];
  const bad = priority.filter((s) => !SECTIONS.includes(s));
  if (bad.length) warnings.push(`${t.id}: dropped unknown sections → ${bad.join(", ")}`);
  priority = priority.filter((s) => SECTIONS.includes(s));

  rows.push(`(
  ${esc(t.id)},
  ${esc(t.name ?? t.id)},
  ${json(t.keywords)},
  ${json(t.typical_services)},
  ${json(t.typical_process)},
  ${json(t.typical_pricing)},
  ${json(t.typical_faq)},
  ${esc(t.door_type ?? "quote-form")},
  ${json(t.image_suggestions)},
  ${esc(t.notes ?? "")},
  ${esc(t.tone ?? "")},
  ${json(t.trust_signals)},
  ${json(t.customer_worries)},
  ${json(t.cta_language)},
  ${json(priority)},
  ${json(t.proof_types)}
)`);
}

const sql = `INSERT OR REPLACE INTO business_models
  (id, name, keywords, typical_services, typical_process, typical_pricing,
   typical_faq, door_type, image_suggestions, notes, tone, trust_signals,
   customer_worries, cta_language, sections_priority, proof_types)
VALUES
${rows.join(",\n")};
`;

writeFileSync("/tmp/seed-business-models.sql", sql);
console.log(`${rows.length} business models → /tmp/seed-business-models.sql`);
for (const w of warnings) console.log("  ! " + w);
