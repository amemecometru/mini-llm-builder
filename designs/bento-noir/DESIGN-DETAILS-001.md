---
name: DESIGN-DETAILS-001.md
layer: Pre-Consultation
description: Line-by-line design description for the bento-noir skin, for a Pre-Consultation website. The element inventory the main DESIGN-BENTO-001.md does not carry: image counts, pill and button placement, and text sizes and fonts for every element in every section. Business-model neutral; the builder works from a thin business brief, business name, business type, and business model, and fills gaps with design-aware placeholders in the client's business context, to be replaced with real facts at consultation.
---

## Purpose

This file is the line-by-line companion to DESIGN-BENTO-001.md. DESIGN-BENTO-001.md carries the system: colours, typography, layout, components, motion and the ten sections. This file carries the details DESIGN-BENTO-001.md does not fill in: how many images each section holds, where every pill and button sits, and the text size and font of every element in every section. Read the two files together. DESIGN-BENTO-001.md says what the design is; this file says what is on the page, line by line, so the builder can put the design together in detail.

This is a Pre-Consultation website. That is a different layer from the Consultation website. In Pre-Consultation the builder has minimal real facts about a specific business, usually only the business name, business type, and business model. The builder does not wait for real facts, does not leave blanks, and does not drop sections. It builds the full page now, using design-aware and business model and business type aware placeholders for everything the brief does not supply, and those placeholders are replaced with real facts at consultation. Placeholders are about 25% to 40% of the website. Using them in the correct context is the main skill that makes the design and the marketing work.

A placeholder is never presented as a real fact about this business. It is a stand-in in the right role, the right component, and the right colour scheme, so the client can see what the finished page will look like and what to replace. A placeholder person is a role, not a named real person. A placeholder partner is a business type, not a named real company, and never a real industry leader's logo. A placeholder price, review, licence, or guarantee is a typical example for the business type, in the right component, to be replaced at consultation. A placeholder image is a photo or illustration in the client's business context, from Unsplash or stock, matched to the business type and the section, and it counts toward the image total in the summary. An illustration counts the same as an image.

The description stays business-model neutral. It names the business, the service, the person, the partner, the offer and the price as roles, never as a specific business. The builder fills every word, price and fact it can from the business brief, and fills the rest with a placeholder in that role.

The reference for the layout pattern is the Cannonball water park template: a design whose HTML, CSS, JavaScript and GSAP motion work when the colours are edited and a different business is plugged in. The pattern is what this file describes; the water park content is not. No business name, place, price or review from the reference appears here.

## How to read this file

Each section is described top to bottom, then left to right, element by element. Every element is named, its font and size are given, and its placement is stated. Image counts are given per section as a number and a placement. Pills and buttons are named by their component (pill-cream, pill-warm, status-chip, button-primary, button-secondary) and their placement is stated. Where a section reflows, the rule is stated. No section is dropped in Pre-Consultation.

Text sizes use the type scale from DESIGN-BENTO-001.md. Headline-display is Playfair Display 96px, weight 700, line-height 0.96, letter-spacing -0.03em, clamped from 54px to 96px. Headline-lg is Playfair Display 56px, weight 700, line-height 1.02, letter-spacing -0.02em, clamped from 34px to 56px. Statement is Roboto Serif 30px, weight 400, line-height 1.3, letter-spacing -0.01em. Pill is Playfair Display 32px, weight 600, line-height 1.1, letter-spacing -0.02em, ranging from 20px to 32px. Body-md is Poppins 17px, weight 400, line-height 1.55, 16px on phones. Label-md is Poppins 14px, weight 500, line-height 1.35, letter-spacing 0.01em. Chip is Poppins 13px, weight 500, line-height 1, letter-spacing 0.01em. Button is Poppins 16px, weight 500, line-height 1. Tile-title is Playfair Display 28px, weight 700, line-height 1.1, letter-spacing -0.02em; it is the size for service names, step names, person names, partner names, validation labels and accordion questions. Everything is sentence case; there is no uppercase.

## Global rules

