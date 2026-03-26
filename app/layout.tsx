import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'
import MobileNav from '@/components/MobileNav'
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
      <body className="overflow-x-hidden">
        <VaultProvider>
          <div className="flex min-h-screen bg-bg-base">
            <Sidebar />
            <main className="flex-1 lg:ml-60 pb-16 lg:pb-0">
              <TopBar />
              <div className="p-4 sm:p-6 lg:p-8 max-w-full overflow-hidden">
                {children}
              </div>
            </main>
            <MobileNav />
          </div>
        </VaultProvider>
      </body>
    </html>
  )
}
