/**
 * Live B2B Browser Audit — TheGentlemen Frozen Foods
 * Runs as a B2B export customer visiting the site for the first time.
 */
import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";

const BASE = "http://localhost:3001";
const PAGES = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about.html" },
  { name: "Products", path: "/products.html" },
  { name: "Export", path: "/export.html" },
  { name: "Contact", path: "/contact.html" },
];

const results = { pages: {}, globalIssues: [] };

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });

// ── Helper ────────────────────────────────────────────────────────────────────
async function auditPage(name, url) {
  const page = await context.newPage();
  const issues = [];
  const consoleErrors = [];
  const failedRequests = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("requestfailed", (req) => {
    failedRequests.push({ url: req.url(), reason: req.failure()?.errorText });
  });

  await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });

  // ── Title
  const title = await page.title();
  const metaDesc = await page.$eval('meta[name="description"]', (el) => el.content).catch(() => null);
  const metaKeywords = await page.$eval('meta[name="keywords"]', (el) => el.content).catch(() => null);

  // ── Images — missing alt text
  const imgsWithoutAlt = await page.$$eval("img", (imgs) =>
    imgs.filter((i) => !i.alt || i.alt.trim() === "").map((i) => i.src)
  );

  // ── Headings structure
  const headings = await page.$$eval("h1,h2,h3,h4", (hs) =>
    hs.map((h) => ({ tag: h.tagName, text: h.innerText.trim().slice(0, 80) }))
  );
  const h1s = headings.filter((h) => h.tag === "H1");

  // ── Links
  const links = await page.$$eval("a", (as) =>
    as.map((a) => ({ text: a.innerText.trim().slice(0, 40), href: a.getAttribute("href") }))
  );
  const emptyLinks = links.filter((l) => !l.href || l.href === "#");
  const externalLinks = links.filter((l) => l.href && l.href.startsWith("http"));

  // ── Forms
  const forms = await page.$$eval("form", (fs) =>
    fs.map((f) => ({
      action: f.action,
      method: f.method,
      fields: Array.from(f.querySelectorAll("input,textarea,select")).map((i) => ({
        type: i.type || i.tagName,
        name: i.name,
        required: i.required,
        placeholder: i.placeholder,
      })),
    }))
  );

  // ── CTA buttons
  const ctas = await page.$$eval("a.btn, button, .btn, [class*='cta']", (els) =>
    els.map((el) => ({ tag: el.tagName, text: el.innerText.trim().slice(0, 60), href: el.getAttribute("href") }))
  );

  // ── Viewport / scroll check
  const viewportHeight = await page.evaluate(() => window.innerHeight);
  const pageHeight = await page.evaluate(() => document.body.scrollHeight);

  // ── Screenshot
  const screenshotDir = path.join("audit", "screenshots");
  fs.mkdirSync(screenshotDir, { recursive: true });
  await page.screenshot({
    path: path.join(screenshotDir, `${name.toLowerCase()}-desktop.png`),
    fullPage: true,
  });

  // ── Mobile screenshot
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: path.join(screenshotDir, `${name.toLowerCase()}-mobile.png`),
    fullPage: true,
  });
  await page.setViewportSize({ width: 1280, height: 900 });

  // ── Mobile menu check
  const mobileMenuVisible = await page.evaluate(() => {
    const el = document.querySelector(".mobile-menu");
    if (!el) return "NOT FOUND";
    const s = window.getComputedStyle(el);
    return s.display + " / " + s.visibility;
  });

  await page.close();

  return {
    title,
    metaDesc,
    metaKeywords,
    headings,
    h1Count: h1s.length,
    imgsWithoutAlt: imgsWithoutAlt.length,
    imgsWithoutAltList: imgsWithoutAlt.slice(0, 5),
    emptyLinks: emptyLinks.length,
    externalLinksCount: externalLinks.length,
    externalLinks: externalLinks.slice(0, 5),
    forms,
    ctaButtons: ctas.slice(0, 10),
    consoleErrors,
    failedRequests,
    mobileMenuVisible,
    pageScrollHeight: pageHeight,
  };
}

// ── Audit all pages ───────────────────────────────────────────────────────────
for (const p of PAGES) {
  console.log(`Auditing: ${p.name} (${p.path})`);
  try {
    results.pages[p.name] = await auditPage(p.name, BASE + p.path);
  } catch (e) {
    results.pages[p.name] = { error: e.message };
  }
}

// ── Homepage deep audit ───────────────────────────────────────────────────────
const homePage = await context.newPage();
await homePage.goto(BASE + "/", { waitUntil: "networkidle" });

results.homepage = {
  // Check for trust signals
  hasCertifications: await homePage.$$eval("*", (els) =>
    els.some((e) => /certif|halal|iso|organic|quality/i.test(e.innerText))
  ),
  hasTestimonials: await homePage.$$eval("*", (els) =>
    els.some((e) => /testimonial|review|client|partner/i.test(e.className + e.id))
  ),
  hasCompanyStats: await homePage.$$eval("*", (els) =>
    els.some((e) => /year|export|countr|tons|kg/i.test(e.innerText) && e.innerText.length < 200)
  ),
  hasWhyChooseUs: await homePage.$$eval("*", (els) =>
    els.some((e) => /why|choose|benefit|advantage/i.test(e.innerText))
  ),
  hasVideoBanner: await homePage.$("video").then((v) => !!v).catch(() => false),
  socialLinks: await homePage.$$eval("a[href*='facebook'],a[href*='instagram'],a[href*='linkedin'],a[href*='whatsapp']", (as) =>
    as.map((a) => a.href)
  ),
  navItems: await homePage.$$eval("nav a", (as) => as.map((a) => a.innerText.trim())),
  footerLinks: await homePage.$$eval("footer a", (as) => as.map((a) => a.innerText.trim())),
  heroText: await homePage.$eval(".hero, #hero, .hero-section", (el) => el.innerText.trim().slice(0, 300)).catch(() => "NOT FOUND"),
  footerText: await homePage.$eval("footer", (el) => el.innerText.trim().slice(0, 200)).catch(() => "NOT FOUND"),
};

await homePage.close();
await browser.close();

// ── Output report ─────────────────────────────────────────────────────────────
fs.mkdirSync("audit", { recursive: true });
fs.writeFileSync("audit/audit-results.json", JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
