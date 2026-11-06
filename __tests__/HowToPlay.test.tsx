import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import React from 'react';
import HowToPlay from '../components/HowToPlay';
import {PLAY_URL} from '../utils/site';

describe('HowToPlay', () => {
    it('renders all three modes', () => {
        render(<HowToPlay/>);
        expect(screen.getByRole('heading', {name: 'Desktop'})).toBeInTheDocument();
        expect(screen.getByRole('heading', {name: 'Terminal (text mode)'})).toBeInTheDocument();
        expect(screen.getByRole('heading', {name: 'In your browser'})).toBeInTheDocument();
    });

    it('shows the terminal launch command', () => {
        render(<HowToPlay/>);
        expect(screen.getByText('python src/roam.py --text')).toBeInTheDocument();
    });

    // The panel is on the home page too, which has no download grid above it, so
    // the desktop mode links to the download page rather than pointing up the page.
    it('links the desktop mode to the download page in the same tab', () => {
        render(<HowToPlay/>);
        const download = screen.getByRole('link', {name: 'Download a build'});
        expect(download).toHaveAttribute('href', '/download');
        expect(download).not.toHaveAttribute('target');
        expect(screen.queryByText(/build above/)).not.toBeInTheDocument();
    });

    it('describes the browser mode as live rather than planned', () => {
        render(<HowToPlay/>);
        expect(screen.queryByText('Planned')).not.toBeInTheDocument();
        expect(screen.getByText('No install')).toBeInTheDocument();
        expect(screen.getByText(/runs entirely in your browser via WebAssembly/)).toBeInTheDocument();
        expect(screen.getByText(/Saves are stored in\s+this browser/)).toBeInTheDocument();
    });

    it('links the browser mode to /play in the same tab', () => {
        render(<HowToPlay/>);
        const play = screen.getByRole('link', {name: 'Play in browser'});
        expect(play).toHaveAttribute('href', PLAY_URL);
        expect(PLAY_URL).toBe('/play');
        expect(play).not.toHaveAttribute('target');
    });
});
