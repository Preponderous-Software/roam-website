import Head from 'next/head';
import React from 'react';
import {absoluteUrl} from '../utils/site';

// Shared per-page document metadata: title, description, canonical link, and
// Open Graph / Twitter card tags so browser tabs, search engines, and shared
// links (Discord, social) all show meaningful information. Render once near the
// top of each page.
const SITE_NAME = 'Roam';
const DEFAULT_DESCRIPTION =
    'Explore a procedurally-generated 2D world and interact with your surroundings. A free, source-available survival game by Preponderous Software.';
// The share card: public/og-roam-2d-3d.png, a 1200x630 PNG cut from the home
// page's 2D / 3D diptych (one Roam world drawn by Roam's own 2D renderer beside
// the same world rendered in 3D with Strata, the title in a band below). It is
// made by scripts/hero/render_hero.py --card; see scripts/hero/README.md.
// 1200x630 is the 1.91:1 shape summary_large_image expects. OG_IMAGE_ALT is
// scripts/hero/og-card.json's alt text, word for word; __tests__/Seo.test.tsx
// fails if the two drift apart.
export const OG_IMAGE_PATH = '/og-roam-2d-3d.png';
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const OG_IMAGE_ALT =
    'The same Roam world twice, side by side: on the left in 2D, top-down pixel art of forest, meadow ' +
    'and a small fenced home as the game draws it; on the right in 3D, the same forest, meadow and ' +
    'home as blocks. Below them: the title Roam, the tagline “One world, in 2D and 3D”, the address ' +
    'roam.preponderous.org, and “3D rendered with Strata 0.6.0”.';
const OG_IMAGE = absoluteUrl(OG_IMAGE_PATH);

interface SeoProps {
    // Page-specific title; the site name is appended automatically. Omit on the
    // home page to use the site name alone.
    title?: string;
    description?: string;
    // The page's own path (e.g. "/download"). When given, a canonical link and
    // og:url pointing at the production origin are emitted. Error pages omit it,
    // since they are served at whatever URL was missing.
    path?: string;
}

const Seo: React.FC<SeoProps> = ({title, description, path}) => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — a procedurally-generated world to explore`;
    const desc = description ?? DEFAULT_DESCRIPTION;
    const url = path === undefined ? undefined : absoluteUrl(path);
    return (
        <Head>
            <title>{fullTitle}</title>
            <meta name="description" content={desc}/>
            <link rel="icon" href="/roam-icon.png"/>
            {url && <link rel="canonical" href={url}/>}
            <meta property="og:title" content={fullTitle}/>
            <meta property="og:description" content={desc}/>
            <meta property="og:type" content="website"/>
            <meta property="og:site_name" content={SITE_NAME}/>
            {url && <meta property="og:url" content={url}/>}
            <meta property="og:image" content={OG_IMAGE}/>
            <meta property="og:image:type" content="image/png"/>
            <meta property="og:image:width" content={String(OG_IMAGE_WIDTH)}/>
            <meta property="og:image:height" content={String(OG_IMAGE_HEIGHT)}/>
            <meta property="og:image:alt" content={OG_IMAGE_ALT}/>
            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:title" content={fullTitle}/>
            <meta name="twitter:description" content={desc}/>
            <meta name="twitter:image" content={OG_IMAGE}/>
            <meta name="twitter:image:alt" content={OG_IMAGE_ALT}/>
        </Head>
    );
};

export default Seo;
