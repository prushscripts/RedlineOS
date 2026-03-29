'use client'

import { useState, useEffect } from 'react'
import { DollarSign, TrendingUp, Target, Calendar, Edit, Trash2, Plus } from 'lucide-react'
import StatCard from '@/components/dashboard/StatCard'
import Card from '@/components/ui/Card'
import ProfitLineChart from '@/components/charts/ProfitLineChart'
import WeeklyPaymentModal, { WeeklyPayment } from '@/components/dashboard/WeeklyPaymentModal'
import { trucks } from '@/lib/mockData'
import { formatCurrency } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

export default function FinancialsPage() {
  const [weeklyPayments, setWeeklyPayments] = useState<WeeklyPayment[]>([])
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [editingPayment, setEditingPayment] = useState<WeeklyPayment | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchWeeklyPayments()
  }, [])

  const fetchWeeklyPayments = async () => {
    const { data, error } = await supabase
      .from('weekly_checks')
      .select('*')
      .order('week_start', { ascending: false })
    
    if (data && !error) {
      const payments: WeeklyPayment[] = data.map(d => ({
        id: d.id,
        weekStart: d.week_start,
        weekLabel: d.week_label,
        client: d.client,
        totalAmount: d.total_amount,
        driverPay: d.driver_pay,
        insurance: d.insurance,
        fuelExpenses: d.fuel_expenses,
        notes: d.notes || ''
      }))
      setWeeklyPayments(payments)
    }
  }

  const handleSavePayment = async (payment: WeeklyPayment) => {
    if (payment.id) {
      await supabase
        .from('weekly_checks')
        .update({
          week_start: payment.weekStart,
          week_label: payment.weekLabel,
          client: payment.client,
          total_amount: payment.totalAmount,
          driver_pay: payment.driverPay,
          insurance: payment.insurance,
          fuel_expenses: payment.fuelExpenses,
          notes: payment.notes
        })
        .eq('id', payment.id)
    } else {
      await supabase
        .from('weekly_checks')
        .insert({
          week_start: payment.weekStart,
          week_label: payment.weekLabel,
          client: payment.client,
          total_amount: payment.totalAmount,
          driver_pay: payment.driverPay,
          insurance: payment.insurance,
          fuel_expenses: payment.fuelExpenses,
          notes: payment.notes
        })
    }
    
    fetchWeeklyPayments()
    setEditingPayment(null)
  }

  const handleDeletePayment = async (paymentId: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from('weekly_checks')
      .delete()
      .eq('id', paymentId)
    
    await fetchWeeklyPayments()
    setDeletingId(null)
    
    // Show toast
    const toast = document.createElement('div')
    toast.className = 'fixed top-4 right-4 bg-accent text-white px-6 py-3 rounded-lg shadow-lg z-50'
    toast.textContent = 'Entry deleted'
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 3000)
  }

  // Calculate stats from weekly_checks
  const mostRecentPayment = weeklyPayments[0]
  const weeklyProfit = mostRecentPayment 
    ? mostRecentPayment.totalAmount - mostRecentPayment.driverPay - mostRecentPayment.insurance - mostRecentPayment.fuelExpenses
    : 0
  
  const last4Weeks = weeklyPayments.slice(0, 4)
  const avgWeeklyProfit = last4Weeks.length > 0
    ? last4Weeks.reduce((sum, p) => sum + (p.totalAmount - p.driverPay - p.insurance - p.fuelExpenses), 0) / last4Weeks.length
    : 0
  
  const monthlyProjection = avgWeeklyProfit * 4.33
  const yearlyProjection = avgWeeklyProfit * 52
  const progressPercent = (yearlyProjection / 1000000) * 100
  const remaining = 1000000 - yearlyProjection
  
  const yearsToGoal = remaining / yearlyProjection
  const totalRevenue = trucks.reduce((sum, truck) => sum + truck.weeklyRevenue, 0)
  const totalCosts = trucks.reduce((sum, truck) => sum + truck.fuelCost + truck.otherCosts, 0)
  
  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-4 sm:space-y-6 lg:space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-text-primary mb-2">
          Financial Overview
        </h1>
        <p className="text-sm sm:text-base text-text-muted">
          Track your revenue, costs, and path to $1M
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Weekly Profit"
          value={weeklyProfit}
          icon={DollarSign}
          format="currency"
          index={0}
        />
        <StatCard
          title="Monthly Projection"
          value={monthlyProjection}
          icon={Calendar}
          format="currency"
          index={1}
        />
        <StatCard
          title="Yearly Projection"
          value={yearlyProjection}
          icon={TrendingUp}
          format="currency"
          index={2}
        />
        <StatCard
          title="Progress to $1M"
          value={progressPercent}
          icon={Target}
          index={3}
        />
      </div>
      
      <Card className="bg-gradient-to-r from-accent/10 via-transparent to-accent/10 border-accent/20">
        <div className="text-center">
          <p className="text-text-muted mb-2">Distance to $1,000,000</p>
          <h2 className="text-4xl font-display font-bold text-text-primary mb-2">
            {formatCurrency(remaining)}
          </h2>
          <p className="text-text-muted">
            At this rate, you&apos;ll reach $1M in <span className="text-text-primary font-semibold">{yearsToGoal.toFixed(1)} years</span>
          </p>
          <p className="text-sm text-text-muted mt-2">
            Adding 1 more truck could reduce this to ~{(yearsToGoal * 0.67).toFixed(1)} years
          </p>
        </div>
      </Card>
      
      <ProfitLineChart data={weeklyPayments.slice(0, 8).reverse().map((p, i) => ({
        week: `W${i + 1}`,
        revenue: p.totalAmount,
        profit: p.totalAmount - p.driverPay - p.insurance - p.fuelExpenses
      }))} />
      
      {/* Check History Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-display font-semibold text-text-primary">
            Check History
          </h3>
          <button
            onClick={() => {
              setEditingPayment(null)
              setIsPaymentModalOpen(true)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg transition-colors text-sm"
          >
            <Plus size={16} />
            New Payment
          </button>
        </div>
        
        {weeklyPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase">Week</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase">Client</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-text-muted uppercase">Total</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-text-muted uppercase">Driver Pay</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-text-muted uppercase">Insurance</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-text-muted uppercase">Fuel</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-text-muted uppercase">Net Profit</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-text-muted uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {weeklyPayments.map((payment) => {
                  const netProfit = payment.totalAmount - payment.driverPay - payment.insurance - payment.fuelExpenses
                  return (
                    <tr key={payment.id} className="border-b border-border-subtle hover:bg-bg-elevated transition-colors">
                      <td className="py-3 px-4 text-sm text-text-primary">{payment.weekLabel}</td>
                      <td className="py-3 px-4 text-sm text-text-muted">{payment.client}</td>
                      <td className="py-3 px-4 text-sm text-text-primary text-right font-mono">{formatCurrency(payment.totalAmount)}</td>
                      <td className="py-3 px-4 text-sm text-text-muted text-right font-mono">{formatCurrency(payment.driverPay)}</td>
                      <td className="py-3 px-4 text-sm text-text-muted text-right font-mono">{formatCurrency(payment.insurance)}</td>
                      <td className="py-3 px-4 text-sm text-text-muted text-right font-mono">{formatCurrency(payment.fuelExpenses)}</td>
                      <td className="py-3 px-4 text-sm text-success text-right font-mono font-semibold">{formatCurrency(netProfit)}</td>
                      <td className="py-3 px-4">
                        {deletingId === payment.id ? (
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-xs text-text-muted">Delete?</span>
                            <button
                              onClick={() => handleDeletePayment(payment.id!)}
                              className="px-2 py-1 text-xs bg-accent hover:bg-accent/90 text-white rounded transition-colors"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setDeletingId(null)}
                              className="px-2 py-1 text-xs bg-bg-elevated hover:bg-bg-elevated/80 text-text-muted rounded transition-colors"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingPayment(payment)
                                setIsPaymentModalOpen(true)
                              }}
                              className="p-1.5 hover:bg-white/5 rounded transition-colors"
                            >
                              <Edit size={14} className="text-text-muted" />
                            </button>
                            <button
                              onClick={() => setDeletingId(payment.id!)}
                              className="p-1.5 hover:bg-white/5 rounded transition-colors group"
                            >
                              <Trash2 size={14} className="text-slate-500 group-hover:text-accent transition-colors" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-text-muted py-8">No payment history yet. Click "New Payment" to add your first entry.</p>
        )}
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-display font-semibold text-text-primary mb-4">
            Revenue Breakdown
          </h3>
          <div className="space-y-3">
            {trucks.map((truck) => (
              <div key={truck.id} className="flex items-center justify-between p-3 bg-bg-elevated rounded-lg">
                <span className="text-sm text-text-muted">{truck.name}</span>
                <span className="text-sm font-mono font-semibold text-text-primary">
                  {formatCurrency(truck.weeklyRevenue)}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg border border-accent/20">
              <span className="text-sm font-semibold text-text-primary">Total Weekly</span>
              <span className="text-lg font-mono font-bold text-accent">
                {formatCurrency(totalRevenue)}
              </span>
            </div>
          </div>
        </Card>
        
        <Card>
          <h3 className="text-lg font-display font-semibold text-text-primary mb-4">
            Cost Breakdown
          </h3>
          <div className="space-y-3">
            {trucks.map((truck) => {
              const truckCosts = truck.fuelCost + truck.otherCosts
              return (
                <div key={truck.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary">{truck.name}</span>
                    <span className="text-sm font-mono text-text-primary">
                      {formatCurrency(truckCosts)}
                    </span>
                  </div>
                  <div className="pl-4 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-muted">Fuel</span>
                      <span className="font-mono text-text-muted">{formatCurrency(truck.fuelCost)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-muted">Other</span>
                      <span className="font-mono text-text-muted">{formatCurrency(truck.otherCosts)}</span>
                    </div>
                  </div>
                </div>
              )
            })}
            <div className="flex items-center justify-between p-3 bg-danger/10 rounded-lg border border-danger/20">
              <span className="text-sm font-semibold text-text-primary">Total Costs</span>
              <span className="text-lg font-mono font-bold text-danger">
                {formatCurrency(totalCosts)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg border border-success/20">
              <span className="text-sm font-semibold text-text-primary">Net Profit</span>
              <span className="text-lg font-mono font-bold text-success">
                {formatCurrency(weeklyProfit)}
              </span>
            </div>
          </div>
        </Card>
      </div>
      
      <WeeklyPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false)
          setEditingPayment(null)
        }}
        onSave={handleSavePayment}
        editData={editingPayment}
      />
    </div>
  )
}
