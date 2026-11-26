/**
 * Content plan schema.
 *
 * The model returns ONLY this. No HTML, no CSS, no GSAP.
 * The renderer turns it into a page.
 *
 * Doctrine — this is a DEMO builder, not a consultation.
 *
 *   TYPICAL      What a business of this type actually does. Written freely
 *                from business_models, as the business's own copy. This is
 *                most of the page.
 *   PLACEHOLDER  A claim about THIS business that a demo cannot know — phone,
 *                email, address, names, review counts, licence numbers,
 *                prices. Written as an approved [token], never invented.
 *
 * A section whose required slots are absent is DROPPED from the page, not
 * rendered with holes. `renderableSections()` is the only thing that decides
 * what appears.
 *
 * Canonical order, ten sections:
 *   hero, services, process, proof, team, partners, guide, validations,
 *   door, footer
 *
 * hero is PENDING. When it is absent the page opens on services.
 */

/* ------------------------------------------------------------------ */
/* ids                                                                 */
/* ------------------------------------------------------------------ */

export type SectionId =
  | "hero"
  | "services"
  | "process"
  | "proof"
  | "team"
  | "partners"
  | "guide"
  | "validations"
  | "door"
  | "footer";

/** Canonical order. This is the only copy. */
export const SECTION_ORDER: SectionId[] = [
  "hero",
  "services",
  "process",
  "proof",
  "team",
  "partners",
  "guide",
  "validations",
  "door",
  "footer",
];

export const ACCENTS = ["red", "orange", "blue", "turquoise"] as const;
export type Accent = (typeof ACCENTS)[number];

/* ------------------------------------------------------------------ */
/* primitives                                                          */
/* ------------------------------------------------------------------ */

export interface Action {
  label: string;
  href: string;
}

export interface Fact {
  label: string;
  value: string;
}

export interface Image {
  src: string;
  alt: string;
}

/* ------------------------------------------------------------------ */
/* section content                                                     */
/* ------------------------------------------------------------------ */

/** PENDING. Do not invent a hero to satisfy a validator. */
export interface HeroContent {
  headline: string;
  statement: string;
  chip?: string;
  image?: { src: string; alt: string };
  actions: { primary: Action; secondary?: Action };
  proof?: { rating?: string; count?: string };
}

export interface ServicesContent {
  headline: string;
  statement: string;
  marquee: string[];
  flagship: {
    name: string;
    description: string;
    fact: Fact;
    image?: Image;
  };
  tiles: Array<{ name: string; description: string; fact: Fact }>;
  actions?: { primary: Action; secondary?: Action };
}

export interface ProcessContent {
  headline: string;
  statement: string;
  steps: Array<{ name: string; description: string; fact: Fact }>;
  actions?: { primary: Action };
}

export interface ProofContent {
  headline: string;
  statement: string;
  quote?: { text: string; name: string; location: string };
  stats?: Array<{ label: string; value: string; description: string }>;
  before_after?: { before: Image; after: Image };
  second_quote?: { text: string; rating: number };
  credentials?: { label: string; items: string[] };
}

export interface TeamContent {
  headline: string;
  statement: string;
  lead: { name: string; role: string; bio: string; photo?: Image };
  members?: Array<{ name: string; role: string; bio: string; photo?: Image }>;
}

export interface PartnersContent {
  headline: string;
  statement: string;
  marquee?: string[];
  featured: { name: string; what: string; description: string };
  tiles: Array<{
    name: string;
    what: string;
    type: "referral" | "supplier" | "collaborator";
  }>;
}

export interface GuideContent {
  headline: string;
  statement: string;
  items: Array<{ question: string; answer: string }>;
  actions?: { primary: Action };
}

export interface ValidationsContent {
  headline: string;
  statement: string;
  tiles: Array<{ type: string; label: string; description: string }>;
}

export interface DoorContent {
  headline: string;
  statement: string;
  contact: { phone: string; email: string };
  actions?: { primary: Action; secondary?: Action };
  form?: { fields: string[]; mailto: string };
}

export interface FooterContent {
  wordmark: string;
  links?: Action[];
  contact?: { phone?: string; email?: string };
  legal: string;
}

/* ------------------------------------------------------------------ */
/* plan                                                                */
/* ------------------------------------------------------------------ */

