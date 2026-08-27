import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import {useTheme} from '@mui/material';
import type {AppProps} from 'next/app';
import React, {useContext} from 'react';
import MyApp from '../pages/_app';
import {ColorModeContext} from '../utils/ColorModeContext';
import {COLOR_MODE_STORAGE_KEY} from '../utils/colorMode';

// MyApp reads the OS preference through window.matchMedia, which jsdom offers
// no way to point at a given prefers-color-scheme answer. Stubbing it per test
// makes both the prefers-dark and prefers-light paths reachable; the original
// is restored afterwards.
const originalMatchMedia = window.matchMedia;

const stubMatchMedia = (prefersDark: boolean) => {
    window.matchMedia = ((query: string) => ({
        matches: prefersDark,
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
    })) as typeof window.matchMedia;
};

// A stand-in page that reports the mode the theme resolved to and offers the
// same toggle the real TopBar/BottomBar switch is wired to.
const ModeProbe: React.FC = () => {
    const theme = useTheme();
    const {toggleColorMode} = useContext(ColorModeContext);
    return (
        <main id="main">
            <p>{`mode:${theme.palette.mode}`}</p>
            <button onClick={toggleColorMode}>Toggle</button>
        </main>
    );
};

// MyApp destructures only Component and pageProps; `router` is required by the
// AppProps type but never read, so an empty stand-in is enough here.
const renderApp = () =>
    render(
        <MyApp
            Component={ModeProbe}
            pageProps={{}}
            router={{} as AppProps['router']}
        />
    );

describe('MyApp', () => {
    beforeEach(() => {
        window.localStorage.clear();
        stubMatchMedia(true);
    });

    afterEach(() => {
        window.matchMedia = originalMatchMedia;
        window.localStorage.clear();
    });

    it('renders the given page component', () => {
        renderApp();
        expect(screen.getByRole('button', {name: 'Toggle'})).toBeInTheDocument();
    });

    it('follows the OS preference when no choice has been stored', () => {
        stubMatchMedia(true);
        renderApp();
        expect(screen.getByText('mode:dark')).toBeInTheDocument();
    });

    it('follows a light OS preference just the same', () => {
        stubMatchMedia(false);
        renderApp();
        expect(screen.getByText('mode:light')).toBeInTheDocument();
    });

    it('honours a stored explicit choice over the OS preference', () => {
        window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, 'light');
        stubMatchMedia(true);
        renderApp();
        expect(screen.getByText('mode:light')).toBeInTheDocument();
    });

    it('persists an explicit toggle so the choice survives a reload', () => {
        renderApp();
        expect(screen.getByText('mode:dark')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', {name: 'Toggle'}));

        expect(screen.getByText('mode:light')).toBeInTheDocument();
        expect(window.localStorage.getItem(COLOR_MODE_STORAGE_KEY)).toBe('light');
    });

    it('offers a skip link to the page\'s #main landmark', () => {
        renderApp();
        expect(screen.getByRole('link', {name: 'Skip to main content'})).toHaveAttribute('href', '#main');
    });
});
