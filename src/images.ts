/**
 * Stock image library.
 *
 * The model writes copy, never URLs. attachImages() runs after a plan
 * validates and assigns a photo to each visual slot by role, seeded from the
 * business name so a build is reproducible and the four windows differ.
 *
 * A slot with no matching photo stays absent — sections.ts already falls back
 * to a colour field, which DESIGN.md requires over an empty slot.
 */
import type { ContentPlan } from "./content";

export interface StockImage {
  id: string;
  url: string;
  alt: string;
  role: string;
  tag: string;
  credit: string;
}

/** FNV-1a. Stable across runs, no dependency. */
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick(
  library: StockImage[],
  role: string,
  tag: string,
  seed: string,
): StockImage | null {
  const byRole = library.filter((i) => i.role === role);
  if (!byRole.length) return null;
  const tagged = byRole.filter((i) => i.tag === tag);
  const pool = tagged.length ? tagged : byRole;
  return pool[hash(seed) % pool.length];
}

const toImage = (i: StockImage) => ({ src: i.url, alt: i.alt || "" });

export function attachImages(
  plan: ContentPlan,
  library: StockImage[],
  opts: { seed: string; tag: string },
): ContentPlan {
  if (!library.length) return plan;

  const out = JSON.parse(JSON.stringify(plan)) as ContentPlan;
  const c = out.content as Record<string, any>;

  const put = (slot: any, role: string, key: string) => {
    if (!slot || slot.image || slot.photo) return;
    const img = pick(library, role, opts.tag, `${opts.seed}:${key}`);
    if (!img) return;
    if (role === "person") slot.photo = toImage(img);
    else slot.image = toImage(img);
  };

  if (c.hero) put(c.hero, "hero", "hero");

  if (c.services) {
    put(c.services.flagship, "work", "services:flagship");
    (c.services.tiles ?? []).forEach((t: any, i: number) =>
      put(t, "work", `services:tile:${i}`),
    );
  }

  if (c.team) {
    put(c.team.lead, "person", "team:lead");
    (c.team.members ?? []).forEach((m: any, i: number) =>
      put(m, "person", `team:member:${i}`),
    );
  }

  if (c.proof?.before_after) {
    const before = pick(library, "before", opts.tag, `${opts.seed}:ba:before`);
    const after = pick(library, "after", opts.tag, `${opts.seed}:ba:after`);
    if (before) c.proof.before_after.before = toImage(before);
    if (after) c.proof.before_after.after = toImage(after);
  }

  return out;
}
