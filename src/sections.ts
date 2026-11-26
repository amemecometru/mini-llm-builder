/**
 * Section templates.
 *
 * Each function is pure: (content) => HTML string.
 * No model involvement. No CSS values. No animation code.
 *
 * Markup implements DESIGN.md exactly: status-chip, Playfair headline,
 * Roboto Serif statement, tile-dark / tile-light, pill-cream / pill-warm.
 *
 * A section whose required slots are absent returns "" and is dropped.
 * There are no [bracketed] placeholders anywhere in this file.
 */

import type {
  Action,
  ContentPlan,
  DoorContent,
  FooterContent,
  GuideContent,
  HeroContent,
  PartnersContent,
  ProcessContent,
  ProofContent,
  SectionId,
  ServicesContent,
  TeamContent,
  ValidationsContent,
} from "./content";

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

export function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const text = esc;

function section(id: SectionId, inner: string, motion?: string): string {
  const attr = motion ? ` data-motion="${motion}"` : "";
  return `<section class="s-${id}" id="${id}"${attr}>\n${inner}\n</section>`;
}

/** Every section opens the same way: chip, Playfair headline, serif statement. */
function head(chip: string, headline: string, statement: string, motion = "split-text"): string {
  return `    <header class="s-head">
      <span class="status-chip">${text(chip)}</span>
      <h2 class="h2" data-motion="${motion}">${text(headline)}</h2>
      <p class="statement" data-motion="fade-rise">${text(statement)}</p>
    </header>`;
}

function actions(a?: { primary?: Action; secondary?: Action }): string {
  if (!a?.primary) return "";
  const primary = `<a class="button-primary" href="${esc(a.primary.href)}">${text(a.primary.label)}</a>`;
  const secondary = a.secondary
    ? `<a class="button-secondary" href="${esc(a.secondary.href)}">${text(a.secondary.label)}</a>`
    : "";
  return `      <div class="actions">${primary}${secondary}</div>`;
}

function marquee(items: string[] | undefined): string {
  if (!items?.length) return "";
  const cells = items
    .map((m) => `<li class="marquee__item">${text(m)}</li>`)
    .join('<li class="marquee__sep" aria-hidden="true"></li>');
  return `    <div class="marquee" data-motion="direction-aware-marquee">
      <ul class="marquee__track">${cells}</ul>
    </div>`;
}

function visual(src: string | undefined, alt: string, motion = "parallax-light"): string {
  if (!src) return `<div class="visual" data-motion="${motion}" aria-hidden="true"></div>`;
  return `<img class="visual" src="${esc(src)}" alt="${esc(alt)}" loading="lazy" data-motion="${motion}">`;
}

/* ------------------------------------------------------------------ */
/* 1. Hero — PENDING. Provisional until DESIGN.md specifies it.        */
/* ------------------------------------------------------------------ */

export function hero(c: HeroContent): string {
  if (!c?.headline || !c?.statement) return "";

  const proof =
    c.proof && (c.proof.rating || c.proof.count)
      ? `      <p class="proof">${[c.proof.rating, c.proof.count]
          .filter(Boolean)
          .map((v) => `<span>${text(v)}</span>`)
          .join('<span class="proof__dot" aria-hidden="true"></span>')}</p>`
      : "";

  return section(
    "hero",
    `  <div class="wrap">
${head("", c.headline, c.statement)}
${actions(c.actions)}
${proof}
  </div>`,
    "stacking-sheets",
  );
}

/* ------------------------------------------------------------------ */
/* 2. Services                                                         */
/* ------------------------------------------------------------------ */

