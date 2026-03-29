'use client'

import { useState } from 'react'
import { Edit, Trash2 } from 'lucide-react'
import Card from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'
import { WeeklyPayment } from './WeeklyPaymentModal'

interface WeeklyPaymentCardProps {
  payment: WeeklyPayment
  onEdit: () => void
  onDelete: () => void
}

export default function WeeklyPaymentCard({ payment, onEdit, onDelete }: WeeklyPaymentCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDelete = () => {
    onDelete()
    setShowDeleteConfirm(false)
  }

  return (
    <Card className="relative">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-display font-semibold text-text-primary">
            {payment.weekLabel}
          </h3>
          <p className="text-sm text-text-muted mt-1">Client: {payment.client}</p>
        </div>
        {!showDeleteConfirm ? (
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <Edit size={16} className="text-text-muted" />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors group"
            >
              <Trash2 size={16} className="text-slate-500 group-hover:text-accent transition-colors" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-end gap-2">
            <p className="text-xs text-text-muted">Delete this entry?</p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDelete}
                className="px-3 py-1 text-xs bg-accent hover:bg-accent/90 text-white rounded transition-colors"
              >
                Yes, delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1 text-xs bg-bg-elevated hover:bg-bg-elevated/80 text-text-muted rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-text-muted">Total Received</span>
          <span className="font-mono text-text-primary">{formatCurrency(payment.totalAmount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Driver Pay</span>
          <span className="font-mono text-text-primary">- {formatCurrency(payment.driverPay)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Insurance</span>
          <span className="font-mono text-text-primary">- {formatCurrency(payment.insurance)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Fuel & Expenses</span>
          <span className="font-mono text-text-primary">- {formatCurrency(payment.fuelExpenses)}</span>
        </div>
        <div className="border-t border-border-subtle pt-2 mt-2">
          <div className="flex justify-between items-center">
            <span className="text-text-muted font-semibold">NET PROFIT</span>
            <span className="font-mono text-xl font-bold text-success">
              {formatCurrency(payment.totalAmount - payment.driverPay - payment.insurance - payment.fuelExpenses)} ✓
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}
