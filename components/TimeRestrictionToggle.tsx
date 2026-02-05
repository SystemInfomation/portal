'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, Lock, Unlock } from 'lucide-react'

export function TimeRestrictionToggle() {
  const [isEnabled, setIsEnabled] = useState(true)

  useEffect(() => {
    // Load saved preference on mount
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('forsyth-time-restriction-enabled')
      // Default to true if not set, false if explicitly disabled
      setIsEnabled(saved === null ? true : saved === 'true')
    }
  }, [])

  const toggleRestriction = () => {
    const newValue = !isEnabled
    setIsEnabled(newValue)
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('forsyth-time-restriction-enabled', newValue.toString())
      
      // If we're disabling the restriction and currently on locked page, redirect to home
      if (!newValue && window.location.pathname.includes('/locked')) {
        window.location.href = '/'
      }
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass rounded-2xl border border-border p-8 space-y-4"
    >
      <div className="flex items-center gap-3">
        <Clock className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold text-primary">After School Hours Lock</h2>
      </div>
      
      <p className="text-muted-foreground text-sm">
        Control when the portal can be accessed. When enabled, the portal is only available during school hours (6 AM - 5 PM ET).
      </p>

      <div className="mt-6">
        <button
          onClick={toggleRestriction}
          className={`w-full p-4 rounded-xl border-2 transition-all ${
            isEnabled
              ? 'border-red-500/50 bg-red-500/10 hover:border-red-500'
              : 'border-green-500/50 bg-green-500/10 hover:border-green-500'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isEnabled ? (
                <Lock className="w-8 h-8 text-red-400" />
              ) : (
                <Unlock className="w-8 h-8 text-green-400" />
              )}
              <div className="text-left">
                <div className="font-semibold text-foreground text-lg">
                  {isEnabled ? 'Time Restriction Enabled' : 'Time Restriction Disabled'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {isEnabled 
                    ? 'Portal locked outside 6 AM - 5 PM ET' 
                    : 'Portal accessible at any time'}
                </div>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-lg font-semibold ${
              isEnabled 
                ? 'bg-red-500/20 text-red-400' 
                : 'bg-green-500/20 text-green-400'
            }`}>
              {isEnabled ? 'ON' : 'OFF'}
            </div>
          </div>
        </button>
      </div>

      {!isEnabled && (
        <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-sm text-green-200/80">
            <strong>✓ Time restriction disabled:</strong> You can now access the portal at any time, including after school hours.
          </p>
        </div>
      )}

      {isEnabled && (
        <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-sm text-yellow-200/80">
            <strong>Note:</strong> The portal will only be accessible during school hours (6 AM - 5 PM Eastern Time) when this setting is enabled.
          </p>
        </div>
      )}
    </motion.section>
  )
}
