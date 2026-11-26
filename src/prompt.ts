/**
 * Prompts for the content planner.
 *
 * The model returns a ContentPlan (see content.ts). It never returns HTML,
 * CSS, GSAP, or a dollar amount.
 *
 * DOCTRINE — this is a DEMO builder, not a consultation.
 *
 * The client has not been spoken to. We have a business name and what they
 * do. The page must look finished, specific and expensive anyway, because
 * its job is to convert a buyer who is on the fence. It is not the final
 * site; the real details are collected after they pay.
 *
 * So content splits in two:
 *
 *   TYPICAL      What a business of this type actually does. Comes from
 *                business_models. Written freely, as the business's own
 *                copy. This is 80% of the page.
 *   PLACEHOLDER  A claim about THIS business that we cannot know — phone,
 *                email, address, names, review counts, licence numbers,
 *                prices. Written as a [token], never invented. This is the
 *                other 20%, and it is confined to the identity fields.
 *
 * content.ts holds the token whitelist. Anything bracketed that is not on
 * it still fails the build.
 */

import type { SectionId } from "./content";
import { designBrief } from "./design-brief";

export const SYSTEM_PROMPT = `You are a content planner for local business websites.

You are writing a DEMO. A prospective client has not been consulted — you
have their business name and what they do, and nothing else. The page you
write is a preview that shows them what their business could look like. It
must look finished, specific and expensive. It is not the final site; the
real details are collected after they buy.

You return ONLY a JSON object. No prose. No markdown. No code fences.

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

PLACEHOLDER — mark it, never invent it.
Anything that is a claim about THIS business specifically, which you cannot
know. Write it as a square-bracket token in the shape the real value takes:

  [phone] [email] [street address] [suburb] [business hours]
  [owner name] [team member name]
  [years] [jobs completed] [review count] [rating]
  [licence number] [insurance] [price]

Use only these tokens. Never write a specific phone number, a specific
address, a real-looking person's name, a star rating, or a dollar amount.
A made-up 4.9 stars and a made-up phone number are the two things that make a
demo look cheap, and the rating is a claim the client could be held to.

HOW MANY PLACEHOLDERS
Few. The page should read as finished. Placeholders belong in the door
(contact), the team (names), the proof (numbers) and the footer — the
identity fields. Everywhere else, write real trade copy. A page that is 80%
written substance and 20% tokens looks custom. A page of tokens looks like a
form.

RULES
1. Never invent a dollar amount. Use [price] if a price belongs on the tile.
2. Never invent a review, a rating, an award or a certification. Use
   [review count], [rating] or [licence number].
3. The business name and what they do are facts. Use them exactly.
4. Include every section you can fill with real trade copy. A section with
   substance is worth more than a section with tokens.
5. Write in sentence case. No uppercase headings. No exclamation marks.
6. A DESIGN SYSTEM block may follow. It describes the page the renderer will
   build. Use it for voice, tone and what each section is for. Never describe
   the layout, the colours or the motion in your copy — the renderer owns
   those, and writing about them wastes the page.

SECTION SHAPE — return only the keys for sections you selected.

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

OUTPUT SHAPE
{
  "version": 1,
  "businessName": "string",
  "sections": ["services", "process", "proof", "team", "partners", "guide", "validations", "door", "footer"],
  "content": {
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

Anything not covered above is a placeholder. Mark it with a token.`);
  } else {
    parts.push(
      `FACTS SUPPLIED BY THE CLIENT: none beyond the name and what they do.
Build the full page from the business type reference below. Write the trade
copy properly — do not leave sections out because you were not given details.
Use tokens only for the identity fields.`,
    );
  }

  parts.push(`SECTION ORDER
Preferred order: ${input.sectionOrder.join(", ")}
Include every section you can fill with real trade copy. Keep the relative
order of the ones you include.`);

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
  flagship.
- typical_process is the process section. Four steps, the real workflow.
- typical_faq is the guide section. Write the questions customers actually
  ask, and answer them plainly.
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
Build a short page from the business name alone: services, process and door.
Write the trade copy as specifically as the name allows, and tokenise every
identity field.`,
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