[ PLACEHOLDERS. USE PLACEHOLDERS WHEN BUSINESS DETAILS ARE TOO THIN & IT'S NECESSARY. Use PLACEHOLDERS IN THE CLIENT'S BUSINESS CONTEXT, ALWAYS MATCH TO THE SECTION'S DESIGN'S COMPONENTS AS BEST AS POSSIBLE IN THE DESIGN COLOUR SCHEME. A PLACEHOLDER NEEDS TO LOOK LIKE IT FITS IN THE DESIGN, then move on. This will cover approx. 25% to 40% of the website, and BLENDING PLACEHOLDERS INTO THE DESIGN & IMPLEMENTING ONLY WHEN NECESSARY IS A CRUCIAL SKILL THAT MAKES THE DESIGN & MARKETING AMAZING ]. Do not leave a slot empty to avoid using a placeholder, and [ DO NOT STOP THE BUILD to wait for a real fact ]. A placeholder is replaced with the real fact at consultation.

Images. An image is a real photograph in the context of the client's business name, business type, or business model and its working processes, or a placeholder image in that same context. A colour field, a logo, an initial or a CSS mark is not counted as an image. An illustration counts the same as an image and goes toward the total image count. A photo tile that has no real photo uses a placeholder image in the business context, or a colour field in red, orange, blue or turquoise, never an empty image slot. A person tile that has no real photo uses a placeholder image of a person at work in the business type, or a colour field with the person's initials in Playfair. A partner tile that has no logo uses a placeholder mark for the partner business type, or the partner's name in Playfair on a colour field, never a real company's logo. The total image count for a page is given in the summary at the end of this file.

Pills. A fact pill (pill-cream or pill-warm) holds one fact: a price, a turnaround, a scope or a count. One fact pill per tile, never two. The flagship tile's pill is Playfair 32px; a standard tile's pill is Playfair 20px. A status-chip holds a number, a label or a short note in Poppins 13px. A status-chip sits at the top of its tile or section, never in the middle of body copy. In Pre-Consultation a fact pill may hold a placeholder fact typical for the business type, in the right component, to be replaced at consultation.

Buttons. A button row sits after the grid or list in its section, never inside a tile. Button-primary is the main action; button-secondary is the second action, shown only when the business has one. A button's label comes from the business brief where the brief supplies one, and from a typical call to action for the business type where it does not, to be replaced at consultation.

Text. Every word, price and fact comes from the business brief where the brief supplies it. Where it does not, use a placeholder in the business type's context, in the right component and size, so the page is complete. Never leave a tile blank, and never drop a section for lack of a real fact. At consultation, every placeholder is replaced with the real word, price and fact.

## Header

The header is the nav bar. It is transparent at the top of the page and becomes a fully rounded dark bar with a white border once the visitor scrolls. It is 78px high. It hides when the visitor scrolls down and returns when the visitor scrolls up.

Left to right, the header holds three things. On the left, the business name in Playfair Display at the tile-title size (28px, weight 700), set in sentence case, in white. In the middle, the navigation links in Poppins label-md (14px, weight 500), in white, one link per section: services, process, proof, team, partners, guide, validations, door. On the right, a button-primary for the main action from the business brief, 50px high, white pill with a black label in Poppins 16px, weight 500. Where the brief gives no main action, use a typical call to action for the business type as a placeholder.

Below 960px the navigation links collapse into a Menu button. The Menu button is a dark pill with a white border, Poppins 16px, weight 500, 50px high. Tapping it opens a full-screen overlay in the dark tile colour, with the navigation links stacked in Playfair Display at the headline-lg size (56px, weight 700) and the main action as a button-primary at the bottom.

The header holds no image. The logo mark is two overlapping circles drawn in CSS, not an image file.

## Hero

The hero is a full-viewport dark tile on the pure black ground. It holds a choreographed image sequence, not a single photo: the images enter on load, disperse in unison as scrolling begins, and weave into the section below. The sequence is 8 images by default, 3 at minimum. Fewer than 5 loses the opening. The 3 image minimum is for when the hero uses larger images with less animation; the 5 to 8 image count is better fitting an active opening scroll animation sequence, and that is what makes the hero great. The images are placeholder images in the business context where the brief supplies no real photo, with a gentle parallax (yPercent -8 to 8, scrubbed to the tile). When no photo fits, use a colour field in red, orange, blue or turquoise carrying the business's name in Playfair Display at the headline-lg size, never an empty slot.

