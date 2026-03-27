'use client'

import { Edit } from 'lucide-react'
import Card from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'
import { WeeklyPayment } from './WeeklyPaymentModal'

interface WeeklyPaymentCardProps {
  payment: WeeklyPayment
  onEdit: () => void
}

export default function WeeklyPaymentCard({ payment, onEdit }: WeeklyPaymentCardProps) {
  return (
    <Card className="relative">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-display font-semibold text-text-primary">
            {payment.weekLabel}
          </h3>
          <p className="text-sm text-text-muted mt-1">Client: {payment.client}</p>
        </div>
        <button
          onClick={onEdit}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
        >
          <Edit size={16} className="text-text-muted" />
        </button>
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
