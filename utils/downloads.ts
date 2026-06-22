import {LATEST_VERSION, RELEASES_URL, REPO_URL, releaseAssetUrl} from './site';

// A single downloadable/installable option within a platform card.
export interface DownloadLink {
    label: string;
    href: string;
    // The headline option for a platform (rendered as a filled button).
    primary?: boolean;
    // True for a direct binary download; false for a link out (source, releases).
    download?: boolean;
}

export interface PlatformDownload {
    id: string;
    // Icon key resolved to a MUI icon by the DownloadCard component.
    icon: 'windows' | 'apple' | 'linux';
    platform: string;
    requirement: string;
    links: DownloadLink[];
}

// Build the platform download list for a given Roam release. Pure (no version
// lookup or network) so the card grid is deterministic and unit-testable; the
// version comes from utils/site.ts and is the single thing to bump per release.
export const buildDownloads = (version: string = LATEST_VERSION): PlatformDownload[] => [
    {
        id: 'windows',
        icon: 'windows',
        platform: 'Windows',
        requirement: 'Windows 10 or 11',
        links: [
            {
                label: `Installer (.exe)`,
                href: releaseAssetUrl(version, `Roam-${version}-Setup.exe`),
                primary: true,
                download: true,
            },
            {
                label: 'Portable (.zip)',
                href: releaseAssetUrl(version, `Roam-${version}-windows-portable.zip`),
                download: true,
            },
        ],
    },
    {
        id: 'macos',
        icon: 'apple',
        platform: 'macOS',
        requirement: 'Drag Roam.app to Applications',
        links: [
            {
                label: 'Disk image (.dmg)',
                href: releaseAssetUrl(version, `Roam-${version}.dmg`),
                primary: true,
                download: true,
            },
        ],
    },
    {
        id: 'linux',
        icon: 'linux',
        platform: 'Linux & source',
        requirement: 'Python 3.10+ with pygame',
        links: [
            {
                label: 'Run from source',
                href: `${REPO_URL}#getting-started`,
                primary: true,
            },
            {
                label: 'All releases',
                href: RELEASES_URL,
            },
        ],
    },
];
