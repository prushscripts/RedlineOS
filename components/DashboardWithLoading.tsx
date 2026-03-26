'use client'

import { useState, useEffect } from 'react'
import LoadingScreen from './ui/LoadingScreen'

export default function DashboardWithLoading({ children }: { children: React.ReactNode }) {
  const [showLoading, setShowLoading] = useState(false)

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem('hasLoaded')
    if (!hasLoaded) {
      setShowLoading(true)
    }
  }, [])

  const handleLoadingComplete = () => {
    sessionStorage.setItem('hasLoaded', 'true')
    setShowLoading(false)
  }

  if (showLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />
  }

  return <>{children}</>
}
