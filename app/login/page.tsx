'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Activity } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AuthLeftPanel from '@/components/auth/AuthLeftPanel'
import { signIn } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const { data, error } = await signIn(email, password)
      if (error) {
        setError(error.message)
        return
      }
      if (data?.session) {
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background gradient */}
      <div 
        className="absolute inset-0" 
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 70% 20%, rgba(239,68,68,0.07) 0%, transparent 70%)'
        }}
      />

      {/* Left Panel */}
      <AuthLeftPanel />

      {/* Vertical divider */}
      <div className="hidden lg:block absolute left-[55%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent/20 to-transparent" />

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-6 lg:px-12" style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(8px)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[360px]"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <Activity className="text-accent" size={24} strokeWidth={2.5} />
            <h1 className="text-lg font-display font-bold text-white">RedlineOS</h1>
          </div>

          <h1 className="text-3xl font-display font-bold text-white mb-2">
            Welcome back
          </h1>
          <p className="text-sm text-slate-400 mb-8">
            Sign in to your operator dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
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

            {/* Password */}
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

            <div className="text-right">
              <Link href="#" className="text-xs text-slate-500 hover:text-accent transition-colors">
                Forgot password?
              </Link>
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
              style={{
                boxShadow: '0 0 24px rgba(239,68,68,0.35)'
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </motion.button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#1E1E2E]"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-[#0D0D14] text-slate-500">or</span>
              </div>
            </div>

            <div className="text-center">
              <Link href="/register" className="text-xs text-slate-500 hover:text-accent transition-colors">
                Need access? Request an invite →
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
