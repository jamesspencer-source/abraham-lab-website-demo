# Abraham Lab Website

Static Eleventy site for the Abraham Lab at Harvard Medical School.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The GitHub Actions workflow in `.github/workflows/deploy.yml` builds the site and publishes `_site` to GitHub Pages.

## Visual review

```bash
npm run visual:setup
npm run visual:review
```

This captures screenshots for all public routes across the required desktop, tablet, and mobile viewport matrix and writes artifacts to `output/visual-review/`.
