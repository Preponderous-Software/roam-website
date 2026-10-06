import type {NextApiRequest, NextApiResponse} from 'next';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {describe, expect, it} from 'vitest';
import handler, {buildSitemap} from '../pages/api/sitemap';
import nextConfig from '../next.config.js';

interface Recorded {
    statusCode: number;
    headers: Record<string, string>;
    body: string | undefined;
}

const call = (method: string): Recorded => {
    const recorded: Recorded = {statusCode: 0, headers: {}, body: undefined};
    const res = {
        setHeader(name: string, value: string) {
            recorded.headers[name.toLowerCase()] = value;
            return this;
        },
        status(code: number) {
            recorded.statusCode = code;
            return this;
        },
        send(body: string) {
            recorded.body = body;
            return this;
        },
        end() {
            return this;
        },
    };
    handler({method} as NextApiRequest, res as unknown as NextApiResponse);
    return recorded;
};

const locs = (xml: string): string[] => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

describe('GET /sitemap.xml', () => {
    it('lists the home page, the download page and the in-browser build at the production origin', () => {
        expect(locs(buildSitemap())).toEqual([
            'https://roam.preponderous.org/',
            'https://roam.preponderous.org/download',
            'https://roam.preponderous.org/play',
        ]);
    });

    it('never advertises a non-production origin', () => {
        for (const loc of locs(buildSitemap())) {
            expect(loc.startsWith('https://roam.preponderous.org/')).toBe(true);
        }
    });

    it('answers 200 with an XML urlset', () => {
        const res = call('GET');
        expect(res.statusCode).toBe(200);
        expect(res.headers['content-type']).toBe('application/xml; charset=utf-8');
        expect(res.body).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    });

    it('refuses other methods with 405', () => {
        const res = call('POST');
        expect(res.statusCode).toBe(405);
        expect(res.headers['allow']).toBe('GET, HEAD');
    });

    it('is reached at /sitemap.xml through a rewrite in next.config.js', async () => {
        const rewrites = await nextConfig.rewrites();
        expect(rewrites).toContainEqual({source: '/sitemap.xml', destination: '/api/sitemap'});
    });
});

describe('robots.txt', () => {
    const robots = readFileSync(join(__dirname, '..', 'public', 'robots.txt'), 'utf8');

    it('allows all crawlers', () => {
        expect(robots).toMatch(/^User-agent: \*$/m);
        expect(robots).toMatch(/^Allow: \/$/m);
        expect(robots).not.toMatch(/^Disallow: \/\s*$/m);
    });

    it('points at the production sitemap', () => {
        expect(robots).toMatch(/^Sitemap: https:\/\/roam\.preponderous\.org\/sitemap\.xml$/m);
    });
});
