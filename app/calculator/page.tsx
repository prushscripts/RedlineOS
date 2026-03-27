'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Copy, Save, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'
import Card from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { supabase } from '@/lib/supabase'

interface Allocation {
  category: string
  amount: number
  percentage: number
  color: string
}

interface CalculationResult {
  allocations: Allocation[]
  weeklyAdvice: string
  totalAllocated: number
}

function getWeekLabel() {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const monday = new Date(today)
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  monday.setDate(today.getDate() - daysFromMonday)
  const friday = new Date(monday)
  friday.setDate(monday.getDate() + 4)
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  
  return `Week of ${formatDate(monday)} – ${formatDate(friday)}, ${today.getFullYear()}`
}

export default function CalculatorPage() {
  const [grossPayment, setGrossPayment] = useState(0)
  const [josephPay, setJosephPay] = useState(750)
  const [markPay, setMarkPay] = useState(750)
  const [insurance, setInsurance] = useState(200)
  const [useAI, setUseAI] = useState(true)
  const [isCalculating, setIsCalculating] = useState(false)
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [highlightedCategory, setHighlightedCategory] = useState<string | null>(null)

  const weekLabel = getWeekLabel()
  const totalDriverPay = josephPay + markPay
  const remainingAmount = grossPayment - totalDriverPay - insurance

  // Load defaults from localStorage
  useEffect(() => {
    const savedJoseph = localStorage.getItem('calculator_joseph_pay')
    const savedMark = localStorage.getItem('calculator_mark_pay')
    const savedInsurance = localStorage.getItem('calculator_insurance')
    
    if (savedJoseph) setJosephPay(parseFloat(savedJoseph))
    if (savedMark) setMarkPay(parseFloat(savedMark))
    if (savedInsurance) setInsurance(parseFloat(savedInsurance))
  }, [])

  const saveDefaults = () => {
    localStorage.setItem('calculator_joseph_pay', josephPay.toString())
    localStorage.setItem('calculator_mark_pay', markPay.toString())
    localStorage.setItem('calculator_insurance', insurance.toString())
  }

  const handleCalculate = async () => {
    if (grossPayment <= 0) {
      setError('Please enter a valid payment amount')
      return
    }

    if (remainingAmount <= 0) {
      setError('No remaining amount to allocate after fixed expenses')
      return
    }

    setIsCalculating(true)
    setError(null)

    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grossPayment,
          driverPay: totalDriverPay,
          insurance,
          remainingAmount,
          weekLabel
        })
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Calculation failed')
      }

      setResult(data)
    } catch (err: any) {
      console.error('Calculation error:', err)
      setError(err.message || 'AI calculation unavailable. Check your API key in Vercel environment variables.')
    } finally {
      setIsCalculating(false)
    }
  }

  const handleSaveToWeeklyPayment = async () => {
    if (!result) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('Please log in to save')
        return
      }

      // Find the most recent weekly_checks record
      const { data: checks } = await supabase
        .from('weekly_checks')
        .select('*')
        .order('week_start', { ascending: false })
        .limit(1)

      if (checks && checks.length > 0) {
        await supabase
          .from('weekly_checks')
          .update({ ai_allocation: result })
          .eq('id', checks[0].id)
        
        alert('Allocation saved to this week\'s payment ✓')
      } else {
        alert('No weekly payment found. Log a payment first on the Dashboard.')
      }
    } catch (err) {
      console.error('Save error:', err)
      alert('Failed to save allocation')
    }
  }

  const handleCopySummary = () => {
    if (!result) return

    const summary = `
AI Money Allocation - ${weekLabel}

Gross Payment: ${formatCurrency(grossPayment)}
Driver Pay (Joseph): -${formatCurrency(josephPay)}
Driver Pay (Mark): -${formatCurrency(markPay)}
Insurance: -${formatCurrency(insurance)}
Remaining to Allocate: ${formatCurrency(remainingAmount)}

ALLOCATION BREAKDOWN:
${result.allocations.map(a => `${a.category}: ${formatCurrency(a.amount)} (${a.percentage.toFixed(1)}%)`).join('\n')}

Total Allocated: ${formatCurrency(result.totalAllocated)}

This Week's Advice: ${result.weeklyAdvice}
    `.trim()

    navigator.clipboard.writeText(summary)
    alert('Summary copied to clipboard ✓')
  }

  const handleRecalculate = () => {
    setResult(null)
    setError(null)
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-text-primary mb-2">
          AI Money Calculator
        </h1>
        <p className="text-text-muted">
          Enter your weekly payment and get an instant allocation breakdown.
        </p>
      </div>

      {/* Input Section */}
      <Card>
        <div className="space-y-6">
          {/* Weekly Payment */}
          <div>
            <label className="text-xs text-text-muted mb-2 block">This Week's Payment</label>
            <input
              type="number"
              value={grossPayment || ''}
              onChange={(e) => setGrossPayment(parseFloat(e.target.value) || 0)}
              placeholder="$0.00"
              className="w-full px-6 py-4 bg-bg-elevated border border-border-subtle rounded-lg text-text-primary text-4xl font-display font-bold text-center focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* Fixed Expenses */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-3">Fixed Expenses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-text-muted mb-1.5 block">Joseph Pedro Pay</label>
                <input
                  type="number"
                  value={josephPay || ''}
                  onChange={(e) => setJosephPay(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 bg-bg-elevated border border-border-subtle rounded-lg text-text-primary font-mono focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-text-muted mb-1.5 block">Mark Parra Pay</label>
                <input
                  type="number"
                  value={markPay || ''}
                  onChange={(e) => setMarkPay(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 bg-bg-elevated border border-border-subtle rounded-lg text-text-primary font-mono focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>
            <p className="text-sm text-text-muted mt-2">
              Total Driver Pay: <span className="font-mono text-text-primary">{formatCurrency(totalDriverPay)}</span>
            </p>
          </div>

          {/* Insurance */}
          <div>
            <label className="text-xs text-text-muted mb-1.5 block">Insurance Reserve</label>
            <input
              type="number"
              value={insurance || ''}
              onChange={(e) => setInsurance(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2.5 bg-bg-elevated border border-border-subtle rounded-lg text-text-primary font-mono focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* AI Toggle */}
          <div className="flex items-center justify-between p-4 bg-bg-elevated rounded-lg">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-accent" />
              <span className="text-sm font-medium text-text-primary">Use AI Recommendations</span>
            </div>
            <button
              onClick={() => setUseAI(!useAI)}
              className={`relative w-12 h-6 rounded-full transition-colors ${useAI ? 'bg-accent' : 'bg-border-subtle'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${useAI ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Real-time Preview */}
          <div className="p-4 bg-bg-elevated border border-border-subtle rounded-lg">
            <div className="space-y-2 text-sm font-mono">
              <div className="flex justify-between">
                <span className="text-text-muted">Gross Payment:</span>
                <span className="text-text-primary">{formatCurrency(grossPayment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Driver Pay (Joseph):</span>
                <span className="text-text-primary">- {formatCurrency(josephPay)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Driver Pay (Mark):</span>
                <span className="text-text-primary">- {formatCurrency(markPay)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Insurance:</span>
                <span className="text-text-primary">- {formatCurrency(insurance)}</span>
              </div>
              <div className="border-t border-border-subtle pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-text-muted font-semibold">Remaining:</span>
                  <span className={`font-bold ${remainingAmount >= 0 ? 'text-success' : 'text-accent'}`}>
                    {formatCurrency(remainingAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Calculate Button */}
          <button
            onClick={handleCalculate}
            disabled={isCalculating || !useAI}
            className="w-full py-4 bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-white font-semibold rounded-lg transition-colors text-lg"
          >
            {isCalculating ? 'Calculating...' : 'Calculate'}
          </button>
        </div>
      </Card>

      {/* Loading State */}
      <AnimatePresence>
        {isCalculating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="text-center py-12">
              <div className="relative mb-4">
                <div className="w-full h-1 bg-bg-elevated rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-accent"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                  />
                </div>
              </div>
              <p className="text-text-muted mb-1">Calculating optimal allocation...</p>
              <p className="text-xs text-accent">Powered by Claude AI</p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-accent/10 border-accent/30">
            <p className="text-accent">{error}</p>
          </Card>
        </motion.div>
      )}

      {/* Results Display */}
      <AnimatePresence>
        {result && !isCalculating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-display font-bold text-text-primary">
                Your Allocation for {weekLabel}
              </h2>
              <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left - Allocation Breakdown */}
              <Card>
                <h3 className="text-lg font-semibold text-text-primary mb-4">Breakdown</h3>
                <div className="space-y-3">
                  {result.allocations.map((allocation, index) => (
                    <motion.div
                      key={allocation.category}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-3 rounded-lg border-l-4 transition-all ${
                        highlightedCategory === allocation.category
                          ? 'bg-white/5 scale-105'
                          : 'bg-bg-elevated'
                      }`}
                      style={{ borderLeftColor: allocation.color }}
                      onMouseEnter={() => setHighlightedCategory(allocation.category)}
                      onMouseLeave={() => setHighlightedCategory(null)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-text-primary text-sm">
                          {allocation.category}
                        </span>
                        <span className="font-mono font-bold text-lg" style={{ color: allocation.color }}>
                          {formatCurrency(allocation.amount)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-bg-base rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${allocation.percentage}%`,
                              backgroundColor: allocation.color
                            }}
                          />
                        </div>
                        <span className="text-xs text-text-muted font-mono">
                          {allocation.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </motion.div>
                  ))}
                  
                  <div className="border-t border-border-subtle pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-text-muted">TOTAL ALLOCATED</span>
                      <span className="font-mono font-bold text-xl text-success">
                        {formatCurrency(result.totalAllocated)}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Right - Pie Chart */}
              <Card>
                <h3 className="text-lg font-semibold text-text-primary mb-4">Visual Breakdown</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={result.allocations}
                      dataKey="amount"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={(entry) => `${entry.percentage.toFixed(0)}%`}
                    >
                      {result.allocations.map((allocation, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={allocation.color}
                          opacity={highlightedCategory === allocation.category ? 1 : 0.8}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: '#0D0D14',
                        border: '1px solid #1E1E2E',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: '12px' }}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* AI Advice */}
            <Card className="bg-accent/5 border-accent/20">
              <div className="flex items-start gap-3">
                <Sparkles size={20} className="text-accent mt-1" />
                <div>
                  <h4 className="text-xs font-semibold text-accent uppercase tracking-wider mb-2">
                    This Week's Advice
                  </h4>
                  <p className="text-text-primary italic">
                    {result.weeklyAdvice}
                  </p>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={handleSaveToWeeklyPayment}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-success hover:bg-success/90 text-white font-semibold rounded-lg transition-colors"
              >
                <Save size={18} />
                Save to This Week's Payment
              </button>
              <button
                onClick={handleCopySummary}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-bg-elevated hover:bg-bg-elevated/80 border border-border-subtle text-text-primary font-semibold rounded-lg transition-colors"
              >
                <Copy size={18} />
                Copy Summary
              </button>
              <button
                onClick={handleRecalculate}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-bg-elevated hover:bg-bg-elevated/80 border border-border-subtle text-text-primary font-semibold rounded-lg transition-colors"
              >
                <RefreshCw size={18} />
                Recalculate
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Section */}
      <Card>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="w-full flex items-center justify-between"
        >
          <h3 className="text-lg font-semibold text-text-primary">Customize Defaults</h3>
          {showSettings ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 space-y-4 overflow-hidden"
            >
              <p className="text-sm text-text-muted">
                Set default values that will pre-fill the calculator every time you visit this page.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-text-muted mb-1.5 block">Joseph Pedro Weekly Pay</label>
                  <input
                    type="number"
                    value={josephPay || ''}
                    onChange={(e) => setJosephPay(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 bg-bg-elevated border border-border-subtle rounded-lg text-text-primary font-mono focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-text-muted mb-1.5 block">Mark Parra Weekly Pay</label>
                  <input
                    type="number"
                    value={markPay || ''}
                    onChange={(e) => setMarkPay(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 bg-bg-elevated border border-border-subtle rounded-lg text-text-primary font-mono focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-text-muted mb-1.5 block">Default Insurance Set-Aside</label>
                  <input
                    type="number"
                    value={insurance || ''}
                    onChange={(e) => setInsurance(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 bg-bg-elevated border border-border-subtle rounded-lg text-text-primary font-mono focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
              </div>
              
              <button
                onClick={saveDefaults}
                className="px-6 py-2 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg transition-colors"
              >
                Save Defaults
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  )
}
