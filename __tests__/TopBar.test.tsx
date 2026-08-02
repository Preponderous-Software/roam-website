import {describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import React from 'react';
import TopBar from '../components/TopBar';

vi.mock('next/router', () => ({
    useRouter: () => ({pathname: mockPathname}),
}));

let mockPathname = '/';

describe('TopBar', () => {
    it('marks the Home link active on the home route', () => {
        mockPathname = '/';
        render(<TopBar/>);
        expect(screen.getByRole('link', {name: 'Home'})).toHaveAttribute('aria-current', 'page');
        expect(screen.getByRole('link', {name: 'Download'})).not.toHaveAttribute('aria-current');
    });

    it('marks the Download link active on the download route', () => {
        mockPathname = '/download';
        render(<TopBar/>);
        expect(screen.getByRole('link', {name: 'Download'})).toHaveAttribute('aria-current', 'page');
        expect(screen.getByRole('link', {name: 'Home'})).not.toHaveAttribute('aria-current');
    });

    it('opens the GitHub link in a new tab and never marks it active', () => {
        mockPathname = '/';
        render(<TopBar/>);
        const github = screen.getByRole('link', {name: /GitHub/});
        expect(github).toHaveAttribute('target', '_blank');
        expect(github).toHaveAttribute('rel', 'noopener noreferrer');
        expect(github).not.toHaveAttribute('aria-current');
    });

    it('renders the dark-mode toggle', () => {
        mockPathname = '/';
        render(<TopBar/>);
        expect(screen.getByLabelText('Toggle dark mode')).toBeInTheDocument();
    });
});
