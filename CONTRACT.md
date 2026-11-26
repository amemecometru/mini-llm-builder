# Design Contract

The rules that keep 20 designs consistent. Read this before writing a variant,
a design bundle, or a skin.

If everyone follows this, parallel work — human or agent — produces consistent
output. If nobody does, you get drift, and drift is what this document exists
to prevent.

---

# Part 1 — The token contract

## The rule

**A component may reference `var(--token)` and nothing else.**

No hex codes. No px sizes. No font names. No layout properties. If a component
needs a value that isn't in this list, the list gets a new token — added to
`normalizeSkin()` and to every skin in the same commit.

## The 25 tokens

Every skin emits all 25. `normalizeSkin()` in `src/render.ts` is the only place
they are produced.

### Colour (8)

| Token | Meaning | Example |
|---|---|---|
| `--color-bg` | Page background | `#0a0a0a` |
| `--color-surface` | Cards, panels, raised blocks | `#0f0f0f` |
| `--color-text` | Primary text | `#f5f5f5` |
| `--color-text-muted` | Secondary text, captions | `#a1a1a1` |
| `--color-border` | Hairlines and dividers | `rgba(245,245,245,.18)` |
| `--color-brand` | Buttons, rules, emphasis | `#e8c07a` |
| `--color-brand-contrast` | Text **on** `--color-brand` | `#0a0a0a` |
| `--color-accent` | Labels, numerals, placeholders | `#e8c07a` |

**Rule:** `--color-brand-contrast` must reach 4.5:1 against `--color-brand`.
`normalizeSkin()` picks white or near-black automatically.

**Rule:** `--color-accent` is used sparingly — section labels, numbers,
placeholder underlines. If it appears more than four times per page, it stops
reading as an accent.

### Type (7)

| Token | Meaning | Example |
|---|---|---|
| `--font-display` | Headlines | `"Fraunces", Georgia, serif` |
| `--font-body` | Everything else | `"Inter", system-ui, sans-serif` |
| `--text-display` | H1 | `clamp(2.9rem, 7.4vw, 6.8rem)` |
| `--text-h1` | H3 / card titles | `clamp(1.3rem, 2vw, 1.7rem)` |
| `--text-h2` | H2 / section titles | `clamp(1.95rem, 4vw, 3.2rem)` |
| `--text-body` | Paragraphs | `1.0625rem` |
| `--text-small` | Captions, labels | `0.875rem` |

**Rule:** display sizes use `clamp()`. Never a fixed px size for anything above
body.

**Rule:** `--font-display` and `--font-body` may be the same family, but a
design is stronger when they differ.

### Spacing (3)

| Token | Meaning | Example |
|---|---|---|
| `--space-section` | Vertical padding between sections | `clamp(4.5rem, 9vw, 8.5rem)` |
| `--space-gutter` | Horizontal page padding, grid gaps | `clamp(1.25rem, 4vw, 3rem)` |
| `--space-stack` | Vertical rhythm inside a block | `1.25rem` |

**Rule:** all three use `clamp()` or `rem`. Never px.

### Shape (4)

| Token | Meaning | Example |
|---|---|---|
| `--radius-card` | Cards, panels | `12px` |
| `--radius-control` | Buttons, inputs | `8px` |
| `--border-width` | Hairline thickness | `1px` |
| `--shadow-card` | Card elevation | `0 1px 2px rgba(0,0,0,.06)` |

**Rule:** a skin that forbids rounded corners sets both radii to `0px`. That is
a valid skin, not a broken one.

### Motion (3)

| Token | Meaning | Example |
|---|---|---|
| `--motion-duration` | Transition length | `700ms` |
| `--motion-ease` | Easing curve | `cubic-bezier(.16,1,.3,1)` |
| `--motion-distance` | Travel distance | `24px` |

**Rule:** motion values come from the design's `motion` profile
(`subtle` / `balanced` / `assertive`). A variant never hardcodes a duration.

## What is NOT a token

