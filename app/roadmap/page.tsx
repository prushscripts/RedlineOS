'use client'

import { useState } from 'react'
import PhaseCard from '@/components/roadmap/PhaseCard'
import { phases as initialPhases } from '@/lib/mockData'
import { Phase } from '@/types'

export default function RoadmapPage() {
  const [phases, setPhases] = useState<Phase[]>(initialPhases)
  
  const handleTaskToggle = (phaseId: number, taskId: string) => {
    setPhases(prevPhases =>
      prevPhases.map(phase =>
        phase.id === phaseId
          ? {
              ...phase,
              tasks: phase.tasks.map(task =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
              )
            }
          : phase
      )
    )
  }
  
  const isPhaseUnlocked = (phaseId: number): boolean => {
    if (phaseId === 1) return true
    
    const previousPhase = phases.find(p => p.id === phaseId - 1)
    if (!previousPhase) return false
    
    const completedTasks = previousPhase.tasks.filter(t => t.completed).length
    const totalTasks = previousPhase.tasks.length
    const progress = (completedTasks / totalTasks) * 100
    
    return progress >= 80
  }
  
  const getCurrentPhase = (): number => {
    for (let i = 0; i < phases.length; i++) {
      const phase = phases[i]
      const completedTasks = phase.tasks.filter(t => t.completed).length
      const totalTasks = phase.tasks.length
      const progress = (completedTasks / totalTasks) * 100
      
      if (progress < 100) return phase.id
    }
    return phases.length
  }
  
  const currentPhaseId = getCurrentPhase()
  
  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-4 sm:space-y-6 lg:space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-text-primary mb-2">
          Road to $1M
        </h1>
        <p className="text-sm sm:text-base text-text-muted">
          Track your progress through each phase of growth
        </p>
      </div>
      
      <div className="relative space-y-4 sm:space-y-6">
        {phases.map((phase, index) => {
          const isUnlocked = isPhaseUnlocked(phase.id)
          const isCurrent = phase.id === currentPhaseId
          
          return (
            <div key={phase.id} className="relative">
              <PhaseCard
                phase={phase}
                isUnlocked={isUnlocked}
                isCurrent={isCurrent}
                onTaskToggle={handleTaskToggle}
              />
              
              {index < phases.length - 1 && (
                <div className="absolute left-5 top-full w-0.5 h-6 bg-border-subtle" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
