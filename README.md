# TRAX

TRAX is a React + Vite PWA trading desk concept for tracking the assets you care about. It crawls market sources on a schedule, then uses your configured LLM endpoint to turn signal into clear, sourced trading calls.

This repo currently ships the **Home** and **Profile** design surfaces with mock data and local-first settings.

## What’s in this build

- **Home desk** — greeting, live-sweep hero, watchlist, AI calls, crawl schedule, and engine status.
- **Profile / desk settings** — trader identity, interest selection, notification preferences, AI engine config, crawl cadence, and PWA install.
- **Local-first settings** — saved in browser `localStorage`; no backend required.
- **PWA shell** — installable manifest, icons, and service worker via `vite-plugin-pwa`.
- **Mock market data** — assets, signals, and source/crawl timeline are static fixtures for the design pass.

## AI engine config

The Profile page accepts any OpenAI-compatible endpoint:

- `base_url`
- `model_name`
- `api_key`

The **Validate config** action performs local validation only. The API key stays in browser local storage and is intended to be sent only to the endpoint you configure.

## Getting started

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run dev      # Start Vite dev server
npm run build    # Typecheck and production build
npm run preview  # Preview production build
npm run icons    # Regenerate PWA icons from public/logo.svg
```

## Project structure

```text
public/              Logo and PWA icons
scripts/             Icon rendering helpers
src/components/      UI building blocks and profile panels
src/context/         Desk settings provider (localStorage)
src/data/            Mock assets, signals, and sources
src/hooks/           Countdown and PWA install hooks
src/pages/           Home and Profile pages
src/styles/          Design system and page styles
```

## Notes

- Market prices, signals, and crawl activity are mock data.
- TRAX is a research desk concept, not financial advice.