| Not a token | Where it belongs |
|---|---|
| Section order | `ContentPlan.sections` |
| Grid columns, layout variants | The variant function |
| Which components appear | The design bundle |
| Content, copy, prices | The plan |
| Animation technique choice | `data-motion` attribute |

**The moment a skin controls layout, `N skins × M designs` collapses back to
hand-building.** This is the most important boundary in the system.

---

# Part 2 — The variant interface

## The signature

Every variant is a pure function. Same shape, every time.

```ts
export function servicesVariant(
  v: ServicesVariant,        // which shape
  items: ServiceItem[],      // content, already validated
): string;                   // a complete <section> element
```

Rules:

1. **Pure.** No `env`, no `fetch`, no `Date.now()`, no randomness.
2. **Returns one `<section>`.** With an `id` matching the section name.
3. **Never throws.** Missing content renders as a placeholder, not an error.
4. **Escapes everything.** Use `esc()` from `sections.ts`, then the placeholder
   treatment.
5. **Declares motion with attributes.** `data-motion="fade-rise"`. Never inline
   animation code.

## The escaping rule

```ts
function text(v: unknown): string {
  return esc(v).replace(/\[([^\]]+)\]/g, '<span class="ph">[$1]</span>');
}
```

`esc()` prevents injection. The `.replace()` makes `[Add your price]` render as
a visible placeholder rather than plain text. Both are mandatory.

## The motion rule

A variant declares *what should animate*, never *how*:

```html
<ul data-motion="stagger-children">
```

The motion library in `render.ts` reads the attribute and attaches behaviour.
Valid values: `fade-rise`, `stagger-children`, `split-text`, `parallax-light`,
`pin-section`, `scrub-timeline`, `batch-cards`, `3d-flip`,
`direction-aware-marquee`.

**A section with no `data-motion` simply does not animate.** That is a valid
choice, not an omission.

## Registering a new variant

Five steps. Miss one and it silently does nothing.

1. **Add to the type union** in `variants.ts`
   ```ts
   export type ServicesVariant = "grid" | "bento" | "list" | "expanding" | "rows";
   ```

2. **Add a branch** in the variant function
   ```ts
   if (v === "rows") { return servicesRows(items); }
   ```

3. **Add the CSS** to `BASE_CSS` in `render.ts`, using tokens only.

4. **Add it to the lab** in `preview.ts` so it appears at `/lab`.

5. **Reference it** from a design bundle in `designs.ts` if it should ship.

## Accessibility floor

Every variant must satisfy these. No exceptions.

- Semantic elements: `<section>`, `<ul>`, `<li>`, `<h2>`, `<h3>`
- Heading order: `h1` once (hero), `h2` per section, `h3` per item
- Every `<img>` has `alt` (empty `alt=""` for decorative)
- Focus states use `outline`, never `outline: none` alone
- `prefers-reduced-motion` is handled globally — variants inherit it
- Interactive elements are real `<a>` or `<button>`, keyboard reachable

---

# Part 3 — Reference variant, annotated

A complete, production-quality variant. Every decision is explained.

```ts
/**
 * services / rows
 *
 * The signature move from the Editorial Warm design: numbered hairline rows
 * instead of cards. It reads as a considered list rather than a template grid,
 * and it scales to any number of services without looking sparse or crowded.
 */
export function servicesRows(items: ServiceItem[]): string {
  // 1. Build the list. Every string goes through text() — escaping plus
  //    placeholder treatment. Never interpolate raw content.
  const rows = items
    .map(
      (s, i) => `    <li class="svc-row">
      <span class="svc-n" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>
      <h3>${text(s.name)}</h3>
      <p>${text(s.desc)}</p>
    </li>`,
    )
    .join("\n");

  // 2. One <section>, with an id matching the section name so anchor links
  //    and the /lab harness both work.
  return `<section class="s-services v-services-rows" id="services">
  <div class="wrap">
    <p class="label">What we do</p>
    <ul class="svc-list" data-motion="stagger-children">
${rows}
    </ul>
  </div>
</section>`;
}
```

