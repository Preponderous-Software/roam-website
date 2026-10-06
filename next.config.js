/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // GET /version.json answers with the version this build was made from
  // (pages/api/version.ts), so a deploy can be verified by the version it
  // reports. GET /sitemap.xml is built by pages/api/sitemap.ts from the page
  // list in utils/site.ts; public/robots.txt points crawlers at it.
  async rewrites() {
    return [
      { source: '/version.json', destination: '/api/version' },
      { source: '/sitemap.xml', destination: '/api/sitemap' },
    ]
  },
}

module.exports = nextConfig
