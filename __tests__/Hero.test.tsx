import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import React from 'react';
import Hero from '../components/Hero';
import {REPO_URL} from '../utils/site';

describe('Hero', () => {
    it('names the game as the page-level heading', () => {
        render(<Hero/>);
        expect(screen.getByRole('heading', {name: 'Roam', level: 1})).toBeInTheDocument();
    });

    it('keeps the primary call to action inside the site', () => {
        render(<Hero/>);
        const download = screen.getByRole('link', {name: 'Download Roam'});
        expect(download).toHaveAttribute('href', '/download');
        // An in-site route navigates in the same tab, unlike the source link below.
        expect(download).not.toHaveAttribute('target');
    });

    it('opens the source link off-site safely', () => {
        render(<Hero/>);
        const source = screen.getByRole('link', {name: 'View Source'});
        expect(source).toHaveAttribute('href', REPO_URL);
        expect(source).toHaveAttribute('target', '_blank');
        expect(source).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders the sprite strip beneath the calls to action', () => {
        const {container} = render(<Hero/>);
        expect(container.querySelectorAll('img[src^="/sprites/"]').length).toBeGreaterThan(0);
    });
});
