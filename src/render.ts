/**
 * Renderer.
 *
 * Pure function: (plan, family) => complete HTML document.
 * No model call. No network. Deterministic.
 *
 * Implements DESIGN.md (Bento Noir). The design family supplies tokens
 * (colour, type, spacing, radii) from its parsed YAML frontmatter. The plan
 * supplies the accent, the variant index and the content. Nothing else varies.
 *
 * The page is a board: bento tiles on a pure black ground, dark tiles edged
 * in white, colour carried by pills, chips and two fields per page.
 *
 * Motion lives in motion-kit.ts. This file carries none of it.
 */

import { renderableSections, type Accent, type ContentPlan, type SectionId } from "./content";
import { esc, renderSection } from "./sections";
import { MOTION_CSS, MOTION_JS } from "./motion-kit";

/* ------------------------------------------------------------------ */
/* colour helpers                                                      */
/* ------------------------------------------------------------------ */

function hexToRgb(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(hex).trim());
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function luminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const [r, g, b] = rgb.map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

function rgba(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return `rgba(0,0,0,${alpha})`;
  return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
}

/* ------------------------------------------------------------------ */
/* design family -> tokens                                             */
/* ------------------------------------------------------------------ */

export interface RenderFamily {
  id: string;
  version: number;
  name: string;
  tokens: Record<string, unknown>;
}

export interface Tokens {
  ground: string;
  surface: string;
  neutral: string;
  onSurface: string;
  accent: string;
  accentText: string;
  warm: string;
  cool: string;
  silver: string;
  fontDisplay: string;
  fontSerif: string;
  fontBody: string;
  textDisplay: string;
  textLg: string;
  textStatement: string;
  textPill: string;
  textBody: string;
  textLabel: string;
  textChip: string;
  rTile: string;
  rPhoto: string;
  rField: string;
  rFull: string;
  gutter: string;
  tilePad: string;
  controlH: string;
  chipH: string;
}

type Dict = Record<string, unknown>;

const str = (v: unknown, fallback: string): string =>
  typeof v === "string" && v.trim() ? v.trim() : fallback;

const dict = (v: unknown): Dict => (v && typeof v === "object" ? (v as Dict) : {});

/** DESIGN.md's four accents, resolved from the family's colour tokens. */
function accentColor(colors: Dict, accent: Accent): string {
  switch (accent) {
    case "red":
      return str(colors.secondary, "#ff2e2e");
    case "orange":
      return str(colors.tertiary, "#ff6b00");
    case "blue":
      return str(colors["accent-blue"], "#2e7cff");
    case "turquoise":
      return str(colors["accent-turquoise"], "#00e5c7");
  }
}

export function tokensFromDesignMd(tokens: Dict, accent: Accent): Tokens {
  const colors = dict(tokens.colors);
  const type = dict(tokens.typography);
  const rounded = dict(tokens.rounded);
  const spacing = dict(tokens.spacing);

  const display = dict(type["headline-display"]);
  const lg = dict(type["headline-lg"]);
  const statement = dict(type.statement);
  const pill = dict(type.pill);
  const body = dict(type["body-md"]);
  const label = dict(type["label-md"]);
  const chip = dict(type.chip);

  const a = accentColor(colors, accent ?? "red");

  return {
    ground: str(colors.primary, "#000000"),
    surface: str(colors.surface, "#0d0d0f"),
    neutral: str(colors.neutral, "#ffffff"),
    onSurface: str(colors["on-surface"], "#ffffff"),
    accent: a,
    accentText: contrast(a, "#ffffff") >= contrast(a, "#000000") ? "#ffffff" : "#000000",
    warm: str(colors.tertiary, "#ff6b00"),
    cool: str(colors["accent-turquoise"], "#00e5c7"),
    silver: str(colors["accent-silver"], "#c0c6ce"),

    fontDisplay: str(display.fontFamily, "Playfair Display"),
    fontSerif: str(statement.fontFamily, "Roboto Serif"),
    fontBody: str(body.fontFamily, "Poppins"),

    textDisplay: `clamp(54px, 9vw, ${str(display.fontSize, "96px")})`,
    textLg: `clamp(34px, 5vw, ${str(lg.fontSize, "56px")})`,
    textStatement: `clamp(22px, 2.6vw, ${str(statement.fontSize, "30px")})`,
    textPill: `clamp(20px, 2.4vw, ${str(pill.fontSize, "32px")})`,
    textBody: str(body.fontSize, "17px"),
    textLabel: str(label.fontSize, "14px"),
    textChip: str(chip.fontSize, "13px"),

    rTile: str(rounded.tile, "20px"),
    rPhoto: str(rounded.photo, "14px"),
    rField: str(rounded.field, "12px"),
    rFull: str(rounded.full, "999px"),

    gutter: str(spacing.gutter, "12px"),
    tilePad: str(spacing["tile-padding"], "52px"),
    controlH: str(spacing["control-height"], "50px"),
    chipH: str(spacing["chip-height"], "30px"),
  };
}

