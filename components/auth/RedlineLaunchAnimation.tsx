'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Rocket } from 'lucide-react'

interface RedlineLaunchAnimationProps {
  onComplete: () => void
}

export default function RedlineLaunchAnimation({ onComplete }: RedlineLaunchAnimationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 2500)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
      {/* Phase 1: Logo and tachometer (0-0.8s) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="absolute"
      >
        <div className="text-center">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="text-accent mb-4"
          >
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </motion.div>
          <h1 className="text-4xl font-display font-bold text-white">RedlineOS</h1>
        </div>
      </motion.div>

      {/* Phase 2: Horizontal line with rocket (0.8-1.8s) */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.8, duration: 1, ease: 'easeInOut' }}
        className="absolute w-full h-1 bg-accent origin-left"
        style={{ top: '50%' }}
      />

      <motion.div
        initial={{ left: '-50px', opacity: 0 }}
        animate={{ left: 'calc(100% + 50px)', opacity: [0, 1, 1, 0] }}
        transition={{ delay: 0.8, duration: 1, ease: 'easeInOut' }}
        className="absolute"
        style={{ top: 'calc(50% - 12px)' }}
      >
        <Rocket className="text-accent" size={24} />
      </motion.div>

      {/* Phase 3: Flash wipe (1.8-2.5s) */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: [0, 1, 0] }}
        transition={{ delay: 1.8, duration: 0.7, ease: 'easeInOut' }}
        className="absolute inset-0 bg-accent origin-left"
      />
    </div>
  )
}
