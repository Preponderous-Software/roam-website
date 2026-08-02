import {describe, expect, it} from 'vitest';
import {render} from '@testing-library/react';
import React from 'react';
import Seo from '../components/Seo';

describe('Seo', () => {
    it('falls back to the site name and default description when no props are given', () => {
        render(<Seo/>);
        expect(document.title).toBe('Roam — a procedurally-generated world to explore');
        expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
            'content',
            'Explore a procedurally-generated 2D world and interact with your surroundings. A free, source-available survival game by Preponderous Software.'
        );
    });

    it('appends the site name to a page-specific title and uses the given description', () => {
        render(<Seo title="Download" description="Grab a build for your platform."/>);
        expect(document.title).toBe('Download — Roam');
        expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
            'content',
            'Grab a build for your platform.'
        );
    });

    it('mirrors the title and description into the Open Graph and Twitter tags', () => {
        render(<Seo title="Download" description="Grab a build for your platform."/>);
        expect(document.querySelector('meta[property="og:title"]')).toHaveAttribute('content', 'Download — Roam');
        expect(document.querySelector('meta[property="og:description"]')).toHaveAttribute(
            'content',
            'Grab a build for your platform.'
        );
        expect(document.querySelector('meta[name="twitter:title"]')).toHaveAttribute('content', 'Download — Roam');
    });
});
