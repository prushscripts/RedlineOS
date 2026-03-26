'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import { signUp } from '@/lib/auth'
import TokenGate from './TokenGate'
import RedlineLaunchAnimation from './RedlineLaunchAnimation'

export default function RegisterForm() {
  const router = useRouter()
  const [step, setStep] = useState<'token' | 'register'>('token')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)

  const handleTokenSuccess = () => {
    setStep('register')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    try {
      await signUp(email, password)
      setShowAnimation(true)
    } catch (err: any) {
      setError(err.message || 'Failed to create account')
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
    <div className="w-full max-w-md">
      <AnimatePresence mode="wait">
        {step === 'token' ? (
          <motion.div
            key="token"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TokenGate onSuccess={handleTokenSuccess} />
          </motion.div>
        ) : (
          <motion.div
            key="register"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="glass rounded-2xl p-8 border border-border-subtle">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/20 rounded-full mb-4">
                  <CheckCircle2 className="text-success" size={16} />
                  <span className="text-success text-sm font-medium">Token verified</span>
                </div>
                <h1 className="text-3xl font-display font-bold text-text-primary mb-2">
                  Create Account
                </h1>
                <p className="text-text-muted text-sm">
                  You&apos;re in. Set up your operator credentials.
                </p>
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

                <div>
                  <label className="block text-sm text-text-muted mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                  {isLoading ? 'Creating account...' : 'Launch RedlineOS →'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setStep('token')}
                  className="text-sm text-text-muted hover:text-accent transition-colors"
                >
                  ← Wrong token?
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
