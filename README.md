---
name: llm-mini-builder
description: Dipdesigns LLM website builder. It turns a small business's facts into a complete website.
---

# llm-mini-builder

llm-mini is DipDesigns' LLM website builder. A user gives a prompt (business name, type, description) and the builder generates complete website templates, all designs are hand crafted styles by us at dipdesigns & a few of our favorite influences. Hope you enjoy.

## Why it exists
Dipdesigns wants to make building production quality designs taylored to your business much much faster, and more affordable for our clients.
## Architecture

Cloudflare-only. Pages serves the builder UI. One Worker runs the API, streams generation, and serves sites. Workers AI generates the sites. R2 stores generated sites. D1 stores users, sites, and versions. AI Gateway provides caching, rate limits, and fallback. Stripe handles billing.

## Status

Planning complete. The build plan is in BUILD-PLAN.md. The research and the decision are in the llm-mini research folder. The next step is Phase 0, the model bake-off.

## How to work on this project

Read STANDARDS.md first. It holds the file format, the working rules, build in phases.
