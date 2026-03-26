import { supabase } from './supabase'
import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10

/**
 * Hash a PIN for secure storage
 */
export async function hashPin(pin: string): Promise<string> {
  return bcrypt.hash(pin, SALT_ROUNDS)
}

/**
 * Verify a PIN against a hash
 */
export async function verifyPin(pin: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pin, hash)
}

/**
 * Check if user has set up vault PIN
 */
export async function hasVaultPin(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  
  const { data, error } = await supabase
    .from('vault_settings')
    .select('id')
    .eq('user_id', user.id)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error
  return !!data
}

/**
 * Set up vault PIN for user
 */
export async function setupVaultPin(pin: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  const pinHash = await hashPin(pin)
  
  const { data, error } = await supabase
    .from('vault_settings')
    .insert({
      user_id: user.id,
      pin_hash: pinHash
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

/**
 * Verify vault PIN
 */
export async function verifyVaultPin(pin: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  
  const { data, error } = await supabase
    .from('vault_settings')
    .select('pin_hash')
    .eq('user_id', user.id)
    .single()
  
  if (error) throw error
  if (!data) return false
  
  return verifyPin(pin, data.pin_hash)
}

/**
 * Get all vault documents
 */
export async function getVaultDocuments() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  const { data, error } = await supabase
    .from('vault_documents')
    .select('*')
    .eq('user_id', user.id)
    .order('uploaded_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

/**
 * Get vault documents by folder
 */
export async function getVaultDocumentsByFolder(folder: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  const { data, error } = await supabase
    .from('vault_documents')
    .select('*')
    .eq('user_id', user.id)
    .eq('folder', folder)
    .order('uploaded_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

/**
 * Get unique folder names
 */
export async function getVaultFolders(): Promise<string[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  const { data, error } = await supabase
    .from('vault_documents')
    .select('folder')
    .eq('user_id', user.id)
  
  if (error) throw error
  if (!data) return []
  
  const folders = new Set(data.map(doc => doc.folder))
  return Array.from(folders).sort()
}

/**
 * Upload file to vault storage
 */
export async function uploadVaultFile(file: File, folder: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  const fileName = `${Date.now()}_${file.name}`
  const filePath = `${user.id}/vault/${folder}/${fileName}`
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('vault-private')
    .upload(filePath, file)
  
  if (uploadError) throw uploadError
  
  // Get public URL (will require auth to access)
  const { data: { publicUrl } } = supabase.storage
    .from('vault-private')
    .getPublicUrl(filePath)
  
  // Insert document record
  const { data, error } = await supabase
    .from('vault_documents')
    .insert({
      user_id: user.id,
      name: file.name,
      folder: folder,
      file_url: publicUrl,
      file_type: file.type
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

/**
 * Delete vault document
 */
export async function deleteVaultDocument(id: string, fileUrl: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  // Extract file path from URL
  const urlParts = fileUrl.split('/vault-private/')
  if (urlParts.length > 1) {
    const filePath = urlParts[1]
    await supabase.storage
      .from('vault-private')
      .remove([filePath])
  }
  
  // Delete database record
  const { error } = await supabase
    .from('vault_documents')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)
  
  if (error) throw error
}

/**
 * Get signed URL for downloading vault file
 */
export async function getVaultFileDownloadUrl(fileUrl: string): Promise<string> {
  const urlParts = fileUrl.split('/vault-private/')
  if (urlParts.length < 2) throw new Error('Invalid file URL')
  
  const filePath = urlParts[1]
  
  const { data, error } = await supabase.storage
    .from('vault-private')
    .createSignedUrl(filePath, 60) // 60 second expiry
  
  if (error) throw error
  if (!data) throw new Error('Failed to generate download URL')
  
  return data.signedUrl
}
