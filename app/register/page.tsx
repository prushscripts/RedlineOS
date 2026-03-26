'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Activity, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AuthLeftPanel from '@/components/auth/AuthLeftPanel'
import { signUp } from '@/lib/auth'

const REGISTRATION_TOKEN = 'roadmap!'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [token, setToken] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [shake, setShake] = useState(false)

  const handleTokenVerify = (e: React.FormEvent) => {
    e.preventDefault()
    if (token === REGISTRATION_TOKEN) {
      setStep(2)
      setError('')
    } else {
      setError('Access denied. Invalid token.')
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)
    try {
      await signUp(email, password)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      <div 
        className="absolute inset-0" 
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 70% 20%, rgba(239,68,68,0.07) 0%, transparent 70%)'
        }}
      />

      <AuthLeftPanel />
      <div className="hidden lg:block absolute left-[55%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent/20 to-transparent" />

      <div className="flex-1 flex items-center justify-center px-6 lg:px-12" style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(8px)' }}>
        <div className="w-full max-w-[360px]">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <Activity className="text-accent" size={24} strokeWidth={2.5} />
            <h1 className="text-lg font-display font-bold text-white">RedlineOS</h1>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.35 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 mb-4">
                  <span className="text-xs text-accent font-medium">INVITE ONLY</span>
                </div>

                <h1 className="text-3xl font-display font-bold text-white mb-2">Request Access</h1>
                <p className="text-sm text-slate-400 mb-8">Enter your operator token to continue</p>

                <form onSubmit={handleTokenVerify} className="space-y-5">
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">Access Token</label>
                    <motion.input
                      animate={shake ? { x: [0, -8, 8, -8, 8, 0] } : {}}
                      type="text"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      className="w-full h-14 px-4 bg-[#0D0D18] border border-[#1E1E2E] rounded-lg text-lg font-mono tracking-[0.25em] text-center text-white placeholder-slate-600 focus:outline-none focus:border-accent focus:ring-3 focus:ring-accent/10 transition-all"
                      placeholder="— — — — — — — —"
                      style={{ borderColor: error ? '#EF4444' : undefined }}
                      required
                    />
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-accent mt-2"
                      >
                        {error}
                      </motion.p>
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full h-12 bg-accent hover:bg-[#DC2626] text-white font-display font-bold text-sm tracking-wider rounded-lg transition-all"
                    style={{ boxShadow: '0 0 24px rgba(239,68,68,0.35)' }}
                  >
                    Verify Token →
                  </motion.button>

                  <div className="text-center pt-4">
                    <Link href="/login" className="text-xs text-slate-500 hover:text-accent transition-colors">
                      ← Back to login
                    </Link>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 60 }}
                transition={{ duration: 0.35 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/15 border border-success/30 mb-4">
                  <CheckCircle size={14} className="text-success" />
                  <span className="text-xs text-success font-medium">Token verified</span>
                </div>

                <h1 className="text-3xl font-display font-bold text-white mb-2">Create Account</h1>
                <p className="text-sm text-slate-400 mb-8">Set your operator credentials</p>

                <form onSubmit={handleSignUp} className="space-y-5">
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">Email address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-12 px-4 bg-[#0D0D18] border border-[#1E1E2E] rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent focus:ring-3 focus:ring-accent/10 transition-all"
                      placeholder="operator@redlineos.space"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-300 mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-12 px-4 pr-12 bg-[#0D0D18] border border-[#1E1E2E] rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent focus:ring-3 focus:ring-accent/10 transition-all"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-300 mb-2">Confirm Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-12 px-4 bg-[#0D0D18] border border-[#1E1E2E] rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent focus:ring-3 focus:ring-accent/10 transition-all"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-accent"
                    >
                      {error}
                    </motion.p>
                  )}

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full h-12 bg-accent hover:bg-[#DC2626] text-white font-display font-bold text-sm tracking-wider rounded-lg transition-all disabled:opacity-50"
                    style={{ boxShadow: '0 0 24px rgba(239,68,68,0.35)' }}
                  >
                    {isLoading ? 'Creating account...' : 'Launch RedlineOS →'}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
