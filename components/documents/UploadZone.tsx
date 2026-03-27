'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { uploadDocument } from '@/lib/documents'

interface UploadZoneProps {
  onUploadComplete?: () => void
}

export default function UploadZone({ onUploadComplete }: UploadZoneProps) {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFolder, setSelectedFolder] = useState('insurance')
  
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setError(null)
    
    try {
      const fileNames: string[] = []
      for (const file of Array.from(files)) {
        await uploadDocument(file, selectedFolder)
        fileNames.push(file.name)
      }
      setUploadedFiles(prev => [...fileNames, ...prev].slice(0, 5))
      onUploadComplete?.()
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }
  
  return (
    <Card>
      <h3 className="text-lg font-display font-semibold text-text-primary mb-4">
        Upload Documents
      </h3>
      
      <label className="block">
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="border-2 border-dashed border-border-subtle rounded-lg p-8 text-center hover:border-accent/50 hover:bg-accent/5 transition-all cursor-pointer">
          <Upload className="mx-auto mb-3 text-text-muted" size={32} />
          <p className="text-sm font-medium text-text-primary mb-1">
            Drop files here or click to upload
          </p>
          <p className="text-xs text-text-muted">
            PDF, Images, or Documents
          </p>
        </div>
      </label>
      
      {/* Error message */}
      {error && (
        <div className="mt-4 p-3 bg-accent/10 border border-accent/30 rounded-lg text-sm text-accent">
          {error}
        </div>
      )}
      
      {/* Folder selector */}
      <div className="mt-4">
        <label className="text-xs text-text-muted mb-2 block">Upload to folder:</label>
        <select
          value={selectedFolder}
          onChange={(e) => setSelectedFolder(e.target.value)}
          className="w-full px-3 py-2 bg-bg-elevated border border-border-subtle rounded-lg text-text-primary text-sm focus:outline-none focus:border-accent transition-colors"
        >
          <option value="insurance">Insurance</option>
          <option value="drivers">Drivers</option>
          <option value="vehicles">Vehicles</option>
          <option value="payroll">Payroll</option>
        </select>
      </div>
      
      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-text-muted">Recently Uploaded</p>
          {uploadedFiles.map((fileName, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-bg-elevated rounded-lg">
              <span className="text-sm text-text-primary truncate">{fileName}</span>
              <Badge variant="success" className="text-xs ml-2">New</Badge>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