/* ------------------------------------------------------------------ */
/* CSS                                                                 */
/* ------------------------------------------------------------------ */

function tokenCss(t: Tokens): string {
  return `:root{
  --ground:${t.ground};
  --surface:${t.surface};
  --neutral:${t.neutral};
  --on-surface:${t.onSurface};
  --accent:${t.accent};
  --accent-text:${t.accentText};
  --warm:${t.warm};
  --cool:${t.cool};
  --silver:${t.silver};
  --font-display:'${t.fontDisplay}',Georgia,serif;
  --font-serif:'${t.fontSerif}',Georgia,serif;
  --font-body:'${t.fontBody}',system-ui,sans-serif;
  --text-display:${t.textDisplay};
  --text-lg:${t.textLg};
  --text-statement:${t.textStatement};
  --text-pill:${t.textPill};
  --text-body:${t.textBody};
  --text-label:${t.textLabel};
  --text-chip:${t.textChip};
  --r-tile:${t.rTile};
  --r-photo:${t.rPhoto};
  --r-field:${t.rField};
  --r-full:${t.rFull};
  --gutter:${t.gutter};
  --tile-pad:${t.tilePad};
  --control-h:${t.controlH};
  --chip-h:${t.chipH};
}`;
}

const BASE_CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:var(--ground);color:var(--neutral);font-family:var(--font-body);
  font-size:var(--text-body);line-height:1.55;-webkit-font-smoothing:antialiased;overflow-x:hidden}
.wrap{max-width:1280px;margin-inline:auto;padding-inline:var(--gutter)}
section{padding-block:clamp(56px,8vw,104px)}
h1,h2,h3{font-family:var(--font-display);font-weight:700;line-height:1.02;letter-spacing:-0.02em}
p{max-width:62ch}
a{color:inherit}

/* section header — chip, Playfair headline, serif statement */
.s-head{display:grid;gap:18px;margin-bottom:clamp(28px,4vw,44px);max-width:900px}
.h2{font-size:var(--text-lg);letter-spacing:-0.02em}
.statement{font-family:var(--font-serif);font-size:var(--text-statement);line-height:1.3;
  letter-spacing:-0.01em;color:var(--neutral);max-width:52ch}

/* status-chip */
.status-chip{display:inline-flex;align-items:center;height:var(--chip-h);padding:0 14px;
  font-family:var(--font-body);font-size:var(--text-chip);font-weight:500;letter-spacing:.01em;
  color:var(--on-surface);background:var(--surface);border:1px solid var(--neutral);
  border-radius:var(--r-full);width:max-content}
.status-chip--light{background:var(--neutral);color:var(--ground);border-color:var(--neutral)}

/* pills */
.pill{display:inline-flex;align-items:center;padding:6px 20px;border-radius:var(--r-full);
  font-family:var(--font-display);font-size:var(--text-pill);font-weight:600;line-height:1.1;
  letter-spacing:-0.02em;width:max-content}
.pill-cream{background:var(--neutral);color:var(--ground)}
.pill-warm{background:var(--warm);color:var(--ground)}

/* buttons */
.button-primary,.button-secondary{display:inline-flex;align-items:center;justify-content:center;
  height:var(--control-h);padding:0 26px;border-radius:var(--r-full);
  font-family:var(--font-body);font-size:16px;font-weight:500;line-height:1;
  text-decoration:none;cursor:pointer;position:relative;overflow:hidden;isolation:isolate;
  transition:color .45s ease,border-color .45s ease}
