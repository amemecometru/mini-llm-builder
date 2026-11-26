---
version: alpha
name: "DipDesigns bento template"
layer: Pre-Consultation
description: "Bold bento tiles on a pure black ground with white borders, red, orange, blue and electric-sea turquoise accents, Playfair Display headlines and Poppins body, for any local business. House design system for the llm-mini builder. Pre-Consultation: built from a thin business brief with design-aware placeholders, replaced with real facts at consultation."
colors:
  primary: "#000000"
  surface: "#0d0d0f"
  neutral: "#ffffff"
  on-surface: "#ffffff"
  secondary: "#ff2e2e"
  tertiary: "#ff6b00"
  accent-blue: "#2e7cff"
  accent-deep-blue: "#0038a8"
  accent-silver: "#c0c6ce"
  accent-turquoise: "#00e5c7"
  accent-copper: "#b87333"
  accent-bronze: "#cd7f32"
typography:
  headline-display:
    fontFamily: Playfair Display
    fontSize: 96px
    fontWeight: 700
    lineHeight: 0.96
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 56px
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: -0.02em
  statement:
    fontFamily: Roboto Serif
    fontSize: 30px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: -0.01em
  pill:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -0.02em
  body-md:
    fontFamily: Poppins
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.55
  label-md:
    fontFamily: Poppins
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: 0.01em
  chip:
    fontFamily: Poppins
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.01em
  button:
    fontFamily: Poppins
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1
rounded:
  tile: 20px
  photo: 14px
  field: 12px
  full: 999px
spacing:
  gutter: 12px
  tile-padding: 52px
  control-height: 50px
  chip-height: 30px
  nav-height: 78px
components:
  button-primary:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: "0 26px"
    height: "{spacing.control-height}"
  button-primary-hover:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.neutral}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: "0 26px"
    height: "{spacing.control-height}"
    border: "2px solid {colors.neutral}"
  button-secondary-hover:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.neutral}"
    border: "2px solid {colors.secondary}"
  tile-dark:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.tile}"
    padding: "{spacing.tile-padding}"
    border: "2px solid {colors.neutral}"
  tile-light:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.tile}"
    padding: "{spacing.tile-padding}"
  pill-cream:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    typography: "{typography.pill}"
    rounded: "{rounded.full}"
  pill-warm:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.primary}"
    typography: "{typography.pill}"
    rounded: "{rounded.full}"
  status-chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.chip}"
    rounded: "{rounded.full}"
    height: "{spacing.chip-height}"
    border: "1px solid {colors.neutral}"
  input-field:
    backgroundColor: transparent
    textColor: "{colors.on-surface}"
    rounded: "{rounded.field}"
    padding: "12px 16px"
    height: "{spacing.control-height}"
    border: "1px solid {colors.neutral}"
---

## Overview

DipDesigns bento is a one-page site for any local business that sells what it does, who does it, and how to reach it. The one idea is a board: bold bento tiles on a pure black ground, each dark tile edged in white, with a Playfair voice that sounds like a person rather than a template. It is for a customer deciding whether to call, and the feeling is premium and direct. The page order is hero, services, process, proof, team, partners, guide, validations, door, footer. All ten sections are specified.

## Pre-Consultation

This design is built as a Pre-Consultation website. That is a different layer from the Consultation website. In Pre-Consultation the builder has minimal real facts about a specific business, usually only the business name, business type, and business model. The builder does not wait for real facts, does not leave blanks, and does not drop sections. It builds the full page now, using design-aware and business model and business type aware placeholders for everything the brief does not supply, and those placeholders are replaced with real facts at consultation. Placeholders are about 25% to 40% of the website. Using them in the correct context is the main skill that makes the design and the marketing work.

A placeholder is never presented as a real fact about this business. It is a stand-in in the right role, the right component, and the right colour scheme, so the client can see what the finished page will look like and what to replace. A placeholder person is a role, not a named real person. A placeholder partner is a business type, not a named real company, and never a real industry leader's logo. A placeholder price, review, licence, or guarantee is a typical example for the business type, in the right component, to be replaced at consultation. A placeholder image is a photo or illustration in the client's business context, from Unsplash or stock, matched to the business type and the section. An illustration counts the same as an image.

