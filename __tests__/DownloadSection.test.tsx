import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import React from 'react';
import DownloadSection from '../components/DownloadSection';
import {buildDownloads} from '../utils/downloads';
import {LATEST_VERSION, RELEASES_URL} from '../utils/site';

describe('DownloadSection', () => {
    it('renders one card per platform returned by buildDownloads', () => {
        render(<DownloadSection/>);
        const platforms = buildDownloads(LATEST_VERSION).map((item) => item.platform);

        // Each DownloadCard titles itself with an h3; the section's own heading is
        // an h2, so the h3 count is the card count.
        expect(screen.getAllByRole('heading', {level: 3})).toHaveLength(platforms.length);
        for (const platform of platforms) {
            expect(screen.getByRole('heading', {name: platform, level: 3})).toBeInTheDocument();
        }
    });

    it('labels the release chip with LATEST_VERSION and links it to the releases page', () => {
        render(<DownloadSection/>);
        const chip = screen.getByRole('link', {name: `Latest: v${LATEST_VERSION}`});
        expect(chip).toHaveAttribute('href', RELEASES_URL);
        expect(chip).toHaveAttribute('target', '_blank');
        expect(chip).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('builds the card asset links from the same version the chip advertises', () => {
        render(<DownloadSection/>);
        // The version-embedding asset URLs are what actually break when
        // LATEST_VERSION and the rendered links drift apart.
        const installer = buildDownloads(LATEST_VERSION).find((item) => item.id === 'windows')!.links[0];
        expect(screen.getByRole('link', {name: installer.label})).toHaveAttribute('href', installer.href);
    });
});
