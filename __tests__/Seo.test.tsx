import {describe, expect, it, vi} from 'vitest';
import {render} from '@testing-library/react';
import React from 'react';
import Seo from '../components/Seo';

// next/head only wires up to the real document via the HeadManagerContext that
// Next's app runtime provides (_app/_document); rendered standalone in jsdom it
// is a no-op, so document.title/document.head are never touched. Rendering it
// as a passthrough lets its <title>/<meta> children be asserted directly.
vi.mock('next/head', () => ({
    default: ({children}: {children: React.ReactNode}) => <>{children}</>,
}));

describe('Seo', () => {
    it('falls back to the site name and default description when no props are given', () => {
        const {container} = render(<Seo/>);
        expect(container.querySelector('title')).toHaveTextContent('Roam — a procedurally-generated world to explore');
        expect(container.querySelector('meta[name="description"]')).toHaveAttribute(
            'content',
            'Explore a procedurally-generated 2D world and interact with your surroundings. A free, source-available survival game by Preponderous Software.'
        );
    });

    it('appends the site name to a page-specific title and uses the given description', () => {
        const {container} = render(<Seo title="Download" description="Grab a build for your platform."/>);
        expect(container.querySelector('title')).toHaveTextContent('Download — Roam');
        expect(container.querySelector('meta[name="description"]')).toHaveAttribute(
            'content',
            'Grab a build for your platform.'
        );
    });

    it('mirrors the title and description into the Open Graph and Twitter tags', () => {
        const {container} = render(<Seo title="Download" description="Grab a build for your platform."/>);
        expect(container.querySelector('meta[property="og:title"]')).toHaveAttribute('content', 'Download — Roam');
        expect(container.querySelector('meta[property="og:description"]')).toHaveAttribute(
            'content',
            'Grab a build for your platform.'
        );
        expect(container.querySelector('meta[name="twitter:title"]')).toHaveAttribute('content', 'Download — Roam');
    });
});
