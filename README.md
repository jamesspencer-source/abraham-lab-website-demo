# Abraham Lab Website

Static Astro site for the Abraham Lab at Harvard Medical School.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The GitHub Actions workflow in `.github/workflows/deploy.yml` builds the Astro site and publishes `_site` to GitHub Pages.

## GitHub Pages configuration

This repository is intended to publish through the custom GitHub Actions workflow in `.github/workflows/deploy.yml`.

In GitHub repository settings, set `Settings > Pages > Build and deployment > Source` to `GitHub Actions`.

If Pages is left on a branch source, GitHub will try to run its built-in Jekyll workflow against the Astro source tree at the repository root. That produces the failing `pages build and deployment` run seen on `main`, even when the custom Astro deploy succeeds.

The repository root and `public/` both include `.nojekyll` markers so a branch-based fallback will bypass the Jekyll build. The authoritative deployment path is still the custom Actions workflow.

The content research notes live under `references/` rather than `docs/` so the repo no longer looks like a branch-published `/docs` site.

## Content validation

```bash
npm run validate:content
```

This checks publication title/DOI/PMID consistency, homepage proof ordering, and the canonical institutional wording used across the site data modules.

## Publication record

```bash
npm run check:publications
```

The checker compares the local record with PubMed and bioRxiv and writes a read-only report to `output/publication-check/`. Update `siteData.publicationRecord.checkedAt` only after both sources complete successfully and any candidate records have been reviewed.

## Image optimization

The full-resolution, open-access homepage figure is retained under `references/source-assets/`. Rebuild its responsive WebP files after replacing that source:

```bash
npm run images:optimize
```

## Visual review

```bash
npm run visual:setup
npm run visual:review
```

This captures screenshots for all public routes across the required desktop, tablet, and mobile viewport matrix and writes artifacts to `output/visual-review/`.

For quicker local passes, you can scope the run:

```bash
VISUAL_REVIEW_ROUTES=home,publications VISUAL_REVIEW_VIEWPORTS=390,768 VISUAL_REVIEW_THEMES=light npm run visual:review
```

`VISUAL_REVIEW_ROUTES`, `VISUAL_REVIEW_VIEWPORTS`, and `VISUAL_REVIEW_THEMES` all accept comma-separated lists.

On some local macOS environments, headless Chromium can fail with a MachPort permission error even when the Astro build succeeds. When that happens, use the GitHub Actions visual review workflow as the canonical artifact source.

## Accessibility and browser review

```bash
npm run quality:setup
npm run quality:review
```

The quality review checks the automated WCAG 2.1 Level AA rule set, keyboard navigation, text-spacing resilience, 320px reflow, light and dark modes, legacy route handoffs, and layout behavior in Chromium, Firefox, and WebKit. It covers phone, tablet, laptop, wide desktop, narrow-window, and short-wide-window shapes.

Reports are written to `output/quality-review/`. The GitHub Actions visual-review workflow runs the same review and uploads the report with the screenshots.

Automated testing does not establish full WCAG conformance. Complete the manual checks in `references/accessibility-release-checklist.md` before the custom-domain launch.
