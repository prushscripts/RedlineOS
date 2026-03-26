'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Truck, TrendingUp, FileText, Map, Activity, Wallet, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import Badge from './ui/Badge'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/fleet', label: 'Fleet', icon: Truck },
  { href: '/financials', label: 'Financials', icon: TrendingUp },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/payroll', label: 'Payroll', icon: Wallet },
  { href: '/roadmap', label: 'Roadmap', icon: Map },
]

const vaultItem = { href: '/vault', label: 'Private Vault', icon: Lock }

export default function Sidebar() {
  const pathname = usePathname()
  
  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-bg-surface border-r border-border-subtle flex flex-col">
      <div className="p-6 border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <Activity className="text-accent" size={28} strokeWidth={2.5} />
          <h1 className="text-2xl font-display font-bold text-text-primary">
            RedlineOS
          </h1>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative group',
                isActive 
                  ? 'bg-white/[0.06] text-text-primary' 
                  : 'text-text-muted hover:text-text-primary hover:bg-white/[0.03]'
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent rounded-r" />
              )}
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
        
        <div className="my-4 border-t border-border-subtle" />
        
        <Link
          href={vaultItem.href}
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative group',
            pathname === vaultItem.href
              ? 'bg-white/[0.06] text-text-primary' 
              : 'text-text-muted hover:text-text-primary hover:bg-white/[0.03]'
          )}
        >
          {pathname === vaultItem.href && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent rounded-r" />
          )}
          <vaultItem.icon size={20} />
          <span className="font-medium">{vaultItem.label}</span>
        </Link>
      </nav>
      
      <div className="p-4 border-t border-border-subtle">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-sm text-text-muted">2 trucks active</span>
        </div>
      </div>
    </aside>
  )
}
