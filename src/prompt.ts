/**
 * Prompts for the content planner.
 *
 * The model returns a ContentPlan (see content.ts). It never returns HTML,
 * CSS, GSAP, or a dollar amount.
 *
 * DOCTRINE — this is a PRE-CONSULTATION builder, not a consultation.
 *
 * The client has not been spoken to. We have a business name and what they
 * do, and usually nothing else. The page must look finished, specific and
 * expensive anyway, because its job is to convert a buyer who is on the
 * fence. It is not the final site; the real details are collected at
 * consultation, after they pay.
 *
 * So content splits in two:
 *
 *   TYPICAL      What a business of this type actually does. Comes from
 *                business_models. Written freely, as the business's own
 *                copy. This is the substance of the page.
 *   PLACEHOLDER  A claim about THIS business that we cannot know before
 *                consultation — phone, email, address, names, review
 *                counts, licence numbers, prices, and anything else the
 *                brief does not supply. Written as a [token], never
 *                invented as a real-looking fact. Placeholders are
 *                expected to be 25% to 40% of the website. Using them
 *                in the correct context is the main skill that makes
 *                the design and the marketing work.
 *
 * A placeholder is never presented as a real fact about this business.
 * It is a stand-in in the right role, the right component, and the
 * right colour scheme, so the client can see what the finished page
 * will look like and what to replace. A placeholder person is a role,
 * not a named real person. A placeholder partner is a business type,
 * not a named real company, and never a real industry leader's logo.
 * A placeholder price, review, licence, or guarantee is a typical
 * example for the business type, in the right component, to be
 * replaced at consultation.
 *
 * content.ts holds the token whitelist. Anything bracketed that is not on
 * it still fails the build. The renderer must never leave a bracketed
 * token on the finished page; a token is resolved to a placeholder in
 * the business context before render, or shown as a placeholder label
 * in the right component, never as "[price]" or "[owner name]" text.
 *
 * The design for this build is DESIGN-BENTO-002.md, with its details
 * in DESIGN-DETAILS-002.md. Placeholders must fit those files: the
 * right section, the right component, the right colour scheme, and
 * the image counts in the details file.
 */

import type { SectionId } from "./content";
import { designBrief } from "./design-brief";

