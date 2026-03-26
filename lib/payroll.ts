import { supabase } from './supabase'

export interface DriverPay {
  id: string
  week_start: string
  week_label: string
  driver_id: string
  amount: number
  notes: string | null
  created_at: string
}

/**
 * Get all driver pay records
 */
export async function getAllDriverPay() {
  const { data, error } = await supabase
    .from('driver_pay')
    .select('*')
    .order('week_start', { ascending: false })
  
  if (error) throw error
  return data || []
}

/**
 * Get driver pay records for a specific driver
 */
export async function getDriverPayByDriver(driverId: string) {
  const { data, error } = await supabase
    .from('driver_pay')
    .select('*')
    .eq('driver_id', driverId)
    .order('week_start', { ascending: false })
  
  if (error) throw error
  return data || []
}

/**
 * Get driver pay for a specific week
 */
export async function getDriverPayByWeek(weekStart: string) {
  const { data, error } = await supabase
    .from('driver_pay')
    .select('*')
    .eq('week_start', weekStart)
  
  if (error) throw error
  return data || []
}

/**
 * Add driver pay record
 */
export async function addDriverPay(pay: {
  week_start: string
  week_label: string
  driver_id: string
  amount: number
  notes?: string
}) {
  const { data, error } = await supabase
    .from('driver_pay')
    .insert(pay)
    .select()
    .single()
  
  if (error) throw error
  return data
}

/**
 * Add multiple driver pay records (batch)
 */
export async function addDriverPayBatch(payRecords: Array<{
  week_start: string
  week_label: string
  driver_id: string
  amount: number
  notes?: string
}>) {
  const { data, error } = await supabase
    .from('driver_pay')
    .insert(payRecords)
    .select()
  
  if (error) throw error
  return data
}

/**
 * Update driver pay record
 */
export async function updateDriverPay(id: string, updates: Partial<DriverPay>) {
  const { data, error } = await supabase
    .from('driver_pay')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

/**
 * Delete driver pay record
 */
export async function deleteDriverPay(id: string) {
  const { error } = await supabase
    .from('driver_pay')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

/**
 * Calculate total paid to a driver (all time)
 */
export async function getTotalPaidToDriver(driverId: string) {
  const records = await getDriverPayByDriver(driverId)
  return records.reduce((sum, record) => sum + record.amount, 0)
}

/**
 * Calculate total payout for current week
 */
export async function getCurrentWeekPayout() {
  // Get Monday of current week
  const now = new Date()
  const dayOfWeek = now.getDay()
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
  const monday = new Date(now.setDate(diff))
  const weekStart = monday.toISOString().split('T')[0]
  
  const records = await getDriverPayByWeek(weekStart)
  return records.reduce((sum, record) => sum + record.amount, 0)
}

/**
 * Calculate average weekly payout (last N weeks)
 */
export async function getAverageWeeklyPayout(weeks: number = 4) {
  const { data, error } = await supabase
    .from('driver_pay')
    .select('week_start, amount')
    .order('week_start', { ascending: false })
    .limit(weeks * 2) // Get more than needed to ensure we have enough weeks
  
  if (error) throw error
  if (!data || data.length === 0) return 0
  
  // Group by week and sum
  const weekTotals = new Map<string, number>()
  data.forEach(record => {
    const current = weekTotals.get(record.week_start) || 0
    weekTotals.set(record.week_start, current + record.amount)
  })
  
  const totals = Array.from(weekTotals.values()).slice(0, weeks)
  if (totals.length === 0) return 0
  
  return totals.reduce((sum, total) => sum + total, 0) / totals.length
}
