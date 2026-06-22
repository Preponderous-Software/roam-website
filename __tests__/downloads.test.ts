import {describe, expect, it} from 'vitest';
import {buildDownloads} from '../utils/downloads';
import {releaseAssetUrl, LATEST_VERSION} from '../utils/site';

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
});
