'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, X } from 'lucide-react'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  isVisible: boolean
  onClose: () => void
}

export default function Toast({ message, type, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div className={`glass rounded-lg p-4 pr-12 min-w-[300px] border ${
            type === 'success' 
              ? 'border-success/20 bg-success/10' 
              : 'border-danger/20 bg-danger/10'
          }`}>
            <div className="flex items-center gap-3">
              {type === 'success' ? (
                <CheckCircle2 className="text-success flex-shrink-0" size={20} />
              ) : (
                <XCircle className="text-danger flex-shrink-0" size={20} />
              )}
              <p className={`text-sm font-medium ${
                type === 'success' ? 'text-success' : 'text-danger'
              }`}>
                {message}
              </p>
            </div>
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-text-muted hover:text-text-primary transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
