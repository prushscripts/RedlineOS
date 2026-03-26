'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import Button from '@/components/ui/Button'

interface VaultSetupPinProps {
  onComplete: (pin: string) => Promise<void>
}

export default function VaultSetupPin({ onComplete }: VaultSetupPinProps) {
  const [step, setStep] = useState<'enter' | 'confirm'>('enter')
  const [pin, setPin] = useState(['', '', '', '', '', ''])
  const [confirmPin, setConfirmPin] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const confirmRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, value: string, isConfirm: boolean = false) => {
    const currentPin = isConfirm ? confirmPin : pin
    const setCurrentPin = isConfirm ? setConfirmPin : setPin
    const refs = isConfirm ? confirmRefs : inputRefs
    
    const newPin = [...currentPin]
    newPin[index] = value.slice(-1)
    setCurrentPin(newPin)
    setError('')

    if (value && index < 5) {
      refs.current[index + 1]?.focus()
    }

    // Auto-advance to confirm step
    if (!isConfirm && index === 5 && value) {
      setTimeout(() => {
        setStep('confirm')
        confirmRefs.current[0]?.focus()
      }, 300)
    }

    // Auto-submit on confirm step
    if (isConfirm && index === 5 && value) {
      const fullConfirmPin = newPin.join('')
      handleSubmit(fullConfirmPin)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent, isConfirm: boolean = false) => {
    const currentPin = isConfirm ? confirmPin : pin
    const refs = isConfirm ? confirmRefs : inputRefs
    
    if (e.key === 'Backspace' && !currentPin[index] && index > 0) {
      refs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (fullConfirmPin: string) => {
    const fullPin = pin.join('')
    
    if (fullPin !== fullConfirmPin) {
      setError('PINs do not match')
      setConfirmPin(['', '', '', '', '', ''])
      confirmRefs.current[0]?.focus()
      return
    }

    setIsLoading(true)
    try {
      await onComplete(fullPin)
    } catch (err) {
      setError('Failed to set up PIN')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="glass rounded-2xl p-8 border border-border-subtle">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
              <Lock className="text-accent" size={32} />
            </div>
            <h1 className="text-2xl font-display font-bold text-text-primary mb-2">
              Create Your Vault PIN
            </h1>
            <p className="text-sm text-text-muted">
              {step === 'enter' ? 'Choose a 6-digit PIN' : 'Confirm your PIN'}
            </p>
          </div>

          {step === 'enter' ? (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex gap-3 justify-center mb-6">
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el }}                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value, false)}
                    onKeyDown={(e) => handleKeyDown(index, e, false)}
                    className="w-12 h-14 text-center text-2xl font-mono bg-bg-elevated border-2 border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all"
                    autoFocus={index === 0}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex gap-3 justify-center mb-6">
                {confirmPin.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { confirmRefs.current[index] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value, true)}
                    onKeyDown={(e) => handleKeyDown(index, e, true)}
                    disabled={isLoading}
                    className="w-12 h-14 text-center text-2xl font-mono bg-bg-elevated border-2 border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all disabled:opacity-50"
                  />
                ))}
              </div>
            </motion.div>
          )}

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-danger text-center mb-4"
            >
              {error}
            </motion.p>
          )}

          {step === 'confirm' && (
            <button
              onClick={() => {
                setStep('enter')
                setConfirmPin(['', '', '', '', '', ''])
                setError('')
                inputRefs.current[0]?.focus()
              }}
              className="text-sm text-text-muted hover:text-accent transition-colors w-full text-center"
              disabled={isLoading}
            >
              ← Start over
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
