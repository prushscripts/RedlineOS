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
    <div className="flex min-h-screen bg-bg-base w-full max-w-full overflow-x-hidden">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-x-hidden lg:ml-60 pb-20 lg:pb-0">
        <TopBar />
        <div className="p-4 sm:p-6 lg:p-8 w-full max-w-full overflow-x-hidden">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  )
}
