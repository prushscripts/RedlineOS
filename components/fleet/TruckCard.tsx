'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Truck as TruckIcon, User, Receipt, ClipboardList, Upload, Trash2, Download, Edit, X } from 'lucide-react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { Truck, Driver } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { useIsOwner } from '@/hooks/useIsOwner'

interface TruckCardProps {
  truck: Truck
  driver: Driver | undefined
  onRevenueChange: (truckId: string, newRevenue: number) => void
}

type TabType = 'overview' | 'invoices' | 'log'

interface Invoice {
  id: string
  name: string
  invoiceNumber?: string
  amount: number
  date: string
  description: string
  status: 'pending' | 'paid' | 'overdue'
}

interface TruckNote {
  id: string
  author: string
  content: string
  timestamp: string
}

export default function TruckCard({ truck, driver, onRevenueChange }: TruckCardProps) {
  const { isOwner } = useIsOwner()
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [revenue, setRevenue] = useState(truck.weeklyRevenue)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [notes, setNotes] = useState<TruckNote[]>([])
  const [newNote, setNewNote] = useState('')
  const [showEditPanel, setShowEditPanel] = useState(false)
  
  const netProfit = revenue - truck.fuelCost - truck.otherCosts
  
  const handleRevenueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0
    setRevenue(value)
    onRevenueChange(truck.id, value)
  }

  const handleAddNote = () => {
    if (!newNote.trim()) return
    const note: TruckNote = {
      id: Date.now().toString(),
      author: 'James',
      content: newNote,
      timestamp: new Date().toISOString()
    }
    setNotes([note, ...notes])
    setNewNote('')
  }

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id))
  }

  const handleStatusCycle = (invoiceId: string) => {
    setInvoices(invoices.map(inv => {
      if (inv.id === invoiceId) {
        const statusOrder: Array<'pending' | 'paid' | 'overdue'> = ['pending', 'paid', 'overdue']
        const currentIndex = statusOrder.indexOf(inv.status)
        const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length]
        return { ...inv, status: nextStatus }
      }
      return inv
    }))
  }

  const handleDeleteInvoice = (id: string) => {
    setInvoices(invoices.filter(inv => inv.id !== id))
  }

  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success'
      case 'pending': return 'warning'
      case 'overdue': return 'danger'
      default: return 'default'
    }
  }

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview' },
    { id: 'invoices' as TabType, label: 'Invoices' },
    { id: 'log' as TabType, label: 'Truck Log' }
  ]

  return (
    <Card hover className="w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-accent/10 rounded-lg">
            <TruckIcon className="text-accent" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-display font-semibold text-text-primary">
              {truck.name}
            </h3>
            <Badge variant="info" className="mt-1">{truck.route}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={truck.status === 'active' ? 'success' : 'default'}>
            {truck.status}
          </Badge>
          {isOwner && (
            <button
              onClick={() => setShowEditPanel(!showEditPanel)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <Edit size={16} className="text-text-muted" />
            </button>
          )}
        </div>
      </div>

      {driver && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-bg-elevated rounded-lg">
          <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
            <User className="text-accent" size={16} />
          </div>
          <div>
            <p className="text-xs text-text-muted">Driver</p>
            <p className="text-sm font-medium text-text-primary">{driver.name}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b border-border-subtle overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-accent border-b-2 border-accent'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-3 min-h-[200px]"
          >
            <div>
              <label className="text-xs text-text-muted mb-1 block">Weekly Revenue</label>
              <input
                type="number"
                value={revenue}
                onChange={handleRevenueChange}
                disabled={!isOwner}
                className="w-full px-3 py-2 bg-bg-elevated border border-border-subtle rounded-lg text-text-primary font-mono focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-text-muted mb-1">Fuel Cost</p>
                <p className="text-sm font-mono text-text-primary">{formatCurrency(truck.fuelCost)}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1">Other Costs</p>
                <p className="text-sm font-mono text-text-primary">{formatCurrency(truck.otherCosts)}</p>
              </div>
            </div>
            
            <div className="pt-3 border-t border-border-subtle">
              <p className="text-xs text-text-muted mb-1">Net Profit</p>
              <p className="text-2xl font-mono font-bold text-success">
                {formatCurrency(netProfit)}
              </p>
            </div>
          </motion.div>
        )}

        {activeTab === 'invoices' && (
          <motion.div
            key="invoices"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="min-h-[200px]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Receipt size={18} className="text-accent" />
                <h4 className="text-sm font-semibold text-text-primary">Invoices</h4>
              </div>
              {isOwner && (
                <button className="flex items-center gap-2 px-3 py-1.5 bg-accent hover:bg-accent/90 text-white text-xs rounded-lg transition-colors">
                  <Upload size={14} />
                  Upload Invoice
                </button>
              )}
            </div>

            {invoices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Receipt size={32} className="text-text-muted mb-2 opacity-50" />
                <p className="text-sm text-text-muted">No invoices uploaded yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {invoices.map(invoice => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 bg-bg-elevated rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-text-primary">{invoice.name}</p>
                        {isOwner ? (
                          <button onClick={() => handleStatusCycle(invoice.id)}>
                            <Badge variant={getStatusColor(invoice.status) as any}>
                              {invoice.status}
                            </Badge>
                          </button>
                        ) : (
                          <Badge variant={getStatusColor(invoice.status) as any}>
                            {invoice.status}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-text-muted">{invoice.description}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-text-muted">{formatDate(invoice.date)}</span>
                        <span className="text-xs font-mono text-text-primary">{formatCurrency(invoice.amount)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 hover:bg-white/5 rounded transition-colors">
                        <Download size={14} className="text-text-muted" />
                      </button>
                      {isOwner && (
                        <button 
                          onClick={() => handleDeleteInvoice(invoice.id)}
                          className="p-1.5 hover:bg-white/5 rounded transition-colors"
                        >
                          <Trash2 size={14} className="text-accent" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'log' && (
          <motion.div
            key="log"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="min-h-[200px]"
          >
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList size={18} className="text-accent" />
              <h4 className="text-sm font-semibold text-text-primary">Truck Log</h4>
            </div>

            {isOwner && (
              <div className="mb-4">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note... e.g. Replaced battery, oil change due, tire rotation completed"
                  className="w-full px-3 py-2 bg-bg-elevated border border-border-subtle rounded-lg text-text-primary text-sm focus:outline-none focus:border-accent transition-colors resize-none"
                  rows={2}
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleAddNote}
                    className="px-4 py-1.5 bg-accent hover:bg-accent/90 text-white text-xs rounded-lg transition-colors"
                  >
                    + Add Note
                  </button>
                </div>
              </div>
            )}

            {notes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <ClipboardList size={32} className="text-text-muted mb-2 opacity-50" />
                <p className="text-sm text-text-muted">No notes yet. Log your first entry.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notes.map(note => (
                  <div key={note.id} className="flex gap-3 p-3 bg-bg-elevated rounded-lg group">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-semibold">JP</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-text-primary font-medium mb-1">{note.author}</p>
                      <p className="text-sm text-text-muted mb-1">{note.content}</p>
                      <p className="text-xs text-text-faint">
                        {formatDate(note.timestamp)} · {formatTime(note.timestamp)}
                      </p>
                    </div>
                    {isOwner && (
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/5 rounded transition-all"
                      >
                        <Trash2 size={14} className="text-accent" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
