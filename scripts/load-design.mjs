#!/usr/bin/env node
/**
 * scripts/load-design.mjs — put a DESIGN.md into design_families.
 *
 *   node scripts/load-design.mjs --family bento-noir
 *
 * Reads designs/<family>/DESIGN-<family>.md, splits the YAML frontmatter from
 * the prose, and writes:
 *   design_md <- the prose (everything after the closing ---)
 *   tokens    <- the frontmatter, as JSON
 *
 * Safe to re-run. Prints the resulting column sizes when it finishes.
 */

import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";

const DB = "dipdesigns-db";

const args = {};
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (!a.startsWith("--")) continue;
  const k = a.slice(2);
  const v = process.argv[i + 1] && !process.argv[i + 1].startsWith("--") ? process.argv[++i] : true;
  args[k] = v;
}

const family = args.family ?? "bento-noir";
const version = Number(args.version ?? 1);
const file = args.file ?? `designs/${family}/DESIGN-${family}.md`;

function splitFrontmatter(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { frontmatter: null, body: src };
  return { frontmatter: m[1], body: m[2] };
}

const sqlString = (s) => "'" + String(s).replace(/'/g, "''") + "'";

async function loadYaml() {
  for (const mod of ["yaml", "js-yaml"]) {
    try {
      const m = await import(mod);
      return m.default?.parse ?? m.default?.load ?? m.parse ?? m.load;
    } catch {}
  }
  return null;
}

function wrangler(argv) {
  return new Promise((resolve) => {
    const p = spawn("npx", ["wrangler", ...argv], { stdio: "inherit" });
    p.on("close", (code) => resolve(code ?? 1));
  });
}

const src = await readFile(file, "utf8");
const { frontmatter, body } = splitFrontmatter(src);

if (body.trim().length < 500) {
  console.error(`! ${file} has only ${body.trim().length} chars of prose. Refusing to write a stub.`);
  process.exit(1);
}

const sets = [`design_md = ${sqlString(body)}`];

const parseYaml = await loadYaml();
if (parseYaml && frontmatter) {
  try {
    sets.push(`tokens = ${sqlString(JSON.stringify(parseYaml(frontmatter)))}`);
    console.log(`  tokens: parsed from frontmatter`);
  } catch (e) {
    console.warn(`! frontmatter is not valid YAML (${e.message}) — writing design_md only`);
  }
} else {
  console.warn(`! no YAML parser installed — writing design_md only`);
  console.warn(`  install one with:  npm i -D yaml`);
}
sets.push(`updated_at = unixepoch()`);

const sql = `UPDATE design_families SET ${sets.join(", ")} WHERE id = ${sqlString(family)} AND version = ${version};`;

await mkdir(".wrangler", { recursive: true });
const tmp = path.join(".wrangler", `load-${family}.sql`);
await writeFile(tmp, sql, "utf8");

console.log(`\nLoading ${file} -> design_families(${family}, v${version})`);
console.log(`  design_md: ${body.trim().length} chars\n`);

const code = await wrangler(["d1", "execute", DB, "--remote", "--file", tmp]);
await rm(tmp, { force: true });

if (code !== 0) {
  console.error(`\n! wrangler exited ${code}. Nothing was written.`);
  process.exit(code);
}

console.log(`\nVerifying:`);
await wrangler([
  "d1", "execute", DB, "--remote", "--command",
  `SELECT id, version, length(design_md) AS design_md_len, length(tokens) AS tokens_len FROM design_families WHERE id = '${family}';`,
]);
