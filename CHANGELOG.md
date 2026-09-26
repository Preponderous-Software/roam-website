# Changelog

All notable changes to the Roam website are documented here.

## [Unreleased]

### Added

- The footer links back to [danielstephenson.dev](https://danielstephenson.dev)
  ("More by Daniel Stephenson → danielstephenson.dev").
- Page views are reported to [trace](https://trace.danielstephenson.dev) as the program
  `roam-website`: one `page-view` event per HTML page served, tagged with the path and the site version
  only, sent server-side from `middleware.ts` (trace decision 0002). Crawlers, monitors,
  prefetches, assets and 404s are skipped; nothing about the visitor is sent. The key is read from
  `USAGE_REPORTING_KEY` only, and reporting is off without it, with `USAGE_REPORTING_ENABLED=false`,
  `TRACE_USAGE_REPORTING=off` or `DO_NOT_TRACK=1`. The client is `trace-client.ts` 0.1.0 vendored
  unmodified from `Stephenson-Software/trace-client-js`.

### Changed

- `utils/trace-client.ts` is re-vendored unmodified from `Stephenson-Software/trace-client-js`
  0.2.0 (tag `0.2.0`, commit 69b494b), which checks `TRACE_USAGE_REPORTING` / `DO_NOT_TRACK` itself
  and exposes `disabledReason`. `utils/usage-reporting.ts` now uses the client's
  `TraceClient.environmentOptsOut` for that check instead of its own copy, and hands the client the
  same two values explicitly so it never falls back to `process.env`; the switches, their order and
  the logged reasons are unchanged.

- Upgraded the framework from Next.js 12.2.2 to 14.2.35, with React 18.3.1, TypeScript 5.4.5 and
  the matching ESLint/type packages. The site stays on the `pages/` router and no source file
  needed changing — nothing here imports `next/link`, so the Next 13 nested-anchor break does not
  apply. `swcMinify: false` was dropped from `next.config.js` (SWC minification has been the
  default since Next 13), and `engines.node` now records Next 14.2's floor of 18.17.

### Fixed

- `README.md`'s usage-reporting section gave `/about` as an example of a reported path, but the
  site has no `/about` page — it would render the 404 and not be reported. The example is now
  `/download`, one of the routes in `PAGE_ROUTES`.

## [0.2.0-SNAPSHOT-8-8-2026] – 2026-08-08

### Changed
- roam-website is now developed AI-first. Day-to-day feature work, grooming, review and maintenance run through AI agents working directly against this repository, with the maintainers setting direction and approving what lands. The version bump marks that change in how the project is built — it is not a break in behaviour, configuration or stored data, and existing installations can upgrade in place. Released as `0.2.0-SNAPSHOT-8-8-2026`: the AI-first line has not yet been verified in live operation, and the dated snapshot designation stays until it has.

### Added

- Footer: a "Discord" link to the Preponderous community server, wired to the `DISCORD_URL`
  constant that already existed in `utils/site.ts` but was never rendered anywhere on the site.

### Fixed

- `CONFIG.md` no longer claims every download card links to the full releases page — that link
  lives on the `Latest: v<version>` chip and on the Linux card, not on the Windows or macOS cards.
- "How to play" panel: the browser-play mode no longer links to a nonexistent `/play` page or
  claims to be "Live" — it now reads "Planned", matching the roadmap framing already used in this
  file and in `README.md`.

## [0.1.0] - 2026-06-21

### Added

- Initial Roam website, built as a sibling of preponderous-dot-org and dansplugins-dot-com
  (Next.js 12 + MUI 5 + TypeScript, shared theme and dark/light color-mode toggle).
- Home page: hero with the game's sprite art, a data-driven feature grid, a screenshot
  showcase, and a "how to play" panel covering desktop, terminal (text) mode, and a flagged
  browser-play follow-up.
- Download page: platform cards linking to the latest GitHub release assets (Windows installer
  and portable zip, macOS `.dmg`, run-from-source for Linux), driven by a single
  `LATEST_VERSION` constant.
- Styled 404 / 500 pages, SEO/Open Graph metadata, and the game icon as favicon.
- Vitest unit + component tests, ESLint, Dockerfile, compose file, and CI workflow.
