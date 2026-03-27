'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity } from 'lucide-react'

interface LoadingScreenProps {
  onComplete: () => void
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [phase, setPhase] = useState(1)
  const [typedText, setTypedText] = useState('')
  const fullText = 'SYSTEM ONLINE'

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase(2), 600)
    const timer2 = setTimeout(() => setPhase(3), 2200)
    const timer3 = setTimeout(() => {
      onComplete()
    }, 2800)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [onComplete])

  useEffect(() => {
    if (phase === 2) {
      let i = 0
      const target = "SYSTEM ONLINE"
      const interval = setInterval(() => {
        if (i < target.length) {
          setTypedText(target.slice(0, i + 1))
          i++
        } else {
          clearInterval(interval)
        }
      }, 80)
      return () => clearInterval(interval)
    }
  }, [phase])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.9 }}
        className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
      >
        {/* Grid background - Phase 2 */}
        {phase >= 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, #1a0000 1px, transparent 1px),
                linear-gradient(to bottom, #1a0000 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />
        )}

        {/* Logo container */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex items-center gap-3 mb-8"
          >
            <Activity size={48} className="text-accent" strokeWidth={2.5} />
            <h1 className="text-4xl font-display font-bold text-white">
              RedlineOS
            </h1>
          </motion.div>

          {/* Scanner line - Phase 2 */}
          {phase >= 2 && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="absolute top-1/2 left-0 right-0 h-[2px] bg-accent origin-center"
              style={{
                boxShadow: '0 0 20px rgba(239, 68, 68, 0.8)'
              }}
            />
          )}

          {/* Typing text - Phase 2 */}
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="mt-16 font-mono text-accent text-sm tracking-widest"
            >
              {typedText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="inline-block w-2 h-4 bg-accent ml-1"
              />
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
