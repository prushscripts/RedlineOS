export interface Driver {
  id: string
  name: string
  truckId: string
  status: 'active' | 'inactive'
  weeksActive?: number
}

export interface Truck {
  id: string
  name: string
  route: string
  driverId: string
  weeklyRevenue: number
  fuelCost: number
  otherCosts: number
  status: 'active' | 'idle'
}

export interface WeeklySnapshot {
  week: string
  revenue: number
  profit: number
}

export interface PhaseTask {
  id: string
  phase_id?: number
  label: string
  completed: boolean
}

export interface Phase {
  id: number
  name: string
  revenueTarget: string
  unlockCondition: string
  tasks: PhaseTask[]
}

export interface FleetDocument {
  id: string
  name: string
  folder: string
  uploadedAt: string
  type: 'PDF' | 'IMG' | 'DOC'
  file_url?: string
}

export interface Alert {
  id: string
  message: string
  type: 'error' | 'warning' | 'info'
}