Top to bottom, left to right, the hero holds these elements. At the top, a status-chip naming the business type and place, in Poppins 13px, weight 500, 30px high, dark with a 1px white border. Below the chip, the headline in Playfair Display at the headline-display size (96px, weight 700, line-height 0.96, letter-spacing -0.03em, clamped from 54px to 96px), carrying the business's promise in one line, from the business brief where the brief supplies it, and from a typical promise for the business type where it does not. Below the headline, one Roboto Serif statement at 30px, weight 400, line-height 1.3, letter-spacing -0.01em, saying what the business does in a single sentence. Below the statement, a button row with button-primary for the main action and button-secondary for the second action, each 50px high, Poppins 16px, weight 500.

Directly under the hero, the one-line proof strip carries stars and count only, in Poppins 14px, weight 500. Where the brief supplies no reviews, use a placeholder strip typical for the business type, to be replaced at consultation. Do not omit the strip.

Image count: 3 images, for a maximum of 8 images in the section and a minimum of 3 images. Motion: on load the images ease in, the headline splits into words that rise with a 0.04 second stagger, and the statement and buttons fade and rise after. Scrolling stacks the next section over the hero: the hero shrinks to 88 percent, rounds to 20px and darkens as services slides up from the bottom. The section does not pin. With reduced motion the headline is unsplit, everything is fully visible and the photos sit still.

## Services

The services section is a bento grid of what the business does. The header holds three elements, top to bottom: a status-chip naming the section in Poppins 13px, weight 500, 30px high; a Playfair headline at the headline-lg size (56px, weight 700, line-height 1.02, letter-spacing -0.02em, clamped from 34px to 56px); and one Roboto Serif statement at 30px, weight 400, line-height 1.3, saying what the business offers in a single sentence.

Below the header runs a direction-aware marquee of the service names in Playfair Display at the headline-lg size (56px, weight 700), separated by turquoise dots, scrolling left and reversing when the visitor scrolls up. Service names come from the brief where the brief supplies them, and from typical services for the business type where it does not.

The grid is twelve columns with a 12px gutter. It holds six tiles: one flagship, two stacked, three in a row. The flagship service spans seven columns and two rows on the left: a light tile, white with black text. Top to bottom, the flagship holds a status-chip with its number in Poppins 13px, weight 500; the service name large in Playfair Display at the headline-lg size (56px, weight 700); a two-line description in Poppins 17px, weight 400, line-height 1.55; one fact pill in Playfair 32px, weight 600 (a price, a turnaround or a scope, placeholder where the brief is thin); and a photo on its right half with a gentle parallax. The photo is 1 image.

Two dark tiles stack in the remaining five columns on the right. Each holds, top to bottom: a status-chip with its number in Poppins 13px, weight 500; the service name in Playfair Display at the tile-title size (28px, weight 700, line-height 1.1); one line of Poppins body copy at 17px, weight 400; and exactly one fact pill in Playfair 20px, weight 600. Each stacked tile holds 1 image when the business has a photo for that service; when no photo fits, the tile uses a placeholder image in the business context, or a colour field in red, orange, blue or turquoise, never an empty image slot.

Below, three dark tiles sit in a row of four columns each. Each holds the same four elements as the stacked tiles: a status-chip with its number, the service name in Playfair 28px, one line of Poppins body copy at 17px, and exactly one fact pill in Playfair 20px. Each row tile holds 1 image when the business has a photo; otherwise a placeholder image or a colour field.

After the grid, a button row carries button-primary for the main action from the business brief, and button-secondary for the second action when the business has one. Each button is 50px high, Poppins 16px, weight 500.

