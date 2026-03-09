import { test, expect } from "@playwright/test";

const pages = [
  { name: "Home", path: "/", title: /Gentlemen/i },
  { name: "About", path: "/about.html", title: /About/i },
  { name: "Products", path: "/products.html", title: /Product/i },
  { name: "Export", path: "/export.html", title: /Export/i },
  { name: "Contact", path: "/contact.html", title: /Contact/i },
];

test.describe("Navigation", () => {
  for (const page of pages) {
    test(`${page.name} page loads without errors`, async ({ page: pw }) => {
      const errors = [];
      pw.on("pageerror", (err) => errors.push(err.message));
      pw.on("requestfailed", (req) => errors.push(`FAILED: ${req.url()}`));

      await pw.goto(page.path);
      await expect(pw).toHaveTitle(page.title);
      expect(errors).toHaveLength(0);
    });
  }

  test("nav links are present on home page", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("nav a")).toHaveCount(5);
  });

  test("mobile menu button is visible on mobile viewports", async ({ page }) => {
    // Mobile menu is hidden on desktop (by design) and visible on mobile
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await expect(page.locator(".mobile-menu")).toBeVisible();
  });
});

test.describe("Broken Links", () => {
  test("no broken internal links on home page", async ({ page }) => {
    await page.goto("/");
    const links = await page.$$eval("a[href]", (as) =>
      as.map((a) => a.getAttribute("href")).filter((h) => h && !h.startsWith("http") && !h.startsWith("mailto") && !h.startsWith("#"))
    );
    for (const link of links) {
      const res = await page.request.get(link);
      expect(res.status(), `Broken link: ${link}`).toBeLessThan(400);
    }
  });
});
