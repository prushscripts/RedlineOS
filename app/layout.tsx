import type { Metadata } from 'next'
import './globals.css'
import LayoutWrapper from './layout-wrapper'
import { VaultProvider } from '@/contexts/VaultContext'

export const metadata: Metadata = {
  title: 'RedlineOS - Trucking Operator Dashboard',
  description: 'Premium operator dashboard for logistics fleet management',
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
