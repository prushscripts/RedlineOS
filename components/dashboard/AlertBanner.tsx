import { AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { Alert } from '@/types'
import { cn } from '@/lib/utils'

interface AlertBannerProps {
  alerts: Alert[]
}

export default function AlertBanner({ alerts }: AlertBannerProps) {
  if (alerts.length === 0) return null
  
  return (
    <div className="space-y-2">
      {alerts.map((alert) => {
        const Icon = alert.type === 'error' ? AlertCircle : alert.type === 'warning' ? AlertTriangle : Info
        
        const colors = {
          error: 'bg-danger/10 border-danger/20 text-danger',
          warning: 'bg-warning/10 border-warning/20 text-warning',
          info: 'bg-blue-500/10 border-blue-500/20 text-blue-400'
        }
        
        return (
          <div 
            key={alert.id}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg border',
              colors[alert.type]
            )}
          >
            <Icon size={18} />
            <p className="text-sm font-medium">{alert.message}</p>
          </div>
        )
      })}
    </div>
  )
}
