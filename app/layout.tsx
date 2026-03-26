import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'
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
    <html lang="en">
      <body>
        <VaultProvider>
          <div className="flex min-h-screen bg-bg-base">
            <Sidebar />
            <main className="flex-1 ml-60">
              <TopBar />
              <div className="p-8">
                {children}
              </div>
            </main>
          </div>
        </VaultProvider>
      </body>
    </html>
  )
}
