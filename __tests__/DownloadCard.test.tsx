import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import React from 'react';
import DownloadCard from '../components/DownloadCard';
import {buildDownloads} from '../utils/downloads';

describe('DownloadCard', () => {
    it('renders the platform name, requirement, and every link', () => {
        const windows = buildDownloads('0.12.0').find((d) => d.id === 'windows')!;
        render(<DownloadCard item={windows}/>);

        expect(screen.getByRole('heading', {name: 'Windows'})).toBeInTheDocument();
        expect(screen.getByText(/Windows 10 or 11/)).toBeInTheDocument();

        for (const link of windows.links) {
            // link.label is matched as a plain string (it contains regex
            // metacharacters like "(.exe)"); the button's accessible name is
            // exactly the label since the start icon is aria-hidden.
            const el = screen.getByRole('link', {name: link.label});
            expect(el).toHaveAttribute('href', link.href);
        }
    });

    it('opens external download links in a new tab safely', () => {
        const mac = buildDownloads('0.12.0').find((d) => d.id === 'macos')!;
        render(<DownloadCard item={mac}/>);
        const dmg = screen.getByRole('link', {name: /Disk image/});
        expect(dmg).toHaveAttribute('target', '_blank');
        expect(dmg).toHaveAttribute('rel', 'noopener noreferrer');
    });
});
