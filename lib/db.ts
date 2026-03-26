import { supabase } from './supabase'

// Database helper functions for fetching and updating data

/**
 * Get all trucks from database
 */
export async function getTrucks() {
  const { data, error } = await supabase
    .from('trucks')
    .select('*')
    .order('created_at', { ascending: true })
  
  if (error) throw error
  return data || []
}

/**
 * Get all drivers from database
 */
export async function getDrivers() {
  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .order('created_at', { ascending: true })
  
  if (error) throw error
  return data || []
}

/**
 * Get weekly snapshots for profit chart
 */
export async function getWeeklySnapshots() {
  const { data, error } = await supabase
    .from('weekly_snapshots')
    .select('*')
    .order('recorded_at', { ascending: true })
  
  if (error) throw error
  return data || []
}

/**
 * Get all documents
 */
export async function getDocuments() {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('uploaded_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

/**
 * Get all phase tasks
 */
export async function getPhaseTasks() {
  const { data, error } = await supabase
    .from('phase_tasks')
    .select('*')
    .order('phase_id', { ascending: true })
  
  if (error) throw error
  return data || []
}

/**
 * Update truck data
 */
export async function updateTruck(id: string, updates: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('trucks')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

/**
 * Update driver data
 */
export async function updateDriver(id: string, updates: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('drivers')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

/**
 * Add weekly snapshot
 */
export async function addWeeklySnapshot(weekLabel: string, revenue: number, profit: number) {
  const { data, error } = await supabase
    .from('weekly_snapshots')
    .insert({ week_label: weekLabel, revenue, profit })
    .select()
    .single()
  
  if (error) throw error
  return data
}

/**
 * Delete weekly snapshot
 */
export async function deleteWeeklySnapshot(id: string) {
  const { error } = await supabase
    .from('weekly_snapshots')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

/**
 * Update phase task
 */
export async function updatePhaseTask(id: string, updates: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('phase_tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

/**
 * Add phase task
 */
export async function addPhaseTask(phaseId: number, label: string) {
  const { data, error } = await supabase
    .from('phase_tasks')
    .insert({ phase_id: phaseId, label, completed: false })
    .select()
    .single()
  
  if (error) throw error
  return data
}

/**
 * Delete phase task
 */
export async function deletePhaseTask(id: string) {
  const { error } = await supabase
    .from('phase_tasks')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}
