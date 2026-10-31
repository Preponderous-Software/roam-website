# Configuration & content

Most of what the site shows is data- or constant-driven, so updating it rarely means touching
component code.

## Release / download version

The prominent download buttons resolve to a single Roam release. Bump one value when a new
version ships:

```ts
// utils/site.ts
export const LATEST_VERSION = '0.13.0';
```

`buildDownloads()` ([`utils/downloads.ts`](utils/downloads.ts)) builds the direct GitHub
release asset URLs from this version, e.g. `Roam-<version>-Setup.exe`. The asset naming
convention is assumed to be stable across releases:

| Platform | Asset |
| -------- | ----- |
| Windows installer | `Roam-<version>-Setup.exe` |
| Windows portable  | `Roam-<version>-windows-portable.zip` |
| macOS             | `Roam-<version>.dmg` |
| Linux             | run from source (links to the repo) |

If the upstream asset names change, update `buildDownloads()` to match.

Older and other builds stay reachable through the full releases page, which is linked from the
`Latest: v<version>` chip beside the "Download Roam" heading
([`components/DownloadSection.tsx`](components/DownloadSection.tsx)) and again from the Linux
card's "All releases" button. The Windows and macOS cards carry only their own assets.

## Off-site links

Repo, releases, issues, and Discord URLs all live in [`utils/site.ts`](utils/site.ts). The
game's repo (`REPO_URL`) is linked from the top bar's "GitHub" button, the hero, the "How to
play" panel and the Linux download card; its releases page (`RELEASES_URL`) from the download
section's `Latest` chip and the Linux card. The footer
([`components/BottomBar.tsx`](components/BottomBar.tsx)) links this website's own repo
(`SITE_REPO_URL`), its new-issue page for bug reports (`SITE_NEW_ISSUE_URL`), and the Discord
invite (`DISCORD_URL`).

The in-browser build's path, `PLAY_URL` (`/play`), lives there too. That build is served on this
same host but outside this Next.js app, so it is linked as a plain same-tab path from the home
hero ([`components/Hero.tsx`](components/Hero.tsx)), the download page
([`pages/download.tsx`](pages/download.tsx)), and the "How to play" panel
([`components/HowToPlay.tsx`](components/HowToPlay.tsx)). `PLAY_3D_URL` (`/play?view=3d`) is the
same build with its 3D view turned on, linked from the caption of the 3D image under the hero
([`components/WorldDiptych.tsx`](components/WorldDiptych.tsx)).

`SITE_ORIGIN` (`https://roam.preponderous.org`) is the production origin that canonical links,
`og:url`, the absolute share-image URLs, `/sitemap.xml` and `public/robots.txt` are built from. A
new page passes its own `path` to `<Seo>` and is added to `SITEMAP_PATHS` beside it.

Three links are not in `utils/site.ts`. The footer's "More by Daniel Stephenson →
danielstephenson.dev" portfolio link is written directly into `BottomBar.tsx` because
the same link appears on all of the author's sites. The caption of the 3D image under the hero
credits [roam-usd](https://github.com/Preponderous-Software/roam-usd) and
[Strata](https://github.com/Preponderous-Software/strata) with links written directly into
[`components/WorldDiptych.tsx`](components/WorldDiptych.tsx).

## Feature cards (home page)

The "What you do in Roam" grid is data-driven:

```
pages/data/features.json
```

Each entry has `id`, `icon`, `title`, and `description`. `icon` is one of the keys mapped in
[`components/FeaturesSection.tsx`](components/FeaturesSection.tsx)
(`public`, `bolt`, `build`, `agriculture`, `pets`, `terminal`); any other key renders the
`public` (globe) icon.

## Screenshots & art

Images live in `public/`:

- `roam-icon.png` — the game icon (logo + favicon)
- `screenshots/*.png` — gameplay/minimap shots shown in the showcase
- `hero/roam-2d.png`, `hero/roam-3d.jpg`, `hero/roam-3d.webm`, `hero/roam-3d.mp4` — one world in 2D
  and in 3D (a still, then a short muted loop as VP9 WebM or H.264 MP4), shown
  under the hero's buttons by [`components/WorldDiptych.tsx`](components/WorldDiptych.tsx); made
  by [`scripts/hero/`](scripts/hero/README.md)
- `og-roam-2d-3d.png` — the 1200×630 share image (`og:image`/`twitter:image`, with its type, size
  and alt text) set by [`components/Seo.tsx`](components/Seo.tsx): the hero's 2D / 3D pair cut to
  a card, the 3D half rendered with [Strata](https://github.com/Preponderous-Software/strata), and
  the title in a band below. It is made by `scripts/hero/render_hero.py --card`
  ([`scripts/hero/README.md`](scripts/hero/README.md)); its alt text is in `scripts/hero/og-card.json`
- `sprites/*.png` — the game's 32×32 sprites used in the hero strip
- `colormode/{light,dark}.svg` — the sun/moon glyphs painted onto the color-mode toggle
  thumb by [`components/ColorModeToggleSwitch.tsx`](components/ColorModeToggleSwitch.tsx),
  which `TopBar` and `BottomBar` render on every page

Pixel art is rendered with `image-rendering: pixelated` so it stays crisp.

## Theme

The MUI theme (palette, fonts, dark/light) is defined in
[`pages/_app.tsx`](pages/_app.tsx), shared verbatim with the sibling Preponderous sites.

## Usage reporting

Four optional environment variables, read by the server at runtime only, control
[usage reporting](README.md#usage-reporting):

| Variable | Default | Purpose |
|---|---|---|
| `USAGE_REPORTING_KEY` | unset — nothing is reported | The [trace](https://trace.danielstephenson.dev) write key for the `roam-website` program. Read by `middleware.ts` only: never inlined into the browser bundle and never committed; keep it in the deployment's environment. |
| `USAGE_REPORTING_ENABLED` | `true` | Set to `false` (also `0`, `no` or `off`; case and surrounding space do not matter) to stop reporting page views even when a key is set. `TRACE_USAGE_REPORTING=off` and `DO_NOT_TRACK=1` do the same and win over it. |
| `USAGE_REPORTING_ENDPOINT` | `https://trace.danielstephenson.dev` | The trace server page views are sent to. |
| `TRACE_INSTALL_ID` | unset — a random ID per server process | The installation ID every page view carries as the tag `install`, so trace can count installations rather than events. Unset, the trace client is pointed at `$XDG_DATA_HOME/roam-website/trace-install-id` (or `$HOME/.local/share/...`), but the report runs in the Edge runtime, which has no file system, so the client makes a random ID that lasts until the server restarts. Set it to keep one ID across restarts and redeploys. Ignored when reporting is off. |

A new page under `pages/` must also be added to `PAGE_ROUTES` in
[`utils/page-view-policy.ts`](utils/page-view-policy.ts) to be counted; a test fails until it is.