The CSS that goes with it — tokens only, no literals:

```css
/* The label is the accent's job: small, uppercase, letter-spaced.
   It appears once per section, which is what keeps the accent meaningful. */
.label{font-size:.7rem;font-weight:600;letter-spacing:.17em;
  text-transform:uppercase;color:var(--color-accent);margin-bottom:1.6rem}

/* A hairline top border on the list, and one under each row.
   --color-border is already a low-opacity text colour, so it reads as a
   rule rather than a line. */
.svc-list{list-style:none;border-top:1px solid var(--color-border)}

/* Three columns: number, name, description. The description column is
   wider than the name column because descriptions are longer — the grid
   follows the content, not the other way round. */
.svc-row{display:grid;grid-template-columns:3.5rem 1fr 1.15fr;
  gap:clamp(1rem,3vw,3rem);align-items:baseline;
  padding-block:1.9rem;border-bottom:1px solid var(--color-border)}

/* Tabular numerals so 01, 02, 10 all align. Without this the numbers
   jitter as they go from single to double digits. */
.svc-n{font-size:.72rem;letter-spacing:.1em;color:var(--color-accent);
  font-variant-numeric:tabular-nums;font-weight:600}

/* The service name uses the display face — it is the loudest thing in
   the row and should carry the type identity of the design. */
.svc-row h3{font-family:var(--font-display)}

/* Descriptions are muted and capped at 46ch. Past that the eye loses
   the line on a wide screen. */
.svc-row p{color:var(--color-text-muted);font-size:.96rem;max-width:46ch}

/* Below 760px the three-column grid stops working. Drop to two columns
   and let the description span under the name. */
@media(max-width:760px){
  .svc-row{grid-template-columns:2.75rem 1fr;row-gap:.45rem}
  .svc-row p{grid-column:2}
}
```

## Why these choices

| Decision | Reason |
|---|---|
| Rows, not cards | Cards make every service look equal and interchangeable. Rows imply a considered list. |
| Numbered | Gives the eye a scan path and makes the section feel catalogued. |
| Hairlines, not boxes | Fewer borders means the type does the work. |
| Description column wider | Follows content length, not a symmetric grid. |
| `tabular-nums` | Numbers align; the list looks deliberate. |
| Accent on the number only | One accent per row. More would compete with the service name. |
| `max-width: 46ch` | Reading comfort on wide screens. |
| `stagger-children` | The rows enter in sequence, which reads as a list being laid out. |

---

# Part 4 — Checklist: adding a variant

```
[ ] Type union updated in variants.ts
[ ] Branch added to the variant function
[ ] Function is pure — no env, no fetch, no Date.now(), no random
[ ] Returns exactly one <section id="...">
[ ] Every string passes through text() (esc + placeholder)
[ ] Motion declared with data-motion, not inline code
[ ] CSS uses only var(--token) — zero literals
[ ] Responsive rule added below 760px
[ ] Heading order correct (h2 for section, h3 for items)
[ ] Images have alt
[ ] Added to /lab in preview.ts
[ ] Referenced from a design bundle if it should ship
```

---

# Part 5 — Checklist: adding a design bundle

```
[ ] id is kebab-case and unique
[ ] skinId exists in the skins table
[ ] hero / services / process / validations variants all exist
[ ] motion profile chosen deliberately (subtle / balanced / assertive)
[ ] blurb is one sentence, written for a buyer
[ ] Appears in /preview
[ ] Added to PREVIEW_DESIGN_IDS only when it is finished
```

---

# Part 6 — Checklist: adding a skin

```
[ ] All 25 tokens present
[ ] --color-brand-contrast reaches 4.5:1 against --color-brand
[ ] Display sizes use clamp()
[ ] Spacing uses clamp() or rem
[ ] No layout properties anywhere in the token values
[ ] Renders correctly in /lab?skin=<id>
```

---

# The one-sentence version

**Components reference tokens. Variants return one section and declare motion
by attribute. Designs are data. Skins are values.**

Everything else in this document follows from those four sentences.
