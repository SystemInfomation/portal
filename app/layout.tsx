import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/Navigation'
import { TabCloakLoader } from '@/components/TabCloakLoader'
import { Protection } from '@/components/Protection'
import { AnnouncementBanner } from '@/components/AnnouncementBanner'
import { TabHider } from '@/components/TabHider'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Forsyth Educational Portal',
  description: 'Interactive learning platform for students - Access educational tools, study resources, and collaborative learning materials',
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
      <body className={`${inter.className} min-h-screen`}>
        <div className="fixed inset-0 bg-gradient-cosmic -z-10" />
        <Protection />
        <TabCloakLoader />
        <TabHider />
        <AnnouncementBanner />
        <Navigation />
        <main className="pt-24 pb-12 px-4">
          {children}
        </main>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
