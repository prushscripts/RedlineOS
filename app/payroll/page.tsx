'use client'

import { useState, useEffect } from 'react'
import { Wallet, Plus } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { getDrivers } from '@/lib/db'
import { getAllDriverPay, getTotalPaidToDriver, getCurrentWeekPayout, getAverageWeeklyPayout } from '@/lib/payroll'
import { formatCurrency } from '@/lib/utils'
import PayWeekModal from '@/components/payroll/PayWeekModal'
import PayHistoryTable from '@/components/payroll/PayHistoryTable'

export default function PayrollPage() {
  const [drivers, setDrivers] = useState<any[]>([])
  const [payRecords, setPayRecords] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [totalJoseph, setTotalJoseph] = useState(0)
  const [totalMark, setTotalMark] = useState(0)
  const [thisWeekTotal, setThisWeekTotal] = useState(0)
  const [avgWeekly, setAvgWeekly] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [driversData, payData] = await Promise.all([
        getDrivers(),
        getAllDriverPay()
      ])
      
      setDrivers(driversData)
      setPayRecords(payData)

      // Calculate summary stats
      if (driversData.length >= 2) {
        const [joseph, mark] = driversData
        const josephTotal = await getTotalPaidToDriver(joseph.id)
        const markTotal = await getTotalPaidToDriver(mark.id)
        setTotalJoseph(josephTotal)
        setTotalMark(markTotal)
      }

      const weekTotal = await getCurrentWeekPayout()
      const avg = await getAverageWeeklyPayout(4)
      setThisWeekTotal(weekTotal)
      setAvgWeekly(avg)
    } catch (error) {
      console.error('Failed to load payroll data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handlePayLogged = () => {
    setShowModal(false)
    loadData()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary mb-2">
            Driver Pay Ledger
          </h1>
          <p className="text-text-muted">Weekly compensation records</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2"
        >
          <Plus size={20} />
          Log Pay Week
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Wallet className="text-accent" size={20} />
            </div>
            <p className="text-sm text-text-muted">Total - Joseph Pedro</p>
          </div>
          <p className="text-2xl font-mono font-bold text-text-primary">
            {formatCurrency(totalJoseph)}
          </p>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Wallet className="text-accent" size={20} />
            </div>
            <p className="text-sm text-text-muted">Total - Mark Parra</p>
          </div>
          <p className="text-2xl font-mono font-bold text-text-primary">
            {formatCurrency(totalMark)}
          </p>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-success/10 rounded-lg">
              <Wallet className="text-success" size={20} />
            </div>
            <p className="text-sm text-text-muted">This Week&apos;s Total</p>
          </div>
          <p className="text-2xl font-mono font-bold text-text-primary">
            {formatCurrency(thisWeekTotal)}
          </p>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Wallet className="text-blue-400" size={20} />
            </div>
            <p className="text-sm text-text-muted">Avg Weekly (Last 4)</p>
          </div>
          <p className="text-2xl font-mono font-bold text-text-primary">
            {formatCurrency(avgWeekly)}
          </p>
        </Card>
      </div>

      {/* Pay History Table */}
      <PayHistoryTable 
        payRecords={payRecords} 
        drivers={drivers}
        onUpdate={loadData}
      />

      {/* Pay Week Modal */}
      {showModal && (
        <PayWeekModal
          drivers={drivers}
          onClose={() => setShowModal(false)}
          onSuccess={handlePayLogged}
        />
      )}
    </div>
  )
}