export interface SectionContentMap {
  hero: HeroContent;
  services: ServicesContent;
  process: ProcessContent;
  proof: ProofContent;
  team: TeamContent;
  partners: PartnersContent;
  guide: GuideContent;
  validations: ValidationsContent;
  door: DoorContent;
  footer: FooterContent;
}

export interface ContentPlan {
  version: 1;
  /** design_families.id — pins the build to an exact design system. */
  family: string;
  /** design_families.version */
  familyVersion: number;
  /** 0..3, the four windows. */
  variant: number;
  accent: Accent;
  businessName: string;
  /** Requested order. Use renderableSections() for what actually renders. */
  sections: SectionId[];
  content: Partial<SectionContentMap>;
}

/* ------------------------------------------------------------------ */
/* validation                                                          */
/* ------------------------------------------------------------------ */

export interface ValidationResult {
  ok: boolean;
  errors: string[];
  /** Sections that will render, in canonical order. */
  renderable: SectionId[];
  /** Sections requested but dropped for missing content. */
  dropped: SectionId[];
}

/**
 * Slots that must be present for a section to render at all.
 * Empty array means "the section's own guard decides" — see DROP_RULES.
 */
const REQUIRED_BY_SECTION: Record<SectionId, string[]> = {
  hero: ["headline", "statement"],
  services: ["headline", "statement", "marquee", "flagship"],
  process: ["headline", "statement", "steps"],
  proof: ["headline", "statement"],
  team: ["headline", "statement", "lead"],
  partners: ["headline", "statement", "featured", "tiles"],
  guide: ["headline", "statement", "items"],
  validations: ["headline", "statement", "tiles"],
  door: ["headline", "statement", "contact"],
  footer: ["wordmark", "legal"],
};

/** Minimum item counts. Below these, the section drops. */
const MIN_ITEMS: Partial<Record<SectionId, { field: string; min: number }>> = {
  services: { field: "tiles", min: 2 },
  process: { field: "steps", min: 3 },
  partners: { field: "tiles", min: 2 },
  guide: { field: "items", min: 3 },
  validations: { field: "tiles", min: 2 },
};

/** proof is the only section with an OR rule across its optional blocks. */
function proofHasEvidence(c: ProofContent | undefined): boolean {
  if (!c) return false;
  return Boolean(
    c.quote || c.stats?.length || c.credentials?.items?.length || c.before_after,
  );
}

function isEmpty(value: unknown): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value === "string") return !value.trim();
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value as object).length === 0;
  return false;
}