Image count: 3 images on the flagship and first tiles, plus 1 image per remaining tile that has a photo, for a maximum of 6 images in the section and a minimum of 3 images. Four to six tiles; with fewer than four services in the brief, use typical services for the business type as placeholders so the grid stays full, and no slot is left empty. A business with one service still gets 3 images of that service. A business with ten or fifteen services does not show all fifteen, because 15 images ruins the component's aesthetics; use 4 to 6 in that situation.

When a service has two tiers or options, the flagship tile uses the offer-card: a light tile with a tall photo and two tabs, one per option, each with a price and a four-item list. The offer-card holds 1 image (the tall photo). Each tab holds a price in Playfair Display at the tile-title size (28px, weight 700) and a four-item list in Poppins 17px, weight 400. Prices and list items are placeholders typical for the business type where the brief is thin, to be replaced at consultation.

Motion: the headline splits into words that rise with a 0.04 second stagger as the header enters at 80% of the viewport. The grid staggers in, tiles fading and rising 24px with a 0.08 second stagger as the grid enters at 85%. The flagship photo parallaxes lightly, yPercent -8 to 8, scrubbed to the tile. The marquee runs direction-aware and pauses off screen. On hover a tile lifts 4px and its border turns red; the flagship pill scales to 1.04. With reduced motion the tiles are fully visible, the marquee is static, and the headline is unsplit.

## Process

The process section is four steps in a row. The header holds three elements, top to bottom: a status-chip naming the section in Poppins 13px, weight 500, 30px high; a Playfair headline at the headline-lg size (56px, weight 700); and one Roboto Serif statement at 30px, weight 400, saying what happens in a single sentence.

Below the header, four dark tiles sit in a row of three columns each, connected by a progress line that runs along the top of the tiles. Each tile holds, top to bottom: a step-number, a 56px circle carrying its number (01-04) in Playfair Display 28px, weight 700, centred; the step name in Playfair Display at the tile-title size (28px, weight 700, line-height 1.1); one line of Poppins body copy at 17px, weight 400; and exactly one fact pill in Playfair 20px, weight 600 (a turnaround, a scope or what is included). The steps are the business's workflow where the brief supplies it, and typical steps for the business type where it does not: intake, build, review, live. The process is shown, not described. An image is worth a thousand words.

After the steps, a button row carries button-primary for the main action from the business brief, 50px high, Poppins 16px, weight 500.

Image count: 4 images, for a maximum of 8 images in the section and a minimum of 4 images. One image per step, plus transition frames. The images are placeholder images in the business context where the brief supplies no real photo.

Motion: the header fades and rises as it enters. The section pins while the visitor scrolls through it, for one viewport height of scroll; a progress line in silver fills in red, scrubbed to the scroll, from 0 to 100% across the four tiles. Each tile activates as the line reaches it: its border turns red, its step-number fills red, and its content fades in. Only the step the line has reached carries a red border; the others keep their white border, so red stays the single strong accent. On phones the section does not pin; the tiles stack in a single column and fade in with a stagger as the grid enters. With reduced motion there is no pin and no scrub; all four steps are fully visible and the line is full.

Four steps; with fewer than four steps in the brief, use typical steps for the business type as placeholders so the row stays full, and no slot is left empty.

## Proof

The proof section is the evidence that the business delivers. The header holds three elements, top to bottom: a status-chip naming the section in Poppins 13px, weight 500, 30px high; a Playfair headline at the headline-lg size (56px, weight 700); and one Roboto Serif statement at 30px, weight 400, saying what the proof adds up to in a single sentence.

The grid is twelve columns with a 12px gutter. The flagship proof spans seven columns on the left: a light tile, white with black text. Top to bottom, it holds one customer quote in Roboto Serif at 30px, weight 400, line-height 1.3, set as a statement rather than a testimonial card, and below the quote a cream pill (pill-cream) in Playfair 20px, weight 600, holding the customer's name and their suburb or trade. Where the brief supplies no real quote, use a placeholder quote typical for the business type, in the right component, to be replaced at consultation. Never present a placeholder quote as a real customer.

