import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
}

export default function Card({ children, className, hover = false, glow = false }: CardProps) {
  return (
    <div 
      className={cn(
        'glass rounded-xl p-6',
        hover && 'hover-lift cursor-pointer',
        glow && 'accent-glow',
        className
      )}
    >
      {children}
    </div>
  )
}
