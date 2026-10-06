import type {NextApiRequest, NextApiResponse} from 'next';
import {SITEMAP_PATHS, absoluteUrl} from '../../utils/site';

// The sitemap body: one <url> per SITEMAP_PATHS entry, at the production origin.
export const buildSitemap = (): string =>
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    SITEMAP_PATHS.map((path) => `  <url><loc>${absoluteUrl(path)}</loc></url>\n`).join('') +
    '</urlset>\n';

// GET /sitemap.xml (rewritten here by next.config.js). robots.txt points at it.
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.setHeader('Allow', 'GET, HEAD');
        res.status(405).end();
        return;
    }
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).send(buildSitemap());
}
