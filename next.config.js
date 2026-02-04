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

  // Security headers - Note: For static exports, these are recommendations
  // Actual headers need to be configured on the hosting platform
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://us-assets.i.posthog.com https://us.i.posthog.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://us.i.posthog.com https://analyticsdata.googleapis.com",
              "font-src 'self' data:",
              "object-src 'none'",
              "media-src 'self' blob:",
              "frame-src 'self' blob:",
              "child-src 'self' blob:",
              "worker-src 'self' blob:",
              "manifest-src 'self'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
            ].join('; '),
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
