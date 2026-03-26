'use client'

import { DollarSign, TrendingUp, Truck as TruckIcon, Navigation } from 'lucide-react'
import StatCard from '@/components/dashboard/StatCard'
import RoadTo1MBanner from '@/components/dashboard/RoadTo1MBanner'
import OperatorPanel from '@/components/dashboard/OperatorPanel'
import ProfitLineChart from '@/components/charts/ProfitLineChart'
import { 
  trucks, 
  drivers, 
  weeklyHistory, 
  alerts,
  calculateWeeklyProfit,
  calculateMonthlyProjection,
  calculateYearlyProjection,
  calculateProgressTo1M,
  calculateRemainingTo1M
} from '@/lib/mockData'

export default function DashboardPage() {
  const weeklyProfit = calculateWeeklyProfit(trucks)
  const monthlyProjection = calculateMonthlyProjection(weeklyProfit)
  const yearlyProjection = calculateYearlyProjection(weeklyProfit)
  const progressPercent = calculateProgressTo1M(yearlyProjection)
  const remaining = calculateRemainingTo1M(yearlyProjection)
  
  const weeklyRevenue = trucks.reduce((sum, truck) => sum + truck.weekly_revenue, 0)
  const totalMiles = 2847
  
  return (
    <div className="space-y-6">
      <RoadTo1MBanner
        weeklyProfit={weeklyProfit}
        monthlyProjection={monthlyProjection}
        yearlyProjection={yearlyProjection}
        progressPercent={progressPercent}
        remaining={remaining}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Weekly Revenue"
          value={weeklyRevenue}
          icon={DollarSign}
          format="currency"
          change={8.5}
          index={0}
        />
        <StatCard
          title="Weekly Profit"
          value={weeklyProfit}
          icon={TrendingUp}
          format="currency"
          change={12.3}
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
          change={5.2}
          index={3}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProfitLineChart data={weeklyHistory} />
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
    </div>
  )
}
