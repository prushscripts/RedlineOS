export interface Driver {
  id: string
  name: string
  status: 'active' | 'inactive'
  truck_id: string | null
  weeksActive?: number
  created_at?: string
}

export interface Truck {
  id: string
  name: string
  route: string | null
  driver_id: string | null
  weekly_revenue: number
  fuel_cost: number
  other_costs: number
  status: 'active' | 'idle'
  created_at?: string
}

export interface Phase {
  id: number
  name: string
  revenueTarget: string
  unlockCondition: string
  tasks: PhaseTask[]
}

export interface PhaseTask {
  id: string
  phase_id: number
  label: string
  completed: boolean
}

export interface WeeklySnapshot {
  id: string
  week_label: string
  revenue: number
  profit: number
  recorded_at?: string
}

export interface FleetDocument {
  id: string
  name: string
  folder: 'insurance' | 'drivers' | 'vehicles' | 'payroll'
  uploaded_at: string
  file_type: 'PDF' | 'IMG' | 'DOC'
  type?: 'PDF' | 'IMG' | 'DOC'
}

export interface Alert {
  id: string
  type: 'danger' | 'warning' | 'info'
  message: string
}
