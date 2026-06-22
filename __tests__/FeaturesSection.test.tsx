import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import React from 'react';
import FeaturesSection from '../components/FeaturesSection';
import featuresData from '../pages/data/features.json';

describe('FeaturesSection', () => {
    it('renders a card for every feature in the data file', () => {
        render(<FeaturesSection/>);
        for (const feature of featuresData.features) {
            expect(screen.getByRole('heading', {name: feature.title})).toBeInTheDocument();
        }
    });
});
