/**
 * Generation orchestration.
 *
 *   D1 lookups  ->  prompt  ->  model  ->  parse  ->  repair  ->  validate
 *               ->  one plan  ->  four variant directives  ->  four renders
 *
 * The model runs ONCE per build. The four windows differ by directive
 * (accent, variant index), not by a second model call.
 *
 * Photos are attached AFTER the plan validates, from stock_images. The model
 * never sees a URL, so it cannot invent one.
 *
 * Nothing here writes HTML from model output.
 */

import {
  validatePlan,
  findPlaceholders,
  findInventedPrices,
  type Accent,
  type ContentPlan,
  type SectionContentMap,
  type SectionId,
} from "./content";
import { SYSTEM_PROMPT, buildUserPrompt, extractJson, type PlanInput } from "./prompt";
import { repairPlan } from "./repair";
import { repairPlaceholders } from "./placeholder-repair";
import { attachImages } from "./images";
import { loadStockImages } from "./db";

export const MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
export const MAX_TOKENS = 8192;
export const TEMPERATURE = 0.7;

export interface Env {
  AI: Ai;
  DB: D1Database;
}

export interface GenerateInput {
  businessName: string;
  businessModel: string;
  extra?: string;
  businessBrief?: string;
  /** design_families.id. Defaults to the first live family. */
  familyId?: string;
}

export interface DesignFamily {
  id: string;
  version: number;
  name: string;
  tokens: Record<string, unknown>;
  sectionOrder: SectionId[];
  /** Prose from designs/<family>/DESIGN.md. Empty when the family has none. */
  designMd: string;
}

export interface GenerateMeta {
  familyId: string;
  familyVersion: number;
  matchedModel: string | null;
  bestScore: number;
  ms: number;
  retried: boolean;
  renderable: SectionId[];
  dropped: SectionId[];
}

export interface BuiltVariant {
  variant: number;
  accent: Accent;
  plan: ContentPlan;
}

export interface GenerateManyResult {
  variants: BuiltVariant[];
  meta: GenerateMeta;
}

export class GenerateError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly detail?: unknown,
  ) {
    super(message);
    this.name = "GenerateError";
  }
}

/* ------------------------------------------------------------------ */
/* D1 — design families                                                */
/* ------------------------------------------------------------------ */

const FAMILY_COLS = "id, version, name, tokens, section_order, design_md";

interface FamilyRow {
  id: string;
  version: number;
  name: string;
  tokens: string | null;
  section_order: string | null;
  design_md: string | null;
}

function toFamily(row: FamilyRow): DesignFamily {
  let tokens: Record<string, unknown> = {};
  let sectionOrder: SectionId[] = [];
  try {
    tokens = JSON.parse(row.tokens || "{}");
  } catch {
    tokens = {};
  }
  try {
    sectionOrder = JSON.parse(row.section_order || "[]");
  } catch {
    sectionOrder = [];
  }
  return {
    id: row.id,
    version: row.version,
    name: row.name,
    tokens,
    sectionOrder,
    designMd: row.design_md ?? "",
  };
}

async function loadFamily(env: Env, familyId?: string): Promise<DesignFamily> {
  const row = familyId
    ? await env.DB.prepare(`SELECT ${FAMILY_COLS} FROM live_design_families WHERE id = ?`)
        .bind(familyId)
        .first<FamilyRow>()
    : await env.DB.prepare(`SELECT ${FAMILY_COLS} FROM live_design_families ORDER BY id LIMIT 1`)
        .first<FamilyRow>();

  if (!row) {
    throw new GenerateError(
      familyId
        ? `No live design family "${familyId}".`
        : "No live design families in D1. Seed design_families first.",
      500,
    );
  }
  return toFamily(row);
}

async function loadAllFamilies(env: Env): Promise<DesignFamily[]> {
  const res = await env.DB.prepare(`SELECT ${FAMILY_COLS} FROM live_design_families ORDER BY id`)
    .all<FamilyRow>();
  const rows = res.results ?? [];
  if (!rows.length) {
    throw new GenerateError("No live design families in D1. Seed design_families first.", 500);
  }
  return rows.map(toFamily);
}

