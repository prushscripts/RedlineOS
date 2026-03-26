import { supabase } from './supabase'

// Weekly check helper functions

export interface WeeklyCheck {
  id: string
  week_start: string
  week_label: string
  total_amount: number
  truck_z455_amount: number
  truck_z420_amount: number
  notes: string | null
  created_at: string
}

/**
 * Get all weekly checks
 */
export async function getWeeklyChecks() {
  const { data, error } = await supabase
    .from('weekly_checks')
    .select('*')
    .order('week_start', { ascending: false })
  
  if (error) throw error
  return data || []
}

/**
 * Get latest weekly check
 */
export async function getLatestCheck() {
  const { data, error } = await supabase
    .from('weekly_checks')
    .select('*')
    .order('week_start', { ascending: false })
    .limit(1)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows
  return data || null
}

/**
 * Get last N weekly checks for averaging
 */
export async function getRecentChecks(count: number = 4) {
  const { data, error } = await supabase
    .from('weekly_checks')
    .select('*')
    .order('week_start', { ascending: false })
    .limit(count)
  
  if (error) throw error
  return data || []
}

/**
 * Add a new weekly check
 */
export async function addWeeklyCheck(check: {
  week_start: string
  week_label: string
  total_amount: number
  truck_z455_amount?: number
  truck_z420_amount?: number
  notes?: string
}) {
  const { data, error } = await supabase
    .from('weekly_checks')
    .insert(check)
    .select()
    .single()
  
  if (error) throw error
  return data
}

/**
 * Update a weekly check
 */
export async function updateWeeklyCheck(id: string, updates: Partial<WeeklyCheck>) {
  const { data, error } = await supabase
    .from('weekly_checks')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

/**
 * Delete a weekly check
 */
export async function deleteWeeklyCheck(id: string) {
  const { error } = await supabase
    .from('weekly_checks')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

/**
 * Calculate weekly profit from latest check and truck costs
 */
export async function calculateWeeklyProfit(trucks: any[]) {
  const latestCheck = await getLatestCheck()
  if (!latestCheck) return 0
  
  const totalCosts = trucks.reduce((sum, truck) => 
    sum + (truck.fuel_cost || 0) + (truck.other_costs || 0), 0
  )
  
  return latestCheck.total_amount - totalCosts
}

/**
 * Calculate monthly projection from recent checks
 */
export async function calculateMonthlyProjection() {
  const recentChecks = await getRecentChecks(4)
  if (recentChecks.length === 0) return 0
  
  const avgWeekly = recentChecks.reduce((sum, check) => sum + check.total_amount, 0) / recentChecks.length
  return avgWeekly * 4.33
}

/**
 * Calculate yearly projection from recent checks
 */
export async function calculateYearlyProjection() {
  const recentChecks = await getRecentChecks(4)
  if (recentChecks.length === 0) return 0
  
  const avgWeekly = recentChecks.reduce((sum, check) => sum + check.total_amount, 0) / recentChecks.length
  return avgWeekly * 52
}

/**
 * Calculate progress to $1M
 */
export async function calculateProgressTo1M() {
  const yearlyProjection = await calculateYearlyProjection()
  return (yearlyProjection / 1000000) * 100
}

/**
 * Calculate distance remaining to $1M
 */
export async function calculateRemainingTo1M() {
  const yearlyProjection = await calculateYearlyProjection()
  return Math.max(0, 1000000 - yearlyProjection)
}
