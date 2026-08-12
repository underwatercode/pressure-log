# Pressure Log

A personal blood-pressure companion app — an installable PWA for logging
daily readings, events, meals, sleep, and water, with trends and a doctor
export. Built for one person, on his doctor's radar, using an iPhone with no
App Store account. All data stays on-device (IndexedDB); there's no backend,
no accounts, no analytics.

This is not a medical device: it records, reminds, and encourages, and never
diagnoses or suggests treatment.

**Live app:** https://underwatercode.github.io/pressure-log/

## Local development

```
npm install
npm run dev
```

Opens a local dev server with hot reload.

## Build & preview

```
npm run build
npm run preview
```

`npm run build` type-checks and outputs a production build to `dist/`.
`npm run preview` serves that build locally (closer to what GitHub Pages
serves than `npm run dev`) at `/pressure-log/`.

## Deploying

Deploys are automatic: pushing to `main` triggers the
[`Deploy to GitHub Pages`](.github/workflows/deploy.yml) GitHub Actions
workflow, which builds the app and publishes `dist/` to GitHub Pages. No
manual deploy step is needed.

## Docs

- **[CLAUDE.md](CLAUDE.md)** — the full build spec: ground rules, stack,
  data model, screens, reading categories, and the milestone plan this app
  is being built against.
- **[Wiki](https://github.com/underwatercode/pressure-log/wiki)** — supporting
  notes and reference material.
