import {describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import React from 'react';
import ServerErrorPage from '../pages/500';

// The TopBar rendered as part of the page chrome reads the current route from
// next/router, which only exists inside Next's app runtime.
vi.mock('next/router', () => ({
    useRouter: () => ({pathname: '/500'}),
}));

// next/head is a no-op outside Next's HeadManagerContext (see Seo.test.tsx);
// a passthrough keeps the chrome's <Seo/> from touching the document here.
vi.mock('next/head', () => ({
    default: ({children}: {children: React.ReactNode}) => <>{children}</>,
}));

describe('500 page', () => {
    it('states the code and puts the fault on the server rather than the visitor', () => {
        render(<ServerErrorPage/>);
        expect(screen.getByRole('heading', {name: '500', level: 1})).toBeInTheDocument();
        expect(screen.getByRole('heading', {name: 'Something went wrong', level: 4})).toBeInTheDocument();
        expect(
            screen.getByText('An unexpected error occurred on our end. Please try again in a moment.')
        ).toBeInTheDocument();
    });

    it('offers a way back to the home page', () => {
        render(<ServerErrorPage/>);
        expect(screen.getByRole('link', {name: 'Back to home'})).toHaveAttribute('href', '/');
    });

    it('titles the tab with the code so an errored route is recognisable from the tab bar', () => {
        const {container} = render(<ServerErrorPage/>);
        expect(container.querySelector('title')).toHaveTextContent('500 — Something went wrong — Roam');
    });
});
