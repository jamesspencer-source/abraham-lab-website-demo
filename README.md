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

## Content validation

```bash
npm run validate:content
```

This checks publication title/DOI/PMID consistency, homepage proof ordering, and the canonical institutional wording used across the site data modules.

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
