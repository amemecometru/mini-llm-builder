/**
 * mini-llm-builder
 *
 *   GET  /                        landing page
 *   POST /                        landing form -> build (compatibility shim)
 *   POST /api/build               build four variants, return the job
 *   GET  /api/build/:id           job status + variant list
 *   GET  /api/build/:id/:n        render one variant, full screen
 *   POST /api/build/:id/choose    pick a favourite
 *   GET  /build/:id               the four windows
 *   GET  /preview                 dev index
 *   GET  /preview/:familyId       render the sample plan through a family
 *   GET  /health                  liveness
 *
 * Nothing here prepares SQL. That lives in db.ts.
 * Nothing here calls the model. That lives in generate.ts.
 */

import { generateMany, GenerateError, type GenerateInput } from "./generate";
import { renderPage } from "./render";
import {
  chooseVariant,
  getBuild,
  getVariant,
  getVariants,
  insertBuild,
  insertVariants,
  loadDefaultFamily,
  loadFamilyById,
  logEvent,
  setBuildStatus,
  type Env,
} from "./db";
import { landingPage } from "./landing";
import { renderSelectionPage, renderChosenPage } from "./selection";
import type { ContentPlan } from "./content";
import { handleGenerate } from "./admin";


export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname === "/admin/gen") return handleGenerate(request, env);

    const method = request.method;

    try {
      if (method === "GET" && pathname === "/") {
        return html(landingPage(""));
      }
      // … unchanged


      if (method === "POST" && pathname === "/api/build") {
        return handleBuild(request, env);
      }

      if (method === "POST" && pathname === "/") {
        return handleBuild(request, env);
      }

      const build = pathname.match(/^\/api\/build\/([^/]+)(?:\/([^/]+))?$/);
      if (build) {
        const [, id, sub] = build;

        if (method === "GET" && !sub) return handleStatus(env, id);
        if (method === "GET" && /^[0-3]$/.test(sub ?? "")) {
          return handleVariant(env, id, Number(sub));
        }
        if (method === "POST" && sub === "choose") {
          return handleChoose(request, env, id);
        }
      }

      const page = pathname.match(/^\/build\/([^/]+)$/);
      if (method === "GET" && page) {
        return handleSelectionPage(env, page[1]);
      }

      if (method === "GET" && pathname === "/preview") {
        return html(previewIndex());
      }
      if (method === "GET" && pathname.startsWith("/preview/")) {
        return handlePreview(env, pathname.slice("/preview/".length));
      }

      if (method === "GET" && pathname === "/health") {
        return json({ ok: true, at: new Date().toISOString() });
      }

      return new Response("Not found", { status: 404 });
    } catch (err) {
      console.error("request failed", { pathname, err });
      const status = err instanceof GenerateError ? err.status : 500;
      const message = err instanceof Error ? err.message : "Request failed";
      return json({ error: message }, status);
    }
  },
} satisfies ExportedHandler<Env>;

/* ------------------------------------------------------------------ */
/* build                                                               */
/* ------------------------------------------------------------------ */

