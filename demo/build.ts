/**
 * Renders the sample plan through every skin and writes HTML files.
 *
 *   npx tsx demo/build.ts
 *
 * Then open demo/out/<skin>.html in a browser.
 *
 * No model call. No D1. No network. This is the renderer alone, which is
 * the point: the shell is deterministic and free.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { infinitPrinterPlan } from "./plan";
import { validatePlan, findInventedPrices } from "../src/content";
import { renderPage, type SkinRow } from "../src/render";

/**
 * The five skins, copied from D1 so this runs without a database.
 * color_palette and typography are the real stored values.
 */
const SKINS: SkinRow[] = [
  {
    id: "cinematic-bento-01",
    name: "Cinematic Bento",
    color_palette:
      '{"primary":"#0f0f0f","accent":"#e8c07a","background":"#0a0a0a","text":"#f5f5f5","muted":"#a1a1a1"}',
    typography:
      '{"display":"clamp(3.5rem, 8vw, 7rem)","heading":"clamp(2rem, 4vw, 3.5rem)","body":"1.125rem","font":"Inter, system-ui, sans-serif"}',
  },
  {
    id: "smithy-dark-cinematic",
    name: "Smithy Dark Cinematic",
    color_palette:
      '{"primary":"#0a0a0a","accent":"#e63946","background":"#050505","text":"#f1f1f1","muted":"#8a8a8a"}',
    typography:
      '{"display":"clamp(4rem,10vw,9rem)","heading":"clamp(2.5rem,5vw,4rem)","body":"1.1rem","font":"Inter, system-ui, sans-serif"}',
  },
  {
    id: "dipdesigns-bold-brand",
    name: "DipDesigns Bold Brand",
    color_palette:
      '{"primary":"#1a1a1a","accent":"#ff6b00","background":"#fafafa","text":"#1a1a1a","muted":"#999"}',
    typography:
      '{"display":"clamp(3rem, 7vw, 6rem)","heading":"clamp(1.8rem, 4vw, 3rem)","body":"1.05rem","font":"Inter, system-ui, sans-serif"}',
  },
  {
    id: "r5-editorial-light",
    name: "R5 Editorial Light",
    color_palette:
      '{"primary":"#2a2a2a","accent":"#3b6e5a","background":"#fdfdfb","text":"#2a2a2a","muted":"#b0b0b0"}',
    typography:
      '{"display":"clamp(3rem, 6vw, 5.5rem)","heading":"clamp(1.75rem, 3.5vw, 2.75rem)","body":"1.0625rem","font":"Georgia, serif"}',
  },
  {
    id: "schultz-strong-type",
    name: "Schultz Strong Type",
    color_palette:
      '{"primary":"#000000","accent":"#ffffff","background":"#ffffff","text":"#000000","muted":"#666666"}',
    typography:
      '{"display":"clamp(3.5rem, 9vw, 8rem)","heading":"clamp(2rem, 4vw, 3.5rem)","body":"1.125rem","font":"Helvetica, Arial, sans-serif"}',
  },
];

/* ------------------------------------------------------------------ */

const plan = infinitPrinterPlan;

const result = validatePlan(plan);
if (!result.ok) {
  console.error("Plan is invalid:");
  for (const e of result.errors) console.error("  -", e);
  process.exit(1);
}
if (result.skipped.length) {
  console.log("Skipped (no content):", result.skipped.join(", "));
}

const invented = findInventedPrices(plan);
if (invented.length) {
  console.error("Invented prices found:", invented.join(", "));
  process.exit(1);
}

const outDir = join(import.meta.dirname ?? ".", "out");
mkdirSync(outDir, { recursive: true });

for (const skin of SKINS) {
  const html = renderPage(plan, skin);
  const file = join(outDir, `${skin.id}.html`);
  writeFileSync(file, html, "utf8");
  console.log(`${skin.id.padEnd(24)} ${String(html.length).padStart(7)} bytes  ->  ${file}`);
}

console.log("\nOpen any file above in a browser.");
