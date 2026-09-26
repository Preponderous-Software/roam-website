import {afterEach, describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import React from 'react';
import FeaturesSection from '../components/FeaturesSection';
import featuresData from '../pages/data/features.json';

// MUI's icons-material components render an <svg data-testid="<Name>Icon">, so
// the icon a card resolved to can be read back off its card.
const EXPECTED_ICON_TEST_IDS: Record<string, string> = {
    public: 'PublicIcon',
    bolt: 'BoltIcon',
    build: 'BuildIcon',
    agriculture: 'AgricultureIcon',
    pets: 'PetsIcon',
    terminal: 'TerminalIcon',
};

// The card is the heading's parent Paper: icon box, title, description.
const cardFor = (title: string): HTMLElement => {
    const card = screen.getByRole('heading', {name: title}).parentElement;
    if (!card) throw new Error(`no card found for "${title}"`);
    return card;
};

describe('FeaturesSection', () => {
    afterEach(() => {
        vi.doUnmock('../pages/data/features.json');
        vi.resetModules();
    });

    it('renders a card for every feature in the data file', () => {
        render(<FeaturesSection/>);
        for (const feature of featuresData.features) {
            expect(screen.getByRole('heading', {name: feature.title})).toBeInTheDocument();
        }
    });

    it('shows each feature\'s description on its own card', () => {
        render(<FeaturesSection/>);
        for (const feature of featuresData.features) {
            expect(cardFor(feature.title)).toHaveTextContent(feature.description);
        }
    });

    it('renders the MUI icon mapped to each feature\'s icon key', () => {
        render(<FeaturesSection/>);
        for (const feature of featuresData.features) {
            const testId = EXPECTED_ICON_TEST_IDS[feature.icon];
            expect(testId, `unmapped icon key "${feature.icon}" in features.json`).toBeDefined();
            expect(cardFor(feature.title).querySelector(`[data-testid="${testId}"]`)).not.toBeNull();
        }
    });

    it('falls back to the globe icon for an icon key it does not know', async () => {
        vi.resetModules();
        vi.doMock('../pages/data/features.json', () => ({
            default: {
                features: [
                    {id: 'mystery', icon: 'not-a-real-icon', title: 'Mystery feature', description: 'Unmapped icon.'},
                ],
            },
        }));
        const {default: MockedFeaturesSection} = await import('../components/FeaturesSection');
        render(<MockedFeaturesSection/>);
        expect(cardFor('Mystery feature').querySelector('[data-testid="PublicIcon"]')).not.toBeNull();
    });
});
