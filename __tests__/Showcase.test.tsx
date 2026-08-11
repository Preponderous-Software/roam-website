import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import React from 'react';
import Showcase from '../components/Showcase';

const SHOTS = [
    {src: '/screenshots/house.png', caption: 'A base built from gathered wood and stone'},
    {src: '/screenshots/map.png', caption: 'The minimap view of a generated world'},
];

describe('Showcase', () => {
    it('renders the section heading', () => {
        render(<Showcase/>);
        expect(screen.getByRole('heading', {name: 'A peek at the world', level: 2})).toBeInTheDocument();
    });

    it('describes every screenshot with alt text rather than leaving it decorative', () => {
        const {container} = render(<Showcase/>);
        const images = Array.from(container.querySelectorAll('img'));

        expect(images).toHaveLength(SHOTS.length);
        for (const image of images) {
            expect(image.getAttribute('alt')).toBeTruthy();
        }
    });

    it('pairs each screenshot with a visible caption matching its alt text', () => {
        render(<Showcase/>);
        for (const shot of SHOTS) {
            expect(screen.getByRole('img', {name: shot.caption})).toHaveAttribute('src', shot.src);
            expect(screen.getByText(shot.caption)).toBeInTheDocument();
        }
    });
});
