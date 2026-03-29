'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Truck, DollarSign, Sparkles, Menu, FileText, Wallet, Map, Lock, X } from 'lucide-react'

const mainNavItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/fleet', icon: Truck, label: 'Fleet' },
  { href: '/financials', icon: DollarSign, label: 'Money' },
  { href: '/calculator', icon: Sparkles, label: 'Calculator' },
]

const moreItems = [
  { href: '/documents', icon: FileText, label: 'Documents' },
  { href: '/payroll', icon: Wallet, label: 'Payroll' },
  { href: '/roadmap', icon: Map, label: 'Roadmap' },
  { href: '/vault', icon: Lock, label: 'Private Vault' },
]

export default function MobileNav() {
  const pathname = usePathname()
  const [showMore, setShowMore] = useState(false)

  const isMoreActive = moreItems.some(item => pathname === item.href)

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#111118] border-t border-[#1E1E2E] h-16">
        <div className="flex items-center justify-around h-full px-2">
          {mainNavItems.map((item) => {
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
          
          <button
            onClick={() => setShowMore(true)}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full relative"
          >
            <Menu 
              size={20} 
              className={isMoreActive ? 'text-accent' : 'text-text-muted'}
            />
            <span className={`text-[10px] ${isMoreActive ? 'text-accent font-medium' : 'text-text-muted'}`}>
              More
            </span>
            {isMoreActive && (
              <div className="absolute top-2 right-1/2 translate-x-1/2 w-1 h-1 bg-accent rounded-full" />
            )}
          </button>
        </div>
      </nav>

      {/* More Menu Slide-up Sheet */}
      <AnimatePresence>
        {showMore && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMore(false)}
              className="lg:hidden fixed inset-0 bg-black/60 z-[60]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 z-[70] bg-[#111118] rounded-t-2xl border-t border-[#1E1E2E] pb-safe"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary">More Pages</h3>
                  <button
                    onClick={() => setShowMore(false)}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <X size={20} className="text-text-muted" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  {moreItems.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon
                    
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setShowMore(false)}
                        className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                          isActive 
                            ? 'bg-accent/10 text-accent' 
                            : 'hover:bg-white/5 text-text-primary'
                        }`}
                      >
                        <Icon size={24} />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
