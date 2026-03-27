'use client'

import { motion } from 'framer-motion'
import { Target } from 'lucide-react'
import Card from '@/components/ui/Card'
import ProgressBar from '@/components/ui/ProgressBar'
import { formatCurrency } from '@/lib/utils'

interface RoadTo1MBannerProps {
  weeklyProfit: number
  monthlyProjection: number
  yearlyProjection: number
  progressPercent: number
  remaining: number
}

export default function RoadTo1MBanner({
  weeklyProfit,
  monthlyProjection,
  yearlyProjection,
  progressPercent,
  remaining
}: RoadTo1MBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="relative overflow-hidden border-2 border-accent/20" glow>
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Target className="text-accent" size={24} />
            <h2 className="text-xl sm:text-2xl font-display font-bold text-text-primary">
              Road to $1,000,000
            </h2>
          </div>
          
          <ProgressBar progress={progressPercent} className="mb-4" />
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
            <div>
              <p className="text-xs text-text-muted mb-1">Weekly Profit</p>
              <p className="text-base sm:text-lg font-mono font-semibold text-success">
                {formatCurrency(weeklyProfit)}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-muted mb-1">Monthly Est.</p>
              <p className="text-base sm:text-lg font-mono font-semibold text-text-primary">
                {formatCurrency(monthlyProjection)}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-muted mb-1">Yearly Est.</p>
              <p className="text-base sm:text-lg font-mono font-semibold text-text-primary">
                {formatCurrency(yearlyProjection)}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-muted mb-1">% to Goal</p>
              <p className="text-base sm:text-lg font-mono font-semibold text-accent">
                {progressPercent.toFixed(1)}%
              </p>
            </div>
          </div>
          
          <p className="text-sm text-text-muted">
            {remaining >= 1000000 ? 'Log your first check to begin tracking' : `You are ${formatCurrency(remaining)} away from $1,000,000`}
          </p>
        </div>
      </Card>
    </motion.div>
  )
}
