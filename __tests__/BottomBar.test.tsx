import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import React from 'react';
import BottomBar from '../components/BottomBar';
import {DISCORD_URL, SITE_REPO_URL} from '../utils/site';

describe('BottomBar', () => {
    it('renders the given website version prefixed with a v', () => {
        render(<BottomBar version="1.2.3"/>);
        expect(screen.getByText('v1.2.3')).toBeInTheDocument();
    });

    it('points the source and bug-report links at this website\'s repo', () => {
        render(<BottomBar version="0.1.0"/>);
        expect(screen.getByRole('link', {name: 'Source Code'})).toHaveAttribute('href', SITE_REPO_URL);
        expect(screen.getByRole('link', {name: 'Report a Bug'})).toHaveAttribute(
            'href',
            `${SITE_REPO_URL}/issues/new`
        );
    });

    it('surfaces the Discord invite from utils/site.ts', () => {
        render(<BottomBar version="0.1.0"/>);
        expect(screen.getByRole('link', {name: 'Discord'})).toHaveAttribute('href', DISCORD_URL);
    });

    it('opens every footer link in a new tab safely', () => {
        render(<BottomBar version="0.1.0"/>);
        for (const name of ['Source Code', 'Report a Bug', 'Discord']) {
            const link = screen.getByRole('link', {name});
            expect(link).toHaveAttribute('target', '_blank');
            expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        }
    });

    it('renders the dark-mode toggle', () => {
        render(<BottomBar version="0.1.0"/>);
        expect(screen.getByLabelText('Toggle dark mode')).toBeInTheDocument();
    });
});
