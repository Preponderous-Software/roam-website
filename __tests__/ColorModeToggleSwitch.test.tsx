import {describe, expect, it, vi} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import React from 'react';
import {ColorModeToggleSwitch} from '../components/ColorModeToggleSwitch';

// The sun/moon glyphs are background images on the thumb's ::before pseudo-element,
// which getComputedStyle does not expose in jsdom, so the emotion-injected rules are
// read off the document instead.
const styleSheetText = (style: HTMLStyleElement): string => {
    if (style.textContent) {
        return style.textContent;
    }
    const rules = style.sheet ? Array.from(style.sheet.cssRules) : [];
    return rules.map((rule) => rule.cssText).join('\n');
};

const injectedCss = (): string =>
    Array.from(document.querySelectorAll('style')).map(styleSheetText).join('\n');

describe('ColorModeToggleSwitch', () => {
    it('renders a checkbox that reflects the checked prop', () => {
        render(
            <ColorModeToggleSwitch
                checked
                onChange={vi.fn()}
                inputProps={{'aria-label': 'Toggle dark mode'}}
            />
        );
        expect(screen.getByLabelText('Toggle dark mode')).toBeChecked();
    });

    it('reports a toggle to the checked state through onChange', () => {
        const onChange = vi.fn();
        render(
            <ColorModeToggleSwitch
                checked={false}
                onChange={onChange}
                inputProps={{'aria-label': 'Toggle dark mode'}}
            />
        );

        fireEvent.click(screen.getByLabelText('Toggle dark mode'));

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][1]).toBe(true);
    });

    it('paints the thumb with the glyphs from /public/colormode', () => {
        render(<ColorModeToggleSwitch checked={false} onChange={vi.fn()}/>);

        const css = injectedCss();
        expect(css).toMatch(/url\(['"]?\/colormode\/light\.svg['"]?\)/);
        expect(css).toMatch(/url\(['"]?\/colormode\/dark\.svg['"]?\)/);
    });
});
