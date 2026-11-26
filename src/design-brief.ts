/**
 * design-brief.ts — the `design_md → prompt` arrow.
 *
 * DESIGN.md is two documents stapled together:
 *
 *   1. Frontmatter  -> parsed into `tokens` by scripts/load-design.mjs.
 *                      The renderer's business. Never sent to the model.
 *   2. Prose        -> this file. Half of it is copy guidance (what each
 *                      section is FOR, what a tile carries, "a blank stays
 *                      off the tile"), half is renderer instruction (grid
 *                      spans, motion timings, CSS). The model writes copy.
 *                      So we keep the first half and drop the second.
 *
 * Dropping is not deletion: DESIGN.md on disk is untouched, the tokens are
 * untouched, and `maxChars` / `RENDERER_TOP_LEVEL` are the only knobs.
 *
 * Never throws. A family with no design_md degrades to today's prompt.
 */

/** Top-level sections that are renderer/token concerns, not copy guidance. */
const RENDERER_TOP_LEVEL = new Set([
  "colors",
  "typography",
  "layout",
  "elevation & depth",
  "shapes",
  "components",
  "motion",
  "sections",
]);

/** Frontmatter is tokens. Strip it before the model sees anything. */
function stripFrontmatter(md: string): string {
  const s = String(md ?? "").replace(/\r\n/g, "\n").trimStart();
  if (!s.startsWith("---")) return s;
  const end = s.indexOf("\n---", 3);
  return end === -1 ? s : s.slice(end + 4);
}

interface Block {
  heading: string;
  level: number;
  body: string;
}

/** Split on ## and ### only. Deeper headings stay inside their block. */
function splitHeadings(md: string): Block[] {
  const blocks: Block[] = [];
  let current: Block = { heading: "", level: 0, body: "" };

  for (const line of md.split("\n")) {
    const m = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (m) {
      if (current.heading || current.body.trim()) blocks.push(current);
      current = { heading: m[2], level: m[1].length, body: "" };
    } else {
      current.body += line + "\n";
    }
  }
  if (current.heading || current.body.trim()) blocks.push(current);
  return blocks;
}

/** "Motion: the headline splits into words..." is renderer behaviour. */
function dropMotionParagraphs(body: string): string {
  return body
    .split(/\n{2,}/)
    .filter((p) => !/^motion:/i.test(p.trim()))
    .join("\n\n")
    .trim();
}

function condense(prose: string): string {
  const kept: string[] = [];

  for (const block of splitHeadings(prose)) {
    const heading = block.heading.toLowerCase();

    // `## Motion` is a container: its own intro is renderer talk, but the
    // `### Services` … `### Footer` specs underneath it are the copy brief.
    if (block.level === 2 && RENDERER_TOP_LEVEL.has(heading)) continue;

    const body = dropMotionParagraphs(block.body);
    if (!body) continue;

    kept.push(block.heading ? `### ${block.heading}\n${body}` : body);
  }

  return kept.join("\n\n").replace(/\n{3,}/g, "\n\n").trim();
}

export interface DesignBriefOptions {
  /** Hard cap on characters sent to the model. Default 7000 (~1.8k tokens). */
  maxChars?: number;
}

/** Returns a prompt block, or "" when the family has no design prose. */
export function designBrief(
  designMd: string | null | undefined,
  opts: DesignBriefOptions = {},
): string {
  const maxChars = opts.maxChars ?? 7000;

  let prose = "";
  try {
    prose = condense(stripFrontmatter(designMd ?? ""));
  } catch {
    return "";
  }

  if (!prose.trim()) return "";

  let body = prose;
  if (body.length > maxChars) {
    body = body.slice(0, maxChars);
    // Cut on a paragraph boundary so the model never sees half a rule.
    const cut = body.lastIndexOf("\n\n");
    if (cut > maxChars * 0.6) body = body.slice(0, cut);
    body += "\n\n[design notes truncated]";
  }

  return `DESIGN SYSTEM — the house style this page will be rendered in.

The layout, colour, type and motion are already built and are NOT yours to
change. You are writing the words that go inside them. Take the voice, the
level of specificity and what each section is FOR from below. Never describe
the layout, the colours or the motion in your copy.

${body}`;
}
