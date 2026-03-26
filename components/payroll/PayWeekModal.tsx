'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, AlertTriangle } from 'lucide-react'
import Button from '@/components/ui/Button'
import { addDriverPayBatch } from '@/lib/payroll'
import { getLatestCheck } from '@/lib/checks'
import { formatCurrency } from '@/lib/utils'

interface PayWeekModalProps {
  drivers: any[]
  onClose: () => void
  onSuccess: () => void
}

export default function PayWeekModal({ drivers, onClose, onSuccess }: PayWeekModalProps) {
  const [weekStart, setWeekStart] = useState(() => {
    const now = new Date()
    const dayOfWeek = now.getDay()
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
    const monday = new Date(now.setDate(diff))
    return monday.toISOString().split('T')[0]
  })
  
  const [payAmounts, setPayAmounts] = useState<Record<string, string>>({})
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [weekCheck, setWeekCheck] = useState<number | null>(null)

  const getWeekLabel = (dateStr: string) => {
    const monday = new Date(dateStr)
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${monthNames[monday.getMonth()]} ${monday.getDate()} – ${monthNames[sunday.getMonth()]} ${sunday.getDate()}`
  }

  const totalPay = Object.values(payAmounts).reduce((sum, val) => sum + (parseFloat(val) || 0), 0)
  const showWarning = weekCheck !== null && totalPay > weekCheck

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const payRecords = drivers.map(driver => ({
        week_start: weekStart,
        week_label: getWeekLabel(weekStart),
        driver_id: driver.id,
        amount: parseFloat(payAmounts[driver.id] || '0'),
        notes: notes[driver.id] || undefined
      })).filter(record => record.amount > 0)

      if (payRecords.length > 0) {
        await addDriverPayBatch(payRecords)
      }

      onSuccess()
    } catch (error) {
      console.error('Failed to log pay:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load week's check amount for validation
  useState(() => {
    getLatestCheck().then(check => {
      if (check) setWeekCheck(check.total_amount)
    })
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl"
      >
        <div className="glass rounded-2xl p-6 border border-border-subtle">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold text-text-primary">
              Log Pay Week
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-bg-elevated rounded-lg transition-colors"
            >
              <X className="text-text-muted" size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-text-muted mb-2">Week Starting</label>
              <input
                type="date"
                value={weekStart}
                onChange={(e) => setWeekStart(e.target.value)}
                className="w-full px-4 py-2 bg-bg-elevated border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors"
                required
              />
              <p className="text-xs text-text-muted mt-1">
                {getWeekLabel(weekStart)}
              </p>
            </div>

            <div className="space-y-4">
              {drivers.map(driver => (
                <div key={driver.id} className="p-4 bg-bg-elevated rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-text-primary">{driver.name}</p>
                      <p className="text-xs text-text-muted">Truck: {driver.truck_id || 'Unassigned'}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-text-muted mb-1">Pay Amount</label>
                      <input
                        type="number"
                        step="0.01"
                        value={payAmounts[driver.id] || ''}
                        onChange={(e) => setPayAmounts({ ...payAmounts, [driver.id]: e.target.value })}
                        placeholder="$0.00"
                        className="w-full px-3 py-2 bg-bg-primary border border-border-subtle rounded-lg text-text-primary font-mono focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-text-muted mb-1">Notes (optional)</label>
                      <input
                        type="text"
                        value={notes[driver.id] || ''}
                        onChange={(e) => setNotes({ ...notes, [driver.id]: e.target.value })}
                        placeholder="e.g. bonus included"
                        className="w-full px-3 py-2 bg-bg-primary border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border-subtle">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-text-muted">Total Payout:</span>
                <span className="text-xl font-mono font-bold text-text-primary">
                  {formatCurrency(totalPay)}
                </span>
              </div>

              {showWarning && (
                <div className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg mb-4">
                  <AlertTriangle className="text-warning flex-shrink-0 mt-0.5" size={16} />
                  <p className="text-sm text-warning">
                    Driver pay ({formatCurrency(totalPay)}) exceeds this week&apos;s check ({formatCurrency(weekCheck!)})
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isLoading || totalPay === 0}
                  className="flex-1"
                >
                  {isLoading ? 'Saving...' : 'Save Pay Week'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
