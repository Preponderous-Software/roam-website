import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {act, fireEvent, render, screen} from '@testing-library/react';
import {existsSync, statSync} from 'node:fs';
import {join} from 'node:path';
import React from 'react';
import WorldDiptych, {
    HERO_2D, HERO_3D_LOOP_MP4, HERO_3D_LOOP_WEBM, HERO_3D_POSTER, REDUCED_MOTION_QUERY,
} from '../components/WorldDiptych';
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

// jsdom has no media playback; spies stand in for play() and pause().
let play: ReturnType<typeof vi.fn>;
let pause: ReturnType<typeof vi.fn>;
beforeEach(() => {
    stubObserver();
    play = vi.fn(() => Promise.resolve());
    pause = vi.fn();
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(play);
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(pause);
});
afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    delete (window as {matchMedia?: unknown}).matchMedia;
    delete (navigator as {connection?: unknown}).connection;
});

describe('WorldDiptych', () => {
    it('ships small files: a crisp 2D still, a 3D still and a 3D loop in two codecs', () => {
        expect(statSync(join(PUBLIC_DIR, HERO_2D)).size).toBeLessThan(40 * 1024);
        expect(statSync(join(PUBLIC_DIR, HERO_3D_POSTER)).size).toBeLessThan(100 * 1024);
        expect(statSync(join(PUBLIC_DIR, HERO_3D_LOOP_WEBM)).size).toBeLessThan(300 * 1024);
        expect(statSync(join(PUBLIC_DIR, HERO_3D_LOOP_MP4)).size).toBeLessThan(300 * 1024);
        expect(existsSync(join(PUBLIC_DIR, 'hero', 'roam-3d.gif'))).toBe(false);
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
        // A muted, inline, looping video over the still, which stays as it was.
        const video = loop() as HTMLVideoElement;
        expect(video.tagName).toBe('VIDEO');
        expect(video).toHaveAttribute('autoplay');
        expect(video).toHaveAttribute('loop');
        expect(video).toHaveAttribute('playsinline');
        expect(video).toHaveAttribute('preload', 'metadata');
        expect(video).toHaveAttribute('poster', HERO_3D_POSTER);
        expect(video.muted).toBe(true);
        expect(Array.from(video.querySelectorAll('source')).map((el) => [el.getAttribute('src'), el.getAttribute('type')]))
            .toEqual([[HERO_3D_LOOP_WEBM, 'video/webm'], [HERO_3D_LOOP_MP4, 'video/mp4']]);
        expect(image3d()).toHaveAttribute('src', HERO_3D_POSTER);
        expect(play).toHaveBeenCalled();
        // Pausing holds the frame (the video stays); playing resumes it.
        fireEvent.click(screen.getByRole('button', {name: 'Pause the 3D day-and-night loop'}));
        expect(pause).toHaveBeenCalled();
        expect(loop()).toBe(video);
        const resume = screen.getByRole('button', {name: 'Play the 3D day-and-night loop'});
        expect(resume).toHaveAttribute('aria-pressed', 'true');
        play.mockClear();
        fireEvent.click(resume);
        expect(play).toHaveBeenCalled();
    });

    it('keeps the poster when the browser refuses to play', () => {
        stubMedia();
        play.mockImplementation(() => Promise.reject(new Error('NotAllowedError')));
        render(<WorldDiptych/>);
        scrollIntoView();
        expect(loop()).toHaveAttribute('poster', HERO_3D_POSTER);
    });

    it('keeps the still for a visitor who prefers reduced motion, with no video to autoplay', () => {
        stubMedia([REDUCED_MOTION_QUERY]);
        const {container} = render(<WorldDiptych/>);
        scrollIntoView();
        expect(loop()).toBeNull();
        expect(container.querySelector('video')).toBeNull();
        expect(play).not.toHaveBeenCalled();
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
