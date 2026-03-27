'use client'

import { useState, useEffect } from 'react'
import { DollarSign, TrendingUp, Truck as TruckIcon, Navigation, Plus } from 'lucide-react'
import StatCard from '@/components/dashboard/StatCard'
import RoadTo1MBanner from '@/components/dashboard/RoadTo1MBanner'
import OperatorPanel from '@/components/dashboard/OperatorPanel'
import ProfitLineChart from '@/components/charts/ProfitLineChart'
import DashboardWithLoading from '@/components/DashboardWithLoading'
import WeeklyPaymentModal, { WeeklyPayment } from '@/components/dashboard/WeeklyPaymentModal'
import WeeklyPaymentCard from '@/components/dashboard/WeeklyPaymentCard'
import Card from '@/components/ui/Card'
import { 
  trucks, 
  drivers, 
  alerts,
} from '@/lib/mockData'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [weeklyPayments, setWeeklyPayments] = useState<WeeklyPayment[]>([])
  const [editingPayment, setEditingPayment] = useState<WeeklyPayment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWeeklyPayments()
  }, [])

  const fetchWeeklyPayments = async () => {
    const { data, error } = await supabase
      .from('weekly_checks')
      .select('*')
      .order('week_start', { ascending: false })
      .limit(10)
    
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
    setLoading(false)
  }

  const handleSavePayment = async (payment: WeeklyPayment) => {
    const netProfit = payment.totalAmount - payment.driverPay - payment.insurance - payment.fuelExpenses
    
    if (payment.id) {
      // Update existing
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
      // Insert new
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

  const handleEditPayment = (payment: WeeklyPayment) => {
    setEditingPayment(payment)
    setIsPaymentModalOpen(true)
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
  
  const weeklyRevenue = mostRecentPayment ? mostRecentPayment.totalAmount : 0
  const totalMiles = 2847
  
  // Convert weekly payments to chart data
  const chartData = weeklyPayments.slice(0, 8).reverse().map((p, i) => ({
    week: `W${i + 1}`,
    revenue: p.totalAmount,
    profit: p.totalAmount - p.driverPay - p.insurance - p.fuelExpenses
  }))
  
  return (
    <DashboardWithLoading>
      <div className="w-full max-w-full overflow-x-hidden space-y-4 sm:space-y-6">
      <RoadTo1MBanner
        weeklyProfit={weeklyProfit}
        monthlyProjection={monthlyProjection}
        yearlyProjection={yearlyProjection}
        progressPercent={progressPercent}
        remaining={remaining}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Weekly Revenue"
          value={weeklyRevenue}
          icon={DollarSign}
          format="currency"
          index={0}
        />
        <StatCard
          title="Weekly Profit"
          value={weeklyProfit}
          icon={TrendingUp}
          format="currency"
          index={1}
        />
        <StatCard
          title="Active Trucks"
          value={trucks.filter(t => t.status === 'active').length}
          icon={TruckIcon}
          index={2}
        />
        <StatCard
          title="Miles This Week"
          value={totalMiles}
          icon={Navigation}
          index={3}
        />
      </div>
      
      {/* Weekly Payment Section */}
      <div>
        {mostRecentPayment ? (
          <WeeklyPaymentCard 
            payment={mostRecentPayment}
            onEdit={() => handleEditPayment(mostRecentPayment)}
          />
        ) : (
          <Card className="text-center py-8">
            <h3 className="text-lg font-display font-semibold text-text-primary mb-2">
              Log Your Weekly Payment
            </h3>
            <p className="text-sm text-text-muted mb-4">
              Track your check, expenses, and profit for this week
            </p>
            <button
              onClick={() => {
                setEditingPayment(null)
                setIsPaymentModalOpen(true)
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg transition-colors"
            >
              <Plus size={20} />
              Log Weekly Payment
            </button>
          </Card>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <ProfitLineChart data={chartData} />
        </div>
        <div>
          <OperatorPanel
            drivers={drivers}
            trucks={trucks}
            weeklyRevenue={weeklyRevenue}
            alerts={alerts}
          />
        </div>
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
    </DashboardWithLoading>
  )
}
