import {describe, expect, it} from 'vitest';
import {isActiveNavLink} from '../utils/nav';

describe('isActiveNavLink', () => {
    it('marks the matching in-site route active', () => {
        expect(isActiveNavLink('/', '/')).toBe(true);
        expect(isActiveNavLink('/download', '/download')).toBe(true);
    });

    it('does not mark a different route active', () => {
        expect(isActiveNavLink('/', '/download')).toBe(false);
    });

    it('never marks external links active', () => {
        expect(isActiveNavLink('/', 'https://github.com/Preponderous-Software/roam')).toBe(false);
    });
});
