'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bookmark, X } from 'lucide-react'

export function BookmarkNotification() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if user has already dismissed the bookmark notification
    const hasDismissedBookmark = localStorage.getItem('forsyth-bookmark-dismissed')
    
    if (!hasDismissedBookmark) {
      // Show notification after a short delay to let page load
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [])

  const handleBookmark = () => {
    // Try to use the browser's bookmark functionality
    if (typeof window !== 'undefined') {
      // @ts-expect-error - Firefox specific API
      if (window.sidebar && window.sidebar.addPanel) {
        // @ts-expect-error - Firefox specific API
        window.sidebar.addPanel('Forsyth Games', window.location.href, '')
        // @ts-expect-error - IE specific API
      } else if (window.external && ('AddFavorite' in window.external)) {
        // @ts-expect-error - IE specific API
        (window.external as { AddFavorite: (url: string, title: string) => void }).AddFavorite(window.location.href, 'Forsyth Games')
        // @ts-expect-error - Opera specific API
      } else if (window.opera && window.print) {
        // Opera
        document.title = 'Forsyth Games'
        return true
      } else {
        // Modern browsers - show instructions
        alert('Press Ctrl+D (or Cmd+D on Mac) to bookmark this page!')
      }
    }
    
    handleDismiss()
  }

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    localStorage.setItem('forsyth-bookmark-dismissed', 'true')
  }

  return (
    <AnimatePresence>
      {isVisible && !isDismissed && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed bottom-8 right-8 z-[90] w-80"
        >
          <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-xl shadow-2xl shadow-primary/20">
            {/* Animated shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity }}
            />
            
            {/* Content */}
            <div className="relative p-5">
              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-background/30 hover:bg-background/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              
              {/* Icon and message */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Bookmark className="w-5 h-5" />
                  </motion.div>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">
                    Hey, bookmark me here!
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Save this page to easily access your favorite games anytime.
                  </p>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handleBookmark}
                      className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium text-sm transition-colors"
                    >
                      Bookmark Now
                    </button>
                    <button
                      onClick={handleDismiss}
                      className="px-4 py-2 bg-background/50 hover:bg-background/70 text-muted-foreground hover:text-foreground rounded-lg font-medium text-sm transition-colors"
                    >
                      Maybe Later
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
