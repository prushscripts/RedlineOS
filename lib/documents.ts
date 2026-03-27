import { supabase } from './supabase'

/**
 * Get all documents for current user
 */
export async function getDocuments() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', user.id)
    .order('uploaded_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

/**
 * Get documents by folder
 */
export async function getDocumentsByFolder(folder: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', user.id)
    .eq('folder', folder)
    .order('uploaded_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

/**
 * Upload file to documents storage
 */
export async function uploadDocument(file: File, folder: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  const fileName = `${Date.now()}_${file.name}`
  const filePath = `${user.id}/docs/${folder}/${fileName}`
  
  const { error: uploadError } = await supabase.storage
    .from('redlineos-docs')
    .upload(filePath, file)
  
  if (uploadError) {
    console.error('Storage upload error:', uploadError)
    throw new Error('Upload failed — check that Supabase storage buckets are configured')
  }
  
  // Insert document record
  const { data, error } = await supabase
    .from('documents')
    .insert({
      user_id: user.id,
      name: file.name,
      folder: folder,
      file_url: filePath,
      file_type: file.name.split('.').pop()?.toUpperCase() || 'FILE'
    })
    .select()
    .single()
  
  if (error) {
    console.error('Database insert error:', error)
    throw new Error('File uploaded but failed to save record — contact support')
  }
  
  return data
}

/**
 * Delete document
 */
export async function deleteDocument(id: string, filePath: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  // Delete from storage
  await supabase.storage
    .from('redlineos-docs')
    .remove([filePath])
  
  // Delete database record
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)
  
  if (error) throw error
}

/**
 * Get signed URL for downloading document
 */
export async function getDocumentDownloadUrl(filePath: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from('redlineos-docs')
    .createSignedUrl(filePath, 60) // 60 second expiry
  
  if (error) throw error
  if (!data) throw new Error('Failed to generate download URL')
  
  return data.signedUrl
}
