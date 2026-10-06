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
const OG_IMAGE = absoluteUrl('/screenshots/house.png');

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
            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:title" content={fullTitle}/>
            <meta name="twitter:description" content={desc}/>
            <meta name="twitter:image" content={OG_IMAGE}/>
        </Head>
    );
};

export default Seo;
