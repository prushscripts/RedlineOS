'use client'

import { useState } from 'react'
import { User, Truck as TruckIcon } from 'lucide-react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { Driver, Truck } from '@/types'

interface DriverCardProps {
  driver: Driver
  truck: Truck | undefined
}

export default function DriverCard({ driver, truck }: DriverCardProps) {
  const [status, setStatus] = useState(driver.status)
  
  const toggleStatus = () => {
    setStatus(prev => prev === 'active' ? 'inactive' : 'active')
  }
  
  return (
    <Card hover>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
            <User className="text-accent" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-display font-semibold text-text-primary">
              {driver.name}
            </h3>
            <p className="text-sm text-text-muted">{driver.weeksActive} weeks active</p>
          </div>
        </div>
        <button onClick={toggleStatus}>
          <Badge variant={status === 'active' ? 'success' : 'default'}>
            {status}
          </Badge>
        </button>
      </div>
      
      {truck && (
        <div className="flex items-center gap-2 p-3 bg-bg-elevated rounded-lg">
          <TruckIcon className="text-text-muted" size={16} />
          <div>
            <p className="text-xs text-text-muted">Assigned Truck</p>
            <p className="text-sm font-medium text-text-primary">{truck.name}</p>
          </div>
        </div>
      )}
    </Card>
  )
}
