import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {act, fireEvent, render, screen} from '@testing-library/react';
import {statSync} from 'node:fs';
import {join} from 'node:path';
import React from 'react';
import WorldDiptych, {HERO_2D, HERO_3D_LOOP, HERO_3D_POSTER, REDUCED_MOTION_QUERY} from '../components/WorldDiptych';
import {PLAY_3D_URL} from '../utils/site';

const PUBLIC_DIR = join(__dirname, '..', 'public');

// matchMedia answering `matching`; an IntersectionObserver the test triggers.
const stubMedia = (matching: string[] = []) => {
    Object.defineProperty(window, 'matchMedia', {
        configurable: true,
        writable: true,
        value: (query: string) => ({
            matches: matching.includes(query), media: query, onchange: null,
            addListener: vi.fn(), removeListener: vi.fn(), dispatchEvent: vi.fn(),
            addEventListener: vi.fn(), removeEventListener: vi.fn(),
        }),
    });
};
let observed: ((entries: {isIntersecting: boolean}[]) => void)[] = [];
const stubObserver = () => {
    observed = [];
    vi.stubGlobal('IntersectionObserver', class {
        constructor(cb: (entries: {isIntersecting: boolean}[]) => void) { observed.push(cb); }
        observe() {}
        disconnect() {}
    });
};
const scrollIntoView = () => act(() => observed.forEach((cb) => cb([{isIntersecting: true}])));
const image3d = () => screen.getByTestId('world-diptych-3d');
const loop = () => screen.queryByTestId('world-diptych-3d-loop');

beforeEach(() => stubObserver());
afterEach(() => {
    vi.unstubAllGlobals();
    delete (window as {matchMedia?: unknown}).matchMedia;
    delete (navigator as {connection?: unknown}).connection;
});

describe('WorldDiptych', () => {
    it('ships small files: a crisp 2D still, a 3D still and a 3D loop', () => {
        expect(statSync(join(PUBLIC_DIR, HERO_2D)).size).toBeLessThan(40 * 1024);
        expect(statSync(join(PUBLIC_DIR, HERO_3D_POSTER)).size).toBeLessThan(100 * 1024);
        expect(statSync(join(PUBLIC_DIR, HERO_3D_LOOP)).size).toBeLessThan(1200 * 1024);
    });

    it('renders both halves as sized stills, so the server markup never holds the loop', () => {
        stubMedia();
        render(<WorldDiptych/>);
        const flat = screen.getByRole('img', {name: /in 2D/});
        expect(flat).toHaveAttribute('src', HERO_2D);
        expect(flat).toHaveAttribute('width', '408');
        expect(image3d()).toHaveAttribute('src', HERO_3D_POSTER);
        expect(image3d()).toHaveAttribute('width', '640');
        expect(screen.queryByRole('button')).toBeNull();
    });

    it('plays the loop once the page has loaded and the box is on screen, and can pause it', () => {
        stubMedia();
        render(<WorldDiptych/>);
        expect(document.readyState).toBe('complete');
        expect(loop()).toBeNull();
        scrollIntoView();
        // Over the still, which stays as it was.
        expect(loop()).toHaveAttribute('src', HERO_3D_LOOP);
        expect(loop()).toHaveAttribute('width', '420');
        expect(image3d()).toHaveAttribute('src', HERO_3D_POSTER);
        fireEvent.click(screen.getByRole('button', {name: 'Pause the 3D day-and-night loop'}));
        expect(loop()).toBeNull();
        const play = screen.getByRole('button', {name: 'Play the 3D day-and-night loop'});
        expect(play).toHaveAttribute('aria-pressed', 'true');
        fireEvent.click(play);
        expect(loop()).toHaveAttribute('src', HERO_3D_LOOP);
    });

    it('keeps the still for a visitor who prefers reduced motion', () => {
        stubMedia([REDUCED_MOTION_QUERY]);
        render(<WorldDiptych/>);
        scrollIntoView();
        expect(loop()).toBeNull();
        expect(screen.queryByRole('button')).toBeNull();
    });

    it('keeps the still when the browser asks to save data', () => {
        stubMedia();
        Object.defineProperty(navigator, 'connection', {configurable: true, value: {saveData: true}});
        render(<WorldDiptych/>);
        scrollIntoView();
        expect(loop()).toBeNull();
    });

    it('credits the tools and links the in-browser 3D view', () => {
        stubMedia();
        render(<WorldDiptych/>);
        expect(screen.getByRole('link', {name: 'roam-usd'})).toHaveAttribute('href', 'https://github.com/Preponderous-Software/roam-usd');
        expect(screen.getByRole('link', {name: 'Strata'})).toHaveAttribute('href', 'https://github.com/Preponderous-Software/strata');
        const try3d = screen.getByRole('link', {name: 'Try the 3D view in your browser'});
        expect(try3d).toHaveAttribute('href', PLAY_3D_URL);
        expect(PLAY_3D_URL).toBe('/play?view=3d');
    });
});
