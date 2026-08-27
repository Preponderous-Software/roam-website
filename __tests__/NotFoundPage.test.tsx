import {describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import React from 'react';
import NotFoundPage from '../pages/404';

// The TopBar rendered as part of the page chrome reads the current route from
// next/router, which only exists inside Next's app runtime.
vi.mock('next/router', () => ({
    useRouter: () => ({pathname: '/404'}),
}));

// next/head is a no-op outside Next's HeadManagerContext (see Seo.test.tsx);
// a passthrough keeps the chrome's <Seo/> from touching the document here.
vi.mock('next/head', () => ({
    default: ({children}: {children: React.ReactNode}) => <>{children}</>,
}));

describe('404 page', () => {
    it('states the code, the problem, and what it means', () => {
        render(<NotFoundPage/>);
        expect(screen.getByRole('heading', {name: '404', level: 1})).toBeInTheDocument();
        expect(screen.getByRole('heading', {name: 'Page not found', level: 4})).toBeInTheDocument();
        expect(
            screen.getByText("The page you're looking for doesn't exist or may have moved.")
        ).toBeInTheDocument();
    });

    it('offers a way back to the home page', () => {
        render(<NotFoundPage/>);
        expect(screen.getByRole('link', {name: 'Back to home'})).toHaveAttribute('href', '/');
    });

    it('titles the tab with the code so a wrong URL is recognisable from the tab bar', () => {
        const {container} = render(<NotFoundPage/>);
        expect(container.querySelector('title')).toHaveTextContent('404 — Page not found — Roam');
    });
});
