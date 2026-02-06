'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import Script from 'next/script'

export function RatingPopup() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already dismissed the rating popup
    // Only access localStorage in browser environment
    if (typeof window === 'undefined') return
    
    const hasDismissedRating = localStorage.getItem('forsyth-rating-dismissed')
    
    if (!hasDismissedRating) {
      // Show popup after 1 minute (60000 milliseconds)
      // Note: Timer resets if user navigates away and returns - this ensures
      // users have stayed continuously for 1 minute
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 60000)
      
      return () => clearTimeout(timer)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem('forsyth-rating-dismissed', 'true')
    }
  }

  return (
    <>
      <Script
        src="https://widgets.embeddable.co/sdk/latest/embeddable.js"
        strategy="lazyOnload"
      />
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-8 right-8 z-[90] w-80"
          >
            <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-background/95 to-background/90 backdrop-blur-xl shadow-2xl shadow-primary/20">
              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-background/30 hover:bg-background/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors z-10"
                aria-label="Close rating popup"
              >
                <X className="w-4 h-4" />
              </button>
              
              {/* Content */}
              <div className="relative p-5">
                <h3 className="font-semibold text-foreground mb-3 text-sm">
                  Rate Your Experience
                </h3>
                
                {/* Embeddable widget container */}
                <div className="embeddable-1OGf-NIO5p"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