Two dark tiles stack in the remaining five columns on the right. Each holds, top to bottom: a status-chip with its label in Poppins 13px, weight 500; one number in Playfair Display at the headline-display size (96px, weight 700, line-height 0.96, clamped from 54px to 96px); and one line of Poppins body copy at 17px, weight 400, under it: years trading, jobs completed, or a guarantee period. Numbers come from the brief where the brief supplies them, and from typical numbers for the business type where it does not, to be replaced at consultation.

Below, three dark tiles sit in a row of four columns each. Left to right: a before-and-after photo pair, a second quote with a silver five-dot rating, and a credentials tile carrying licences, insurance or memberships. The before-and-after tile holds 2 images (the before frame and the after frame). The second-quote tile holds the quote in Roboto Serif 30px, weight 400, and a silver five-dot rating below it. The credentials tile holds a status-chip with its label in Poppins 13px, weight 500, and the credentials in Poppins 17px, weight 400, one per line.

Image count: 2 images (the before-and-after pair in one tile), plus 1 image per remaining proof tile that has a photo, for a maximum of 6 images in the section and a minimum of 2 images. Before-and-after pairs, three pairs at maximum.

Every fact comes from the business brief or from the business type's proof_types where the brief supplies it. Where it does not, use a placeholder in the business type's context, in the right component, to be replaced at consultation. The section is never dropped in Pre-Consultation. If the brief has no reviews, the flagship slot takes a placeholder number or a placeholder quote instead and the grid stays full. Red appears once at most, on the credentials tile's chip; the rating dots are silver, never turquoise, because turquoise is spent on the services marquee.

Motion: the headline splits into words that rise with a 0.04 second stagger as the header enters at 80% of the viewport. The tiles enter in batches of three with batch-cards as the grid crosses 85%, so the grid arrives as a rhythm rather than one wave. The before-and-after tile uses 3d-flip: it turns on hover, and on tap on phones, to show the after frame. The numbers count up from zero with a scrub-timeline tied to the tile's own scroll progress, once, and never loop. The section does not pin. With reduced motion the tiles are fully visible, the numbers sit at their final value, and the before-and-after renders as a static side-by-side pair with no flip.

## Team

The team section is the people behind the business. The header holds three elements, top to bottom: a status-chip naming the section in Poppins 13px, weight 500, 30px high; a Playfair headline at the headline-lg size (56px, weight 700); and one Roboto Serif statement at 30px, weight 400, saying who the team are in a single sentence.

The grid is twelve columns with a 12px gutter. It holds six tiles: one lead, two stacked, three in a row. The lead tile spans seven columns and two rows on the left: a light tile, white with black text. Top to bottom, it holds the person's name large in Playfair Display at the headline-lg size (56px, weight 700); their role in Poppins 14px, weight 500, letter-spacing 0.01em; and two lines of Poppins body copy at 17px, weight 400, about what they do. A photo sits on the tile's right half, 1 image, with a gentle parallax. The photo is a real photo from the business where the brief supplies one, and a placeholder image of a person at work in the business type where it does not.

Two dark tiles stack in the remaining five columns on the right. Below, three dark tiles sit in a row of four columns each. Each smaller tile holds, on its front face: a photo (1 image), a name in Playfair Display at the tile-title size (28px, weight 700), and a role in Poppins 14px, weight 500. On its back face, one line of Poppins body copy at 17px, weight 400, the person's one-line bio.

Image count: 1 image on the lead tile, plus 1 image per remaining tile that has a photo, for a maximum of 6 images in the section and a minimum of 1 image (the lead photo, with the other tiles using colour fields). 3 images is optimal. A one-person business gets the lead photo and colour fields. Only 1 team image is for a larger group style image of the entire office or crew. When a photo is missing, the tile uses a placeholder image in the business context, or a colour field in red, orange, blue or turquoise with the person's initials in Playfair Display at the tile-title size (28px, weight 700).

People come from the business brief where the brief supplies them. Where it does not, use placeholder people in roles typical for the business type, never a named real person, to be replaced at consultation. A business with fewer people reflows the grid and no slot is left empty; a one-person business shows the founder in the lead tile and a "how I work" tile beside them.

