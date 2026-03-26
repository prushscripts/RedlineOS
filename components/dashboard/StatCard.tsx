'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { formatCurrency, formatNumber } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: number
  icon: LucideIcon
  format?: 'currency' | 'number'
  change?: number
  index?: number
}

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  format = 'number',
  change,
  index = 0 
}: StatCardProps) {
  const formattedValue = format === 'currency' ? formatCurrency(value) : formatNumber(value)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
    >
      <Card hover>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-text-muted mb-1">{title}</p>
            <motion.h3 
              className="text-3xl font-display font-bold text-text-primary tabular-nums"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.08 + 0.2, duration: 0.6 }}
            >
              {formattedValue}
            </motion.h3>
            {change !== undefined && (
              <div className="mt-2">
                <Badge variant={change >= 0 ? 'success' : 'danger'}>
                  {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                </Badge>
              </div>
            )}
          </div>
          <div className="p-3 bg-accent/10 rounded-lg">
            <Icon className="text-accent" size={24} />
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
