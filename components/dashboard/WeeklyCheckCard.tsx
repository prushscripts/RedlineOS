'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import { addWeeklyCheck } from '@/lib/checks'

interface WeeklyCheckCardProps {
  onCheckLogged: () => void
}

export default function WeeklyCheckCard({ onCheckLogged }: WeeklyCheckCardProps) {
  const [totalAmount, setTotalAmount] = useState('')
  const [truck1Amount, setTruck1Amount] = useState('')
  const [truck2Amount, setTruck2Amount] = useState('')
  const [showBreakdown, setShowBreakdown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Get current week label
  const getCurrentWeekLabel = () => {
    const now = new Date()
    const dayOfWeek = now.getDay()
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
    const monday = new Date(now.setDate(diff))
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${monthNames[monday.getMonth()]} ${monday.getDate()} – ${monthNames[sunday.getMonth()]} ${sunday.getDate()}`
  }

  const getCurrentWeekStart = () => {
    const now = new Date()
    const dayOfWeek = now.getDay()
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
    const monday = new Date(now.setDate(diff))
    return monday.toISOString().split('T')[0]
  }

  const total = parseFloat(totalAmount) || 0
  const truck1 = parseFloat(truck1Amount) || 0
  const truck2 = parseFloat(truck2Amount) || 0
  const breakdownSum = truck1 + truck2
  const isBreakdownValid = !showBreakdown || Math.abs(breakdownSum - total) < 0.01

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (total <= 0) return
    if (showBreakdown && !isBreakdownValid) return

    setIsLoading(true)
    try {
      await addWeeklyCheck({
        week_start: getCurrentWeekStart(),
        week_label: getCurrentWeekLabel(),
        total_amount: total,
        truck_z455_amount: truck1,
        truck_z420_amount: truck2
      })

      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        setTotalAmount('')
        setTruck1Amount('')
        setTruck2Amount('')
        setShowBreakdown(false)
        onCheckLogged()
      }, 2000)
    } catch (error) {
      console.error('Failed to log check:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-l-4 border-l-accent">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/10 rounded-lg">
            <Calendar className="text-accent" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-display font-semibold text-text-primary">
              This Week&apos;s Check
            </h3>
            <p className="text-xs text-text-muted">
              Week of {getCurrentWeekLabel()}
            </p>
          </div>
        </div>
      </div>

      <p className="text-sm text-text-muted mb-6">
        Log your payment to update all projections
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="number"
            step="0.01"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            placeholder="$0.00"
            className="w-full px-4 py-4 bg-bg-elevated border border-border-subtle rounded-lg text-text-primary font-display text-4xl text-center focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all"
            required
          />
        </div>

        <button
          type="button"
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors"
        >
          {showBreakdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {showBreakdown ? 'Hide' : '+ Add'} breakdown
        </button>

        {showBreakdown && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 pt-2"
          >
            <div>
              <label className="text-xs text-text-muted mb-1 block">Truck z455</label>
              <input
                type="number"
                step="0.01"
                value={truck1Amount}
                onChange={(e) => setTruck1Amount(e.target.value)}
                placeholder="$0.00"
                className="w-full px-3 py-2 bg-bg-elevated border border-border-subtle rounded-lg text-text-primary font-mono focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-text-muted mb-1 block">Truck z420</label>
              <input
                type="number"
                step="0.01"
                value={truck2Amount}
                onChange={(e) => setTruck2Amount(e.target.value)}
                placeholder="$0.00"
                className="w-full px-3 py-2 bg-bg-elevated border border-border-subtle rounded-lg text-text-primary font-mono focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            {showBreakdown && (
              <div className={`text-xs ${isBreakdownValid ? 'text-success' : 'text-danger'}`}>
                {isBreakdownValid ? '✓ Breakdown matches total' : `⚠ Breakdown sum: ${formatCurrency(breakdownSum)}`}
              </div>
            )}
          </motion.div>
        )}

        {showSuccess ? (
          <div className="py-3 px-4 bg-success/10 border border-success/20 rounded-lg text-success text-center">
            ✓ Week logged — projections updated
          </div>
        ) : (
          <Button
            type="submit"
            variant="primary"
            className="w-full animate-pulse"
            disabled={isLoading || !isBreakdownValid}
          >
            {isLoading ? 'Logging...' : 'Log Check'}
          </Button>
        )}
      </form>
    </Card>
  )
}