Motion: the header fades and rises as it enters. The grid staggers in, tiles fading and rising 24px with a 0.08 second stagger as the grid enters at 85%. The smaller member tiles flip in 3d on hover, and on tap on phones, to reveal the person's one-line bio on the back face. The lead tile does not flip; its bio sits on the front and its photo parallaxes lightly, yPercent -8 to 8, scrubbed to the tile. The section does not pin. With reduced motion the tiles are fully visible, there is no flip, and the photo sits still.

## Partners

The partners section is the businesses the business works with. The header holds three elements, top to bottom: a status-chip naming the section in Poppins 13px, weight 500, 30px high; a Playfair headline at the headline-lg size (56px, weight 700); and one Roboto Serif statement at 30px, weight 400, saying what the partnerships add up to in a single sentence.

Below the header runs a direction-aware marquee of the partner names in Playfair Display at the headline-lg size (56px, weight 700), separated by silver dots, scrolling left and reversing when the visitor scrolls up.

The grid is twelve columns with a 12px gutter. It holds six tiles: one featured, two stacked, three in a row. The featured partner spans seven columns and two rows on the left: a light tile, white with black text. Top to bottom, it holds the partner's name large in Playfair Display at the headline-lg size (56px, weight 700); what they do in Poppins 17px, weight 400; and two lines of Poppins body copy at 17px, weight 400, about how the partnership works.

Two dark tiles stack in the remaining five columns on the right. Below, three dark tiles sit in a row of four columns each. Each tile holds, top to bottom: the partner's name in Playfair Display at the tile-title size (28px, weight 700); what they do in one line of Poppins body copy at 17px, weight 400; and a status-chip with the partnership type (referral, supplier, collaborator) in Poppins 13px, weight 500.

Image count: 0 photos. Logos are real, from the partner business, where the brief supplies them; a tile holds 1 logo when the business has one. When a logo is missing, the tile uses a placeholder mark for the partner business type, or the partner's name in Playfair Display at the tile-title size (28px, weight 700) on a colour field in red, orange, blue or turquoise. Never use a real company's logo, and never use a real industry leader's logo. Partners come from the business brief where the brief supplies them. Where it does not, use placeholder partners in business types typical for the client's business, never named real companies, to be replaced at consultation. A business with fewer partners reflows the grid and no slot is left empty. The section is never dropped in Pre-Consultation.

Motion: the header splits into words that rise with a 0.04 second stagger as the header enters at 80% of the viewport. The marquee runs direction-aware and pauses off screen. The grid enters in batches of three with batch-cards as the grid crosses 85%. On hover a tile lifts 4px and its border turns red. The section does not pin. With reduced motion the tiles are fully visible, the marquee is static, and the headline is unsplit.

## Guide

The guide section is what to expect and how it works, in the business's own words. The header holds three elements, top to bottom: a status-chip naming the section in Poppins 13px, weight 500, 30px high; a Playfair headline at the headline-lg size (56px, weight 700); and one Roboto Serif statement at 30px, weight 400, saying what the guide covers in a single sentence.

Below the header, the guide is a list of accordion items in dark tiles. Each item holds, top to bottom: a question in Playfair Display at the tile-title size (28px, weight 700, line-height 1.1) and an answer in Poppins body copy at 17px, weight 400, line-height 1.55, that expands on click or tap. The first item is open when the section arrives.

Each item carries one question and one answer, both from the business brief or from the questions customers actually ask where the brief supplies them, and from typical questions for the business type where it does not, to be replaced at consultation. Four to six items; with fewer in the brief, use typical questions as placeholders so the list stays full, and no slot is left empty.

After the list, a button row carries button-primary for the main action from the business brief, 50px high, Poppins 16px, weight 500.

Image count: 0 images, for a maximum of 6 images in the section and a minimum of 0 images. One supporting image per open item, 4 images by default. The images are placeholder images in the business context where the brief supplies no real photo.

Motion: the header fades and rises as it enters. The accordion items stagger in, fading and rising 24px with a 0.08 second stagger as the list enters at 85%. An item expands with a GSAP height animation when opened and collapses when another opens, so only one answer is visible at a time. The section does not pin. With reduced motion the items are fully visible, the first answer is open, and opening an item shows its answer at once with no animation.

