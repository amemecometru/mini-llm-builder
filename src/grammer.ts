/**
 * grammar.ts — the details file as data.
 *
 * DESIGN-DETAILS-002.md states the image count of every section on one
 * line, in one format, every time:
 *
 *   Image count: 3 images, for a maximum of 8 images in the section and a minimum of 3 images.
 *   Image count: 3 images on the flagship and first tiles, plus 1 image per remaining tile that has a photo, for a maximum of 6 images ...
 *   Image count: 0 photos.
 *
 * That line is the only thing parsed. Pills and buttons stay in sections.ts —
 * they are renderer concerns and prose is not a reliable source for them.
 *
 * Pre-Consultation: placeholder images are expected, 25% to 40% of the
 * page, in the business context and the design components. A section is
 * never marked stock:false for using a placeholder image. The old
 * "never a stock face" / "never a stock mark" bans belonged to the
 * Consultation layer, where real photos were required; they do not apply
 * here. A placeholder person is a role, not a named real person, and a
 * placeholder partner mark is a business type, never a real company's
 * logo — that rule lives in the design files and in prompt.ts, not in
 * this parser. The only sections with stock:false are the ones with no
 * image slots at all.
 */

export interface SectionSlots {
  images: { min: number; max: number };
  /** false when the section has no image slots at all. */
  stock: boolean;
}

export type SlotMap = Record<string, SectionSlots>;

const SECTIONS = [
  "header", "hero", "services", "process", "proof",
  "team", "partners", "guide", "validations", "door", "footer",
] as const;

/** Bento Noir, from DESIGN-DETAILS-002.md. Used when D1 has no grammar. */
export const DEFAULT_SLOTS: SlotMap = {
  header:      { images: { min: 0, max: 0 }, stock: false },
  hero:        { images: { min: 3, max: 8 }, stock: true },
  services:    { images: { min: 3, max: 6 }, stock: true },
  process:     { images: { min: 4, max: 8 }, stock: true },
  proof:       { images: { min: 2, max: 6 }, stock: true },
  team:        { images: { min: 1, max: 6 }, stock: true },
  partners:    { images: { min: 0, max: 0 }, stock: false },
  guide:       { images: { min: 0, max: 6 }, stock: true },
  validations: { images: { min: 0, max: 6 }, stock: true },
  door:        { images: { min: 0, max: 0 }, stock: false },
  footer:      { images: { min: 0, max: 0 }, stock: false },
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
      // Pre-Consultation: a section with image slots may use placeholder
      // images. Only a section with no slots at all is stock:false.
      stock: max > 0,
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
