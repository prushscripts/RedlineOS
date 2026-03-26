import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: ReactNode
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default'
  className?: string
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    danger: 'bg-danger/10 text-danger border-danger/20',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    default: 'bg-white/5 text-text-muted border-border-subtle'
  }
  
  return (
    <span 
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
