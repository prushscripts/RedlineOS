'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'

interface EditableFieldProps {
  value: string | number
  onSave: (value: string | number) => Promise<void>
  type?: 'text' | 'number'
  className?: string
}

export default function EditableField({ value, onSave, type = 'text', className = '' }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value.toString())
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const finalValue = type === 'number' ? parseFloat(editValue) : editValue
      await onSave(finalValue)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to save:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditValue(value.toString())
    setIsEditing(false)
  }

  if (!isEditing) {
    return (
      <span
        onClick={() => setIsEditing(true)}
        className={`cursor-pointer hover:text-accent transition-colors ${className}`}
      >
        {value}
      </span>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type={type}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        className="px-2 py-1 bg-bg-elevated border border-accent rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
        autoFocus
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSave()
          if (e.key === 'Escape') handleCancel()
        }}
      />
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="p-1 text-success hover:bg-success/10 rounded transition-colors"
      >
        <Check size={16} />
      </button>
      <button
        onClick={handleCancel}
        disabled={isSaving}
        className="p-1 text-danger hover:bg-danger/10 rounded transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  )
}
