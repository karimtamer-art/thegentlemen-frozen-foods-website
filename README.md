# TheGentlemen for Export — B2B Frozen Foods Website

A production-quality, multi-page static website for **TheGentlemen for Export**, an Egyptian B2B frozen foods exporter. The site targets international wholesale buyers and distributors in the UK, Kuwait, UAE, and Saudi Arabia.

---

## Project Overview

TheGentlemen for Export is a frozen foods company based in Cairo, Egypt (founded 2023), specialising in IQF-processed French fries, frozen vegetables, and frozen fruits for the export market.

This website serves as the company's global online presence — presenting the brand, product catalogue, export capabilities, and a B2B inquiry form to prospective distributors worldwide.

---

## Features

- **5-page responsive website** — Home, About, Products, Export, Contact
- **Responsive images** — local `.jpg` + `.webp` assets with `srcset` at 400px and 800px breakpoints
- **Performance-optimised** — hero image preload, Font Awesome loaded asynchronously (no render-blocking), LCP-optimised
- **Accessible** — WCAG AA colour contrast on all text, semantic landmarks (`<main>`, `<header>`, `<footer>`), `aria-label` on all icon links, proper form labels
- **Working B2B contact form** — Formspree-ready (POST method, honeypot spam protection, field validation)
- **Mobile-first navigation** — hamburger menu for mobile viewports
- **Animated stats counter** — export achievements section with scroll-triggered counters
- **Clean, no-dependency codebase** — no frameworks, no build step, no external image CDNs

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 (semantic) |
| Styles | CSS3 (custom properties, flexbox, grid, responsive) |
| Scripts | Vanilla JavaScript (ES6+) |
| Icons | Font Awesome 6.0.0 (CDN, async loaded) |
| Form backend | Formspree (static-site-compatible, no server required) |
| Dev server | `serve` (port 3001) |

### Dev Tooling

| Tool | Purpose |
|------|---------|
| Playwright | E2E browser testing (14 tests — navigation, UI, broken links, visual snapshots) |
| HTMLHint | HTML linting |
| Stylelint | CSS linting |
| ESLint | JavaScript linting |
| Prettier | Code formatting |
| Lighthouse | Performance / SEO / best practices audit |
| axe-core | Accessibility audit |

---

## Pages

| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Hero, featured products, export overview, CTA |
| About | `about.html` | Company story, mission/vision/values |
| Products | `products.html` | French fries, frozen vegetables, frozen fruits catalogue |
| Export | `export.html` | Export markets, logistics, certifications |
| Contact | `contact.html` | B2B inquiry form, headquarters info |

---

## Running Locally

**Requirements:** Node.js 22+, npm 10+

```bash
# Install dev dependencies
npm install

# Start local dev server on http://localhost:3001
npm run serve

# Run E2E tests (Playwright — auto-starts server)
npm run test

# Run all linters
npm run lint

# Format code with Prettier
npm run format

# Lighthouse performance audit
npm run audit:lighthouse
```

> **Note:** Port 3001 is used by default. Do not change this to 8080 as it may conflict with other local services.

---

## Owner Setup (before going live)

The following placeholders must be replaced with real values before the site is deployed publicly:

1. **Contact form** — Replace `https://formspree.io/f/YOUR_FORM_ID` in `contact.html` with a real [Formspree](https://formspree.io) endpoint (free tier available)
2. **Phone number** — Replace `+20 [Your Phone Number]` in all page footers and `contact.html`
3. **Email address** — Replace `[Your Email Address]` in all page footers and `contact.html`
4. **Social media** — Replace `href="#"` on Facebook/LinkedIn/Twitter/Instagram links in all footers
5. **Export markets** — Confirm UAE and Saudi Arabia markets on `export.html` (UK and Kuwait are confirmed)

---

## Accessibility & Performance Notes

- All product title text uses `#1e7a3a` (contrast ratio ~5.1:1) — upgraded from `#2ecc71` which failed WCAG AA
- Font Awesome icons load asynchronously using the `media="print" onload` pattern with a `<noscript>` fallback
- Hero image is preloaded with `<link rel="preload" as="image">` to improve LCP
- All icon-only links have descriptive `aria-label` attributes
- `<main>` landmark present on all 5 pages
- No duplicate `<h1>` elements — logo uses `<a class="logo-link">` on pages with their own page H1

---

## What I Built

This project involved a full audit, rewrite, and quality-engineering pass on a real-client prototype website:

- **Identified and fixed 20+ issues** across branding, broken images, dead CTAs, wrong template data, and non-functional form
- **Replaced all external CDN images** (Unsplash) with locally-optimised `.jpg` and `.webp` assets
- **Fixed homepage 404** — tracked down a broken CSS background-image URL and replaced it with a CSS pseudo-element gradient overlay
- **Fixed CSS scope leak** — an unscoped `.hero-content` override was breaking the homepage layout on mobile
- **Built complete QA pipeline** from scratch — Playwright test suite (14 tests across Chromium, Firefox, and mobile), HTMLHint, Stylelint, ESLint, Prettier, Lighthouse, and axe-core
- **Accessibility pass** — fixed duplicate H1s, missing landmarks, icon contrast failures, unlabelled form fields
- **Performance optimisations** — async font loading, image preload, `srcset`/`sizes` for responsive images, favicon suppression to remove spurious 404
- **Contact form rebuilt** — from a broken GET-method form with no `name` attributes to a fully Formspree-ready POST form with honeypot spam protection

---

## License

[MIT](https://opensource.org/licenses/MIT) — Feel free to use this as a reference or portfolio piece.

> Images in the `Images/` folder are proprietary to TheGentlemen for Export and are not covered by the MIT license.