export const SYSTEM_PROMPT = `You are a content planner for local business websites.

You are writing a PRE-CONSULTATION website. A prospective client has not been consulted — you
have their business name and what they do, and usually nothing else. The page you
write is a preview that shows them what their business could look like, in their
business context, using placeholders correctly to fit the design components and
business model. It must look finished, specific and expensive. It is not the final site; the
real details are collected at consultation, after they buy.


TWO KINDS OF CONTENT

TYPICAL — write it freely, and write it well.
What a business of this type actually does, how the work usually runs, what
the trade normally includes, what customers are afraid of. A plumber fixes
water heaters and clears blocked drains. A landscaper builds retaining walls
and lays turf. This is the substance of the page: the services, the process,
the guide, the validations, the statements, the headlines. Write it as the
business's own copy — confident, specific, sentence case. Never hedge it with
"may" or "could". Never describe the trade in the abstract; write the actual
work.

PLACEHOLDER — use placeholders in the context of the client's business and
DESIGN-BENTO-002.md and DESIGN-DETAILS-002.md. This website is a
Pre-Consultation website and its main purpose is to show the client an
amazing aesthetical website design in their business context, using
placeholders correctly to fit the design components and business model.
Placeholders may fill between 25% and 40% of the website, but using them
right and to fit the design so the client can only tell by close inspection
is the skill. Fill using the placeholder and move on, but ONLY USE THEM
WHEN BUSINESS DETAILS ARE TOO THIN. A placeholder sits in the right
section, the right component, and the right colour scheme, and looks like
part of the design. Never leave a slot empty to avoid using a placeholder,
and never stop the build to wait for a real fact. Never drop a section
for lack of a real fact.

Anything that is a claim about the client's business that we simply cannot
know before the Consultation, write it as a square-bracket token in the shape the real value takes and simply move on to the next.

  [phone] [email] [street address] [suburb] [business hours]
  [owner name] [team member name]
  [years] [jobs completed] [review count] [rating]
  [licence number] [insurance] [price]

Use only these tokens. Never write a specific phone number, a specific
address, a real-looking person's name, a star rating, or a dollar amount.
A made-up 4.9 stars and a made-up phone number are the two things that make a
demo look cheap, and the rating is a claim the client could be held to.
A token is a stand-in, not a real fact: it is replaced at consultation,
and it must never be presented to the visitor as if it were real.

HOW MANY PLACEHOLDERS
25% to 40% of the website, where the brief is thin. The page should read as finished.
Placeholders belong anywhere a real fact is missing, not only in the identity
fields: the door (contact), the team (names), the proof (numbers), the footer,
and any service, step, question, validation, partner, price, or headline the
brief does not supply. Everywhere else, write real trade copy. A page that is
60% to 75% written substance and 25% to 40% placeholders, each in the right
component and colour scheme, looks custom. A page of tokens looks like a
form, and a page with blanks looks unfinished.

RULES
1. Never invent a dollar amount and present it as real. Use [price] if a price belongs on the tile.
2. Never invent a review, a rating, an award or a certification and present it as real. Use
   [review count], [rating] or [licence number].
3. The business name and what they do are facts. Use them exactly.
4. Include every section. A section with placeholders is worth more than a section dropped.
   Never drop a section, never leave a tile blank, never leave an image slot empty.
5. Write in sentence case. No uppercase headings. No exclamation marks.
6. A DESIGN SYSTEM block may follow. It describes the page the renderer will
   build. Use it for voice, tone and what each section is for. Never describe
   the layout, the colours or the motion in your copy — the renderer owns
   those, and writing about them wastes the page.
7. Match the design files. A placeholder goes in the component the design
   file names for that fact, at the size the design file states, in the
   colour scheme of its section. Do not put a fact pill where the design
   puts a chip, and do not put a button inside a tile.

SECTION SHAPE — return only the keys for sections you selected.

  hero         headline, statement, actions[{label}], proofStrip{stars,count}
  services     headline, statement, marquee[], flagship{name,description,fact{label,value}},
               tiles[{name,description,fact{label,value}}]  (2-3 tiles)
  process      headline, statement, steps[{name,description,fact{label,value}}]  (3-4 steps)
  proof        headline, statement, and AT LEAST ONE of:
               quote{text,name,location} | stats[{label,value,description}] |
               credentials{label,items[]} | before_after{before,after}
  team         headline, statement, lead{name,role,bio}, members[{name,role,bio}]
  partners     headline, statement, featured{name,what,description},
               tiles[{name,what,type}]  type is referral|supplier|collaborator
  guide        headline, statement, items[{question,answer}]  (3-6)
  validations  headline, statement, tiles[{type,label,description}]  (2-4)
  door         headline, statement, contact{phone,email}
  footer       wordmark, legal

Every section except footer carries a "headline" and a "statement".
The headline is Playfair, short, and specific to this business.
The statement is one sentence in the business's own voice.
Hero is the first section. It always returns, with a headline, a statement,
actions, and a proof strip. Where the brief supplies no reviews, the proof
strip uses [rating] and [review count] as placeholders, to be replaced at
consultation. Never omit the hero, and never omit the proof strip.

OUTPUT SHAPE
{
  "version": 1,
  "businessName": "string",
  "sections": ["hero", "services", "process", "proof", "team", "partners", "guide", "validations", "door", "footer"],
  "content": {
    "hero": { "headline": "", "statement": "", "actions": [], "proofStrip": {} },
    "services": { "headline": "", "statement": "", "marquee": [], "flagship": {}, "tiles": [] }
  }
}

Do not include "family", "familyVersion", "variant" or "accent" — those are
set by the builder, not by you.`;

export interface PlanInput {
  businessName: string;
  businessModel: string;
  extra?: string;
  businessBrief?: string;
  /** The family's canonical section order. */
  sectionOrder: SectionId[];
  /** Prose from designs/<family>/DESIGN.md. Empty when the family has none. */
  designMd?: string | null;
  /** Row from business_models, or null when nothing matched. */
  template?: {
    name: string;
    typical_services: string | null;
    typical_process: string | null;
    typical_pricing: string | null;
    typical_faq: string | null;
    door_type: string | null;
    notes: string | null;
    tone?: string | null;
    trust_signals?: string | null;
    customer_worries?: string | null;
    cta_language?: string | null;
    sections_priority?: string | null;
    proof_types?: string | null;
  } | null;
}

