import {describe, expect, it} from 'vitest';
import {buildDownloads} from '../utils/downloads';
import {releaseAssetUrl, LATEST_VERSION, RELEASES_URL, REPO_URL} from '../utils/site';

describe('releaseAssetUrl', () => {
    it('builds a GitHub release asset download URL from version + filename', () => {
        expect(releaseAssetUrl('1.2.3', 'Roam-1.2.3-Setup.exe')).toBe(
            'https://github.com/Preponderous-Software/roam/releases/download/1.2.3/Roam-1.2.3-Setup.exe'
        );
    });
});

describe('buildDownloads', () => {
    it('covers Windows, macOS, and Linux/source', () => {
        const ids = buildDownloads('0.12.0').map((d) => d.id);
        expect(ids).toEqual(['windows', 'macos', 'linux']);
    });

    it('embeds the given version in the direct download asset links', () => {
        const windows = buildDownloads('9.9.9').find((d) => d.id === 'windows')!;
        const installer = windows.links.find((l) => l.primary)!;
        expect(installer.href).toContain('/releases/download/9.9.9/Roam-9.9.9-Setup.exe');
        expect(installer.download).toBe(true);
    });

    it('gives every platform exactly one primary link', () => {
        for (const platform of buildDownloads('0.12.0')) {
            const primaries = platform.links.filter((l) => l.primary);
            expect(primaries).toHaveLength(1);
        }
    });

    it('defaults to LATEST_VERSION when no version is passed', () => {
        const windows = buildDownloads().find((d) => d.id === 'windows')!;
        expect(windows.links[0].href).toContain(`/${LATEST_VERSION}/`);
    });

    // The asset-naming table in CONFIG.md, one row per direct download. If an
    // upstream release renames an asset, this and CONFIG.md change together.
    it('builds every direct download from the asset names CONFIG.md documents', () => {
        const direct = buildDownloads('9.9.9')
            .flatMap((platform) => platform.links)
            .filter((link) => link.download)
            .map((link) => link.href);
        expect(direct).toEqual([
            releaseAssetUrl('9.9.9', 'Roam-9.9.9-Setup.exe'),
            releaseAssetUrl('9.9.9', 'Roam-9.9.9-windows-portable.zip'),
            releaseAssetUrl('9.9.9', 'Roam-9.9.9.dmg'),
        ]);
    });

    it('links Linux to running from source and the releases page, with no direct download', () => {
        const linux = buildDownloads('9.9.9').find((d) => d.id === 'linux')!;
        expect(linux.links.map((l) => l.href)).toEqual([`${REPO_URL}#getting-started`, RELEASES_URL]);
        expect(linux.links.some((l) => l.download)).toBe(false);
        expect(linux.links.some((l) => l.href.includes('9.9.9'))).toBe(false);
    });
});
