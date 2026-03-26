'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

interface UploadedFile {
  name: string
  timestamp: string
}

export default function UploadZone() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newFiles = Array.from(files).map(file => ({
        name: file.name,
        timestamp: new Date().toLocaleString()
      }))
      setUploadedFiles(prev => [...prev, ...newFiles])
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
      
      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-text-muted">Recently Uploaded</p>
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-bg-elevated rounded-lg">
              <span className="text-sm text-text-primary truncate">{file.name}</span>
              <Badge variant="success" className="text-xs ml-2">New</Badge>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