/* ------------------------------------------------------------------ */
/* D1 — business models                                                */
/* ------------------------------------------------------------------ */

interface TemplateRow {
  id: string;
  name: string;
  typical_services: string | null;
  typical_process: string | null;
  typical_pricing: string | null;
  typical_faq: string | null;
  door_type: string | null;
  notes: string | null;
  tone: string | null;
  trust_signals: string | null;
  customer_worries: string | null;
  cta_language: string | null;
  sections_priority: string | null;
  proof_types: string | null;
}

async function matchBusinessModel(
  env: Env,
  searchText: string,
): Promise<{ template: TemplateRow | null; bestScore: number }> {
  const all = await env.DB
    .prepare("SELECT id, name, keywords FROM business_models")
    .all<{ id: string; name: string; keywords: string | null }>();

  let bestId: string | null = null;
  let bestScore = 0;

  for (const row of all.results ?? []) {
    let keywords: string[] = [];
    try {
      keywords = JSON.parse(row.keywords || "[]");
    } catch {
      keywords = [];
    }

    let score = 0;
    for (const kw of keywords) {
      if (typeof kw === "string" && kw && searchText.includes(kw.toLowerCase())) score++;
    }

    if (score > bestScore) {
      bestScore = score;
      bestId = row.id;
    }
  }

  if (!bestId) return { template: null, bestScore: 0 };

  const template = await env.DB
    .prepare(
      `SELECT id, name, typical_services, typical_process, typical_pricing,
              typical_faq, door_type, notes, tone, trust_signals,
              customer_worries, cta_language, sections_priority, proof_types
         FROM business_models WHERE id = ?`,
    )
    .bind(bestId)
    .first<TemplateRow>();

  return { template: template ?? null, bestScore };
}

/* ------------------------------------------------------------------ */
/* model                                                               */
/* ------------------------------------------------------------------ */

async function callModel(env: Env, userPrompt: string): Promise<string> {
  const res = (await env.AI.run(MODEL as never, {
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    max_tokens: MAX_TOKENS,
    temperature: TEMPERATURE,
  })) as any;

  const candidates = [
    res?.response,
    res?.result?.response,
    res?.choices?.[0]?.message?.content,
    res?.result?.choices?.[0]?.message?.content,
  ];
  const raw = candidates.find((c) => typeof c === "string" && c.trim()) ?? "";

  if (!raw) {
    console.error("empty model response", {
      model: MODEL,
      keys: res && typeof res === "object" ? Object.keys(res) : typeof res,
      sample: JSON.stringify(res).slice(0, 600),
    });
    throw new GenerateError("The model returned an empty response. Model: " + MODEL, 502);
  }

  return raw;
}

/* ------------------------------------------------------------------ */
/* plan                                                                */
/* ------------------------------------------------------------------ */

const ACCENT_ROTATION: Accent[] = ["red", "orange", "blue", "turquoise"];

interface BasePlan {
  businessName: string;
  sections: SectionId[];
  content: Partial<SectionContentMap>;
}

