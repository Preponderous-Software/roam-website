import {describe, expect, it} from 'vitest';
import {
    PLAY_URL,
    RELEASES_URL,
    REPO_URL,
    SITEMAP_PATHS,
    SITE_NEW_ISSUE_URL,
    SITE_ORIGIN,
    SITE_REPO_URL,
    absoluteUrl,
} from '../utils/site';

describe('absoluteUrl', () => {
    it('prefixes a rooted path with the production origin', () => {
        expect(absoluteUrl('/download')).toBe('https://roam.preponderous.org/download');
    });

    it('adds the missing leading slash to an unrooted path', () => {
        expect(absoluteUrl('download')).toBe('https://roam.preponderous.org/download');
    });

    it('maps the root path to the origin with a trailing slash', () => {
        expect(absoluteUrl('/')).toBe('https://roam.preponderous.org/');
    });

    it('maps an empty path to the origin with a trailing slash', () => {
        expect(absoluteUrl('')).toBe('https://roam.preponderous.org/');
    });
});

describe('SITE_ORIGIN', () => {
    it('is the https production origin with no trailing slash', () => {
        expect(SITE_ORIGIN).toBe('https://roam.preponderous.org');
    });
});

describe('SITEMAP_PATHS', () => {
    it('lists the home page, the download page and the in-browser build', () => {
        expect(SITEMAP_PATHS).toEqual(['/', '/download', PLAY_URL]);
    });

    it('holds only rooted paths', () => {
        for (const path of SITEMAP_PATHS) {
            expect(path.startsWith('/')).toBe(true);
        }
    });
});

describe('off-site URLs', () => {
    it('points the releases page at the game repo, not the website repo', () => {
        expect(RELEASES_URL).toBe(`${REPO_URL}/releases`);
        expect(REPO_URL).toBe('https://github.com/Preponderous-Software/roam');
    });

    it('points the bug-report link at the website repo, not the game repo', () => {
        expect(SITE_NEW_ISSUE_URL).toBe(`${SITE_REPO_URL}/issues/new`);
        expect(SITE_REPO_URL).toBe('https://github.com/Preponderous-Software/roam-website');
    });
});
