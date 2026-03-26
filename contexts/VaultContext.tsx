'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface VaultContextType {
  isUnlocked: boolean
  unlock: () => void
  lock: () => void
  lastActivity: number
  updateActivity: () => void
}

const VaultContext = createContext<VaultContextType | undefined>(undefined)

const INACTIVITY_TIMEOUT = 10 * 60 * 1000 // 10 minutes in milliseconds

export function VaultProvider({ children }: { children: ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [lastActivity, setLastActivity] = useState(Date.now())

  const unlock = () => {
    setIsUnlocked(true)
    setLastActivity(Date.now())
  }

  const lock = () => {
    setIsUnlocked(false)
  }

  const updateActivity = () => {
    setLastActivity(Date.now())
  }

  // Auto-lock after inactivity
  useEffect(() => {
    if (!isUnlocked) return

    const checkInactivity = setInterval(() => {
      const now = Date.now()
      if (now - lastActivity > INACTIVITY_TIMEOUT) {
        lock()
      }
    }, 1000) // Check every second

    return () => clearInterval(checkInactivity)
  }, [isUnlocked, lastActivity])

  return (
    <VaultContext.Provider value={{ isUnlocked, unlock, lock, lastActivity, updateActivity }}>
      {children}
    </VaultContext.Provider>
  )
}

export function useVault() {
  const context = useContext(VaultContext)
  if (context === undefined) {
    throw new Error('useVault must be used within a VaultProvider')
  }
  return context
}
