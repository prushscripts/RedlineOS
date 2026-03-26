export interface Driver {
  id: string
  name: string
  status: 'active' | 'inactive'
  truckId: string
  weeksActive: number
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

export interface Phase {
  id: number
  name: string
  revenueTarget: string
  unlockCondition: string
  tasks: Task[]
}

export interface Task {
  id: string
  label: string
  completed: boolean
}

export interface WeeklySnapshot {
  week: string
  revenue: number
  profit: number
}

export interface Document {
  id: string
  name: string
  folder: 'insurance' | 'drivers' | 'vehicles' | 'payroll'
  uploadedAt: string
  type: 'PDF' | 'IMG' | 'DOC'
}

export interface Alert {
  id: string
  type: 'danger' | 'warning' | 'info'
  message: string
}
