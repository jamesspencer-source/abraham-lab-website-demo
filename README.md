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

## Visual review

```bash
npm run visual:setup
npm run visual:review
```

This captures screenshots for all public routes across the required desktop, tablet, and mobile viewport matrix and writes artifacts to `output/visual-review/`.

On some local macOS environments, headless Chromium can fail with a MachPort permission error even when the Astro build succeeds. When that happens, use the GitHub Actions visual review workflow as the canonical artifact source.
