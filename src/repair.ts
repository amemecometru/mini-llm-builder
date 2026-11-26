/**
 * Plan repair.
 *
 * Runs BEFORE validation. A plan that is 90% right should not fail a build,
 * so this fixes structural faults — wrong container types, stringified
 * arrays, numbers where strings belong, "desc" where "description" belongs —
 * and reports what it touched.
 *
 * It never invents content. If a field is missing it stays missing, and the
 * section drops. Repair is about shape, not about filling holes.
 */

import type { SectionId } from "./content";
import { SECTION_ORDER } from "./content";

export interface RepairContext {
  businessName: string;
  businessModel: string;
}

export interface RepairResult {
  plan: Record<string, unknown>;
  repairs: string[];
}

/* ------------------------------------------------------------------ */
/* primitives                                                          */
/* ------------------------------------------------------------------ */

const isObj = (v: unknown): v is Record<string, unknown> =>
  Boolean(v) && typeof v === "object" && !Array.isArray(v);

/** "a, b, c" or '["a","b"]' or a single object -> array */
function toArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    const s = value.trim();
    if (!s) return [];
    if (s.startsWith("[")) {
      try {
        const parsed = JSON.parse(s);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        /* fall through to comma split */
      }
    }
    return s.split(/\s*,\s*/).filter(Boolean);
  }
  if (isObj(value)) return [value];
  return [];
}

/** Anything -> trimmed string. Objects and arrays are never stringified. */
function toStr(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return "";
}

/** First non-empty string among the given keys. */
function pick(obj: Record<string, unknown>, ...keys: string[]): string {
  for (const k of keys) {
    const v = toStr(obj[k]);
    if (v) return v;
  }
  return "";
}

function toFact(value: unknown): { label: string; value: string } | null {
  if (isObj(value)) {
    const label = pick(value, "label", "name", "key", "title");
    const val = pick(value, "value", "text", "amount", "detail");
    if (label || val) return { label, value: val };
    return null;
  }
  if (typeof value === "string" && value.trim()) {
    const s = value.trim();
    // "Glass · 10mm tempered" -> split on the first separator
    const m = /^(.{1,24}?)\s*[·:—–-]\s*(.+)$/.exec(s);
    if (m) return { label: m[1].trim(), value: m[2].trim() };
    return { label: "", value: s };
  }
  return null;
}

function toImage(value: unknown): { src: string; alt: string } | null {
  if (isObj(value)) {
    const src = pick(value, "src", "url", "image");
    if (!src) return null;
    return { src, alt: toStr(value.alt) };
  }
  if (typeof value === "string" && value.trim()) {
    return { src: value.trim(), alt: "" };
  }
  return null;
}

/** Attach a fact only when one survived — never emit an empty object. */
function withFact<T extends Record<string, unknown>>(base: T, fact: unknown): T {
  const f = toFact(fact);
  return f ? ({ ...base, fact: f } as T) : base;
}

function withImage<T extends Record<string, unknown>>(base: T, image: unknown): T {
  const i = toImage(image);
  return i ? ({ ...base, image: i } as T) : base;
}

/* ------------------------------------------------------------------ */
/* sections                                                            */
/* ------------------------------------------------------------------ */

function normaliseSections(raw: unknown, repairs: string[]): SectionId[] {
  const list = toArray(raw)
    .map((s) => toStr(s).toLowerCase().replace(/[\s_]+/g, "-"))
    .filter(Boolean);

  const seen = new Set<SectionId>();
  const out: SectionId[] = [];

  for (const id of list) {
    if (!SECTION_ORDER.includes(id as SectionId)) {
      repairs.push(`dropped unknown section "${id}"`);
      continue;
    }
    if (seen.has(id as SectionId)) {
      repairs.push(`dropped duplicate section "${id}"`);
      continue;
    }
    seen.add(id as SectionId);
    out.push(id as SectionId);
  }

  out.sort((a, b) => SECTION_ORDER.indexOf(a) - SECTION_ORDER.indexOf(b));
  return out;
}

