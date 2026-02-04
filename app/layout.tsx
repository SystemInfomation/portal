import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/Navigation'
import { TabCloakLoader } from '@/components/TabCloakLoader'
import { Protection } from '@/components/Protection'
import { AnnouncementBanner } from '@/components/AnnouncementBanner'
import { TabHider } from '@/components/TabHider'
import { TimeBasedAccessControl } from '@/components/TimeBasedAccessControl'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import CustomAnalytics from '@/components/analytics'

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
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
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
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-FGXXN9EK0N"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-FGXXN9EK0N');
            `,
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen`}>
        <div className="fixed inset-0 bg-gradient-cosmic -z-10" />
        <TimeBasedAccessControl />
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
        <CustomAnalytics />
      </body>
    </html>
  )
}