export function services(c: ServicesContent): string {
  if (!c?.headline || !c?.flagship?.name || !c?.marquee?.length) return "";

  const f = c.flagship;
  const tiles = (c.tiles ?? []).slice(0, 3);

  const flagship = `      <article class="tile tile-light tile--flagship" data-motion="fade-rise">
        <span class="status-chip status-chip--light">01</span>
        <h3 class="tile__title">${text(f.name)}</h3>
        <p class="tile__body">${text(f.description)}</p>
        ${factPill(f.fact, "cream")}
        ${visual(f.image?.src, f.image?.alt ?? f.name)}
      </article>`;

  const rest = tiles
    .map(
      (t, i) => `      <article class="tile tile-dark" data-motion="batch-cards">
        <span class="status-chip">${String(i + 2).padStart(2, "0")}</span>
        <h3 class="tile__title">${text(t.name)}</h3>
        <p class="tile__body">${text(t.description)}</p>
        ${factPill(t.fact, "warm")}
      </article>`,
    )
    .join("\n");

  return section(
    "services",
    `  <div class="wrap">
${head("Services", c.headline, c.statement)}
${marquee(c.marquee)}
    <div class="bento">
${flagship}
${rest}
    </div>
${actions(c.actions)}
  </div>`,
  );
}

/* ------------------------------------------------------------------ */
/* 3. Process                                                          */
/* ------------------------------------------------------------------ */

export function process(c: ProcessContent): string {
  if (!c?.headline || !c?.steps?.length) return "";

  const steps = c.steps
    .slice(0, 4)
    .map(
      (s, i) => `      <li class="step">
        <span class="status-chip">${String(i + 1).padStart(2, "0")}</span>
        <h3 class="tile__title">${text(s.name)}</h3>
        <p class="tile__body">${text(s.description)}</p>
        ${factPill(s.fact, "warm")}
      </li>`,
    )
    .join("\n");

  return section(
    "process",
    `  <div class="wrap">
${head("Process", c.headline, c.statement, "fade-rise")}
    <ol class="steps" data-motion="scrub-timeline">
${steps}
    </ol>
${actions(c.actions)}
  </div>`,
    "pin-section",
  );
}

/* ------------------------------------------------------------------ */
/* 4. Proof                                                            */
/* ------------------------------------------------------------------ */

export function proof(c: ProofContent): string {
  if (!c?.headline) return "";

  const hasEvidence = Boolean(
    c.quote || c.stats?.length || c.credentials?.items?.length || c.before_after,
  );
  if (!hasEvidence) return "";

  const quote = c.quote
    ? `      <figure class="tile tile-light tile--flagship" data-motion="fade-rise">
        <blockquote class="statement">${text(c.quote.text)}</blockquote>
        <figcaption>
          <span class="pill pill-cream">${text(c.quote.name)}${c.quote.location ? ` · ${text(c.quote.location)}` : ""}</span>
        </figcaption>
      </figure>`
    : "";

  const stats = (c.stats ?? [])
    .slice(0, 2)
    .map(
      (s) => `      <article class="tile tile-dark" data-motion="scrub-timeline">
        <span class="status-chip">${text(s.label)}</span>
        <p class="stat">${text(s.value)}</p>
        <p class="tile__body">${text(s.description)}</p>
      </article>`,
    )
    .join("\n");

  const beforeAfter = c.before_after
    ? `      <article class="tile tile-dark tile--flip" data-motion="3d-flip">
        <span class="status-chip">Before</span>
        ${visual(c.before_after.before.src, c.before_after.before.alt, "")}
        <span class="status-chip status-chip--after">After</span>
        ${visual(c.before_after.after.src, c.before_after.after.alt, "")}
      </article>`
    : "";

  const secondQuote = c.second_quote
    ? `      <article class="tile tile-dark" data-motion="batch-cards">
        <span class="status-chip">Review</span>
        <p class="tile__body">${text(c.second_quote.text)}</p>
        <span class="rating" aria-label="${c.second_quote.rating} out of 5">${"●".repeat(
          Math.max(0, Math.min(5, c.second_quote.rating)),
        )}</span>
      </article>`
    : "";

  const credentials = c.credentials?.items?.length
    ? `      <article class="tile tile-dark" data-motion="batch-cards">
        <span class="status-chip">${text(c.credentials.label)}</span>
        <ul class="credential-list">
${c.credentials.items.map((i) => `          <li>${text(i)}</li>`).join("\n")}
        </ul>
      </article>`
    : "";

  return section(
    "proof",
    `  <div class="wrap">
${head("Proof", c.headline, c.statement)}
    <div class="bento">
${quote}
${stats}
    </div>
    <div class="bento bento--row">
${beforeAfter}
${secondQuote}
${credentials}
    </div>
  </div>`,
  );
}

