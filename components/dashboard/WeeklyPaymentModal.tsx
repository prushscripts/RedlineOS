'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar } from 'lucide-react'
import Card from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'

interface WeeklyPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (payment: WeeklyPayment) => void
  editData?: WeeklyPayment | null
}

export interface WeeklyPayment {
  id?: string
  weekStart: string
  weekLabel: string
  client: string
  totalAmount: number
  driverPay: number
  insurance: number
  fuelExpenses: number
  notes: string
}

function getWeekDates() {
  const today = new Date()
  const dayOfWeek = today.getDay()
  
  // Calculate Monday (start of week)
  const monday = new Date(today)
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  monday.setDate(today.getDate() - daysFromMonday)
  
  // Calculate Friday (end of week)
  const friday = new Date(monday)
  friday.setDate(monday.getDate() + 4)
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  
  const weekLabel = `Week of ${formatDate(monday)} – ${formatDate(friday)}, ${today.getFullYear()}`
  const weekStart = monday.toISOString().split('T')[0]
  
  return { weekLabel, weekStart }
}

export default function WeeklyPaymentModal({ isOpen, onClose, onSave, editData }: WeeklyPaymentModalProps) {
  const { weekLabel: autoWeekLabel, weekStart: autoWeekStart } = getWeekDates()
  
  const [weekLabel, setWeekLabel] = useState(autoWeekLabel)
  const [weekStart, setWeekStart] = useState(autoWeekStart)
  const [client, setClient] = useState('Healey')
  const [totalAmount, setTotalAmount] = useState(0)
  const [driverPay, setDriverPay] = useState(0)
  const [insurance, setInsurance] = useState(0)
  const [fuelExpenses, setFuelExpenses] = useState(0)
  const [notes, setNotes] = useState('')
  
  useEffect(() => {
    if (editData) {
      setWeekLabel(editData.weekLabel)
      setWeekStart(editData.weekStart)
      setClient(editData.client)
      setTotalAmount(editData.totalAmount)
      setDriverPay(editData.driverPay)
      setInsurance(editData.insurance)
      setFuelExpenses(editData.fuelExpenses)
      setNotes(editData.notes)
    } else {
      const { weekLabel: newLabel, weekStart: newStart } = getWeekDates()
      setWeekLabel(newLabel)
      setWeekStart(newStart)
      setClient('Healey')
      setTotalAmount(0)
      setDriverPay(0)
      setInsurance(0)
      setFuelExpenses(0)
      setNotes('')
    }
  }, [editData, isOpen])
  
  const netProfit = totalAmount - driverPay - insurance - fuelExpenses
  
  const handleSave = () => {
    if (totalAmount <= 0) {
      alert('Please enter a valid payment amount')
      return
    }
    
    onSave({
      id: editData?.id,
      weekStart,
      weekLabel,
      client,
      totalAmount,
      driverPay,
      insurance,
      fuelExpenses,
      notes
    })
    
    onClose()
  }
  
  if (!isOpen) return null
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-[560px]"
        >
          <Card className="relative">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-display font-bold text-text-primary mb-1">
                  Weekly Payment
                </h2>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-accent" />
                  <p className="text-sm text-accent">{weekLabel}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X size={20} className="text-text-muted" />
              </button>
            </div>
            
            {/* Form */}
            <div className="space-y-4">
              {/* Client */}
              <div>
                <label className="text-xs text-text-muted mb-1.5 block">Client</label>
                <input
                  type="text"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="e.g. Healey"
                  className="w-full px-4 py-2.5 bg-bg-elevated border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              
              {/* Total Received */}
              <div>
                <label className="text-xs text-text-muted mb-1.5 block">Payment Received</label>
                <input
                  type="number"
                  value={totalAmount || ''}
                  onChange={(e) => setTotalAmount(parseFloat(e.target.value) || 0)}
                  placeholder="$0.00"
                  className="w-full px-4 py-3 bg-bg-elevated border border-border-subtle rounded-lg text-text-primary text-2xl font-mono font-semibold focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              
              {/* Driver Pay */}
              <div>
                <label className="text-xs text-text-muted mb-1.5 block">Driver Pay (Total)</label>
                <input
                  type="number"
                  value={driverPay || ''}
                  onChange={(e) => setDriverPay(parseFloat(e.target.value) || 0)}
                  placeholder="$0.00"
                  className="w-full px-4 py-2.5 bg-bg-elevated border border-border-subtle rounded-lg text-text-primary font-mono focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              
              {/* Insurance */}
              <div>
                <label className="text-xs text-text-muted mb-1.5 block">Insurance</label>
                <input
                  type="number"
                  value={insurance || ''}
                  onChange={(e) => setInsurance(parseFloat(e.target.value) || 0)}
                  placeholder="$0.00"
                  className="w-full px-4 py-2.5 bg-bg-elevated border border-border-subtle rounded-lg text-text-primary font-mono focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              
              {/* Fuel & Expenses */}
              <div>
                <label className="text-xs text-text-muted mb-1.5 block">Fuel & Expenses</label>
                <input
                  type="number"
                  value={fuelExpenses || ''}
                  onChange={(e) => setFuelExpenses(parseFloat(e.target.value) || 0)}
                  placeholder="$0.00"
                  className="w-full px-4 py-2.5 bg-bg-elevated border border-border-subtle rounded-lg text-text-primary font-mono focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              
              {/* Notes */}
              <div>
                <label className="text-xs text-text-muted mb-1.5 block">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any notes for this week..."
                  rows={2}
                  className="w-full px-4 py-2.5 bg-bg-elevated border border-border-subtle rounded-lg text-text-primary text-sm focus:outline-none focus:border-accent transition-colors resize-none"
                />
              </div>
              
              {/* Summary Box */}
              <div className="mt-6 p-4 bg-bg-elevated border border-border-subtle rounded-lg">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-muted">TOTAL RECEIVED</span>
                    <span className="font-mono text-text-primary">{formatCurrency(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Driver Pay</span>
                    <span className="font-mono text-text-primary">- {formatCurrency(driverPay)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Insurance</span>
                    <span className="font-mono text-text-primary">- {formatCurrency(insurance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Fuel & Expenses</span>
                    <span className="font-mono text-text-primary">- {formatCurrency(fuelExpenses)}</span>
                  </div>
                  <div className="border-t border-border-subtle pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-text-muted font-semibold">NET PROFIT</span>
                      <span className={`font-mono text-2xl font-bold ${netProfit >= 0 ? 'text-success' : 'text-accent'}`}>
                        {formatCurrency(netProfit)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Save Button */}
              <button
                onClick={handleSave}
                className="w-full py-3 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg transition-colors mt-4"
              >
                Save Weekly Payment
              </button>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
