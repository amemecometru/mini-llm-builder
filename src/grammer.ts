/**
 * grammar.ts — the details file as data.
 *
 * DESIGN-<family>-details.md states the image count of every section on one
 * line, in one format, every time:
 *
 *   Image count: 1 image (the hero photo tile).
 *   Image count: 1 image on the flagship tile, ... for a maximum of 6 images ...
 *   Image count: 0 photos.
 *
 * That line is the only thing parsed. Pills and buttons stay in sections.ts —
 * they are renderer concerns and prose is not a reliable source for them.
 *
 * A section that forbids stock imagery ("never a stock face", "never a stock
 * mark") is marked stock:false and attachImages will not touch it.
 */

export interface SectionSlots {
  images: { min: number; max: number };
  /** false when the design forbids stock imagery in this section. */
  stock: boolean;
}

export type SlotMap = Record<string, SectionSlots>;

const SECTIONS = [
  "header", "hero", "services", "process", "proof",
  "team", "partners", "guide", "validations", "door", "footer",
] as const;

const STOCK_FORBIDDEN = [
  /never a stock face/i,
  /never use a stock photo of a fake person/i,
  /never a stock mark/i,
  /never use a stock logo/i,
  /never a stock image/i,
];

/** Bento Noir, from DESIGN-bento-noir-details.md. Used when D1 has no grammar. */
export const DEFAULT_SLOTS: SlotMap = {
  header:      { images: { min: 0, max: 0 }, stock: false },
  hero:        { images: { min: 1, max: 1 }, stock: true },
  services:    { images: { min: 1, max: 6 }, stock: true },
  process:     { images: { min: 0, max: 0 }, stock: true },
  proof:       { images: { min: 2, max: 2 }, stock: true },
  team:        { images: { min: 1, max: 6 }, stock: false },
  partners:    { images: { min: 0, max: 0 }, stock: false },
  guide:       { images: { min: 0, max: 0 }, stock: true },
  validations: { images: { min: 0, max: 0 }, stock: true },
  door:        { images: { min: 0, max: 0 }, stock: true },
  footer:      { images: { min: 0, max: 0 }, stock: true },
};

export function parseSlots(detailsMd: string): SlotMap {
  const out: SlotMap = {};
  const text = String(detailsMd ?? "").replace(/\r\n/g, "\n");

  for (const part of text.split(/^##\s+/m).slice(1)) {
    const nl = part.indexOf("\n");
    const heading = (nl === -1 ? part : part.slice(0, nl)).trim().toLowerCase();
    const body = nl === -1 ? "" : part.slice(nl + 1);

    if (!(SECTIONS as readonly string[]).includes(heading)) continue;

    const minM = /Image count:\s*(\d+)\s*(?:image|photo)/i.exec(body);
    const maxM = /maximum of\s*(\d+)\s*image/i.exec(body);

    let min = minM ? Number(minM[1]) : 0;
    let max = maxM ? Number(maxM[1]) : min;

    // "The header holds no image." — stated in prose, not as a count.
    if (!minM && /holds no (?:image|photo)/i.test(body)) {
      min = 0;
      max = 0;
    }
    if (max < min) max = min;

    out[heading] = {
      images: { min, max },
      stock: !STOCK_FORBIDDEN.some((re) => re.test(body)),
    };
  }

  return out;
}

/** Total stock photos a page can draw, for budgeting the library. */
export function stockBudget(slots: SlotMap): { min: number; max: number } {
  let min = 0;
  let max = 0;
  for (const s of Object.values(slots)) {
    if (!s.stock) continue;
    min += s.images.min;
    max += s.images.max;
  }
  return { min, max };
}