/* ------------------------------------------------------------------ */
/* 5. Team                                                             */
/* ------------------------------------------------------------------ */

export function team(c: TeamContent): string {
  if (!c?.lead?.name) return "";

  const person = (p: { name: string; role: string; bio: string; photo?: { src: string; alt: string } }, flagship: boolean) =>
    `      <article class="tile ${flagship ? "tile-light tile--flagship" : "tile-dark"}" data-motion="${flagship ? "fade-rise" : "batch-cards"}">
        ${visual(p.photo?.src, p.photo?.alt ?? p.name)}
        <h3 class="tile__title">${text(p.name)}</h3>
        <span class="role">${text(p.role)}</span>
        <p class="tile__body">${text(p.bio)}</p>
      </article>`;

  const rest = (c.members ?? [])
    .slice(0, 5)
    .map((m) => person(m, false))
    .join("\n");

  return section(
    "team",
    `  <div class="wrap">
${head("Team", c.headline, c.statement, "fade-rise")}
    <div class="bento">
${person(c.lead, true)}
${rest}
    </div>
  </div>`,
  );
}

/* ------------------------------------------------------------------ */
/* 6. Partners                                                         */
/* ------------------------------------------------------------------ */

export function partners(c: PartnersContent): string {
  if (!c?.featured?.name || !c?.tiles?.length) return "";

  const featured = `      <article class="tile tile-light tile--flagship" data-motion="fade-rise">
        <span class="status-chip status-chip--light">${text(c.featured.what)}</span>
        <h3 class="tile__title">${text(c.featured.name)}</h3>
        <p class="tile__body">${text(c.featured.description)}</p>
      </article>`;

  const tiles = c.tiles
    .slice(0, 3)
    .map(
      (t) => `      <article class="tile tile-dark" data-motion="batch-cards">
        <span class="status-chip">${text(t.type)}</span>
        <h3 class="tile__title">${text(t.name)}</h3>
        <p class="tile__body">${text(t.what)}</p>
      </article>`,
    )
    .join("\n");

  return section(
    "partners",
    `  <div class="wrap">
${head("Partners", c.headline, c.statement)}
${marquee(c.marquee)}
    <div class="bento">
${featured}
${tiles}
    </div>
  </div>`,
  );
}

/* ------------------------------------------------------------------ */
/* 7. Guide                                                            */
/* ------------------------------------------------------------------ */

export function guide(c: GuideContent): string {
  if (!c?.items?.length) return "";

  const items = c.items
    .slice(0, 6)
    .map(
      (f, i) => `      <li class="faq" data-motion="fade-rise"${i === 0 ? " open" : ""}>
        <h3 class="tile__title">${text(f.question)}</h3>
        <p class="tile__body">${text(f.answer)}</p>
      </li>`,
    )
    .join("\n");

  return section(
    "guide",
    `  <div class="wrap">
${head("Guide", c.headline, c.statement, "fade-rise")}
    <ul class="faq-list">
${items}
    </ul>
${actions(c.actions)}
  </div>`,
  );
}

/* ------------------------------------------------------------------ */
/* 8. Validations                                                      */
/* ------------------------------------------------------------------ */

export function validations(c: ValidationsContent): string {
  if (!c?.tiles?.length) return "";

  const tiles = c.tiles
    .slice(0, 4)
    .map(
      (v) => `      <article class="tile tile-dark" data-motion="batch-cards">
        <span class="status-chip">${text(v.type)}</span>
        <h3 class="tile__title">${text(v.label)}</h3>
        <p class="tile__body">${text(v.description)}</p>
      </article>`,
    )
    .join("\n");

  return section(
    "validations",
    `  <div class="wrap">
${head("Validations", c.headline, c.statement, "fade-rise")}
    <div class="bento bento--row">
${tiles}
    </div>
  </div>`,
  );
}