function repairHero(block: unknown): Record<string, unknown> | null {
  if (!isObj(block)) return null;
  return {
    headline: pick(block, "headline", "title"),
    statement: pick(block, "statement", "subline", "subheadline"),
  };
}

function repairServices(block: unknown, repairs: string[]): Record<string, unknown> | null {
  if (!isObj(block)) return null;

  const out: Record<string, unknown> = {
    headline: pick(block, "headline", "title"),
    statement: pick(block, "statement", "intro", "description"),
    marquee: toArray(block.marquee ?? block.keywords).map(toStr).filter(Boolean),
  };

  const flagshipRaw = isObj(block.flagship)
    ? block.flagship
    : isObj(block.featured)
      ? block.featured
      : null;

  if (flagshipRaw) {
    const name = pick(flagshipRaw, "name", "title");
    if (name) {
      let flagship: Record<string, unknown> = {
        name,
        description: pick(flagshipRaw, "description", "desc", "body"),
      };
      flagship = withFact(flagship, flagshipRaw.fact ?? flagshipRaw.detail);
      flagship = withImage(flagship, flagshipRaw.image ?? flagshipRaw.photo);
      out.flagship = flagship;
    }
  }

  const tiles = toArray(block.tiles ?? block.services ?? block.items)
    .map((t) => {
      if (!isObj(t)) {
        const name = toStr(t);
        return name ? { name, description: "" } : null;
      }
      const name = pick(t, "name", "title");
      if (!name) return null;
      return withFact(
        { name, description: pick(t, "description", "desc", "body") },
        t.fact ?? t.detail,
      );
    })
    .filter(Boolean);

  out.tiles = tiles;

  if (!out.flagship && tiles.length) {
    // Promote the first tile rather than render a section with no flagship.
    const [first, ...rest] = tiles as Record<string, unknown>[];
    out.flagship = first;
    out.tiles = rest;
    repairs.push("services: promoted first tile to flagship");
  }

  if (!out.flagship) repairs.push("services: no flagship, section will drop");
  if (!(out.marquee as string[]).length) {
    const names = [out.flagship, ...(out.tiles as unknown[])]
      .filter(isObj)
      .map((t) => toStr((t as Record<string, unknown>).name))
      .filter(Boolean);
    if (names.length) {
      out.marquee = names;
      repairs.push("services: marquee built from service names");
    }
  }

  return out;
}

function repairProcess(block: unknown, repairs: string[]): Record<string, unknown> | null {
  if (!isObj(block)) return null;

  const steps = toArray(block.steps ?? block.items)
    .map((s) => {
      if (!isObj(s)) {
        const name = toStr(s);
        return name ? { name, description: "" } : null;
      }
      const name = pick(s, "name", "title");
      if (!name) return null;
      return withFact(
        { name, description: pick(s, "description", "desc", "body") },
        s.fact ?? s.detail,
      );
    })
    .filter(Boolean);

  if (!steps.length) repairs.push("process: no steps survived");
  return {
    headline: pick(block, "headline", "title"),
    statement: pick(block, "statement", "intro"),
    steps,
  };
}

function repairProof(block: unknown, repairs: string[]): Record<string, unknown> | null {
  if (!isObj(block)) return null;

  const out: Record<string, unknown> = {
    headline: pick(block, "headline", "title"),
    statement: pick(block, "statement", "intro"),
  };

  const quoteRaw = isObj(block.quote)
    ? block.quote
    : isObj(block.testimonial)
      ? block.testimonial
      : null;

  if (quoteRaw) {
    const text = pick(quoteRaw, "text", "quote", "body");
    if (text) {
      out.quote = {
        text,
        name: pick(quoteRaw, "name", "who", "author"),
        location: pick(quoteRaw, "location", "where", "suburb"),
      };
    }
  }

  const stats = toArray(block.stats)
    .map((s) => {
      if (!isObj(s)) return null;
      const value = pick(s, "value", "number", "figure");
      if (!value) return null;
      return {
        label: pick(s, "label", "name"),
        value,
        description: pick(s, "description", "desc", "note"),
      };
    })
    .filter(Boolean)
    .slice(0, 2);
  if (stats.length) out.stats = stats;

  if (isObj(block.credentials)) {
    const items = toArray(block.credentials.items ?? block.credentials.list)
      .map(toStr)
      .filter(Boolean);
    if (items.length) {
      out.credentials = {
        label: pick(block.credentials, "label", "name") || "Credentials",
        items,
      };
    }
  }

  if (isObj(block.before_after)) {
    const before = toImage(block.before_after.before);
    const after = toImage(block.before_after.after);
    if (before && after) out.before_after = { before, after };
  }

  const secondRaw = isObj(block.second_quote) ? block.second_quote : null;
  if (secondRaw) {
    const text = pick(secondRaw, "text", "quote");
    if (text) {
      const rating = Number(secondRaw.rating);
      out.second_quote = {
        text,
        rating: Number.isFinite(rating)
          ? Math.max(0, Math.min(5, Math.round(rating)))
          : 0,
      };
    }
  }

  const hasEvidence =
    out.quote || out.stats || out.credentials || out.before_after || out.second_quote;
  if (!hasEvidence) repairs.push("proof: no evidence survived, section will drop");

  return out;
}