async function buildBasePlan(
  env: Env,
  input: GenerateInput,
  family: DesignFamily,
): Promise<{ base: BasePlan; meta: Omit<GenerateMeta, "renderable" | "dropped"> }> {
  const started = Date.now();

  const businessName = input.businessName?.trim() || "Untitled Business";
  const businessModel = input.businessModel?.trim() || "local service business";
  const extra = input.extra?.trim() || "";
  const businessBrief = input.businessBrief?.trim() || "";

  const searchText = `${businessName} ${businessModel} ${extra}`.toLowerCase();
  const { template, bestScore } = await matchBusinessModel(env, searchText);

  if (!template) console.warn("no business model matched", { searchText, bestScore });

  const planInput: PlanInput = {
    businessName,
    businessModel,
    extra,
    businessBrief,
    template,
    sectionOrder: family.sectionOrder,
    designMd: family.designMd,
  };
  const userPrompt = buildUserPrompt(planInput);

  let base: BasePlan | null = null;
  let retried = false;
  let lastError: unknown = null;

  for (let attempt = 0; attempt < 2; attempt++) {
    const raw = await callModel(env, userPrompt);

    try {
      const parsed = extractJson(raw);

      // Repair shape before validating. A plan that is 90% right should not
      // fail the build.
      const { plan: repaired, repairs } = repairPlan(parsed, { businessName, businessModel });
      if (repairs.length) console.warn("plan repaired", repairs);

      // Placeholder repair. The model sometimes writes a bracketed
      // DESCRIPTION of a value instead of the value — "[businessName]",
      // "[Partner Name]", "[list of file formats]". Substitute what we can
      // know, drop the sections we cannot. A page missing team and partners
      // is a page; a 502 is not.
      const { plan: cleaned, dropped } = repairPlaceholders(repaired, { businessName });
      if (dropped.length) {
        console.warn("sections dropped for unapproved placeholders", dropped);
      }

      // Assemble a full plan so the shared validators can run on it.
      const candidate: ContentPlan = {
        version: 1,
        family: family.id,
        familyVersion: family.version,
        variant: 0,
        accent: ACCENT_ROTATION[0],
        businessName,
        sections: (cleaned as any).sections ?? family.sectionOrder,
        content: (cleaned as any).content ?? {},
      };

      const result = validatePlan(candidate);

      if (!result.ok) {
        lastError = { errors: result.errors, repairs, raw: raw.slice(0, 700) };
        console.warn("plan validation failed", { attempt, errors: result.errors });
        retried = attempt === 0;
        continue;
      }

      const holes = findPlaceholders(candidate);
      if (holes.length) {
        lastError = { holes };
        console.warn("unapproved placeholder text rejected", { attempt, holes });
        retried = attempt === 0;
        continue;
      }

      const invented = findInventedPrices(candidate);
      if (invented.length) {
        lastError = { invented };
        console.warn("invented prices rejected", { attempt, invented });
        retried = attempt === 0;
        continue;
      }

      base = {
        businessName,
        sections: candidate.sections,
        content: candidate.content,
      };
      break;
    } catch (err) {
      lastError = { error: String(err), raw: raw.slice(0, 700) };
      console.warn("plan parse failed", { attempt, error: String(err) });
      retried = attempt === 0;
    }
  }

  if (!base) {
    throw new GenerateError("The model did not return a valid plan.", 502, lastError);
  }

  return {
    base,
    meta: {
      familyId: family.id,
      familyVersion: family.version,
      matchedModel: template?.id ?? null,
      bestScore,
      ms: Date.now() - started,
      retried,
    },
  };
}

/* ------------------------------------------------------------------ */
/* many                                                                */
/* ------------------------------------------------------------------ */

export async function generateMany(
  env: Env,
  input: GenerateInput,
  count = 4,
): Promise<GenerateManyResult> {
  const family = await loadFamily(env, input.familyId);
  const { base, meta } = await buildBasePlan(env, input, family);

  // Photos are assigned after the plan validates. The model never sees a URL.
  const images = await loadStockImages(env);
  const tag = meta.matchedModel ?? "trades";

  const variants: BuiltVariant[] = [];
  let renderable: SectionId[] = [];
  let dropped: SectionId[] = [];

  for (let i = 0; i < count; i++) {
    const plan = attachImages(
      {
        version: 1,
        family: family.id,
        familyVersion: family.version,
        variant: i,
        accent: ACCENT_ROTATION[i % ACCENT_ROTATION.length],
        businessName: base.businessName,
        sections: base.sections,
        content: base.content,
      },
      images,
      { seed: `${base.businessName}:${i}`, tag },
    );

    const result = validatePlan(plan);
    renderable = result.renderable;
    dropped = result.dropped;

    variants.push({ variant: i, accent: plan.accent, plan });
  }

  if (!renderable.length) {
    throw new GenerateError("No section had enough content to render.", 422, { dropped });
  }

  return { variants, meta: { ...meta, renderable, dropped } };
}
