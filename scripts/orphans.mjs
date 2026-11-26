/**
 * Find modules in src/ that nothing imports.
 *
 * A file that exists but is never imported is either dead code or a fix
 * that was written and never wired. Both are worth knowing about before
 * you spend an hour debugging why a change had no effect.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const dir = "src";
const files = readdirSync(dir).filter((f) => f.endsWith(".ts"));
const sources = files.map((f) => ({
  name: f.replace(/\.ts$/, ""),
  text: readFileSync(join(dir, f), "utf8"),
}));

for (const { name } of sources) {
  if (name === "index") continue;

  const imported = sources.some(
    (s) => s.name !== name && new RegExp(`from\\s+["']\\./${name}["']`).test(s.text),
  );

  if (!imported) console.log(`ORPHAN  src/${name}.ts  — nothing imports it`);
}