.button-primary{background:var(--neutral);color:var(--ground);border:2px solid var(--neutral)}
.button-secondary{background:var(--surface);color:var(--on-surface);border:2px solid var(--neutral)}
.button-primary::before,.button-secondary::before{content:"";position:absolute;inset:0;z-index:-1;
  background:var(--accent);transform:scaleY(0);transform-origin:bottom;
  transition:transform .45s cubic-bezier(.16,1,.3,1)}
.button-primary:hover::before,.button-secondary:hover::before{transform:scaleY(1)}
.button-primary:hover,.button-secondary:hover{color:var(--neutral);border-color:var(--accent)}
.actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:32px}

/* the board */
.bento{display:grid;grid-template-columns:repeat(12,1fr);gap:var(--gutter)}
.bento > .tile:nth-child(1){grid-column:span 7;grid-row:span 2}
.bento > .tile:nth-child(2),
.bento > .tile:nth-child(3){grid-column:span 5}
.bento > .tile:nth-child(n+4){grid-column:span 4}
.bento--row > .tile{grid-column:span 4;grid-row:auto}
.bento--four > .tile{grid-column:span 3;grid-row:auto}

/* tiles */
.tile{display:flex;flex-direction:column;gap:16px;padding:var(--tile-pad);
  border-radius:var(--r-tile);min-width:0}
.tile-dark{background:var(--surface);color:var(--on-surface);border:2px solid var(--neutral)}
.tile-light{background:var(--neutral);color:var(--ground);border:0}
.tile__title{font-size:clamp(24px,2.6vw,36px);letter-spacing:-0.02em}
.tile__body{font-size:var(--text-body);line-height:1.55;max-width:44ch}
.tile .status-chip{margin-bottom:auto}
.tile .pill{margin-top:auto}
.tile--flagship{gap:20px}
.tile--flagship .tile__title{font-size:clamp(30px,3.4vw,48px)}
.tile-dark:hover{border-color:var(--accent);transform:translateY(-4px)}
.tile-dark{transition:border-color .3s ease,transform .3s ease}

/* visual — a real image, or a colour field standing in for one */
.visual{display:block;width:100%;min-height:220px;border-radius:var(--r-photo);
  object-fit:cover;margin-top:auto;
  background:radial-gradient(120% 120% at 18% 8%,var(--accent) 0%,transparent 58%),
             radial-gradient(110% 110% at 82% 92%,var(--warm) 0%,transparent 62%),
             var(--surface)}

/* two colour fields per page, never more */
[data-field="warm"]{background:var(--warm);color:var(--ground)}
[data-field="cool"]{background:var(--cool);color:var(--ground)}
[data-field] .tile-dark{background:transparent;border-color:currentColor;color:inherit}
[data-field] .status-chip{background:transparent;border-color:currentColor;color:inherit}
[data-field] .statement{color:inherit}
[data-field] .visual{background:rgba(0,0,0,.12)}

/* hero — full-viewport sheet that stacks under the next section */
.hero{display:grid;grid-template-columns:1.05fr .95fr;gap:var(--gutter);
  align-items:center;min-height:calc(100vh - 78px)}
.hero__copy{display:grid;gap:18px;align-content:center}
.hero__media .visual{min-height:clamp(320px,52vh,620px)}
.display{font-size:var(--text-display);letter-spacing:-0.03em;line-height:.96}

/* marquee */
.marquee{overflow:hidden;margin-block:clamp(20px,3vw,32px);
  mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}
.marquee__track{display:flex;align-items:center;gap:28px;list-style:none;width:max-content;
  will-change:transform}
.marquee__item{font-family:var(--font-display);font-size:clamp(24px,3vw,40px);
  font-weight:600;letter-spacing:-0.02em;white-space:nowrap}
.marquee__sep{width:10px;height:10px;border-radius:50%;flex:none}
.marquee__sep--cool{background:var(--cool)}
.marquee__sep--silver{background:var(--silver)}

