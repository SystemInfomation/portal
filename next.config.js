/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Serve static files from games and utilities directories
  async rewrites() {
    return [
      {
        source: '/games/:path*',
        destination: '/games/:path*',
      },
      {
        source: '/utilities/:path*',
        destination: '/utilities/:path*',
      },
      {
        source: '/assets/:path*',
        destination: '/assets/:path*',
      },
    ]
  },
}

module.exports = nextConfig