Where this file says a word, price, fact, photo, person, partner, licence, or guarantee comes from the business brief, read it as: from the brief where the brief supplies it, and from a placeholder in the business type's context where it does not. The Consultation layer replaces every placeholder with the real fact. Nothing in this file may cause the builder to stop, leave a blank, or drop a section for lack of a real fact.

## Colors

Twelve colours: a black ground, one dark tile, white, and eight accents. Text is white on dark and near-black on light.

- **Primary (#000000):** pure black. The page ground that frames every tile, and the text on light tiles.
- **Surface (#0d0d0f):** near-black. Dark tiles, the second button, and the nav bar once you scroll.
- **Neutral and on-surface (#ffffff):** bold white. Text on dark tiles, light tiles, the main button, and the solid border on every dark tile.
- **Secondary (#ff2e2e):** vivid red. The single strong accent: the main button's hover fill, the flagship tile's accent, and the warmest field on the page. Used once per section at most.
- **Tertiary (#ff6b00):** orange. Warm pills, the second button's hover fill, and warm highlights.
- **Accent blue (#2e7cff) and accent deep blue (#0038a8):** electric blue and deep blue. Info fields, links, and cool tile accents.
- **Accent turquoise (#00e5c7):** electric-sea turquoise. The single cool accent: one cool field per page, and the marquee separator.
- **Accent silver (#c0c6ce):** silver. Metallic details, secondary text on dark tiles, and dividers.
- **Accent copper (#b87333) and accent bronze (#cd7f32):** metallic copper and bronze. Metallic feature fields, used sparingly, never both on one tile.

## Typography

Three families, one voice each.

- **Playfair Display** (weights 400 to 900) carries headings, pills, and the wordmark. The h1 is up to 96px at weight 700 with tight tracking. The closing wordmark animates its weight from 400 to 800.
- **Roboto Serif** (weights 400 and 500) carries statements and quotes at 30px.
- **Poppins** (weights 400 and 500) carries body copy at 17px (16px on phones), labels at 14px, chips at 13px, buttons at 16px and form text.
- Everything is sentence case; there is no uppercase. Sizes use `clamp()`: the h1 runs from 54px to 96px, section titles from 34px to 56px.

## Layout

The page is a board: grids of tiles separated by one gutter of 12px (8px on small screens) and framed by the pure black ground. Most sections use a twelve-column grid with copy in one block and the content beside it. Tiles pad up to 52px. At 960px and 760px the grids fold to two columns and then one, and the nav collapses into a Menu button with a full-screen overlay. The hero is a full-viewport sheet; below 760px its images and copy stack in one column.

## Elevation & Depth

There are no shadows. Depth comes from flat colour fields, overlap and sticky stacking: light tiles sit on the black ground, white borders edge every dark tile, and photos inside tiles carry a gentle parallax. Colour does the work that shadow would do.

## Shapes

One tile radius (20px) is shared by every tile, band and card. Photos inside tiles use 14px and form fields 12px. Buttons, pills, chips and the nav bar are fully rounded. The logo mark is two overlapping circles drawn in CSS.

## Components

- **button-primary:** a white pill, 50px high, black label. On hover a red fill rises from the bottom in 0.45 seconds and the label turns white.
- **button-secondary:** the dark pill for light tiles, edged in white; its hover fill is red and its border turns red.
- **tile-dark and tile-light:** the two main tile types; a dark tile is near-black with a 2px solid white border, a light tile is white with black text and no border. A red tile is the warm variant.
- **pill-cream and pill-warm:** Playfair capsules from 20px to 32px for facts, names and prices. Orange, red and turquoise variants exist.
- **status-chip:** a 30px dark capsule with a 13px label and a 1px white border for service numbers, counts and short notes; a white variant marks the flagship tile.
- **input-field:** a bare 50px box with a thin white outline and no fill, in white text on a dark tile.
- **nav bar:** transparent at the top, a fully rounded dark bar with a white border once you scroll. It hides when you scroll down and returns when you scroll up.

## Motion

The page uses GSAP + ScrollTrigger from CDN, the one motion library on every template. No other animation library. The nine techniques are fade-rise, stagger-children, split-text, parallax-light, pin-section, direction-aware-marquee, 3d-flip, scrub-timeline and batch-cards. Never the same combination on every section: split-text on large headlines, stagger-children on grids, direction-aware-marquee on marquees, parallax-light sparingly and on images only. All initial hidden states are set through GSAP, never in CSS, so if the CDN fails the page is fully readable and static. With `prefers-reduced-motion`, GSAP is off entirely and every section is fully visible with no marquee movement. Hover fills and the nav hiding on scroll keep working. If a GSAP scene fails, only its section stays static.

### Hero

The hero is the first thing the visitor sees, and it sits above services. It is a full-viewport dark tile on the pure black ground. A status-chip naming the business type and place sits at the top, then a Playfair Display headline at the display size carrying the business's promise in one line, one Roboto Serif statement at 30px that says what the business does in a single sentence, and a button row with button-primary for the main action and button-secondary for the second action. On the right, a choreographed image sequence carries photos of the business's work, 8 images by default, 3 at minimum, with a gentle parallax; the images enter on load, disperse in unison as scrolling begins, and weave into the section below. When no photo fits, a colour field in red, orange, blue or turquoise carries the business's name in Playfair, never an empty slot. Directly under the hero, the one-line proof strip carries stars and count only; where the brief supplies no reviews, use a placeholder strip typical for the business type, to be replaced at consultation.

All words, prices and facts come from the business brief where the brief supplies them, and from a placeholder in the business type's context where it does not. The headline is the business's promise, from the brief where the brief supplies it, and a typical promise for the business type where it does not. The statement is what the business does in a single sentence. The buttons are the main action and the second action, from the brief where the brief supplies them, and typical calls to action for the business type where it does not.

Motion: on load the images ease in, the headline splits into words that rise with a 0.04 second stagger, and the statement and buttons fade and rise after. Scrolling stacks the next section over the hero: the hero shrinks to 88 percent, rounds to 20px and darkens as services slides up from the bottom. The section does not pin. With reduced motion the headline is unsplit, everything is fully visible and the photos sit still.

### Services

The services section is a bento grid of what the business does, and it is on every page. The header is a status-chip naming the section, a Playfair headline, and one Roboto Serif statement that says what the business offers in a single sentence. Below the header runs a direction-aware marquee of the service names in Playfair, separated by turquoise dots, scrolling left and reversing when the visitor scrolls up.

The grid is twelve columns with a 12px gutter. The flagship service spans seven columns and two rows on the left: a light tile, white with black text, carrying the service name large, a two-line description, one fact pill, and a photo on its right half with a gentle parallax. Two dark tiles stack in the remaining five columns on the right. Below, three dark tiles sit in a row of four columns each. That is six tiles: one flagship, two stacked, three in a row. After the grid, a button row carries the primary action from the business brief, and a secondary action when the business has one.

Each tile carries a status-chip with its number, the service name in Playfair, one line of Poppins body copy, and exactly one fact pill: a price, a turnaround, or a scope. The fact pill holds a real number where the brief supplies one, and a placeholder fact typical for the business type where it does not, to be replaced at consultation. The flagship is the business's main service, the one the owner names first. Four to six tiles; with fewer than four services in the brief, use typical services for the business type as placeholders so the grid stays full, and no slot is left empty. Photos are real, from the business or from Unsplash, where the brief supplies them, and placeholder images in the business context where it does not; when no photo fits a tile, use a colour field in red, orange, blue or turquoise, never an empty image slot.

Motion: the headline splits into words that rise with a 0.04 second stagger as the header enters at 80% of the viewport. The grid staggers in, tiles fading and rising 24px with a 0.08 second stagger as the grid enters at 85%. The flagship photo parallaxes lightly, yPercent -8 to 8, scrubbed to the tile. The marquee runs direction-aware and pauses off screen. On hover a tile lifts 4px and its border turns red; the flagship pill scales to 1.04. With reduced motion the tiles are fully visible, the marquee is static, and the headline is unsplit.

### Process

The process section is four steps in a row that show how a site goes from a conversation to live. The header is a status-chip naming the section, a Playfair headline, and one Roboto Serif statement that says what happens in a single sentence. Below the header, four dark tiles sit in a row of three columns each, connected by a progress line that runs along the top of the tiles.

Each tile carries a status-chip with its number (01-04), the step name in Playfair, one line of Poppins body copy, and exactly one fact pill: a turnaround, a scope, or what is included. The steps are the business's workflow where the brief supplies it, and typical steps for the business type where it does not: intake, build, review, live. Four steps; with fewer than four steps in the brief, use typical steps as placeholders so the row stays full, and no slot is left empty. After the steps, a button row carries the primary action from the business brief.

Motion: the header fades and rises as it enters. The section pins while the visitor scrolls through it, for one viewport height of scroll; a progress line in silver fills in red, scrubbed to the scroll, from 0 to 100% across the four tiles. Each tile activates as the line reaches it: its border turns red, its number chip fills red, and its content fades in. Only the step the line has reached carries a red border; the others keep their white border, so red stays the single strong accent. On phones the section does not pin; the tiles stack in a single column and fade in with a stagger as the grid enters. With reduced motion there is no pin and no scrub; all four steps are fully visible and the line is full.

### Proof

The proof section is the evidence that the business actually delivers, and it sits directly after process so the visitor reads "how it works" and then "it worked for these people". The header is a status-chip naming the section, a Playfair headline, and one Roboto Serif statement that says what the proof adds up to in a single sentence. Below the header, the grid is twelve columns with a 12px gutter.

The flagship proof spans seven columns on the left: a light tile, white with black text, carrying one customer quote in Roboto Serif at 30px, set as a statement rather than a testimonial card, with a cream pill under it holding the customer's name and their suburb or trade. Two dark tiles stack in the remaining five columns on the right. Each carries a status-chip with its label, one number in Playfair Display at the display size, and one line of Poppins body copy under it: years trading, jobs completed, or a guarantee period. Below, three dark tiles sit in a row of four columns each: a before-and-after photo pair, a second quote with a silver five-dot rating, and a credentials tile carrying licences, insurance or memberships.

Every fact on this section comes from the business brief or from the business type's `proof_types` where the brief supplies it, and from a placeholder in the business type's context where it does not, to be replaced at consultation. A placeholder quote is never presented as a real customer. If the business has no reviews in the brief, the flagship slot takes a placeholder number or a placeholder quote instead and the grid stays full. The section is never dropped in Pre-Consultation. Red appears once at most, on the credentials tile's chip; the rating dots are silver, never turquoise, because turquoise is spent on the services marquee.

Motion: the headline splits into words that rise with a 0.04 second stagger as the header enters at 80% of the viewport. The tiles enter in batches of three with batch-cards as the grid crosses 85%, so the grid arrives as a rhythm rather than one wave. The before-and-after tile uses 3d-flip: it turns on hover, and on tap on phones, to show the after frame. The numbers count up from zero with a scrub-timeline tied to the tile's own scroll progress, once, and never loop. The section does not pin. With reduced motion the tiles are fully visible, the numbers sit at their final value, and the before-and-after renders as a static side-by-side pair with no flip.

### Team

The team section is the people behind the business, and it sits after proof so the visitor reads the evidence and then meets the people who did it. The header is a status-chip naming the section, a Playfair headline, and one Roboto Serif statement that says who the team are in a single sentence. Below the header, the grid is twelve columns with a 12px gutter.

The lead tile spans seven columns and two rows on the left: a light tile, white with black text, carrying the person's photo on its right half, their name large in Playfair, their role, and two lines of Poppins body copy about what they do. Two dark tiles stack in the remaining five columns on the right. Below, three dark tiles sit in a row of four columns each. That is six tiles: one lead, two stacked, three in a row. Each smaller tile carries a photo, a name in Playfair, and a role on its front face, with one line of Poppins body copy on its back face. A business with fewer people reflows the grid and no slot is left empty; a one-person business shows the founder in the lead tile and a "how I work" tile beside them.

Every person comes from the business brief where the brief supplies them, and from a placeholder person in a role typical for the business type where it does not, never a named real person, to be replaced at consultation. Photos are real, from the business, where the brief supplies them, and placeholder images of a person at work in the business type where it does not. When a photo is missing, the tile uses a colour field in red, orange, blue or turquoise with the person's initials in Playfair.

Motion: the header fades and rises as it enters. The grid staggers in, tiles fading and rising 24px with a 0.08 second stagger as the grid enters at 85%. The smaller member tiles flip in 3d on hover, and on tap on phones, to reveal the person's one-line bio on the back face. The lead tile does not flip; its bio sits on the front and its photo parallaxes lightly, yPercent -8 to 8, scrubbed to the tile. The section does not pin. With reduced motion the tiles are fully visible, there is no flip, and the photo sits still.

### Partners

The partners section is the businesses the business works with, and it sits after team so the visitor meets the people and then sees who they work alongside. The header is a status-chip naming the section, a Playfair headline, and one Roboto Serif statement that says what the partnerships add up to in a single sentence. Below the header runs a direction-aware marquee of the partner names in Playfair, separated by silver dots, scrolling left and reversing when the visitor scrolls up.

The grid is twelve columns with a 12px gutter. The featured partner spans seven columns and two rows on the left: a light tile, white with black text, carrying the partner's name large in Playfair, what they do, and two lines of Poppins body copy about how the partnership works. Two dark tiles stack in the remaining five columns on the right. Below, three dark tiles sit in a row of four columns each. That is six tiles: one featured, two stacked, three in a row. Each tile carries the partner's name in Playfair, what they do in one line of Poppins body copy, and a status-chip with the partnership type (referral, supplier, collaborator). A business with fewer partners reflows the grid and no slot is left empty. The section is never dropped in Pre-Consultation.

Every partner comes from the business brief where the brief supplies them, and from a placeholder partner in a business type typical for the client's business where it does not, never a named real company, and never a real company's logo, to be replaced at consultation. Logos are real, from the partner business, where the brief supplies them. When a logo is missing, the tile uses a placeholder mark for the partner business type, or the partner's name in Playfair on a colour field in red, orange, blue or turquoise.

Motion: the header splits into words that rise with a 0.04 second stagger as the header enters at 80% of the viewport. The marquee runs direction-aware and pauses off screen. The grid enters in batches of three with batch-cards as the grid crosses 85%. On hover a tile lifts 4px and its border turns red. The section does not pin. With reduced motion the tiles are fully visible, the marquee is static, and the headline is unsplit.

### Guide

The guide section is what to expect and how it works, in the business's own words, and it sits after partners so the visitor sees who the business works with and then learns what working with them is like. The header is a status-chip naming the section, a Playfair headline, and one Roboto Serif statement that says what the guide covers in a single sentence. Below the header, the guide is a list of accordion items in dark tiles, each with a question in Playfair and an answer in Poppins body copy that expands on click or tap. The first item is open when the section arrives.

Each item carries one question and one answer, both from the business brief or from the questions customers actually ask where the brief supplies them, and from typical questions for the business type where it does not, to be replaced at consultation. Four to six items; with fewer in the brief, use typical questions as placeholders so the list stays full, and no slot is left empty. After the list, a button row carries the primary action from the business brief.

Motion: the header fades and rises as it enters. The accordion items stagger in, fading and rising 24px with a 0.08 second stagger as the list enters at 85%. An item expands with a GSAP height animation when opened and collapses when another opens, so only one answer is visible at a time. The section does not pin. With reduced motion the items are fully visible, the first answer is open, and opening an item shows its answer at once with no animation.

### Validations

The validations section is the business's own checks and guarantees, and it sits after guide so the visitor learns what to expect and then sees how the business stands behind it. The header is a status-chip naming the section, a Playfair headline, and one Roboto Serif statement that says what the business guarantees in a single sentence. Below the header, four dark tiles sit in a row of three columns each. Each tile carries a status-chip with the validation type, a label in Playfair, and one line of Poppins body copy under it: a licence, insurance, a guarantee period, or a process check. Proof carries the customer evidence; validations carries the business's own standing behind its work.

Every validation comes from the business brief where the brief supplies it, and from a placeholder validation typical for the business type where it does not, to be replaced at consultation. Four tiles; with fewer validations in the brief, use typical validations as placeholders so the row stays full, and no slot is left empty. The section is never dropped in Pre-Consultation.

Motion: the header fades and rises as it enters. The tiles stagger in, fading and rising 24px with a 0.08 second stagger as the row enters at 85%. The section does not pin. With reduced motion the tiles are fully visible.

### Door

The door section is the way in, and it sits near the end so the visitor has seen the work, the people and the proof before they are asked to act. A light tile spans the full twelve columns: a status-chip naming the section sits at the top, then a Playfair headline at the large size, one Roboto Serif statement that says what happens next in a single sentence, and below that two halves — on the left, the business's contact details (phone and email) with a button-primary for the main action and a button-secondary for the second action; on the right, a short form with input-fields for name, email and message whose button opens a pre-addressed email carrying the form's contents.

Every contact detail comes from the business brief where the brief supplies it, and from a placeholder in the business type's context where it does not, to be replaced at consultation. Never leave the contact tile blank. The form's button opens the visitor's mail app with the business's email address and the form's contents already filled in; it does not submit to a server and it does not store anything.

Motion: the headline splits into words that rise with a 0.04 second stagger as the door enters at 80% of the viewport. The contact details and the form fade and rise as they enter. The section does not pin. With reduced motion the headline is unsplit and everything is fully visible.

### Footer

The footer is the closing, and it sits at the end of the page. A dark tile spans the full twelve columns: the business's wordmark in Playfair Display at the display size, set large across the tile, with the weight animating from 400 to 800 as the footer scrolls into view; below the wordmark, the navigation links in Poppins labels, the business's contact details, and a small legal line (copyright and the business's name) in Poppins at the chip size.

Every link and detail comes from the business brief where the brief supplies it, and from a placeholder in the business type's context where it does not, to be replaced at consultation. Never leave the footer blank. The wordmark is the business's name in Playfair, set in sentence case.

Motion: the wordmark's weight animates from 400 to 800 with a scrub-timeline tied to the footer's own scroll progress, once, and never loops. The links and details fade and rise as they enter. The section does not pin. With reduced motion the wordmark sits at its final weight and everything is fully visible.

## Do's and Don'ts

- Do keep one tile radius, one gutter and no shadows.
- Do keep the pure black ground and white borders on dark tiles only.
- Do use red as the single strong accent and turquoise as the single cool accent.
- Do keep GSAP + ScrollTrigger as the only motion library, with initial states set through GSAP only.
- Do build new motion from the nine techniques, matched per section, never the same combination twice in a row.
- Do use placeholders when business details are too thin and it is necessary. Use placeholders in the client's business context, always matched to the section's design components as best as possible in the colour scheme. This will be about 25% to 40% of the website, and knowing how to use placeholders is the main skill that makes the design and marketing amazing.
- Do take every service, price and fact from the business brief where the brief supplies it, and from a placeholder in the business type's context where it does not. Never leave an empty tile, and never drop a section in Pre-Consultation.
- Don't add a third typeface, and don't set text in uppercase.
- Don't use a soft pastel palette, stock icon cards, a dark photo overlay or gradients.
- Don't present a placeholder as a real fact about this business: no named real person, no named real partner company, no real company's logo, no invented review presented as a real customer, no invented licence or guarantee presented as held.
- Don't leave an empty tile or an empty image slot.

## Sections

All ten sections are specified, in this order.

- hero — specified
- services — specified
- process — specified
- proof — specified
- team — specified
- partners — specified
- guide — specified
- validations — specified
- door — specified
- footer — specified
