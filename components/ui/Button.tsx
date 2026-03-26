import { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className,
  ...props 
}: ButtonProps) {
  const baseStyles = 'rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-accent hover:bg-accent/90 text-white shadow-lg hover:shadow-xl hover:shadow-accent/20',
    secondary: 'glass hover:bg-white/[0.06] text-text-primary border border-border-subtle',
    ghost: 'hover:bg-white/[0.03] text-text-muted hover:text-text-primary'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  return (
    <button 
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}
