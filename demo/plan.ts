import type { ContentPlan } from "../src/content";

/**
 * A hand-written plan for InfinitPrinter.
 *
 * This is exactly the shape the model will return — except a human wrote it,
 * so every placeholder is honest and nothing is invented.
 *
 * Note: no dollar amounts anywhere. No reviews. No hours. No turnaround times.
 */
export const infinitPrinterPlan: ContentPlan = {
  version: 1,
  businessName: "InfinitPrinter",
  sections: [
    "hero",
    "services",
    "process",
    "team",
    "roadmap",
    "partners",
    "events",
    "pricing",
    "guide",
    "validations",
    "door",
    "footer",
  ],
  content: {
    hero: {
      headline: "Print that makes Richmond look sharp",
      subline:
        "Business cards, banners and apparel for local businesses in Richmond, Indiana.",
      cta: "Get a quote",
      proof: { rating: "[Add your rating]", count: "[Add review count]" },
    },

    services: [
      { name: "Business cards", desc: "Heavy stock, clean edges, ready when you need them." },
      { name: "Banners and signage", desc: "Large format for storefronts, events and job sites." },
      { name: "Apparel", desc: "Shirts and workwear with your logo, printed or embroidered." },
      { name: "Flyers and brochures", desc: "Handouts and mailers that hold up in a stack." },
      { name: "Packaging and labels", desc: "Labels, boxes and inserts for products you sell." },
      { name: "Direct mail", desc: "Printed pieces addressed and sent to your list." },
    ],

    process: [
      { title: "Send your artwork", desc: "Or describe the job and we will set it up for you." },
      { title: "Get a proof and a quote", desc: "You see exactly what will print before anything runs." },
      { title: "Approve the proof", desc: "One round of changes is included before we go to press." },
      { title: "Print and finish", desc: "We print, cut, fold and finish to the approved spec." },
      { title: "Pick up or arrange delivery", desc: "[Add your pickup and delivery options]" },
    ],

    team: [
      { name: "Mike Gibbs", role: "Owner", note: "[One line about Mike]" },
      { name: "[Team member name]", role: "[Role]", note: "[One line about them]" },
      { name: "[Team member name]", role: "[Role]", note: "[One line about them]" },
    ],

    roadmap: [
      { horizon: "Next 12 months", goal: "[Add your next milestone]" },
      { horizon: "2 to 3 years", goal: "[Add your next milestone]" },
      { horizon: "5 years", goal: "[Add your next milestone]" },
    ],

    partners: [
      { name: "[Partner name]" },
      { name: "[Partner name]" },
      { name: "[Partner name]" },
    ],

    events: [
      { name: "[Event name]", when: "[Add date or cadence]" },
      { name: "[Event name]", when: "[Add date or cadence]" },
    ],

    pricing: [
      { item: "Business cards", model: "per-quantity tier" },
      { item: "Banners and signage", model: "per square foot" },
      { item: "Apparel", model: "per unit plus setup fee" },
      { item: "Rush turnaround", model: "surcharge on standard rate" },
    ],

    guide: [
      { q: "What file formats do you accept?" },
      { q: "What are your standard turnaround times?" },
      { q: "Do you offer rush printing?" },
      { q: "Can you match a specific brand colour?" },
      { q: "Is delivery available or is pickup required?" },
      { q: "What is your minimum order?" },
    ],

    validations: [
      { quote: "[Customer review text]", who: "[Customer name]" },
      { quote: "[Customer review text]", who: "[Customer name]" },
      { quote: "[Customer review text]", who: "[Customer name]" },
    ],

    door: {
      heading: "Request a quote",
      fields: ["Name", "Email", "Phone", "What do you need printed?", "Details"],
      action: "mailto:[Add your business email]",
    },

    footer: {
      name: "InfinitPrinter",
      address: "[Add your address], Richmond, Indiana",
      phone: "[Add your phone]",
      email: "[Add your email]",
      hours: "[Add your hours]",
    },
  },
};
