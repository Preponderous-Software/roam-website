# Roam — Website

The marketing and download site for [**Roam**](https://github.com/Preponderous-Software/roam),
a free, source-available survival game by Preponderous Software where you explore a
procedurally-generated 2D world and interact with your surroundings.

The site is a small [Next.js](https://nextjs.org/) + [MUI](https://mui.com/) app, built as
a sibling of [preponderous-dot-org](https://github.com/Preponderous-Software/preponderous-dot-org)
and [dansplugins-dot-com](https://github.com/Dans-Plugins/dansplugins-dot-com) — same theme,
color-mode toggle, chrome, and Docker/CI setup.

## What's on it

- **Home** (`/`) — hero, an at-a-glance feature grid, in-game screenshots, and a "how to play"
  panel (desktop, terminal/text mode, and a flagged browser-play follow-up).
- **Download** (`/download`) — platform cards linking to the latest GitHub release assets
  (Windows installer + portable zip, macOS `.dmg`, and run-from-source for Linux).

The game's own art (icon, sprites, screenshots) lives in `public/` and is shown on the site.

## Getting started

```bash
npm install      # first time only (a lockfile is committed)
npm run dev      # http://localhost:3000
```

## Scripts

| Command         | What it does                                  |
| --------------- | --------------------------------------------- |
| `npm run dev`   | Start the dev server on port 3000             |
| `npm run build` | Production build                              |
| `npm run start` | Serve the production build                     |
| `npm run lint`  | ESLint (`next lint`)                           |
| `npm test`      | Run the Vitest unit + component tests          |

## Keeping downloads current

The download buttons point at a specific Roam release. When a new version ships, bump
`LATEST_VERSION` in [`utils/site.ts`](utils/site.ts) — that one value drives every direct
asset link. See [CONFIG.md](CONFIG.md) for the full content/config reference.

## Deployment

Containerized like its sibling sites:

```bash
docker compose up --build   # serves on :3000
```

It is intended to deploy behind the Preponderous gateway nginx box alongside the other
Preponderous sites.

## License

[Preponderous Non-Commercial License](LICENSE).
