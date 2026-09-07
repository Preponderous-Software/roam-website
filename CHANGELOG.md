# Changelog

All notable changes to the Roam website are documented here.

## [Unreleased]

### Changed

- Upgraded the framework from Next.js 12.2.2 to 14.2.35, with React 18.3.1, TypeScript 5.4.5 and
  the matching ESLint/type packages. The site stays on the `pages/` router and no source file
  needed changing — nothing here imports `next/link`, so the Next 13 nested-anchor break does not
  apply. `swcMinify: false` was dropped from `next.config.js` (SWC minification has been the
  default since Next 13), and `engines.node` now records Next 14.2's floor of 18.17.

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
