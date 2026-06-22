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

If the upstream asset names change, update `buildDownloads()` to match. Every card also links
to the full releases page, so older/other builds are always reachable.

## Off-site links

Repo, releases, issues, and Discord URLs all live in [`utils/site.ts`](utils/site.ts).

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

Pixel art is rendered with `image-rendering: pixelated` so it stays crisp.

## Theme

The MUI theme (palette, fonts, dark/light) is defined in
[`pages/_app.tsx`](pages/_app.tsx), shared verbatim with the sibling Preponderous sites.
