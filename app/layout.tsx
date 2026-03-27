import type { Metadata } from 'next'
import './globals.css'
import LayoutWrapper from './layout-wrapper'
import { VaultProvider } from '@/contexts/VaultContext'

export const metadata: Metadata = {
  title: 'RedlineOS — Road to $1,000,000',
  description: 'Operator command center for fleet logistics. Track profit, manage drivers, and map your road to $1M.',
  metadataBase: new URL('https://redlineos.space'),
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: '/favicon-32.png',
  },
  openGraph: {
    title: 'RedlineOS — Road to $1,000,000',
    description: 'Operator command center for fleet logistics. Track profit, manage drivers, and map your road to $1M.',
    url: 'https://redlineos.space',
    siteName: 'RedlineOS',
    images: [
      {
        url: 'https://redlineos.space/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RedlineOS — Road to $1,000,000',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RedlineOS — Road to $1,000,000',
    description: 'Operator command center for fleet logistics. Track profit, manage drivers, and map your road to $1M.',
    images: ['https://redlineos.space/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className="overflow-x-hidden bg-[#080810]">
        <VaultProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </VaultProvider>
      </body>
    </html>
  )
}
