import {describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import React from 'react';
import DownloadPage from '../pages/download';
import pkg from '../package.json';
import {LATEST_VERSION} from '../utils/site';

// The TopBar rendered as part of the page chrome reads the current route from
// next/router, which only exists inside Next's app runtime.
vi.mock('next/router', () => ({
    useRouter: () => ({pathname: '/download'}),
}));

// next/head is a no-op outside Next's HeadManagerContext (see Seo.test.tsx);
// a passthrough keeps the chrome's <Seo/> from touching the document here.
vi.mock('next/head', () => ({
    default: ({children}: {children: React.ReactNode}) => <>{children}</>,
}));

describe('Download page', () => {
    it('introduces the page with its own heading and blurb', () => {
        render(<DownloadPage/>);
        expect(screen.getByRole('heading', {name: 'Get Roam', level: 1})).toBeInTheDocument();
        expect(screen.getByText(/Pick your platform and start exploring/)).toBeInTheDocument();
    });

    it('renders the platform grid for the version in utils/site.ts', () => {
        render(<DownloadPage/>);
        expect(screen.getByRole('heading', {name: 'Download Roam', level: 2})).toBeInTheDocument();
        expect(screen.getByRole('link', {name: `Latest: v${LATEST_VERSION}`})).toBeInTheDocument();
        for (const platform of ['Windows', 'macOS', 'Linux & source']) {
            expect(screen.getByRole('heading', {name: platform, level: 3})).toBeInTheDocument();
        }
    });

    it('repeats the how-to-play panel below the grid', () => {
        render(<DownloadPage/>);
        // getAllByRole returns nodes in document order, and the page chrome
        // contributes no headings, so these are the page's sections top to bottom.
        expect(screen.getAllByRole('heading', {level: 2}).map((heading) => heading.textContent)).toEqual([
            'Download Roam',
            'How to play',
        ]);
    });

    it('wraps the sections in the standard site chrome', () => {
        render(<DownloadPage/>);
        expect(screen.getByRole('link', {name: 'Home'})).toHaveAttribute('href', '/');
        expect(screen.getByText(`v${pkg.version}`)).toBeInTheDocument();
        expect(screen.getByRole('main')).toHaveAttribute('id', 'main');
    });

    it('overrides the page title and description for sharing and search', () => {
        const {container} = render(<DownloadPage/>);
        expect(container.querySelector('title')).toHaveTextContent('Download — Roam');
        expect(container.querySelector('meta[name="description"]')).toHaveAttribute(
            'content',
            'Download Roam for Windows, macOS, or build from source on Linux. Free and source-available.'
        );
    });
});