## Validations

The validations section is the business's own checks and guarantees. The header holds three elements, top to bottom: a status-chip naming the section in Poppins 13px, weight 500, 30px high; a Playfair headline at the headline-lg size (56px, weight 700); and one Roboto Serif statement at 30px, weight 400, saying what the business guarantees in a single sentence.

Below the header, four dark tiles sit in a row of three columns each. Each tile holds, top to bottom: a status-chip with the validation type in Poppins 13px, weight 500; a label in Playfair Display at the tile-title size (28px, weight 700); and one line of Poppins body copy at 17px, weight 400, under it: a licence, insurance, a guarantee period, or a process check. Proof carries the customer evidence; validations carries the business's own standing behind its work.

Image count: 0 images, for a maximum of 6 images in the section and a minimum of 0 images. One visual per credential, 4 images by default. The images are placeholder images in the business context where the brief supplies no real photo.

Every validation comes from the business brief where the brief supplies it. Where it does not, use a placeholder validation typical for the business type, in the right component, to be replaced at consultation. Four tiles; with fewer validations in the brief, use typical validations as placeholders so the row stays full, and no slot is left empty. The section is never dropped in Pre-Consultation.

Motion: the header fades and rises as it enters. The tiles stagger in, fading and rising 24px with a 0.08 second stagger as the row enters at 85%. The section does not pin. With reduced motion the tiles are fully visible.

## Door

The door section is the way in. A light tile spans the full twelve columns. Top to bottom, it holds: a status-chip naming the section in Poppins 13px, weight 500, 30px high; a Playfair headline at the headline-lg size (56px, weight 700); and one Roboto Serif statement at 30px, weight 400, saying what happens next in a single sentence.

Below the statement, the tile splits into two halves. On the left, the business's contact details: the phone number in Poppins 17px, weight 500, and the email address in Poppins 17px, weight 400, one per line; below them a button row with button-primary for the main action and button-secondary for the second action, each 50px high, Poppins 16px, weight 500. On the right, a short form with three input-fields (name, email, message), each 50px high with a 12px radius and a 1px white outline, in Poppins 17px, weight 400, and a button below the form that opens a pre-addressed email carrying the form's contents.

Image count: 0 images. The door section holds no photos.

Every contact detail comes from the business brief where the brief supplies it. Where it does not, use a placeholder in the business type's context, in the right component, to be replaced at consultation. Never leave the contact tile blank. The form's button opens the visitor's mail app with the business's email address and the form's contents already filled in; it does not submit to a server and it does not store anything.

Motion: the headline splits into words that rise with a 0.04 second stagger as the door enters at 80% of the viewport. The contact details and the form fade and rise as they enter. The section does not pin. With reduced motion the headline is unsplit and everything is fully visible.

## Footer

