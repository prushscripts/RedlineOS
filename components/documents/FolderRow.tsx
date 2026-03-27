'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, FileText, Image as ImageIcon, File, Upload, Trash2, Download } from 'lucide-react'
import { FleetDocument } from '@/types'
import Badge from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import { uploadDocument, deleteDocument, getDocumentDownloadUrl } from '@/lib/documents'

interface FolderRowProps {
  title: string
  icon: React.ReactNode
  folder: string
  documents: any[]
  onUpdate: () => void
}

export default function FolderRow({ title, icon, folder, documents, onUpdate }: FolderRowProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setError(null)
    
    try {
      for (const file of Array.from(files)) {
        await uploadDocument(file, folder)
      }
      onUpdate()
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (doc: any) => {
    if (!confirm(`Delete ${doc.name}?`)) return

    try {
      await deleteDocument(doc.id, doc.file_url)
      onUpdate()
    } catch (err) {
      console.error('Delete error:', err)
      setError('Failed to delete document')
    }
  }

  const handleDownload = async (doc: any) => {
    try {
      const url = await getDocumentDownloadUrl(doc.file_url)
      window.open(url, '_blank')
    } catch (err) {
      console.error('Download error:', err)
      setError('Failed to download document')
    }
  }
  
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return <FileText size={16} className="text-accent" />
      case 'IMG':
        return <ImageIcon size={16} className="text-blue-400" />
      default:
        return <File size={16} className="text-text-muted" />
    }
  }
  
  return (
    <div className="glass rounded-xl overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/[0.03] transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-display font-semibold text-text-primary">{title}</span>
          <Badge variant="default">{documents.length}</Badge>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={20} className="text-text-muted" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 space-y-2">
              {/* Error message */}
              {error && (
                <div className="p-3 bg-accent/10 border border-accent/30 rounded-lg text-sm text-accent">
                  {error}
                </div>
              )}
              
              {/* Upload button */}
              <label className="flex items-center justify-center gap-2 p-3 bg-bg-elevated border border-border-subtle rounded-lg hover:bg-bg-elevated/80 transition-colors cursor-pointer">
                <Upload size={16} className="text-text-muted" />
                <span className="text-sm text-text-muted">
                  {isUploading ? 'Uploading...' : `Upload to ${title}`}
                </span>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
              
              {/* Documents list */}
              {documents.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between p-3 bg-bg-elevated rounded-lg hover:bg-bg-elevated/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {getFileIcon(doc.file_type || 'FILE')}
                    <div>
                      <p className="text-sm font-medium text-text-primary">{doc.name}</p>
                      <p className="text-xs text-text-muted">
                        {new Date(doc.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownload(doc)}
                      className="p-1.5 hover:bg-white/5 rounded transition-colors"
                      title="Download"
                    >
                      <Download size={14} className="text-text-muted" />
                    </button>
                    <button
                      onClick={() => handleDelete(doc)}
                      className="p-1.5 hover:bg-accent/10 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} className="text-accent" />
                    </button>
                  </div>
                </motion.div>
              ))}
              
              {documents.length === 0 && !isUploading && (
                <p className="text-center text-sm text-text-muted py-4">
                  No documents yet. Upload your first file above.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
