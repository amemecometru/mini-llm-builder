/**
 * Placeholder repair.
 *
 * The model sometimes writes a bracketed DESCRIPTION of a value instead of
 * the value — "[businessName]", "[Partner Name]", "[list of file formats]".
 * Those are holes, not tokens, and they fail the build.
 *
 * Two passes:
 *   1. Substitute the values we can know: the business name, the year.
 *   2. Drop any section that still contains an unapproved bracket, so the
 *      page renders without it instead of failing the whole build.
 *
 * This turns a 502 into a page. A page missing team and partners is a page.
 */
import { PLACEHOLDER_TOKENS, SECTION_ORDER, type SectionId } from "./content";

const APPROVED = new Set<string>(
  PLACEHOLDER_TOKENS.map((t) => t.toLowerCase()),
);
const BRACKET = /\[[^\]]+\]/g;

function unapproved(value: unknown): string[] {
  if (typeof value === "string") {
    const found = value.match(BRACKET) ?? [];
    return found.filter(
      (raw) => !APPROVED.has(raw.slice(1, -1).trim().toLowerCase()),
    );
  }
  if (Array.isArray(value)) return value.flatMap(unapproved);
  if (value && typeof value === "object") {
    return Object.values(value).flatMap(unapproved);
  }
  return [];
}

function substitute(value: unknown, businessName: string, year: string): unknown {
  if (typeof value === "string") {
    return value
      .replace(/\[\s*business\s*name\s*\]/gi, businessName)
      .replace(/\[\s*year\s*\]/gi, year);
  }
  if (Array.isArray(value)) {
    return value.map((v) => substitute(v, businessName, year));
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = substitute(v, businessName, year);
    }
    return out;
  }
  return value;
}

export interface PlaceholderRepairResult {
  plan: any;
  dropped: SectionId[];
}

export function repairPlaceholders(
  plan: any,
  opts: { businessName: string },
): PlaceholderRepairResult {
  const year = String(new Date().getFullYear());
  const out = JSON.parse(JSON.stringify(plan ?? {}));

  // Pass 1 — substitute the values we can know.
  out.content = substitute(out.content ?? {}, opts.businessName, year);
  if (!out.businessName) out.businessName = opts.businessName;

  // Pass 2 — drop any section that still has an unapproved bracket.
  const dropped: SectionId[] = [];
  const content = out.content ?? {};

  for (const id of SECTION_ORDER) {
    if (!(id in content)) continue;
    if (unapproved(content[id]).length) {
      delete content[id];
      dropped.push(id);
    }
  }

  if (Array.isArray(out.sections)) {
    out.sections = out.sections.filter((id: SectionId) => !dropped.includes(id));
  }

  return { plan: out, dropped };
}
