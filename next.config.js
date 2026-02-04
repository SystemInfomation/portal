/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for GitHub Pages
  output: 'export',
  
  // GitHub Pages serves from /<repo-name>/ path
  // Set to empty string if using custom domain or root deployment
  basePath: process.env.GITHUB_PAGES === 'true' ? '/portal' : '',
  assetPrefix: process.env.GITHUB_PAGES === 'true' ? '/portal' : '',
  
  images: {
    // Required for static export
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Trailing slash helps with static file serving
  trailingSlash: true,
}

module.exports = nextConfig
