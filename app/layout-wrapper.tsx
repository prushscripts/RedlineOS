'use client'

import { usePathname } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'
import MobileNav from '@/components/MobileNav'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname === '/login' || pathname === '/register'

  if (isAuthPage) {
    return <>{children}</>
  }

  return (
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
  )
}
