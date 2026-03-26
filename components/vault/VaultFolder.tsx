'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronRight, Upload, Download, Trash2, FileText, Image, File } from 'lucide-react'
import { getVaultDocumentsByFolder, uploadVaultFile, deleteVaultDocument, getVaultFileDownloadUrl } from '@/lib/vault'
import { formatCurrency } from '@/lib/utils'

interface VaultFolderProps {
  folderName: string
  onUpdate: () => void
}

export default function VaultFolder({ folderName, onUpdate }: VaultFolderProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [documents, setDocuments] = useState<any[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const loadDocuments = useCallback(async () => {
    const docs = await getVaultDocumentsByFolder(folderName)
    setDocuments(docs)
  }, [folderName])

  useEffect(() => {
    if (isExpanded) {
      loadDocuments()
    }
  }, [isExpanded, loadDocuments])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    try {
      for (const file of Array.from(files)) {
        await uploadVaultFile(file, folderName)
      }
      await loadDocuments()
      onUpdate()
    } catch (error) {
      console.error('Failed to upload file:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (doc: any) => {
    if (!confirm(`Delete ${doc.name}?`)) return

    try {
      await deleteVaultDocument(doc.id, doc.file_url)
      await loadDocuments()
      onUpdate()
    } catch (error) {
      console.error('Failed to delete document:', error)
    }
  }

  const handleDownload = async (doc: any) => {
    try {
      const url = await getVaultFileDownloadUrl(doc.file_url)
      window.open(url, '_blank')
    } catch (error) {
      console.error('Failed to download file:', error)
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image size={16} className="text-blue-400" />
    if (fileType.includes('pdf')) return <FileText size={16} className="text-danger" />
    return <File size={16} className="text-text-muted" />
  }

  return (
    <div className="bg-[#0D0D14] border border-border-subtle rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-bg-elevated transition-colors"
      >
        <div className="flex items-center gap-3">
          {isExpanded ? <ChevronDown size={20} className="text-accent" /> : <ChevronRight size={20} className="text-text-muted" />}
          <span className="font-medium text-text-primary">📁 {folderName}</span>
          <span className="text-xs text-text-muted">({documents.length} files)</span>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border-subtle"
          >
            <div className="p-4 space-y-3">
              {/* Upload Zone */}
              <label className="block p-4 border-2 border-dashed border-border-subtle rounded-lg hover:border-accent transition-colors cursor-pointer">
                <div className="flex items-center justify-center gap-2 text-text-muted hover:text-accent transition-colors">
                  <Upload size={20} />
                  <span className="text-sm">
                    {isUploading ? 'Uploading...' : 'Click to upload or drag & drop'}
                  </span>
                </div>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>

              {/* Documents List */}
              {documents.length > 0 && (
                <div className="space-y-2">
                  {documents.map(doc => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 bg-bg-elevated rounded-lg hover:bg-bg-primary transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {getFileIcon(doc.file_type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-text-primary truncate">{doc.name}</p>
                          <p className="text-xs text-text-muted">
                            {new Date(doc.uploaded_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownload(doc)}
                          className="p-1.5 text-text-muted hover:text-accent hover:bg-accent/10 rounded transition-colors"
                          title="Download"
                        >
                          <Download size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(doc)}
                          className="p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {documents.length === 0 && !isUploading && (
                <p className="text-center text-sm text-text-muted py-4">
                  No documents in this folder yet
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
