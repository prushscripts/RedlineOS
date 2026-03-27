'use client'

import { useState, useEffect } from 'react'
import { Shield, User, Truck, DollarSign } from 'lucide-react'
import FolderRow from '@/components/documents/FolderRow'
import UploadZone from '@/components/documents/UploadZone'
import { getDocuments } from '@/lib/documents'

export default function DocumentsPage() {
  const [allDocuments, setAllDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      const docs = await getDocuments()
      setAllDocuments(docs)
    } catch (error) {
      console.error('Failed to load documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const insuranceDocs = allDocuments.filter(d => d.folder === 'insurance')
  const driverDocs = allDocuments.filter(d => d.folder === 'drivers')
  const vehicleDocs = allDocuments.filter(d => d.folder === 'vehicles')
  const payrollDocs = allDocuments.filter(d => d.folder === 'payroll')
  
  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-4 sm:space-y-6 lg:space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-text-primary mb-2">
          Document Vault
        </h1>
        <p className="text-sm sm:text-base text-text-muted">
          Organize and access all your business documents
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4">
          <FolderRow
            title="Insurance"
            icon={<Shield className="text-blue-400" size={20} />}
            folder="insurance"
            documents={insuranceDocs}
            onUpdate={loadDocuments}
          />
          <FolderRow
            title="Drivers"
            icon={<User className="text-success" size={20} />}
            folder="drivers"
            documents={driverDocs}
            onUpdate={loadDocuments}
          />
          <FolderRow
            title="Vehicles"
            icon={<Truck className="text-accent" size={20} />}
            folder="vehicles"
            documents={vehicleDocs}
            onUpdate={loadDocuments}
          />
          <FolderRow
            title="Payroll"
            icon={<DollarSign className="text-warning" size={20} />}
            folder="payroll"
            documents={payrollDocs}
            onUpdate={loadDocuments}
          />
        </div>
        
        <div>
          <UploadZone onUploadComplete={loadDocuments} />
        </div>
      </div>
    </div>
  )
}
