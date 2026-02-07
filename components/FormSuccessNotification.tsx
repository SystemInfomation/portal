'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, X } from 'lucide-react'

export function FormSuccessNotification() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if URL has success parameter
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('success') === 'true') {
      setIsVisible(true)
      
      // Remove the success parameter from URL
      const url = new URL(window.location.href)
      url.searchParams.delete('success')
      window.history.replaceState({}, '', url.toString())
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className="fixed top-4 right-4 z-50 max-w-sm"
      >
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-4 shadow-lg backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-green-800 dark:text-green-200">
                Form Submitted Successfully!
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                Your game suggestion has been received. Thank you for your feedback!
              </p>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="flex-shrink-0 p-1 rounded-lg hover:bg-green-500/20 transition-colors"
            >
              <X className="w-4 h-4 text-green-600 dark:text-green-400" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
