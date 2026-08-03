# Changelog

All notable changes to the Roam website are documented here.

## [Unreleased]

### Fixed

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
