'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Lock, CheckCircle2, Circle } from 'lucide-react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import ProgressBar from '@/components/ui/ProgressBar'
import { Phase } from '@/types'

interface PhaseCardProps {
  phase: Phase
  isUnlocked: boolean
  isCurrent: boolean
  onTaskToggle: (phaseId: number, taskId: string) => void
}

export default function PhaseCard({ phase, isUnlocked, isCurrent, onTaskToggle }: PhaseCardProps) {
  const [isExpanded, setIsExpanded] = useState(isCurrent)
  
  const completedTasks = phase.tasks.filter(t => t.completed).length
  const totalTasks = phase.tasks.length
  const progress = (completedTasks / totalTasks) * 100
  
  return (
    <div className="relative">
      <Card 
        className={isCurrent ? 'border-2 border-accent/40' : ''} 
        glow={isCurrent}
      >
        <button
          onClick={() => isUnlocked && setIsExpanded(!isExpanded)}
          className="w-full text-left"
          disabled={!isUnlocked}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-bold ${
                isCurrent ? 'bg-accent text-white' : 'bg-bg-elevated text-text-muted'
              }`}>
                {phase.id}
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-text-primary flex items-center gap-2">
                  {phase.name}
                  {!isUnlocked && <Lock size={16} className="text-text-muted" />}
                </h3>
                <p className="text-sm text-text-muted">{phase.revenueTarget}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={progress === 100 ? 'success' : 'default'}>
                {completedTasks}/{totalTasks}
              </Badge>
              {isUnlocked && (
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={20} className="text-text-muted" />
                </motion.div>
              )}
            </div>
          </div>
          
          <ProgressBar 
            progress={progress} 
            variant={progress === 100 ? 'success' : 'default'}
          />
          
          <p className="text-xs text-text-muted mt-3">
            <span className="font-semibold">Unlock:</span> {phase.unlockCondition}
          </p>
        </button>
        
        <AnimatePresence>
          {isExpanded && isUnlocked && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-border-subtle space-y-2">
                {phase.tasks.map((task) => (
                  <motion.button
                    key={task.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      onTaskToggle(phase.id, task.id)
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-bg-elevated transition-colors text-left"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="text-success flex-shrink-0" size={20} />
                    ) : (
                      <Circle className="text-text-muted flex-shrink-0" size={20} />
                    )}
                    <span className={`text-sm ${
                      task.completed ? 'text-text-muted line-through' : 'text-text-primary'
                    }`}>
                      {task.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  )
}
