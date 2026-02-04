import type { Metadata } from 'next'
import './globals.css'
import { Navigation } from '@/components/Navigation'
import { TabCloakLoader } from '@/components/TabCloakLoader'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  title: 'Forsyth Games Portal',
  description: 'A Fast, Curated Portal for Playing HTML Games — Built to Be Simple, Safe, & Enjoyable',
  icons: {
    icon: 'https://site.imsglobal.org/sites/default/files/orgs/logos/primary/fcslogo_hexagon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans min-h-screen" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
        <div className="fixed inset-0 bg-gradient-cosmic -z-10" />
        <TabCloakLoader />
        <Navigation />
        <main className="pt-24 pb-12 px-4">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  )
}