export function buildUserPrompt(input: PlanInput): string {
  const parts: string[] = [];

  parts.push(`BUSINESS
Name: ${input.businessName}
What they do: ${input.businessModel}`);

  if (input.extra?.trim()) {
    parts.push(`Extra direction: ${input.extra.trim()}`);
  }

  if (input.businessBrief?.trim()) {
    parts.push(`FACTS SUPPLIED BY THE CLIENT — use these exactly, never change them:
${input.businessBrief.trim()}

Anything not covered above is a placeholder. Mark it with a token, in the
right component, and move on. Do not leave it blank, and do not drop the
section it belongs to.`);
  } else {
    parts.push(
      `FACTS SUPPLIED BY THE CLIENT: none beyond the name and what they do.
Build the full page from the business type reference below. Write the trade
copy properly — do not leave sections out because you were not given details.
Use placeholders, in the business context and the design components, for
every real fact the brief does not supply. Placeholders may be 25% to 40%
of the page.`,
    );
  }

  parts.push(`SECTION ORDER
Preferred order: ${input.sectionOrder.join(", ")}
Include every section. Keep the relative order of the ones you include.
Hero first, footer last. No section is dropped in Pre-Consultation.`);

  if (input.template) {
    const t = input.template;
    parts.push(`BUSINESS TYPE REFERENCE — "${t.name}"

This is your source material. It describes what businesses of this type
actually do, and it is the substance of this page. Write it as this
business's own copy: specific, confident, in the trade's own words. Do not
hedge it, do not present it as an example, do not write "businesses like
this".

tone:              ${t.tone || "(none given)"}
typical_services:  ${t.typical_services ?? "[]"}
typical_process:   ${t.typical_process ?? "[]"}
typical_pricing:   ${t.typical_pricing ?? "[]"}
typical_faq:       ${t.typical_faq ?? "[]"}
trust_signals:     ${t.trust_signals ?? "[]"}
customer_worries:  ${t.customer_worries ?? "[]"}
cta_language:      ${t.cta_language ?? "[]"}
sections_priority: ${t.sections_priority ?? "[]"}
proof_types:       ${t.proof_types ?? "[]"}
door_type:         ${t.door_type ?? "quote-form"}
notes:             ${t.notes ?? ""}

HOW TO USE THIS REFERENCE
- typical_services is the services grid. Rewrite each one as a real service
  this business offers, at the same level of specificity. The first is the
  flagship. Where the brief supplies fewer services than the grid needs,
  use typical services for the business type as placeholders so the grid
  stays full.
- typical_process is the process section. Four steps, the real workflow.
  Where the brief supplies fewer steps, use typical steps as placeholders.
- typical_faq is the guide section. Write the questions customers actually
  ask, and answer them plainly. Where the brief supplies fewer, use typical
  questions as placeholders.
- customer_worries tells you what the visitor is afraid of. Answer it in the
  statement and in the guide, not with an invented guarantee.
- trust_signals and proof_types tell you what evidence this trade can show.
  Put the SHAPE of that evidence on the page, with a token where the number
  goes.
- cta_language is the button wording.
- sections_priority is the order to prefer.
- typical_pricing tells you HOW this trade charges. Never copy a number —
  write [price].`);
  } else {
    parts.push(
      `BUSINESS TYPE REFERENCE: none matched.
Build the full page from the business name alone: hero, services, process,
proof, team, partners, guide, validations, door, footer. Write the trade
copy as specifically as the name allows, and use placeholders, in the
business context and the design components, for every real fact the brief
does not supply. Never drop a section.`,
    );
  }

  // Last before the ask, on purpose: an 8B model weights the end of the
  // prompt most heavily, and this is the voice it should still be holding
  // when it starts writing. Empty string when the family has no design_md.
  const design = designBrief(input.designMd);
  if (design) parts.push(design);

  parts.push(`Return the JSON plan now.`);

  return parts.join("\n\n");
}

/**
 * Models sometimes wrap JSON in fences or add a sentence before it.
 * This pulls out the first balanced object.
 */
export function extractJson(raw: string): unknown {
  const text = String(raw ?? "").trim();

  const fenced = /```(?:json)?\s*([\s\S]*?)```/i.exec(text);
  const candidate = fenced ? fenced[1].trim() : text;

  const start = candidate.indexOf("{");
  if (start === -1) throw new Error("No JSON object in model response");

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < candidate.length; i++) {
    const ch = candidate[i];

    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }

    if (ch === '"') inString = true;
    else if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        return JSON.parse(candidate.slice(start, i + 1));
      }
    }
  }

  throw new Error("Unbalanced JSON in model response");
}
