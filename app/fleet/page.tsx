'use client'

import { useState } from 'react'
import TruckCard from '@/components/fleet/TruckCard'
import DriverCard from '@/components/fleet/DriverCard'
import { trucks as initialTrucks, drivers } from '@/lib/mockData'
import { Truck } from '@/types'

export default function FleetPage() {
  const [trucks, setTrucks] = useState<Truck[]>(initialTrucks)
  
  const handleRevenueChange = (truckId: string, newRevenue: number) => {
    setTrucks(prevTrucks => 
      prevTrucks.map(truck => 
        truck.id === truckId ? { ...truck, weeklyRevenue: newRevenue } : truck
      )
    )
  }
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-text-primary mb-2">
          Fleet Management
        </h1>
        <p className="text-text-muted">
          Manage your trucks and drivers
        </p>
      </div>
      
      <div>
        <h2 className="text-xl font-display font-semibold text-text-primary mb-4">
          Trucks
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {trucks.map((truck) => {
            const driver = drivers.find(d => d.id === truck.driverId)
            return (
              <TruckCard 
                key={truck.id} 
                truck={truck} 
                driver={driver}
                onRevenueChange={handleRevenueChange}
              />
            )
          })}
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-display font-semibold text-text-primary mb-4">
          Drivers
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {drivers.map((driver) => {
            const truck = trucks.find(t => t.id === driver.truckId)
            return (
              <DriverCard 
                key={driver.id} 
                driver={driver} 
                truck={truck}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
