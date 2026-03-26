'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import Button from '@/components/ui/Button'

interface VaultPinEntryProps {
  onSuccess: () => void
  onVerify: (pin: string) => Promise<boolean>
}

export default function VaultPinEntry({ onSuccess, onVerify }: VaultPinEntryProps) {
  const [pin, setPin] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockTimer, setLockTimer] = useState(0)
  const [isShaking, setIsShaking] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (lockTimer > 0) {
      const timer = setTimeout(() => setLockTimer(lockTimer - 1), 1000)
      return () => clearTimeout(timer)
    } else if (lockTimer === 0 && isLocked) {
      setIsLocked(false)
      setAttempts(0)
    }
  }, [lockTimer, isLocked])

  const handleChange = (index: number, value: string) => {
    if (isLocked) return
    
    const newPin = [...pin]
    newPin[index] = value.slice(-1) // Only take last character
    setPin(newPin)
    setError('')

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all 6 digits entered
    if (index === 5 && value) {
      const fullPin = newPin.join('')
      handleSubmit(fullPin)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (fullPin: string) => {
    if (fullPin.length !== 6) return

    const isValid = await onVerify(fullPin)
    
    if (isValid) {
      onSuccess()
    } else {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      setError('Incorrect PIN')
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
      setPin(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()

      if (newAttempts >= 3) {
        setIsLocked(true)
        setLockTimer(30)
        setError('Too many attempts. Locked for 30 seconds.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <motion.div
        animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="glass rounded-2xl p-8 border border-border-subtle">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
              <Lock className="text-accent" size={32} />
            </div>
            <h1 className="text-2xl font-display font-bold text-text-primary mb-2">
              Private Vault
            </h1>
            <p className="text-sm text-text-muted">
              Enter your 6-digit PIN to unlock
            </p>
          </div>

          <div className="flex gap-3 justify-center mb-6">
            {pin.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isLocked}
                className="w-12 h-14 text-center text-2xl font-mono bg-bg-elevated border-2 border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all disabled:opacity-50"
                autoFocus={index === 0}
              />
            ))}
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-sm text-center mb-4 ${isLocked ? 'text-warning' : 'text-danger'}`}
            >
              {error}
            </motion.p>
          )}

          {isLocked && (
            <div className="text-center">
              <p className="text-3xl font-mono font-bold text-accent mb-2">
                {lockTimer}s
              </p>
              <p className="text-xs text-text-muted">Vault locked</p>
            </div>
          )}

          {!isLocked && attempts > 0 && attempts < 3 && (
            <p className="text-xs text-center text-text-muted">
              {3 - attempts} attempt{3 - attempts !== 1 ? 's' : ''} remaining
            </p>
          )}
        </div>
      </motion.div>
    </div>
  )
}
