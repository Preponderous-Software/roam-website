import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import React from 'react';
import HowToPlay from '../components/HowToPlay';
import {REPO_URL} from '../utils/site';

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

    it('labels the browser mode as planned rather than live, with no link to a nonexistent /play route', () => {
        render(<HowToPlay/>);
        expect(screen.getByText('Planned')).toBeInTheDocument();
        expect(screen.queryByText('Live')).not.toBeInTheDocument();
        for (const link of screen.getAllByRole('link')) {
            expect(link).not.toHaveAttribute('href', '/play');
        }
    });

    it('links to GitHub from the browser mode, opening in a new tab', () => {
        render(<HowToPlay/>);
        const github = screen.getByRole('link', {name: 'Follow along on GitHub'});
        expect(github).toHaveAttribute('href', REPO_URL);
        expect(github).toHaveAttribute('target', '_blank');
        expect(github).toHaveAttribute('rel', 'noopener noreferrer');
    });
});