export function validatePlan(plan: unknown): ValidationResult {
  const errors: string[] = [];
  const renderable: SectionId[] = [];
  const dropped: SectionId[] = [];

  if (typeof plan !== "object" || plan === null) {
    return { ok: false, errors: ["plan is not an object"], renderable, dropped };
  }

  const p = plan as Partial<ContentPlan>;

  if (p.version !== 1) errors.push("version must be 1");
  if (typeof p.family !== "string" || !p.family.trim()) errors.push("family is required");
  if (typeof p.familyVersion !== "number") errors.push("familyVersion is required");
  if (typeof p.variant !== "number" || p.variant < 0 || p.variant > 3) {
    errors.push("variant must be 0..3");
  }
  if (!ACCENTS.includes(p.accent as Accent)) errors.push("accent must be one of " + ACCENTS.join(", "));
  if (typeof p.businessName !== "string" || !p.businessName.trim()) {
    errors.push("businessName is required");
  }

  let requested: SectionId[] = Array.isArray(p.sections) ? (p.sections as SectionId[]) : [];
  if (!requested.length) {
    requested = Object.keys((p.content ?? {}) as Record<string, unknown>)
      .filter((k) => SECTION_ORDER.includes(k as SectionId)) as SectionId[];
  }
  if (!requested.length) {
    errors.push("sections must be a non-empty array");
    return { ok: false, errors, renderable, dropped };
  }

  const seen = new Set<string>();
  for (const id of requested) {
    if (!SECTION_ORDER.includes(id as SectionId)) {
      errors.push(`unknown section id: ${id}`);
      continue;
    }
    if (seen.has(id)) errors.push(`duplicate section id: ${id}`);
    seen.add(id);
  }

  // Ordering: only relative position is enforced, never absolute presence.
  // hero is pending, so a page may legitimately open on services.
  const idx = (id: SectionId) => requested!.indexOf(id);
  if (idx("footer") !== -1 && idx("footer") !== requested.length - 1) {
    errors.push("footer must be last");
  }
  if (idx("hero") !== -1 && idx("hero") !== 0) {
    errors.push("hero must be first when present");
  }
  if (idx("services") !== -1 && idx("process") !== -1 && idx("services") > idx("process")) {
    errors.push("services must come before process");
  }
  if (idx("process") !== -1 && idx("proof") !== -1 && idx("process") > idx("proof")) {
    errors.push("process must come before proof");
  }
  if (idx("validations") !== -1) {
    const after = requested.slice(idx("validations") + 1);
    const bad = after.filter((s) => s !== "door" && s !== "footer");
    if (bad.length) errors.push("only door and footer may follow validations");
  }

  const content = (p.content ?? {}) as Record<string, unknown>;

  for (const id of SECTION_ORDER) {
    if (!requested.includes(id)) continue;

    const block = content[id] as Record<string, unknown> | undefined;
    const required = REQUIRED_BY_SECTION[id];

    // Missing required slots => drop, never error, never placeholder.
    const missing = required.filter((f) => isEmpty(block?.[f]));
    if (missing.length) {
      dropped.push(id);
      continue;
    }

    // Minimum item counts.
    const min = MIN_ITEMS[id];
    if (min) {
      const arr = block?.[min.field];
      if (!Array.isArray(arr) || arr.length < min.min) {
        dropped.push(id);
        continue;
      }
    }

    // proof needs at least one piece of evidence.
    if (id === "proof" && !proofHasEvidence(block as unknown as ProofContent)) {
      dropped.push(id);
      continue;
    }

    renderable.push(id);
  }

  return { ok: errors.length === 0, errors, renderable, dropped };
}

/** The sections that will actually render, in canonical order. */
export function renderableSections(plan: ContentPlan): SectionId[] {
  return validatePlan(plan).renderable;
}

/* ------------------------------------------------------------------ */
/* fabrication guards                                                  */
/* ------------------------------------------------------------------ */

/**
 * Approved placeholder tokens.
 *
 * A demo page is allowed to say "[phone]" because the client has not been
 * consulted yet. It is NOT allowed to say "[Add your phone]" or "[TBD]" —
 * those are holes, not tokens.
 */
export const PLACEHOLDER_TOKENS = [
  "phone",
  "email",
  "street address",
  "suburb",
  "address",
  "business hours",
  "owner name",
  "team member name",
  "years",
  "jobs completed",
  "review count",
  "rating",
  "licence number",
  "insurance",
  "price",
] as const;

const TOKEN_SET = new Set<string>(
  PLACEHOLDER_TOKENS.map((t) => t.toLowerCase()),
);

/**
 * Any [bracketed] text that is not an approved token is a hole.
 * Approved tokens are the client's own details, which a demo cannot know.
 */
export function findPlaceholders(plan: ContentPlan): string[] {
  const hits: string[] = [];

  const walk = (label: string, value: unknown) => {
    if (typeof value === "string") {
      const found = value.match(/\[[^\]]+\]/g);
      if (found) {
        for (const raw of found) {
          const token = raw.slice(1, -1).trim().toLowerCase();
          if (!TOKEN_SET.has(token)) hits.push(`${label}: ${raw}`);
        }
      }
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((v, i) => walk(`${label}[${i}]`, v));
      return;
    }
    if (value && typeof value === "object") {
      for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
        walk(`${label}.${k}`, v);
      }
    }
  };

  walk("content", plan.content);
  return hits;
}

/**
 * Rejects any dollar amount the client did not supply.
 * Scans every string in the plan, not just pricing — pricing is no longer
 * a page section, so the old narrow scan protected nothing.
 */
export function findInventedPrices(plan: ContentPlan): string[] {
  const hits: string[] = [];
  const money = /\$\s?\d/;

  const walk = (label: string, value: unknown) => {
    if (typeof value === "string") {
      if (money.test(value)) hits.push(label);
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((v, i) => walk(`${label}[${i}]`, v));
      return;
    }
    if (value && typeof value === "object") {
      for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
        walk(`${label}.${k}`, v);
      }
    }
  };

  walk("content", plan.content);
  return hits;
}
