import { CheckCircle2 } from 'lucide-react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import AlertBanner from './AlertBanner'
import { Driver, Truck, Alert } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface OperatorPanelProps {
  drivers: Driver[]
  trucks: Truck[]
  weeklyRevenue: number
  alerts: Alert[]
}

export default function OperatorPanel({ drivers, trucks, weeklyRevenue, alerts }: OperatorPanelProps) {
  const activeTrucks = trucks.filter(t => t.status === 'active').length
  const activeDrivers = drivers.filter(d => d.status === 'active')
  
  return (
    <Card>
      <h3 className="text-lg font-display font-semibold text-text-primary mb-4">
        Operator Panel
      </h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-text-muted mb-2">Active Trucks</p>
          <div className="flex items-center gap-2">
            <Badge variant="success">{activeTrucks}/{trucks.length}</Badge>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-text-muted mb-2">Drivers on Route</p>
          <div className="space-y-2">
            {activeDrivers.map((driver) => (
              <div key={driver.id} className="flex items-center gap-2">
                <CheckCircle2 className="text-success" size={16} />
                <span className="text-sm text-text-primary">{driver.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <p className="text-sm text-text-muted mb-1">This Week&apos;s Revenue</p>
          <p className="text-xl font-mono font-semibold text-text-primary">
            {formatCurrency(weeklyRevenue)}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-text-muted mb-2">Alerts</p>
          <AlertBanner alerts={alerts} />
        </div>
      </div>
    </Card>
  )
}
