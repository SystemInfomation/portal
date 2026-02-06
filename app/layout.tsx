import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { Navigation } from '@/components/Navigation'
import { TabCloakLoader } from '@/components/TabCloakLoader'
import { Protection } from '@/components/Protection'
import { ScreenPrivacyGuard } from '@/components/ScreenPrivacyGuard'
import { AnnouncementBanner } from '@/components/AnnouncementBanner'
import { TosNotification } from '@/components/TosNotification'
import { TabHider } from '@/components/TabHider'
import { TimeBasedAccessControl } from '@/components/TimeBasedAccessControl'
import { GeoLock } from '@/components/GeoLock'

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Forsyth Educational Portal - Interactive Learning Platform',
  description: 'Educational gaming portal for students - Access educational games, interactive learning tools, study resources, and collaborative educational materials',
  keywords: 'educational, learning, students, interactive, educational games, study tools, collaborative learning, educational resources',
  icons: {
    icon: 'https://site.imsglobal.org/sites/default/files/orgs/logos/primary/fcslogo_hexagon.png',
  },
  openGraph: {
    title: 'Forsyth Educational Portal',
    description: 'Educational gaming and learning platform for students',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forsyth Educational Portal',
    description: 'Educational gaming and learning platform for students',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen`}>
        <Script 
          src="https://www.googletagmanager.com/gtag/js?id=G-FGXXN9EK0N" 
          strategy="afterInteractive"
        />
        <Script id="analytics-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FGXXN9EK0N');
          `}
        </Script>
        <div className="fixed inset-0 bg-gradient-cosmic -z-10" />
        <GeoLock />
        <TimeBasedAccessControl />
        <Protection />
        <ScreenPrivacyGuard />
        <TabCloakLoader />
        <TabHider />
        <AnnouncementBanner />
        <TosNotification />
        <Navigation />
        <main className="pt-24 pb-12 px-4">
          {children}
        </main>
        {/* Analytics and SpeedInsights removed */}
      </body>
    </html>
  )
}