async function handleBuild(request: Request, env: Env): Promise<Response> {
  let body: GenerateInput;
  try {
    body = (await request.json()) as GenerateInput;
  } catch {
    return json({ error: "Request body must be valid JSON." }, 400);
  }

  if (!body?.businessName?.trim()) {
    return json({ error: "businessName is required." }, 400);
  }

  const family =
    (body.familyId ? await loadFamilyById(env, body.familyId) : null) ??
    (await loadDefaultFamily(env)) ??
    BENTO_NOIR;

  const clientQuery = [
    body.businessName,
    body.businessModel,
    body.extra,
    body.businessBrief,
  ]
    .filter(Boolean)
    .join(" · ");

  const jobId = await insertBuild(env, {
    clientQuery,
    businessModelId: null,
    familyId: family.id,
    familyVersion: family.version,
    brief: body,
    status: "building",
  });

  await logEvent(env, jobId, "queued");

  try {
    const { variants, meta } = await generateMany(
      env,
      { ...body, familyId: family.id },
      4,
    );

    await insertVariants(env, jobId, variants);
    await setBuildStatus(env, jobId, "ready");
    await logEvent(env, jobId, "built", {
      family: meta.familyId,
      version: meta.familyVersion,
      renderable: meta.renderable,
      dropped: meta.dropped,
      ms: meta.ms,
    });

    const payload = {
      job_id: jobId,
      status: "ready",
      family: `${meta.familyId}@${meta.familyVersion}`,
      sections: meta.renderable,
      dropped: meta.dropped,
      variants: variants.map((v) => ({
        index: v.variant,
        accent: v.accent,
        view: `/api/build/${jobId}/${v.variant}`,
      })),
      windows: `/build/${jobId}`,
    };

    if ((request.headers.get("Accept") ?? "").includes("application/json")) {
      return json(payload, 201);
    }

    return redirect(`/build/${jobId}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Build failed";
    await setBuildStatus(env, jobId, "failed", message);
    await logEvent(env, jobId, "failed", { message });

    const status = err instanceof GenerateError ? err.status : 500;
    return json({ error: message, job_id: jobId }, status);
  }
}

/**
 * Compatibility shim for the existing landing form.
 * Maps form fields onto GenerateInput and reuses handleBuild.
 */
async function handleFormBuild(request: Request, env: Env): Promise<Response> {
  const form = await request.formData().catch(() => null);
  if (!form) return json({ error: "Expected a form submission." }, 400);

  const get = (...keys: string[]) => {
    for (const k of keys) {
      const v = form.get(k);
      if (typeof v === "string" && v.trim()) return v.trim();
    }
    return "";
  };

  const businessName = get("businessName", "business_name", "name", "business");
  if (!businessName) return json({ error: "businessName is required." }, 400);

  const body: GenerateInput = {
    businessName,
    businessModel: get("businessModel", "business_model", "model", "type"),
    extra: get("extra", "notes"),
    businessBrief: get("businessBrief", "business_brief", "brief", "details"),
  };

  const synthetic = new Request(request.url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return handleBuild(synthetic, env);
}

async function handleStatus(env: Env, jobId: string): Promise<Response> {
  const build = await getBuild(env, jobId);
  if (!build) return json({ error: "Unknown build." }, 404);

  const variants = await getVariants(env, jobId);

  return json({
    job_id: build.id,
    status: build.status,
    family: build.design_family_id
      ? `${build.design_family_id}@${build.design_family_version}`
      : null,
    error: build.error,
    variants: variants.map((v) => ({
      index: v.variant_index,
      status: v.status,
      chosen: Boolean(v.chosen),
      view: `/api/build/${build.id}/${v.variant_index}`,
    })),
  });
}

async function handleVariant(
  env: Env,
  jobId: string,
  index: number,
): Promise<Response> {
  const build = await getBuild(env, jobId);
  if (!build) return new Response("Unknown build.", { status: 404 });

  const variant = await getVariant(env, jobId, index);
  if (!variant?.plan_json) {
    return new Response("That variant is not ready.", { status: 404 });
  }

  const family =
    (build.design_family_id
      ? await loadFamilyById(env, build.design_family_id)
      : null) ?? BENTO_NOIR;

  let plan: ContentPlan;
  try {
    plan = JSON.parse(variant.plan_json) as ContentPlan;
  } catch {
    return new Response("Stored plan is corrupt.", { status: 500 });
  }

  await logEvent(env, jobId, "previewed", { variant: index });

  return html(renderPage(plan, family));
}

async function handleChoose(
  request: Request,
  env: Env,
  jobId: string,
): Promise<Response> {
  let index: number;

  const contentType = request.headers.get("Content-Type") ?? "";
  if (contentType.includes("application/json")) {
    const body = (await request.json().catch(() => ({}))) as {
      variant_index?: number;
    };
    index = Number(body.variant_index);
  } else {
    const form = await request.formData().catch(() => null);
    index = Number(form?.get("variant_index"));
  }

  if (!Number.isInteger(index) || index < 0 || index > 3) {
    return json({ error: "variant_index must be 0..3." }, 400);
  }

  const ok = await chooseVariant(env, jobId, index);
  if (!ok) return json({ error: "That variant is not ready." }, 409);

  await logEvent(env, jobId, "chosen", { variant: index });

  if (contentType.includes("application/json")) {
    return json({ job_id: jobId, status: "chosen", variant_index: index });
  }

  return redirect(`/build/${jobId}`);
}

async function handleSelectionPage(env: Env, jobId: string): Promise<Response> {
  const build = await getBuild(env, jobId);
  if (!build) return new Response("Unknown build.", { status: 404 });

  const variants = await getVariants(env, jobId);
  const chosen = variants.find((v) => v.chosen);

  if (chosen) {
    return html(
      renderChosenPage({
        jobId,
        variantIndex: chosen.variant_index,
      }),
    );
  }

  if (build.status === "failed") {
    return new Response(`Build failed: ${build.error ?? "unknown error"}`, {
      status: 500,
    });
  }

  return html(
    renderSelectionPage({
      jobId,
      variants: variants.map((v) => ({
        index: v.variant_index,
        status: v.status,
      })),
    }),
  );
}

/* ------------------------------------------------------------------ */
/* preview                                                             */
/* ------------------------------------------------------------------ */

async function handlePreview(env: Env, familyId: string): Promise<Response> {
  const family =
    (await loadFamilyById(env, familyId)) ??
    (familyId === BENTO_NOIR.id ? BENTO_NOIR : null);

  if (!family) {
    return new Response(`Unknown design family "${familyId}".`, { status: 404 });
  }
  return html(previewVariant(family));
}

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

function html(body: string): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload, null, 2), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function redirect(location: string): Response {
  return new Response(null, { status: 303, headers: { Location: location } });
}
