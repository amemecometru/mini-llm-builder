/**
 * The four windows.
 *
 * This is the builder's own UI, not a client page — so it carries the house
 * look but does not go through renderDocument().
 *
 * Each window shows a live iframe of the variant, with two controls in the
 * top right: [View full] opens the variant on its own, [Select] chooses it.
 */

import { esc } from "./sections";

const SHELL_CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:#000;color:#fff;font-family:'Poppins',system-ui,sans-serif;
  font-size:15px;line-height:1.5;-webkit-font-smoothing:antialiased}
.wrap{max-width:1600px;margin-inline:auto;padding:32px 20px 64px}
header.top{display:flex;align-items:baseline;justify-content:space-between;gap:16px;
  margin-bottom:28px;flex-wrap:wrap}
h1{font-family:'Playfair Display',Georgia,serif;font-size:clamp(24px,3vw,38px);
  font-weight:700;letter-spacing:-0.02em}
.meta{font-size:13px;color:#c0c6ce}
.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
@media (max-width:900px){.grid{grid-template-columns:1fr}}
.window{position:relative;border:2px solid #fff;border-radius:20px;overflow:hidden;
  background:#0d0d0f;display:flex;flex-direction:column;min-height:420px}
.bar{display:flex;align-items:center;justify-content:space-between;gap:8px;
  padding:10px 12px;border-bottom:1px solid rgba(255,255,255,.18)}
.tag{font-size:12px;letter-spacing:.02em;color:#c0c6ce}
.tag b{color:#fff;font-weight:500}
.controls{display:flex;gap:8px;align-items:center}
.controls form{display:inline}
.btn{display:inline-flex;align-items:center;justify-content:center;height:32px;padding:0 14px;
  border-radius:999px;font-size:13px;font-weight:500;text-decoration:none;cursor:pointer;
  border:1px solid #fff;background:transparent;color:#fff;font-family:inherit;
  transition:background .25s ease,color .25s ease,border-color .25s ease}
.btn:hover{background:#ff2e2e;border-color:#ff2e2e;color:#fff}
.btn-primary{background:#fff;color:#000;border-color:#fff}
.btn-primary:hover{background:#ff2e2e;border-color:#ff2e2e;color:#fff}
.frame{position:relative;flex:1;background:#000;min-height:360px}
.frame iframe{position:absolute;inset:0;width:100%;height:100%;border:0;
  transform-origin:top left;pointer-events:none}
.frame a.cover{position:absolute;inset:0;z-index:2}
.pending{display:flex;align-items:center;justify-content:center;height:100%;
  color:#c0c6ce;font-size:14px;padding:40px}
.chosen{max-width:720px;margin:80px auto;text-align:center}
.chosen h1{margin-bottom:16px}
.chosen p{color:#c0c6ce;margin-bottom:32px}
`;

function shell(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="robots" content="noindex">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@400;500&display=swap">
<style>${SHELL_CSS}</style>
</head>
<body>
${body}
</body>
</html>`;
}

export interface SelectionVariant {
  index: number;
  status: "pending" | "ready" | "failed";
}

export function renderSelectionPage(opts: {
  jobId: string;
  variants: SelectionVariant[];
}): string {
  const windows = opts.variants
    .map((v) => {
      const label = `Design ${v.index + 1}`;

      if (v.status !== "ready") {
        return `    <div class="window">
      <div class="bar">
        <span class="tag"><b>${esc(label)}</b></span>
        <span class="tag">${esc(v.status)}</span>
      </div>
      <div class="pending">This design is still being built.</div>
    </div>`;
      }

      return `    <div class="window">
      <div class="bar">
        <span class="tag"><b>${esc(label)}</b></span>
        <div class="controls">
          <a class="btn" href="/api/build/${esc(opts.jobId)}/${v.index}" target="_blank" rel="noopener">View full</a>
          <form method="POST" action="/api/build/${esc(opts.jobId)}/choose">
            <input type="hidden" name="variant_index" value="${v.index}">
            <button class="btn btn-primary" type="submit">Select</button>
          </form>
        </div>
      </div>
      <div class="frame">
        <iframe src="/api/build/${esc(opts.jobId)}/${v.index}" title="${esc(label)}"></iframe>
        <a class="cover" href="/api/build/${esc(opts.jobId)}/${v.index}" target="_blank" rel="noopener" aria-label="Open ${esc(label)} full screen"></a>
      </div>
    </div>`;
    })
    .join("\n");

  return shell(
    "Your four designs",
    `<div class="wrap">
  <header class="top">
    <h1>Pick the one that feels right.</h1>
    <p class="meta">Four designs, built for your business. Nothing to pay yet.</p>
  </header>
  <div class="grid">
${windows}
  </div>
</div>`,
  );
}

export function renderChosenPage(opts: {
  jobId: string;
  variantIndex: number;
}): string {
  return shell(
    "Design selected",
    `<div class="wrap">
  <div class="chosen">
    <h1>Design ${opts.variantIndex + 1} is yours.</h1>
    <p>Next: choose a package. Your site, hosting, domain and business email in one.</p>
    <form method="POST" action="/api/checkout">
      <input type="hidden" name="job_id" value="${esc(opts.jobId)}">
      <input type="hidden" name="variant_index" value="${opts.variantIndex}">
      <button class="btn btn-primary" type="submit">See packages</button>
    </form>
  </div>
</div>`,
  );
}