function repairTeam(block: unknown, repairs: string[]): Record<string, unknown> | null {
  if (!isObj(block)) return null;

  const person = (p: unknown) => {
    if (!isObj(p)) {
      const name = toStr(p);
      return name ? { name, role: "", bio: "" } : null;
    }
    const name = pick(p, "name", "title");
    if (!name) return null;
    const photo = toImage(p.photo ?? p.image);
    return {
      name,
      role: pick(p, "role", "title", "position"),
      bio: pick(p, "bio", "note", "description", "desc"),
      ...(photo ? { photo } : {}),
    };
  };

  const lead = person(block.lead ?? block.owner ?? block.founder);
  if (!lead) repairs.push("team: no lead survived, section will drop");

  const members = toArray(block.members ?? block.people ?? block.team)
    .map(person)
    .filter(Boolean)
    .slice(0, 5);

  return {
    headline: pick(block, "headline", "title"),
    statement: pick(block, "statement", "intro"),
    ...(lead ? { lead } : {}),
    ...(members.length ? { members } : {}),
  };
}

function repairPartners(block: unknown, repairs: string[]): Record<string, unknown> | null {
  if (!isObj(block)) return null;

  const featuredRaw = isObj(block.featured) ? block.featured : null;
  const featured = featuredRaw
    ? {
        name: pick(featuredRaw, "name", "title"),
        what: pick(featuredRaw, "what", "role", "type"),
        description: pick(featuredRaw, "description", "desc", "body"),
      }
    : null;

  const tiles = toArray(block.tiles ?? block.partners ?? block.items)
    .map((t) => {
      if (!isObj(t)) {
        const name = toStr(t);
        return name ? { name, what: "", type: "collaborator" } : null;
      }
      const name = pick(t, "name", "title");
      if (!name) return null;
      const type = toStr(t.type).toLowerCase();
      return {
        name,
        what: pick(t, "what", "role", "description", "desc"),
        type: ["referral", "supplier", "collaborator"].includes(type)
          ? type
          : "collaborator",
      };
    })
    .filter(Boolean);

  if (!featured?.name) repairs.push("partners: no featured partner, section will drop");
  if (!tiles.length) repairs.push("partners: no tiles survived, section will drop");

  const marquee = toArray(block.marquee).map(toStr).filter(Boolean);

  return {
    headline: pick(block, "headline", "title"),
    statement: pick(block, "statement", "intro"),
    ...(marquee.length ? { marquee } : {}),
    ...(featured?.name ? { featured } : {}),
    tiles,
  };
}

function repairGuide(block: unknown, repairs: string[]): Record<string, unknown> | null {
  if (!isObj(block)) return null;

  const items = toArray(block.items ?? block.faq ?? block.questions)
    .map((f) => {
      if (!isObj(f)) return null;
      const question = pick(f, "question", "q", "title");
      const answer = pick(f, "answer", "a", "body");
      // A question with no answer is a hole in a paid page. Drop it.
      if (!question || !answer) return null;
      return { question, answer };
    })
    .filter(Boolean);

  if (!items.length) repairs.push("guide: no answered questions survived");
  return {
    headline: pick(block, "headline", "title"),
    statement: pick(block, "statement", "intro"),
    items,
  };
}

