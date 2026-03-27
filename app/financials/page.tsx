'use client'

import { DollarSign, TrendingUp, Target, Calendar } from 'lucide-react'
import StatCard from '@/components/dashboard/StatCard'
import Card from '@/components/ui/Card'
import ProfitLineChart from '@/components/charts/ProfitLineChart'
import { 
  trucks, 
  weeklyHistory,
  calculateWeeklyProfit,
  calculateMonthlyProjection,
  calculateYearlyProjection,
  calculateProgressTo1M,
  calculateRemainingTo1M
} from '@/lib/mockData'
import { formatCurrency } from '@/lib/utils'

export default function FinancialsPage() {
  const weeklyProfit = calculateWeeklyProfit(trucks)
  const monthlyProjection = calculateMonthlyProjection(weeklyProfit)
  const yearlyProjection = calculateYearlyProjection(weeklyProfit)
  const progressPercent = calculateProgressTo1M(yearlyProjection)
  const remaining = calculateRemainingTo1M(yearlyProjection)
  
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
      
      <ProfitLineChart data={weeklyHistory} />
      
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
    </div>
  )
}
