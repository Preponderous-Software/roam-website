import {describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import React from 'react';
import ErrorPage from '../components/ErrorPage';
import pkg from '../package.json';

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

const props = {
    code: '404',
    title: 'Page not found',
    message: "The page you're looking for doesn't exist or may have moved.",
};

describe('ErrorPage', () => {
    it('renders the code, title, and message it is given', () => {
        render(<ErrorPage {...props}/>);
        expect(screen.getByRole('heading', {name: props.code, level: 1})).toBeInTheDocument();
        expect(screen.getByRole('heading', {name: props.title, level: 4})).toBeInTheDocument();
        expect(screen.getByText(props.message)).toBeInTheDocument();
    });

    it('offers a way back to the home page', () => {
        render(<ErrorPage {...props}/>);
        expect(screen.getByRole('link', {name: 'Back to home'})).toHaveAttribute('href', '/');
    });

    it('wraps the message in the standard site chrome', () => {
        render(<ErrorPage {...props}/>);
        // TopBar navigation above, BottomBar version label below — an errored
        // route still looks like the rest of the site.
        expect(screen.getByRole('link', {name: 'Download'})).toBeInTheDocument();
        expect(screen.getByText(`v${pkg.version}`)).toBeInTheDocument();
    });
});
