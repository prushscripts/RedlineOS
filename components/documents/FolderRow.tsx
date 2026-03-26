'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, FileText, Image as ImageIcon, File } from 'lucide-react'
import { FleetDocument } from '@/types'
import Badge from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

interface FolderRowProps {
  title: string
  icon: React.ReactNode
  documents: FleetDocument[]
}

export default function FolderRow({ title, icon, documents }: FolderRowProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
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
              {documents.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between p-3 bg-bg-elevated rounded-lg hover:bg-bg-elevated/80 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {getFileIcon(doc.type)}
                    <div>
                      <p className="text-sm font-medium text-text-primary">{doc.name}</p>
                      <p className="text-xs text-text-muted">Uploaded {doc.uploadedAt}</p>
                    </div>
                  </div>
                  <Badge variant="default" className="text-xs">{doc.type}</Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
