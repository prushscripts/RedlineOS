'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  progress: number
  className?: string
  showLabel?: boolean
  variant?: 'default' | 'success' | 'warning'
}

export default function ProgressBar({ 
  progress, 
  className, 
  showLabel = false,
  variant = 'default' 
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100)
  
  const variants = {
    default: 'bg-accent',
    success: 'bg-success',
    warning: 'bg-warning'
  }
  
  return (
    <div className={cn('w-full', className)}>
      <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
        <motion.div
          className={cn('h-full rounded-full', variants[variant])}
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ 
            type: 'spring',
            stiffness: 60,
            damping: 20,
            duration: 1.2
          }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-xs text-text-muted text-right">
          {clampedProgress.toFixed(1)}%
        </div>
      )}
    </div>
  )
}
