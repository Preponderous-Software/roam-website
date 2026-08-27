import {describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import React from 'react';
import Home from '../pages/index';
import pkg from '../package.json';

// The TopBar rendered as part of the page chrome reads the current route from
// next/router, which only exists inside Next's app runtime.
vi.mock('next/router', () => ({
    useRouter: () => ({pathname: '/'}),
}));

// next/head is a no-op outside Next's HeadManagerContext (see Seo.test.tsx);
// a passthrough keeps the chrome's <Seo/> from touching the document here.
vi.mock('next/head', () => ({
    default: ({children}: {children: React.ReactNode}) => <>{children}</>,
}));

describe('Home page', () => {
    it('leads with the hero', () => {
        render(<Home/>);
        expect(screen.getByRole('heading', {name: 'Roam', level: 1})).toBeInTheDocument();
        expect(screen.getByRole('link', {name: 'Download Roam'})).toHaveAttribute('href', '/download');
    });

    it('assembles the features, showcase, and how-to-play sections beneath it, in that order', () => {
        render(<Home/>);
        // getAllByRole returns nodes in document order, and the page chrome
        // contributes no headings, so these are the page's sections top to bottom.
        expect(screen.getAllByRole('heading', {level: 2}).map((heading) => heading.textContent)).toEqual([
            'What you do in Roam',
            'A peek at the world',
            'How to play',
        ]);
    });

    it('wraps the sections in the standard site chrome', () => {
        render(<Home/>);
        // TopBar navigation above, BottomBar version label below.
        expect(screen.getByRole('link', {name: 'Download'})).toHaveAttribute('href', '/download');
        expect(screen.getByText(`v${pkg.version}`)).toBeInTheDocument();
    });

    it('gives the skip link in _app a #main landmark to jump to', () => {
        render(<Home/>);
        expect(screen.getByRole('main')).toHaveAttribute('id', 'main');
    });

    it('carries the default site-wide title and description', () => {
        const {container} = render(<Home/>);
        expect(container.querySelector('title')).toHaveTextContent(
            'Roam — a procedurally-generated world to explore'
        );
    });
});
