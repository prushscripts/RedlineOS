'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { signIn } from '@/lib/auth'
import RedlineLaunchAnimation from './RedlineLaunchAnimation'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)
  const [isShaking, setIsShaking] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await signIn(email, password)
      setShowAnimation(true)
    } catch (err) {
      setError('Invalid email or password')
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
      setIsLoading(false)
    }
  }

  const handleAnimationComplete = () => {
    router.push('/dashboard')
  }

  if (showAnimation) {
    return <RedlineLaunchAnimation onComplete={handleAnimationComplete} />
  }

  return (
    <motion.div
      animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md"
    >
      <div className="glass rounded-2xl p-8 border border-border-subtle">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <h1 className="text-3xl font-display font-bold text-text-primary">
              RedlineOS
            </h1>
          </div>
          <p className="text-text-muted text-xs uppercase tracking-wider">
            Operator Access
          </p>
          <div className="w-10 h-0.5 bg-accent mx-auto mt-4" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-text-muted mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-bg-elevated border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-text-muted mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-bg-elevated border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all"
              required
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

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link 
            href="/register" 
            className="text-sm text-text-muted hover:text-accent transition-colors"
          >
            Need access? Register →
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
