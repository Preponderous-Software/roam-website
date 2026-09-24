# Configuration & content

Most of what the site shows is data- or constant-driven, so updating it rarely means touching
component code.

## Release / download version

The prominent download buttons resolve to a single Roam release. Bump one value when a new
version ships:

```ts
// utils/site.ts
export const LATEST_VERSION = '0.12.0';
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
Discord invite (`DISCORD_URL`) is surfaced in the footer
([`components/BottomBar.tsx`](components/BottomBar.tsx)) alongside the site's source and
bug-report links.

## Feature cards (home page)

The "What you do in Roam" grid is data-driven:

```
pages/data/features.json
```

Each entry has `id`, `icon`, `title`, and `description`. `icon` is one of the keys mapped in
[`components/FeaturesSection.tsx`](components/FeaturesSection.tsx)
(`public`, `bolt`, `build`, `agriculture`, `pets`, `terminal`).

## Screenshots & art

Images live in `public/`:

- `roam-icon.png` — the game icon (logo + favicon)
- `screenshots/*.png` — gameplay/minimap shots shown in the showcase
- `sprites/*.png` — the game's 32×32 sprites used in the hero strip
- `colormode/{light,dark}.svg` — the sun/moon glyphs painted onto the color-mode toggle
  thumb by [`components/ColorModeToggleSwitch.tsx`](components/ColorModeToggleSwitch.tsx),
  which `TopBar` and `BottomBar` render on every page

Pixel art is rendered with `image-rendering: pixelated` so it stays crisp.

## Theme

The MUI theme (palette, fonts, dark/light) is defined in
[`pages/_app.tsx`](pages/_app.tsx), shared verbatim with the sibling Preponderous sites.

## Usage reporting

Three optional environment variables, read by the server at runtime only, control
[usage reporting](README.md#usage-reporting):

| Variable | Default | Purpose |
|---|---|---|
| `USAGE_REPORTING_KEY` | unset — nothing is reported | The [trace](https://trace.danielstephenson.dev) write key for the `roam-website` program. Read by `middleware.ts` only: never inlined into the browser bundle and never committed; keep it in the deployment's environment. |
| `USAGE_REPORTING_ENABLED` | `true` | Set to `false` to stop reporting page views even when a key is set. `TRACE_USAGE_REPORTING=off` and `DO_NOT_TRACK=1` do the same and win over it. |
| `USAGE_REPORTING_ENDPOINT` | `https://trace.danielstephenson.dev` | The trace server page views are sent to. |

A new page under `pages/` must also be added to `PAGE_ROUTES` in
[`utils/page-view-policy.ts`](utils/page-view-policy.ts) to be counted; a test fails until it is.
