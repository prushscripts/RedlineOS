'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, LockOpen, Plus } from 'lucide-react'
import { useVault } from '@/contexts/VaultContext'
import { hasVaultPin, setupVaultPin, verifyVaultPin, getVaultFolders } from '@/lib/vault'
import VaultSetupPin from '@/components/vault/VaultSetupPin'
import VaultPinEntry from '@/components/vault/VaultPinEntry'
import VaultFolder from '@/components/vault/VaultFolder'
import Button from '@/components/ui/Button'

const DEFAULT_FOLDERS = ['Insurance', 'Contracts', 'Banking', 'Tax Documents']

export default function VaultPage() {
  const router = useRouter()
  const { isUnlocked, unlock, lock, updateActivity } = useVault()
  const [hasPinSetup, setHasPinSetup] = useState<boolean | null>(null)
  const [folders, setFolders] = useState<string[]>([])
  const [showNewFolder, setShowNewFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')

  useEffect(() => {
    checkPinSetup()
  }, [])

  useEffect(() => {
    if (isUnlocked) {
      loadFolders()
    }
  }, [isUnlocked])

  const checkPinSetup = async () => {
    const hasPin = await hasVaultPin()
    setHasPinSetup(hasPin)
  }

  const loadFolders = async () => {
    const existingFolders = await getVaultFolders()
    const allFolders = [...new Set([...DEFAULT_FOLDERS, ...existingFolders])]
    setFolders(allFolders)
  }

  const handleSetupComplete = async (pin: string) => {
    await setupVaultPin(pin)
    setHasPinSetup(true)
    unlock()
  }

  const handlePinVerified = async (pin: string) => {
    return await verifyVaultPin(pin)
  }

  const handleUnlockSuccess = () => {
    unlock()
  }

  const handleLock = () => {
    lock()
    router.push('/vault')
  }

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      setFolders([...folders, newFolderName.trim()])
      setNewFolderName('')
      setShowNewFolder(false)
    }
  }

  // Track user activity
  const handleActivity = () => {
    if (isUnlocked) {
      updateActivity()
    }
  }

  if (hasPinSetup === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-text-muted">Loading...</p>
      </div>
    )
  }

  if (!hasPinSetup) {
    return <VaultSetupPin onComplete={handleSetupComplete} />
  }

  if (!isUnlocked) {
    return <VaultPinEntry onSuccess={handleUnlockSuccess} onVerify={handlePinVerified} />
  }

  return (
    <div className="space-y-6" onClick={handleActivity}>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <LockOpen className="text-success" size={24} />
            <h1 className="text-3xl font-display font-bold text-text-primary">
              Private Vault
            </h1>
          </div>
          <p className="text-text-muted">Secure document storage</p>
        </div>
        <Button
          variant="secondary"
          onClick={handleLock}
          className="flex items-center gap-2"
        >
          <Lock size={16} />
          Lock Vault
        </Button>
      </div>

      <div className="p-4 bg-[#0D0D14] border border-success/20 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-sm text-success">Vault Open</span>
          </div>
          <span className="text-xs text-text-muted">Auto-locks after 10 minutes of inactivity</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-display font-semibold text-text-primary">Folders</h2>
        {!showNewFolder && (
          <Button
            variant="secondary"
            onClick={() => setShowNewFolder(true)}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            New Folder
          </Button>
        )}
      </div>

      {showNewFolder && (
        <div className="p-4 bg-bg-elevated rounded-lg border border-border-subtle mb-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="flex-1 px-4 py-2 bg-bg-primary border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddFolder()
                if (e.key === 'Escape') setShowNewFolder(false)
              }}
            />
            <Button variant="primary" onClick={handleAddFolder}>
              Create
            </Button>
            <Button variant="secondary" onClick={() => setShowNewFolder(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {folders.map(folder => (
          <VaultFolder key={folder} folderName={folder} onUpdate={loadFolders} />
        ))}
      </div>

      {folders.length === 0 && (
        <div className="text-center py-12">
          <Lock className="mx-auto text-text-muted mb-4" size={48} />
          <p className="text-text-muted">No folders yet. Create your first folder to get started.</p>
        </div>
      )}
    </div>
  )
}
