import {describe, expect, it} from 'vitest';
import {render} from '@testing-library/react';
import React from 'react';
import SpriteStrip from '../components/SpriteStrip';

describe('SpriteStrip', () => {
    it('hides the decorative strip from assistive technology', () => {
        const {container} = render(<SpriteStrip/>);
        expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    });

    it('renders every sprite from /sprites with empty alt text', () => {
        const {container} = render(<SpriteStrip/>);
        const images = Array.from(container.querySelectorAll('img'));

        expect(images.length).toBeGreaterThan(0);
        for (const image of images) {
            expect(image).toHaveAttribute('alt', '');
            expect(image.getAttribute('src')).toMatch(/^\/sprites\/\w+\.png$/);
        }
        expect(images.map((image) => image.getAttribute('src'))).toContain('/sprites/player_down.png');
    });

    it('sizes each sprite at 40px square by default', () => {
        const {container} = render(<SpriteStrip/>);
        for (const image of Array.from(container.querySelectorAll('img'))) {
            expect(image).toHaveStyle({width: '40px', height: '40px'});
        }
    });

    it('honours an explicit size', () => {
        const {container} = render(<SpriteStrip size={64}/>);
        for (const image of Array.from(container.querySelectorAll('img'))) {
            expect(image).toHaveStyle({width: '64px', height: '64px'});
        }
    });
});
