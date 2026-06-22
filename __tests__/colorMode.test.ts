import {describe, expect, it} from 'vitest';
import {resolveInitialColorMode} from '../utils/colorMode';

describe('resolveInitialColorMode', () => {
    it('honours a stored explicit choice over the system preference', () => {
        expect(resolveInitialColorMode('light', true)).toBe('light');
        expect(resolveInitialColorMode('dark', false)).toBe('dark');
    });

    it('falls back to the system preference when nothing is stored', () => {
        expect(resolveInitialColorMode(null, true)).toBe('dark');
        expect(resolveInitialColorMode(null, false)).toBe('light');
    });

    it('ignores invalid stored values', () => {
        expect(resolveInitialColorMode('purple', true)).toBe('dark');
    });
});
