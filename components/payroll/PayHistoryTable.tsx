'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import Card from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'
import { deleteDriverPay } from '@/lib/payroll'
import { getWeeklyChecks } from '@/lib/checks'

interface PayHistoryTableProps {
  payRecords: any[]
  drivers: any[]
  onUpdate: () => void
}

export default function PayHistoryTable({ payRecords, drivers, onUpdate }: PayHistoryTableProps) {
  const [tab, setTab] = useState<'all' | 'by-driver'>('all')
  const [selectedDriver, setSelectedDriver] = useState<string>('')

  // Group pay records by week
  const weekGroups = payRecords.reduce((groups, record) => {
    const key = record.week_start
    if (!groups[key]) {
      groups[key] = {
        week_start: record.week_start,
        week_label: record.week_label,
        records: []
      }
    }
    groups[key].records.push(record)
    return groups
  }, {} as Record<string, any>)

  const weeks = Object.values(weekGroups).sort((a: any, b: any) => 
    b.week_start.localeCompare(a.week_start)
  )

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this pay record?')) return
    
    try {
      await deleteDriverPay(id)
      onUpdate()
    } catch (error) {
      console.error('Failed to delete pay record:', error)
    }
  }

  const getDriverName = (driverId: string) => {
    const driver = drivers.find(d => d.id === driverId)
    return driver ? driver.name : 'Unknown'
  }

  if (tab === 'by-driver') {
    const driverRecords = selectedDriver 
      ? payRecords.filter(r => r.driver_id === selectedDriver)
      : []

    return (
      <Card>
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setTab('all')}
            className="text-sm text-text-muted hover:text-accent transition-colors"
          >
            ← Back to All Drivers
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          {drivers.map(driver => (
            <button
              key={driver.id}
              onClick={() => setSelectedDriver(driver.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedDriver === driver.id
                  ? 'bg-accent text-white'
                  : 'bg-bg-elevated text-text-muted hover:text-text-primary'
              }`}
            >
              {driver.name}
            </button>
          ))}
        </div>

        {selectedDriver && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Week</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Pay Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Truck</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Notes</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {driverRecords.map(record => {
                  const driver = drivers.find(d => d.id === record.driver_id)
                  return (
                    <tr key={record.id} className="border-b border-border-subtle/50">
                      <td className="py-3 px-4 text-sm text-text-primary">{record.week_label}</td>
                      <td className="py-3 px-4 text-sm font-mono text-text-primary">
                        {formatCurrency(record.amount)}
                      </td>
                      <td className="py-3 px-4 text-sm text-text-muted">
                        {driver?.truck_id || 'Unassigned'}
                      </td>
                      <td className="py-3 px-4 text-sm text-text-muted">
                        {record.notes || '—'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="p-1 text-danger hover:bg-danger/10 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    )
  }

  return (
    <Card>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setTab('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'all'
              ? 'bg-accent text-white'
              : 'bg-bg-elevated text-text-muted hover:text-text-primary'
          }`}
        >
          All Drivers
        </button>
        <button
          onClick={() => {
            setTab('by-driver')
            if (drivers.length > 0) setSelectedDriver(drivers[0].id)
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'by-driver'
              ? 'bg-accent text-white'
              : 'bg-bg-elevated text-text-muted hover:text-text-primary'
          }`}
        >
          By Driver
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-subtle">
              <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Week</th>
              {drivers.map(driver => (
                <th key={driver.id} className="text-left py-3 px-4 text-sm font-medium text-text-muted">
                  {driver.name}
                </th>
              ))}
              <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Total Paid</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {weeks.map((week: any) => {
              const totalPaid = week.records.reduce((sum: number, r: any) => sum + r.amount, 0)
              
              return (
                <tr key={week.week_start} className="border-b border-border-subtle/50">
                  <td className="py-3 px-4 text-sm text-text-primary">{week.week_label}</td>
                  {drivers.map(driver => {
                    const record = week.records.find((r: any) => r.driver_id === driver.id)
                    return (
                      <td key={driver.id} className="py-3 px-4 text-sm font-mono text-text-primary">
                        {record ? formatCurrency(record.amount) : '—'}
                      </td>
                    )
                  })}
                  <td className="py-3 px-4 text-sm font-mono font-bold text-text-primary">
                    {formatCurrency(totalPaid)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        week.records.forEach((r: any) => handleDelete(r.id))
                      }}
                      className="p-1 text-danger hover:bg-danger/10 rounded transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {weeks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-text-muted">No pay records yet. Click &quot;Log Pay Week&quot; to get started.</p>
        </div>
      )}
    </Card>
  )
}
