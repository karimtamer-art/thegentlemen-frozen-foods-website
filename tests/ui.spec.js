import { test, expect } from "@playwright/test";

test.describe("UI & Responsiveness", () => {
  test("hero section is visible on desktop", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".hero, #hero, [class*='hero']").first()).toBeVisible();
  });

  test("header is sticky / visible after scroll", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollBy(0, 600));
    await expect(page.locator("header, .header").first()).toBeVisible();
  });

  test("images load without 404", async ({ page }) => {
    const failed = [];
    page.on("response", (res) => {
      if (res.url().match(/\.(jpg|webp|png)$/i) && res.status() >= 400) {
        failed.push(res.url());
      }
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(failed, `Failed images: ${failed.join(", ")}`).toHaveLength(0);
  });

  test("contact form fields exist", async ({ page }) => {
    await page.goto("/contact.html");
    const form = page.locator("form");
    await expect(form).toBeVisible();
  });
});

test.describe("Visual Snapshots", () => {
  test("home page desktop snapshot", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("home-desktop.png", { fullPage: true });
  });

  test("home page mobile snapshot", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("home-mobile.png", { fullPage: true });
  });
});
