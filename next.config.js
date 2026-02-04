/** @type {import('next').NextConfig} */

const isGitHubPages = process.env.GITHUB_PAGES === 'true'
const basePath = isGitHubPages ? '/portal' : ''

const nextConfig = {
  // Enable static export for GitHub Pages
  output: 'export',
  
  // GitHub Pages serves from /<repo-name>/ path
  // Set to empty string if using custom domain or root deployment
  basePath: basePath,
  assetPrefix: basePath,
  
  // Make basePath available to client-side code
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  
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
