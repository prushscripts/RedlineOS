'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'

interface TokenGateProps {
  onSuccess: () => void
}

const VALID_TOKEN = 'roadmap!'

export default function TokenGate({ onSuccess }: TokenGateProps) {
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [isShaking, setIsShaking] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (token.trim() === VALID_TOKEN) {
      onSuccess()
    } else {
      setError('Invalid token. Access denied.')
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
    }
  }

  return (
    <motion.div
      animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md"
    >
      <div className="glass rounded-2xl p-8 border border-border-subtle">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-text-primary mb-2">
            Request Access
          </h1>
          <p className="text-text-muted text-sm">
            Enter your operator token to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={token}
              onChange={(e) => {
                setToken(e.target.value)
                setError('')
              }}
              placeholder="XXXXXXXX"
              className="w-full px-4 py-3 bg-bg-elevated border border-border-subtle rounded-lg text-text-primary font-mono text-center text-lg tracking-widest uppercase focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all"
              autoFocus
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-danger text-sm text-center"
            >
              {error}
            </motion.p>
          )}

          <Button type="submit" variant="primary" className="w-full">
            Verify Token →
          </Button>
        </form>
      </div>
    </motion.div>
  )
}