function repairValidations(block: unknown, repairs: string[]): Record<string, unknown> | null {
  if (!isObj(block)) return null;

  const tiles = toArray(block.tiles ?? block.items ?? block.validations)
    .map((v) => {
      if (!isObj(v)) {
        const label = toStr(v);
        return label ? { type: "Credential", label, description: "" } : null;
      }
      const label = pick(v, "label", "name", "title");
      if (!label) return null;
      return {
        type: pick(v, "type", "kind") || "Credential",
        label,
        description: pick(v, "description", "desc", "body"),
      };
    })
    .filter(Boolean);

  if (!tiles.length) repairs.push("validations: no tiles survived");
  return {
    headline: pick(block, "headline", "title"),
    statement: pick(block, "statement", "intro"),
    tiles,
  };
}

function repairDoor(block: unknown, repairs: string[]): Record<string, unknown> | null {
  if (!isObj(block)) return null;

  const contactRaw = isObj(block.contact) ? block.contact : {};
  const phone = pick(contactRaw, "phone", "tel") || pick(block, "phone", "telephone");
  const email = pick(contactRaw, "email", "mail") || pick(block, "email");

  if (!phone && !email) repairs.push("door: no contact details, section will drop");

  return {
    headline: pick(block, "headline", "title", "heading"),
    statement: pick(block, "statement", "intro"),
    contact: { phone, email },
  };
}

function repairFooter(block: unknown, ctx: RepairContext): Record<string, unknown> | null {
  if (!isObj(block)) return null;
  const wordmark = pick(block, "wordmark", "name") || ctx.businessName;
  if (!wordmark) return null;
  return {
    wordmark,
    legal:
      pick(block, "legal", "copyright") ||
      `© ${new Date().getFullYear()} ${wordmark}`,
  };
}

/* ------------------------------------------------------------------ */
/* entry                                                               */
/* ------------------------------------------------------------------ */

export function repairPlan(parsed: unknown, ctx: RepairContext): RepairResult {
  const repairs: string[] = [];

  if (!isObj(parsed)) {
    return { plan: {}, repairs: ["plan was not an object"] };
  }

  const plan: Record<string, unknown> = { ...parsed };

  if (plan.version !== 1) {
    plan.version = 1;
    repairs.push("version coerced to 1");
  }

  const businessName = toStr(plan.businessName) || ctx.businessName;
  if (businessName !== plan.businessName) repairs.push("businessName filled from input");
  plan.businessName = businessName;

  const sections = normaliseSections(plan.sections, repairs);
  plan.sections = sections;

  const rawContent = isObj(plan.content) ? plan.content : {};
  if (!isObj(plan.content)) repairs.push("content was not an object");

  const content: Record<string, unknown> = {};

  for (const id of sections) {
    const block = rawContent[id];
    let repaired: Record<string, unknown> | null = null;

    switch (id) {
      case "hero":
        repaired = repairHero(block);
        break;
      case "services":
        repaired = repairServices(block, repairs);
        break;
      case "process":
        repaired = repairProcess(block, repairs);
        break;
      case "proof":
        repaired = repairProof(block, repairs);
        break;
      case "team":
        repaired = repairTeam(block, repairs);
        break;
      case "partners":
        repaired = repairPartners(block, repairs);
        break;
      case "guide":
        repaired = repairGuide(block, repairs);
        break;
      case "validations":
        repaired = repairValidations(block, repairs);
        break;
      case "door":
        repaired = repairDoor(block, repairs);
        break;
      case "footer":
        repaired = repairFooter(block, ctx);
        break;
      default:
        repaired = null;
    }

    if (repaired) content[id] = repaired;
    else repairs.push(`${id}: block missing or unrepairable`);
  }

  plan.content = content;

  // The builder owns these, never the model.
  delete plan.family;
  delete plan.familyVersion;
  delete plan.variant;
  delete plan.accent;

  return { plan, repairs };
}
