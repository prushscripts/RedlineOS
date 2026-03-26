'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Card from '@/components/ui/Card'
import { WeeklySnapshot } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface ProfitLineChartProps {
  data: WeeklySnapshot[]
}

export default function ProfitLineChart({ data }: ProfitLineChartProps) {
  return (
    <Card>
      <h3 className="text-lg font-display font-semibold text-text-primary mb-4">
        Profit Trend (Last 8 Weeks)
      </h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <defs>
            <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" />
          <XAxis 
            dataKey="week" 
            stroke="#64748B"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#64748B"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1A1A24',
              border: '1px solid #1E1E2E',
              borderRadius: '8px',
              color: '#F1F5F9'
            }}
            formatter={(value: number) => [formatCurrency(value), 'Profit']}
          />
          <Line 
            type="monotone" 
            dataKey="profit" 
            stroke="#EF4444" 
            strokeWidth={3}
            fill="url(#profitGradient)"
            dot={{ fill: '#EF4444', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
