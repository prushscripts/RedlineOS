'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Truck, DollarSign, FileText, Map, Wallet, Lock } from 'lucide-react'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/fleet', icon: Truck, label: 'Fleet' },
  { href: '/financials', icon: DollarSign, label: 'Money' },
  { href: '/documents', icon: FileText, label: 'Docs' },
  { href: '/roadmap', icon: Map, label: 'Roadmap' },
  { href: '/payroll', icon: Wallet, label: 'Payroll' },
  { href: '/vault', icon: Lock, label: 'Vault' },
]

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#111118] border-t border-[#1E1E2E] h-16">
      <div className="flex items-center justify-around h-full px-2">
        {navItems.slice(0, 5).map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full relative"
            >
              <Icon 
                size={20} 
                className={isActive ? 'text-accent' : 'text-text-muted'}
              />
              <span className={`text-[10px] ${isActive ? 'text-accent font-medium' : 'text-text-muted'}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute top-2 right-1/2 translate-x-1/2 w-1 h-1 bg-accent rounded-full" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
