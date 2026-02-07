'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, Info, AlertTriangle, CheckCircle } from 'lucide-react'
import { withBasePath } from '@/lib/utils'
import { announcementService, type AnnouncementData } from '@/lib/announcementService'

export function AnnouncementBanner() {
  const [announcement, setAnnouncement] = useState<AnnouncementData | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  const handleDismiss = useCallback((id?: string) => {
    setIsVisible(false)
    setIsDismissed(true)
    if (id || announcement?.id) {
      sessionStorage.setItem('forsyth-announcement-dismissed', id || announcement?.id || '')
    }
  }, [announcement?.id])

  useEffect(() => {
    const checkAnnouncement = async () => {
      try {
        // Use announcement service for real-time API calls with fallback
        const data = await announcementService.checkForUpdates()
        
        if (!data) {
          setIsVisible(false)
          return
        }
        
        // Check if already dismissed this session
        const dismissedId = sessionStorage.getItem('forsyth-announcement-dismissed')
        if (dismissedId === data.id) {
          return
        }
        
        setAnnouncement(data)
        setIsVisible(true)
        setIsDismissed(false)
        
        // Auto-dismiss after 6 seconds
        const timer = setTimeout(() => {
          handleDismiss(data.id)
        }, 6000)
        
        return () => clearTimeout(timer)
      } catch {
        // Ignore fetch errors - service handles fallback
      }
    }

    // Check on mount
    checkAnnouncement()
    
    // Poll for changes every 15 seconds (more frequent for real-time)
    const pollInterval = setInterval(checkAnnouncement, 15000)

    return () => {
      clearInterval(pollInterval)
    }
  }, [handleDismiss])

  const getIcon = () => {
    switch (announcement?.type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />
      case 'success':
        return <CheckCircle className="w-5 h-5" />
      default:
        return <Info className="w-5 h-5" />
    }
  }

  const getColors = () => {
    switch (announcement?.type) {
      case 'warning':
        return {
          bg: 'from-yellow-500/20 to-orange-500/20',
          border: 'border-yellow-500/30',
          icon: 'text-yellow-400',
          glow: 'shadow-yellow-500/20'
        }
      case 'success':
        return {
          bg: 'from-green-500/20 to-emerald-500/20',
          border: 'border-green-500/30',
          icon: 'text-green-400',
          glow: 'shadow-green-500/20'
        }
      default:
        return {
          bg: 'from-blue-500/20 to-cyan-500/20',
          border: 'border-blue-500/30',
          icon: 'text-blue-400',
          glow: 'shadow-blue-500/20'
        }
    }
  }

  const colors = getColors()

  return (
    <AnimatePresence>
      {isVisible && announcement && !isDismissed && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-4"
        >
          <div className={`relative overflow-hidden rounded-2xl border ${colors.border} backdrop-blur-xl shadow-2xl ${colors.glow}`}>
            {/* Gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-r ${colors.bg} opacity-80`} />
            
            {/* Animated shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            />
            
            {/* Content */}
            <div className="relative p-4 flex items-start gap-4">
              {/* Icon with pulse animation */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-background/30 flex items-center justify-center ${colors.icon}`}>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {getIcon()}
                </motion.div>
              </div>
              
              {/* Message */}
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2 mb-1">
                  <Bell className={`w-4 h-4 ${colors.icon}`} />
                  <span className={`text-xs font-semibold uppercase tracking-wider ${colors.icon}`}>
                    Announcement
                  </span>
                </div>
                <p className="text-foreground font-medium leading-relaxed">
                  {announcement.message}
                </p>
              </div>
              
              {/* Close button */}
              <button
                onClick={() => handleDismiss()}
                className="flex-shrink-0 w-8 h-8 rounded-full bg-background/30 hover:bg-background/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Progress bar */}
            <motion.div
              className={`h-1 ${colors.icon.replace('text-', 'bg-')}`}
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 6, ease: 'linear' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
