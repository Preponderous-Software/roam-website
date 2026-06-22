// Central place for the off-site URLs and the current release the download
// buttons point at. Bumping LATEST_VERSION here is all that's needed to make
// every direct download link target a new Roam release (see CONFIG.md).

export const ORG_URL = 'https://github.com/Preponderous-Software';
export const REPO_URL = 'https://github.com/Preponderous-Software/roam';
export const SITE_REPO_URL = 'https://github.com/Preponderous-Software/roam-website';
export const ISSUES_URL = `${REPO_URL}/issues`;
export const NEW_ISSUE_URL = `${REPO_URL}/issues/new`;
export const RELEASES_URL = `${REPO_URL}/releases`;
export const LATEST_RELEASE_URL = `${REPO_URL}/releases/latest`;
export const DISCORD_URL = 'https://discord.gg/49J4RHQxhy';

// The Roam release the prominent "Download" buttons resolve to. The game itself
// is versioned independently of this website; keep this in step with the latest
// published release tag at https://github.com/Preponderous-Software/roam/releases.
export const LATEST_VERSION = '0.12.0';

// GitHub serves a release's uploaded asset at this stable path. Asset names embed
// the version (e.g. Roam-0.12.0-Setup.exe), so the URL is built from both.
export const releaseAssetUrl = (version: string, filename: string): string =>
    `${REPO_URL}/releases/download/${version}/${filename}`;