/* process */
.progress{position:relative;height:2px;background:var(--silver);margin:0 0 24px}
.progress__fill{position:absolute;inset:0 auto 0 0;width:0;background:var(--accent)}
.steps{list-style:none;display:grid;gap:var(--gutter)}
.steps--four{grid-template-columns:repeat(4,1fr)}
.step{display:flex;flex-direction:column;gap:14px;padding:var(--tile-pad);
  background:var(--surface);border:2px solid var(--neutral);border-radius:var(--r-tile);
  transition:border-color .35s ease}
.step .status-chip{margin-bottom:0}
.step .pill{margin-top:0}
.step-number{display:inline-flex;align-items:center;justify-content:center;
  width:56px;height:56px;border-radius:var(--r-full);background:var(--surface);
  color:var(--on-surface);border:1px solid var(--neutral);
  font-family:var(--font-display);font-size:20px;font-weight:600;
  transition:background .35s ease,color .35s ease,border-color .35s ease}
.step.is-active .step-number{background:var(--accent);color:var(--accent-text);
  border-color:var(--accent)}
.step.is-active{border-color:var(--accent)}

/* proof */
.stat{font-family:var(--font-display);font-size:var(--text-display);font-weight:700;
  line-height:0.96;letter-spacing:-0.03em}
.rating{display:flex;gap:6px;color:var(--silver);font-size:14px;letter-spacing:2px}
.credential-list{list-style:none;display:grid;gap:8px;font-size:var(--text-label);
  color:var(--silver)}
.tile--flip{perspective:900px}
.tile--flip .visual{margin-top:0}
.status-chip--after{background:var(--accent);color:var(--accent-text);border-color:var(--accent)}

/* team */
.role{font-family:var(--font-body);font-size:var(--text-label);font-weight:500;
  color:var(--silver);letter-spacing:.01em}
.tile-light .role{color:rgba(0,0,0,.6)}

/* offer-card — two tiers side by side */
.offer-card{display:grid;grid-template-columns:1fr 1fr;overflow:hidden}
.offer-card__tab{padding:24px;display:grid;gap:10px}
.offer-card__tab + .offer-card__tab{border-left:1px solid rgba(0,0,0,.12)}
.offer-card__price{font-family:var(--font-display);font-size:var(--text-pill);font-weight:600}
.offer-card__list{list-style:none;display:grid;gap:6px;font-size:var(--text-label)}

/* guide — native accordion, one open at a time */
.faq-list{display:grid;gap:var(--gutter)}
.faq{padding:clamp(24px,3vw,36px);background:var(--surface);border:2px solid var(--neutral);
  border-radius:var(--r-tile);display:grid;gap:10px;transition:border-color .3s ease}
.faq summary{cursor:pointer;list-style:none;display:flex;justify-content:space-between;
  gap:16px;align-items:baseline;font-size:clamp(20px,2.2vw,28px)}
.faq summary::-webkit-details-marker{display:none}
.faq summary::after{content:"+";color:var(--silver);font-size:20px;line-height:1}
.faq[open] summary::after{content:"\\2013"}
.faq[open]{border-color:var(--accent)}

/* door — one light tile, two halves */
.door{grid-column:span 12;display:grid;gap:32px}
.door__halves{display:grid;grid-template-columns:1fr 1fr;gap:var(--gutter)}
.door .contact a{color:inherit}
.door .contact span{color:rgba(0,0,0,.55)}
.contact{list-style:none;display:grid;gap:10px;font-size:var(--text-body)}
.contact span{display:block;font-size:var(--text-label);color:var(--silver);
  letter-spacing:.01em;margin-bottom:2px}
.field{margin-bottom:18px}
label{display:block;margin-bottom:6px;font-size:var(--text-label);font-weight:500}
input,textarea{width:100%;height:var(--control-h);padding:12px 16px;background:transparent;
  color:var(--on-surface);border:1px solid var(--neutral);border-radius:var(--r-field);
  font-family:var(--font-body);font-size:16px}
textarea{height:auto;min-height:120px;padding-top:14px;resize:vertical}
input:focus,textarea:focus{outline:2px solid var(--accent);outline-offset:2px}

