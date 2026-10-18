import {afterEach, describe, expect, it, vi} from 'vitest';
import {cleanup, render} from '@testing-library/react';
import {existsSync, readdirSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
import React from 'react';
import Home from '../pages/index';
import DownloadPage from '../pages/download';
import {SITE_ORIGIN} from '../utils/site';

// The TopBar rendered as part of the page chrome reads the current route from
// next/router, which only exists inside Next's app runtime.
vi.mock('next/router', () => ({
    useRouter: () => ({pathname: '/'}),
}));

// next/head is a no-op outside Next's HeadManagerContext (see Seo.test.tsx);
// a passthrough lets the favicon and share-image tags be read off the render.
vi.mock('next/head', () => ({
    default: ({children}: {children: React.ReactNode}) => <>{children}</>,
}));

const PUBLIC_DIR = join(__dirname, '..', 'public');
const COMPONENTS_DIR = join(__dirname, '..', 'components');

// A same-site path to a file (it has an extension), e.g. "/sprites/wolf.png".
// "/play" and "/download" are pages, not files, so they are left out.
const ASSET_PATH = /^\/[^?#]*\.[a-z0-9]+$/i;

// Every same-site file a rendered page asks the browser to fetch: <img src>,
// <link href> (the favicon) and <meta content> (og:image/twitter:image, which
// are absolute at SITE_ORIGIN, so the origin is stripped back to a path).
const renderedAssetPaths = (container: HTMLElement): string[] => {
    const values = [
        ...Array.from(container.querySelectorAll('img')).map((el) => el.getAttribute('src')),
        ...Array.from(container.querySelectorAll('link')).map((el) => el.getAttribute('href')),
        ...Array.from(container.querySelectorAll('meta')).map((el) => el.getAttribute('content')),
    ];
    return values
        .filter((value): value is string => value !== null)
        .map((value) => (value.startsWith(SITE_ORIGIN) ? value.slice(SITE_ORIGIN.length) : value))
        .filter((value) => ASSET_PATH.test(value));
};

const missingFromPublic = (paths: string[]): string[] =>
    paths.filter((path) => !existsSync(join(PUBLIC_DIR, path)));

describe('public assets', () => {
    afterEach(cleanup);

    it.each([
        ['home', Home],
        ['download', DownloadPage],
    ])('every file the %s page references exists under public/', (_name, Page) => {
        const {container} = render(<Page/>);
        const paths = renderedAssetPaths(container);

        expect(paths.length).toBeGreaterThan(0);
        expect(missingFromPublic(paths)).toEqual([]);
    });

    it('the home page references the icon, every screenshot and the sprites', () => {
        const {container} = render(<Home/>);
        const paths = renderedAssetPaths(container);

        expect(paths).toContain('/roam-icon.png');
        expect(paths).toContain('/screenshots/house.png');
        expect(paths).toContain('/screenshots/map.png');
        expect(paths).toContain('/sprites/player_down.png');
    });

    // CSS background images (the color-mode toggle's sun/moon glyphs) are not
    // in the DOM, so they are read from the component sources instead.
    it('every url(...) a component styles with exists under public/', () => {
        const paths = readdirSync(COMPONENTS_DIR)
            .filter((file) => file.endsWith('.tsx'))
            .flatMap((file) => {
                const source = readFileSync(join(COMPONENTS_DIR, file), 'utf8');
                return Array.from(source.matchAll(/url\(['"]?(\/[^'")]+)['"]?\)/g), (match) => match[1]);
            });

        expect(paths).toEqual(expect.arrayContaining(['/colormode/light.svg', '/colormode/dark.svg']));
        expect(missingFromPublic(paths)).toEqual([]);
    });
});
