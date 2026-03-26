'use client'

import { useState } from 'react'
import { Truck as TruckIcon, User } from 'lucide-react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { Truck, Driver } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface TruckCardProps {
  truck: Truck
  driver: Driver | undefined
  onRevenueChange: (truckId: string, newRevenue: number) => void
}

export default function TruckCard({ truck, driver, onRevenueChange }: TruckCardProps) {
  const [revenue, setRevenue] = useState(truck.weeklyRevenue)
  
  const netProfit = revenue - truck.fuelCost - truck.otherCosts
  
  const handleRevenueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0
    setRevenue(value)
    onRevenueChange(truck.id, value)
  }
  
  return (
    <Card hover>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-accent/10 rounded-lg">
            <TruckIcon className="text-accent" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-display font-semibold text-text-primary">
              {truck.name}
            </h3>
            <Badge variant="info" className="mt-1">{truck.route}</Badge>
          </div>
        </div>
        <Badge variant={truck.status === 'active' ? 'success' : 'default'}>
          {truck.status}
        </Badge>
      </div>
      
      {driver && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-bg-elevated rounded-lg">
          <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
            <User className="text-accent" size={16} />
          </div>
          <div>
            <p className="text-xs text-text-muted">Driver</p>
            <p className="text-sm font-medium text-text-primary">{driver.name}</p>
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        <div>
          <label className="text-xs text-text-muted mb-1 block">Weekly Revenue</label>
          <input
            type="number"
            value={revenue}
            onChange={handleRevenueChange}
            className="w-full px-3 py-2 bg-bg-elevated border border-border-subtle rounded-lg text-text-primary font-mono focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-text-muted mb-1">Fuel Cost</p>
            <p className="text-sm font-mono text-text-primary">{formatCurrency(truck.fuelCost)}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1">Other Costs</p>
            <p className="text-sm font-mono text-text-primary">{formatCurrency(truck.otherCosts)}</p>
          </div>
        </div>
        
        <div className="pt-3 border-t border-border-subtle">
          <p className="text-xs text-text-muted mb-1">Net Profit</p>
          <p className="text-2xl font-mono font-bold text-success">
            {formatCurrency(netProfit)}
          </p>
        </div>
      </div>
    </Card>
  )
}