/* ------------------------------------------------------------------ */
/* 9. Door                                                             */
/* ------------------------------------------------------------------ */

export function door(c: DoorContent): string {
  if (!c?.contact?.phone && !c?.contact?.email) return "";

  const contact = [
    c.contact.phone ? `<li><span>Phone</span> <a href="tel:${esc(c.contact.phone)}">${text(c.contact.phone)}</a></li>` : "",
    c.contact.email ? `<li><span>Email</span> <a href="mailto:${esc(c.contact.email)}">${text(c.contact.email)}</a></li>` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const fields = (c.form?.fields ?? ["Name", "Email", "Message"])
    .map((f) => {
      const id = esc(f.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
      const isLong = /message|detail|note|describe/i.test(f);
      const control = isLong
        ? `<textarea id="${id}" name="${id}" rows="4"></textarea>`
        : `<input id="${id}" name="${id}" type="text" required>`;
      return `        <div class="field">
          <label for="${id}">${text(f)}</label>
          ${control}
        </div>`;
    })
    .join("\n");

  return section(
    "door",
    `  <div class="wrap">
${head("Contact", c.headline, c.statement)}
    <div class="door">
      <div class="tile tile-dark door__contact">
        <ul class="contact">
${contact}
        </ul>
${actions(c.actions)}
      </div>
      <form class="tile tile-dark door__form" action="${esc(c.form?.mailto ?? `mailto:${c.contact.email ?? ""}`)}" method="post">
${fields}
        <button class="button-primary" type="submit">Send</button>
      </form>
    </div>
  </div>`,
  );
}

/* ------------------------------------------------------------------ */
/* 10. Footer                                                          */
/* ------------------------------------------------------------------ */

export function footer(c: FooterContent): string {
  if (!c?.wordmark) return "";

  const links = (c.links ?? [])
    .map((l) => `<li><a href="${esc(l.href)}">${text(l.label)}</a></li>`)
    .join("\n");

  const contact = [
    c.contact?.phone ? `<li><span>Phone</span> ${text(c.contact.phone)}</li>` : "",
    c.contact?.email ? `<li><span>Email</span> ${text(c.contact.email)}</li>` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return section(
    "footer",
    `  <div class="wrap">
    <p class="wordmark" data-motion="scrub-timeline">${text(c.wordmark)}</p>
    ${links ? `<ul class="footer-links">\n${links}\n    </ul>` : ""}
    ${contact ? `<ul class="contact">\n${contact}\n    </ul>` : ""}
    <p class="colophon">${text(c.legal)}</p>
  </div>`,
  );
}

/* ------------------------------------------------------------------ */
/* dispatcher                                                          */
/* ------------------------------------------------------------------ */

export function renderSection(id: SectionId, plan: ContentPlan): string {
  const c = plan.content as Record<string, any>;

  switch (id) {
    case "hero":
      return c.hero ? hero(c.hero) : "";
    case "services":
      return c.services ? services(c.services) : "";
    case "process":
      return c.process ? process(c.process) : "";
    case "proof":
      return c.proof ? proof(c.proof) : "";
    case "team":
      return c.team ? team(c.team) : "";
    case "partners":
      return c.partners ? partners(c.partners) : "";
    case "guide":
      return c.guide ? guide(c.guide) : "";
    case "validations":
      return c.validations ? validations(c.validations) : "";
    case "door":
      return c.door ? door(c.door) : "";
    case "footer":
      return c.footer ? footer(c.footer) : "";
    default:
      return "";
  }
}

/** A fact pill, or nothing when the plan has no fact for this item. */
function factPill(
  fact: { label?: string; value?: string } | undefined,
  variant: "cream" | "warm" = "warm",
): string {
  if (!fact) return "";
  const label = String(fact.label ?? "").trim();
  const value = String(fact.value ?? "").trim();
  if (!label && !value) return "";
  return `<span class="pill pill-${variant}">${esc(label)} ${esc(value)}</span>`;
}
