import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { renderPage } from "../src/render";
import { BENTO_NOIR } from "../src/preview";
import { validatePlan } from "../src/content";

const raw = JSON.parse(readFileSync("/tmp/plan.json", "utf8"));
const plan = JSON.parse(raw[0].results[0].plan_json);

describe("stored plan", () => {
  it("validates", () => {
    const r = validatePlan(plan);
    console.log("renderable:", r.renderable);
    console.log("dropped:", r.dropped);
    console.log("errors:", r.errors);
    expect(r.renderable.length).toBeGreaterThan(0);
  });

  it("renders", () => {
    const html = renderPage(plan, BENTO_NOIR);
    const count = (html.match(/<section /g) || []).length;
    console.log("sections:", count);
    const start = html.indexOf("<body>");
    console.log(html.slice(start, start + 3000));
    expect(count).toBeGreaterThan(0);
  });
});