/* footer — one dark tile, wordmark */
.footer{grid-column:span 12;display:grid;gap:24px}
.footer .contact span{color:var(--silver)}
.wordmark{font-family:var(--font-display);font-size:clamp(48px,10vw,140px);font-weight:700;
  line-height:0.92;letter-spacing:-0.04em}
.footer-links{list-style:none;display:flex;flex-wrap:wrap;gap:20px;
  font-size:var(--text-label)}
.colophon{font-size:var(--text-chip);color:var(--silver)}

/* proof strip under the hero */
.proof{display:flex;gap:10px;align-items:center;font-size:var(--text-label);
  color:var(--silver)}
.proof__dot{width:4px;height:4px;border-radius:50%;background:var(--silver)}

[data-motion]{will-change:transform,opacity}

@media (max-width:960px){
  .bento{grid-template-columns:repeat(6,1fr)}
  .bento > .tile:nth-child(1){grid-column:span 6;grid-row:auto}
  .bento > .tile:nth-child(2),
  .bento > .tile:nth-child(3){grid-column:span 3}
  .bento > .tile:nth-child(n+4){grid-column:span 3}
  .bento--row > .tile{grid-column:span 3}
  .bento--four > .tile{grid-column:span 3}
  .steps--four{grid-template-columns:repeat(2,1fr)}
}
@media (max-width:760px){
  .bento{grid-template-columns:1fr}
  .bento > .tile{grid-column:span 1!important}
  .bento--row > .tile{grid-column:span 1}
  .bento--four > .tile{grid-column:span 1}
  .tile,.step,.faq{padding:clamp(24px,6vw,32px)}
  .hero{grid-template-columns:1fr;min-height:auto}
  .door__halves{grid-template-columns:1fr}
  .steps--four{grid-template-columns:1fr}
  .offer-card{grid-template-columns:1fr}
}
@media (prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  [data-motion]{opacity:1!important;transform:none!important}
}
`;

/* ------------------------------------------------------------------ */
/* document                                                            */
/* ------------------------------------------------------------------ */

const FONTS =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800;900" +
  "&family=Roboto+Serif:wght@400;500&family=Poppins:wght@400;500&display=swap";

export function renderDocument(opts: {
  title: string;
  family: RenderFamily;
  accent: Accent;
  variant: number;
  body: string;
  indexable?: boolean;
}): string {
  const tokens = tokensFromDesignMd(opts.family.tokens, opts.accent);
  const robots = opts.indexable ? "" : '\n<meta name="robots" content="noindex">';

  return `<!DOCTYPE html>
<html lang="en" data-family="${esc(opts.family.id)}" data-version="${opts.family.version}" data-variant="${opts.variant}" data-accent="${esc(opts.accent)}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(opts.title)}</title>${robots}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<style>
${tokenCss(tokens)}
${BASE_CSS}
${MOTION_CSS}
</style>
</head>
<body>
${opts.body}
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>
<script>${MOTION_JS}</script>
<script>window.addEventListener("load",function(){if(!window.gsap||!window.ScrollTrigger)return;ScrollTrigger.refresh();setTimeout(function(){gsap.utils.toArray("[data-motion]").forEach(function(el){if(getComputedStyle(el).opacity==="0"){gsap.to(el,{opacity:1,y:0,duration:0.3});}});},1200);});</script>
</body>
</html>`;
}

/* ------------------------------------------------------------------ */
/* page                                                                */
/* ------------------------------------------------------------------ */

/**
 * Two colour fields per page, never more. DESIGN.md: one warm field, one
 * cool field. Everything else sits on the black ground.
 */
const FIELD_MAP: Partial<Record<SectionId, "warm" | "cool">> = {
  proof: "warm",
  validations: "cool",
};

export function renderPage(plan: ContentPlan, family: RenderFamily): string {
  const body = renderableSections(plan)
    .map((id) => {
      const html = renderSection(id, plan);
      if (!html) return "";
      const field = FIELD_MAP[id];
      return field ? html.replace(/<section([^>]*)>/, `<section$1 data-field="${field}">`) : html;
    })
    .filter(Boolean)
    .join("\n");

  return renderDocument({
    title: `${plan.businessName} — ${family.name}`,
    family,
    accent: plan.accent ?? "red",
    variant: plan.variant ?? 0,
    body,
  });
}
