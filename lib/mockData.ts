import { Driver, Truck, WeeklySnapshot, Phase, FleetDocument, Alert } from '@/types'

export const drivers: Driver[] = [
  { 
    id: 'D1', 
    name: 'Joseph Pedro', 
    status: 'active', 
    truckId: 'T1',
    weeksActive: 12
  },
  { 
    id: 'D2', 
    name: 'Mark Parra', 
    status: 'active', 
    truckId: 'T2',
    weeksActive: 8
  },
]

export const trucks: Truck[] = [
  { 
    id: 'T1', 
    name: 'Truck 1', 
    route: 'Healey Route', 
    driverId: 'D1',
    weeklyRevenue: 0, 
    fuelCost: 0, 
    otherCosts: 0,
    status: 'active'
  },
  { 
    id: 'T2', 
    name: 'Truck 2', 
    route: 'Healey Route', 
    driverId: 'D2',
    weeklyRevenue: 0, 
    fuelCost: 0, 
    otherCosts: 0,
    status: 'active'
  },
]

export const weeklyHistory: WeeklySnapshot[] = [
  { week: 'W1', revenue: 0, profit: 0 },
  { week: 'W2', revenue: 0, profit: 0 },
  { week: 'W3', revenue: 0, profit: 0 },
  { week: 'W4', revenue: 0, profit: 0 },
  { week: 'W5', revenue: 0, profit: 0 },
  { week: 'W6', revenue: 0, profit: 0 },
  { week: 'W7', revenue: 0, profit: 0 },
  { week: 'W8', revenue: 0, profit: 0 },
]

export const phases: Phase[] = [
  {
    id: 1,
    name: 'Stabilize',
    revenueTarget: '$0–$5K/wk',
    unlockCondition: 'Complete all setup tasks',
    tasks: [
      { id: 'T1-1', label: 'Set up business entity and EIN', completed: true },
      { id: 'T1-2', label: 'Obtain commercial insurance', completed: true },
      { id: 'T1-3', label: 'Secure first two trucks', completed: true },
      { id: 'T1-4', label: 'Hire and onboard drivers', completed: true },
      { id: 'T1-5', label: 'Establish route contracts', completed: false },
    ]
  },
  {
    id: 2,
    name: 'Optimize',
    revenueTarget: '$5K–$10K/wk',
    unlockCondition: '90%+ on-time + cost controls in place',
    tasks: [
      { id: 'T2-1', label: 'Implement fuel tracking system', completed: false },
      { id: 'T2-2', label: 'Negotiate better fuel rates', completed: false },
      { id: 'T2-3', label: 'Optimize route efficiency', completed: false },
      { id: 'T2-4', label: 'Reduce maintenance costs by 15%', completed: false },
      { id: 'T2-5', label: 'Achieve 95% on-time delivery rate', completed: false },
    ]
  },
  {
    id: 3,
    name: 'Scale',
    revenueTarget: '$10K–$20K/wk',
    unlockCondition: 'Add 3rd truck or driver',
    tasks: [
      { id: 'T3-1', label: 'Purchase third truck', completed: false },
      { id: 'T3-2', label: 'Hire third driver', completed: false },
      { id: 'T3-3', label: 'Secure additional route contracts', completed: false },
      { id: 'T3-4', label: 'Implement driver performance metrics', completed: false },
      { id: 'T3-5', label: 'Establish backup driver pool', completed: false },
    ]
  },
  {
    id: 4,
    name: 'Systemize',
    revenueTarget: '$20K–$40K/wk',
    unlockCondition: 'SOPs documented, manager hired',
    tasks: [
      { id: 'T4-1', label: 'Document all operational procedures', completed: false },
      { id: 'T4-2', label: 'Hire operations manager', completed: false },
      { id: 'T4-3', label: 'Implement fleet management software', completed: false },
      { id: 'T4-4', label: 'Create driver training program', completed: false },
      { id: 'T4-5', label: 'Establish maintenance schedule system', completed: false },
    ]
  },
  {
    id: 5,
    name: '$1M+',
    revenueTarget: '$40K+/wk',
    unlockCondition: 'Passive operations running',
    tasks: [
      { id: 'T5-1', label: 'Expand to 10+ trucks', completed: false },
      { id: 'T5-2', label: 'Build management team', completed: false },
      { id: 'T5-3', label: 'Automate all reporting', completed: false },
      { id: 'T5-4', label: 'Establish strategic partnerships', completed: false },
      { id: 'T5-5', label: 'Achieve $1M annual profit', completed: false },
    ]
  },
]

export const documents: FleetDocument[] = [
  { id: 'DOC1', name: 'Commercial Auto Policy 2024.pdf', folder: 'insurance', uploadedAt: '2024-01-15', type: 'PDF' },
  { id: 'DOC2', name: 'Liability Coverage.pdf', folder: 'insurance', uploadedAt: '2024-01-15', type: 'PDF' },
  { id: 'DOC3', name: 'Joseph Pedro - CDL.pdf', folder: 'drivers', uploadedAt: '2024-02-01', type: 'PDF' },
  { id: 'DOC4', name: 'Mark Parra - CDL.pdf', folder: 'drivers', uploadedAt: '2024-02-10', type: 'PDF' },
  { id: 'DOC5', name: 'Truck 1 - Registration.pdf', folder: 'vehicles', uploadedAt: '2024-01-20', type: 'PDF' },
  { id: 'DOC6', name: 'Truck 2 - Registration.pdf', folder: 'vehicles', uploadedAt: '2024-01-22', type: 'PDF' },
  { id: 'DOC7', name: 'January Payroll.pdf', folder: 'payroll', uploadedAt: '2024-02-01', type: 'PDF' },
  { id: 'DOC8', name: 'February Payroll.pdf', folder: 'payroll', uploadedAt: '2024-03-01', type: 'PDF' },
]

export const alerts: Alert[] = [
  { id: 'A1', type: 'error', message: 'Truck 1 — fuel receipt missing' },
  { id: 'A2', type: 'warning', message: 'Insurance renewal due in 14 days' },
]

export function calculateWeeklyProfit(truckData: Truck[]): number {
  return truckData.reduce((sum, truck) => {
    return sum + (truck.weeklyRevenue - truck.fuelCost - truck.otherCosts)
  }, 0)
}

export function calculateMonthlyProjection(weeklyProfit: number): number {
  return weeklyProfit * 4.33
}

export function calculateYearlyProjection(weeklyProfit: number): number {
  return weeklyProfit * 52
}

export function calculateProgressTo1M(yearlyProjection: number): number {
  return (yearlyProjection / 1000000) * 100
}

export function calculateRemainingTo1M(yearlyProjection: number): number {
  return 1000000 - yearlyProjection
}