The footer is the closing. A dark tile spans the full twelve columns. Top to bottom, it holds: the business's wordmark in Playfair Display at the headline-display size (96px, weight animating from 400 to 800 as the footer scrolls into view, clamped from 54px to 96px), set large across the tile, in sentence case; below the wordmark, the navigation links in Poppins label-md (14px, weight 500), one link per section; below the links, the business's contact details (phone and email) in Poppins 14px, weight 500; and a small legal line (copyright and the business's name) in Poppins at the chip size (13px, weight 500).

Image count: 0 images. The footer holds no photos. The logo mark is two overlapping circles drawn in CSS, not an image file.

Every link and detail comes from the business brief where the brief supplies it. Where it does not, use a placeholder in the business type's context, in the right component, to be replaced at consultation. Never leave the footer blank. The wordmark is the business's name in Playfair, set in sentence case.

Motion: the wordmark's weight animates from 400 to 800 with a scrub-timeline tied to the footer's own scroll progress, once, and never loops. The links and details fade and rise as they enter. The section does not pin. With reduced motion the wordmark sits at its final weight and everything is fully visible.

## Image count summary

The number of images on a page, by section. An image is a real photograph in the context of the client's business name, business type, or business model and its working processes, or a placeholder image in that same context. A colour field, a logo, an initial or a CSS mark is not counted as an image. An illustration is counted the same as an image and goes toward the total image count. Each line leads with the maximum, which is the number the builder attaches; the minimum is the fewest number of images acceptable. The reason for the minimum and maximum number of images is that each section's component's aesthetics is a balance: too many is incorrect and feels cluttered, too few derails the viewer's wow factor. The middle numbers tend to have the best combination of business detail and marketing our clients are asking for.

- Header: 0 images.
- Hero: 8 images (3 minimum, 8 maximum). The hero is a choreographed image sequence, not a single photo: the images enter on load, disperse in unison as scrolling begins, and weave into the section below. Fewer than 5 loses the opening. The 3 image minimum is for when the hero uses larger images with less animation; the 5 to 8 image count is better fitting an active opening scroll animation sequence, and that is what makes the hero great.
- Services: 6 images (3 minimum, 6 maximum). One per tile. A business with one service still gets 3 images of that service; a business with ten or fifteen services does not show all fifteen, because 15 images ruins the component's aesthetics; use 4 to 6 in that situation.
- Process: 8 images (4 minimum, 8 maximum). One per step, plus transition frames. The process is shown, not described. An image is worth a thousand words.
- Proof: 6 images (2 minimum, 6 maximum). Before-and-after pairs, three pairs at maximum.
- Team: 6 images (1 minimum, 3 is optimal, 6 maximum). One per tile. A one-person business gets the lead photo and colour fields, never a named real person as a placeholder. Only 1 team image is for a larger group style image of the entire office or crew.
- Partners: 0 images (0 photographs; up to 6 logos). Logos are real, from the partner business, where the brief supplies them; otherwise use a placeholder mark for the partner business type, never a real company's logo. A missing logo is the partner's name on a colour field.
- Guide: 4 images (0 minimum, 6 maximum). One supporting image per open item.
- Validations: 4 images (0 minimum, 6 maximum). One visual per credential.
- Door: 0 images.
- Footer: 0 images.

A full page holds 42 images by default, 46 at maximum and 13 at minimum. Below 40 the page loses the weight that closes an undecided buyer; above 46 the images start competing with the business's message. The minimum is 3 hero images, 3 service images, 4 process images, 2 proof images and 1 lead team image, which sum to 13. The maximum is 8 hero, 6 services, 8 process, 6 proof, 6 team, 6 guide and 6 validations, which sum to 46. The page copy budget is 1,200 words across the ten sections.

## Do's and Don'ts

- Do read this file alongside DESIGN-BENTO-001.md; neither file alone is enough to build the page.
- Do use placeholders when business details are too thin and it is necessary. Use placeholders in the client's business context, always matched to the section's design components as best as possible in the colour scheme. This will be about 25% to 40% of the website, and knowing how to use placeholders is the main skill that makes the design and marketing amazing. Make the placeholder look like part of the design as best as you can, then move on.
- Do count the images per section before building; a section with no image slot must not gain one, and a section with an image slot must never be left empty.
- Do attach the maximum the section allows that can be filled with a design-aware placeholder, not the minimum. A section that could hold six images and holds one is the failure this file exists to prevent.
- Do use colour fields, initials and CSS marks to fill a slot when no real image and no placeholder image fits. A filled slot is never a broken slot.
- Do keep every section on the page in Pre-Consultation, with placeholders where the brief is thin. Never drop a section, and never leave a tile blank.
- Do place one fact pill per tile and one button row per section, in the places this file states.
- Do set every element in the font and size this file states; the tile-title size is Playfair Display 28px, weight 700.
- Don't put two fact pills on one tile, and don't put a button inside a tile.
- Don't set a tile title, a step name, a person name, a partner name, a validation label or an accordion question in any size other than the tile-title size.
- Don't present a placeholder as a real fact about this business: no named real person, no named real partner company, no real company's logo, no invented review presented as a real customer, no invented licence or guarantee presented as held.
- Don't wait for a real fact, leave a blank, or drop a section in Pre-Consultation. That is the Consultation layer's job, after the client supplies the real facts.
