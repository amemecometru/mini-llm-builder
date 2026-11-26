/**
 * One-off image generation route.
 *
 *   GET /admin/gen?key=<GEN_KEY>&prompt=<text>&steps=8
 *
 * Generates one image with flux-1-schnell and returns it as a PNG.
 *
 * GEN_KEY is NOT your Cloudflare API token. It is a random string you invent
 * and set with `wrangler secret put GEN_KEY`. It gates this route so nobody
 * else can spend your AI allocation.
 *
 * Remove the route from index.ts once the library is built.
 */

export interface AdminEnv {
  AI: Ai;
  GEN_KEY?: string;
}

const MODEL = "@cf/black-forest-labs/flux-1-schnell";
const DEFAULT_STEPS = 8;

export async function handleGenerate(
  request: Request,
  env: AdminEnv,
): Promise<Response> {
  const url = new URL(request.url);

  // Fail closed: no secret configured means the route is off.
  if (!env.GEN_KEY) {
    return new Response("GEN_KEY not set", { status: 503 });
  }
  if (url.searchParams.get("key") !== env.GEN_KEY) {
    return new Response("forbidden", { status: 403 });
  }

  const prompt = (url.searchParams.get("prompt") ?? "").trim();
  if (!prompt) {
    return new Response("prompt required", { status: 400 });
  }

  const raw = Number(url.searchParams.get("steps") ?? DEFAULT_STEPS);
  const steps = Math.min(12, Math.max(1, Number.isFinite(raw) ? raw : DEFAULT_STEPS));

  let res: any;
  try {
    res = await env.AI.run(MODEL as never, { prompt, steps });
  } catch (err) {
    console.error("image generation failed", { prompt, err: String(err) });
    return new Response(`generation failed: ${String(err)}`, { status: 502 });
  }

  // flux-1-schnell returns { image: "<base64 png>" }
  const b64 = res?.image ?? res?.result?.image;
  if (typeof b64 !== "string" || !b64) {
    console.error("no image in response", {
      keys: res && typeof res === "object" ? Object.keys(res) : typeof res,
      sample: JSON.stringify(res).slice(0, 400),
    });
    return new Response("model returned no image", { status: 502 });
  }

  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);

  return new Response(bytes, {
    headers: {
      "content-type": "image/png",
      "cache-control": "no-store",
      "x-image-bytes": String(bytes.length),
    },
  });
}
