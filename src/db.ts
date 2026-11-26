/**
 * D1 access layer.
 *
 * All SQL lives here. Nothing else in src/ prepares a statement.
 *
 * Tables (see sql/003_builds.sql):
 *   build_jobs, build_variants, packages, orders, client_details, build_events
 *
 * Tables (see sql/007_stock_images.sql):
 *   stock_images
 */

import type { Accent, ContentPlan } from "./content";
import type { RenderFamily } from "./render";

export interface BuildRow {
  id: string;
  client_query: string;
  business_model_id: string | null;
  design_family_id: string | null;
  design_family_version: number | null;
  status: BuildStatus;
  brief_json: string | null;
  error: string | null;
  created_at: number;
  updated_at: number;
}

export type BuildStatus =
  | "queued"
  | "building"
  | "ready"
  | "chosen"
  | "checkout"
  | "paid"
  | "onboarding"
  | "live"
  | "abandoned"
  | "failed";

export interface VariantRow {
  id: string;
  job_id: string;
  variant_index: number;
  directive_json: string;
  plan_json: string | null;
  status: "pending" | "ready" | "failed";
  chosen: number;
  created_at: number;
}

/* ------------------------------------------------------------------ */
/* builds                                                              */
/* ------------------------------------------------------------------ */

export async function insertBuild(
  env: Env,
  opts: {
    clientQuery: string;
    businessModelId: string | null;
    familyId: string;
    familyVersion: number;
    brief: unknown;
    status?: BuildStatus;
  },
): Promise<string> {
  const id = crypto.randomUUID();
  const now = Math.floor(Date.now() / 1000);

  await env.DB.prepare(
    `INSERT INTO build_jobs
       (id, client_query, business_model_id, design_family_id,
        design_family_version, status, brief_json, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      id,
      opts.clientQuery,
      opts.businessModelId,
      opts.familyId,
      opts.familyVersion,
      opts.status ?? "building",
      JSON.stringify(opts.brief ?? {}),
      now,
      now,
    )
    .run();

  return id;
}

export async function insertVariants(
  env: Env,
  jobId: string,
  variants: Array<{ variant: number; accent: Accent; plan: ContentPlan }>,
): Promise<void> {
  const now = Math.floor(Date.now() / 1000);

  const stmts = variants.map((v) =>
    env.DB.prepare(
      `INSERT INTO build_variants
         (id, job_id, variant_index, directive_json, plan_json, status, chosen, created_at)
       VALUES (?, ?, ?, ?, ?, 'ready', 0, ?)`,
    ).bind(
      crypto.randomUUID(),
      jobId,
      v.variant,
      JSON.stringify({ variant: v.variant, accent: v.accent }),
      JSON.stringify(v.plan),
      now,
    ),
  );

  if (stmts.length) await env.DB.batch(stmts);
}

export async function setBuildStatus(
  env: Env,
  jobId: string,
  status: BuildStatus,
  error?: string,
): Promise<void> {
  await env.DB.prepare(
    `UPDATE build_jobs SET status = ?, error = ?, updated_at = ? WHERE id = ?`,
  )
    .bind(status, error ?? null, Math.floor(Date.now() / 1000), jobId)
    .run();
}

export async function getBuild(env: Env, jobId: string): Promise<BuildRow | null> {
  return env.DB.prepare(`SELECT * FROM build_jobs WHERE id = ?`)
    .bind(jobId)
    .first<BuildRow>();
}

export async function getVariants(env: Env, jobId: string): Promise<VariantRow[]> {
  const res = await env.DB.prepare(
    `SELECT * FROM build_variants WHERE job_id = ? ORDER BY variant_index`,
  )
    .bind(jobId)
    .all<VariantRow>();
  return res.results ?? [];
}

export async function getVariant(
  env: Env,
  jobId: string,
  index: number,
): Promise<VariantRow | null> {
  return env.DB.prepare(
    `SELECT * FROM build_variants WHERE job_id = ? AND variant_index = ?`,
  )
    .bind(jobId, index)
    .first<VariantRow>();
}

/**
 * Exactly one chosen variant per job — enforced by a partial unique index,
 * so this clears the old choice first.
 */
export async function chooseVariant(
  env: Env,
  jobId: string,
  index: number,
): Promise<boolean> {
  const variant = await getVariant(env, jobId, index);
  if (!variant || variant.status !== "ready") return false;

  const now = Math.floor(Date.now() / 1000);

  await env.DB.batch([
    env.DB.prepare(`UPDATE build_variants SET chosen = 0 WHERE job_id = ?`).bind(jobId),
    env.DB.prepare(
      `UPDATE build_variants SET chosen = 1 WHERE job_id = ? AND variant_index = ?`,
    ).bind(jobId, index),
    env.DB.prepare(
      `UPDATE build_jobs SET status = 'chosen', updated_at = ? WHERE id = ?`,
    ).bind(now, jobId),
  ]);

  return true;
}

/* ------------------------------------------------------------------ */
/* design families                                                     */
/* ------------------------------------------------------------------ */

export async function loadFamilyById(
  env: Env,
  id: string,
): Promise<RenderFamily | null> {
  const row = await env.DB.prepare(
    `SELECT id, version, name, tokens FROM live_design_families WHERE id = ?`,
  )
    .bind(id)
    .first<{ id: string; version: number; name: string; tokens: string }>();

  if (!row) return null;

  let tokens: Record<string, unknown> = {};
  try {
    tokens = JSON.parse(row.tokens || "{}");
  } catch {
    tokens = {};
  }

  return { id: row.id, version: row.version, name: row.name, tokens };
}

export async function loadDefaultFamily(env: Env): Promise<RenderFamily | null> {
  const row = await env.DB.prepare(
    `SELECT id, version, name, tokens FROM live_design_families ORDER BY id LIMIT 1`,
  ).first<{ id: string; version: number; name: string; tokens: string }>();

  if (!row) return null;

  let tokens: Record<string, unknown> = {};
  try {
    tokens = JSON.parse(row.tokens || "{}");
  } catch {
    tokens = {};
  }

  return { id: row.id, version: row.version, name: row.name, tokens };
}

/* ------------------------------------------------------------------ */
/* stock images                                                        */
/* ------------------------------------------------------------------ */

export interface StockImage {
  id: string;
  url: string;
  alt: string;
  role: string;
  tag: string;
  credit: string;
}

/**
 * The whole library. It is small — a few hundred rows at most — so it is
 * loaded once per build rather than queried per slot.
 *
 * A missing table must never fail a build: an empty library simply means
 * every visual slot falls back to the colour field DESIGN.md specifies.
 */
export async function loadStockImages(env: Env): Promise<StockImage[]> {
  try {
    const res = await env.DB.prepare(
      `SELECT id, url, alt, role, tag, credit FROM stock_images`,
    ).all<StockImage>();
    return res.results ?? [];
  } catch (err) {
    console.warn("stock_images unavailable", String(err));
    return [];
  }
}

/* ------------------------------------------------------------------ */
/* events                                                              */
/* ------------------------------------------------------------------ */

export async function logEvent(
  env: Env,
  jobId: string,
  event: string,
  meta: Record<string, unknown> = {},
): Promise<void> {
  try {
    await env.DB.prepare(
      `INSERT INTO build_events (job_id, event, meta, created_at) VALUES (?, ?, ?, ?)`,
    )
      .bind(jobId, event, JSON.stringify(meta), Math.floor(Date.now() / 1000))
      .run();
  } catch (err) {
    // Analytics must never fail a build.
    console.warn("event log failed", { jobId, event, err: String(err) });
  }
}

/* ------------------------------------------------------------------ */
/* env                                                                 */
/* ------------------------------------------------------------------ */

export interface Env {
  AI: Ai;
  DB: D1Database;
}
