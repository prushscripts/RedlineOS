'use client'

import { Bell } from 'lucide-react'
import Badge from './ui/Badge'

export default function TopBar() {
  return (
    <header className="h-16 border-b border-border-subtle bg-bg-surface/50 backdrop-blur-md flex items-center justify-between px-8">
      <div>
        <h2 className="text-lg font-display font-semibold text-text-primary">
          Operator Dashboard
        </h2>
        <p className="text-sm text-text-muted">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-white/[0.03] rounded-lg transition-colors">
          <Bell size={20} className="text-text-muted" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
        </button>
      </div>
    </header>
  )
}
