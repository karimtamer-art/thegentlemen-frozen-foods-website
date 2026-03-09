/**
 * axe accessibility audit using Playwright (no chromedriver needed)
 */
import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "fs";

const BASE = "http://localhost:3001";
const PAGES = ["/", "/about.html", "/products.html", "/export.html", "/contact.html"];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const allViolations = {};

for (const path of PAGES) {
  const page = await context.newPage();
  await page.goto(BASE + path, { waitUntil: "networkidle" });

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "best-practice"])
    .analyze();

  allViolations[path] = results.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    description: v.description,
    helpUrl: v.helpUrl,
    nodes: v.nodes.length,
    example: v.nodes[0]?.html?.slice(0, 120),
  }));

  console.log(`${path}: ${results.violations.length} violations`);
  await page.close();
}

await browser.close();
fs.writeFileSync("audit/axe-results.json", JSON.stringify(allViolations, null, 2));
console.log(JSON.stringify(allViolations, null, 2));
