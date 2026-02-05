'use client'

import { useState, useEffect } from 'react'
import { ENABLE_TOS_NOTIFICATION, TOS_CONFIG } from '@/lib/tos-config'

/**
 * Terms of Service Notification Component
 * 
 * This component displays a full-screen modal overlay for first-time visitors
 * requiring them to read the Terms of Service before continuing.
 * 
 * Features:
 * - Only shows for users who haven't accepted TOS yet (tracked via localStorage)
 * - Can be completely disabled via ENABLE_TOS_NOTIFICATION flag
 * - Full-screen modal that blocks all interaction with the page
 * - Can only be dismissed by clicking the TOS link
 * - Opens TOS in new tab and immediately marks as accepted
 * - Mobile-responsive with professional styling
 */
export function TosNotification() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Early return if feature is disabled
    if (!ENABLE_TOS_NOTIFICATION) {
      return
    }

    // Check if user has already accepted TOS
    const hasAccepted = localStorage.getItem(TOS_CONFIG.STORAGE_KEY) === 'true'
    
    // Only show notification if user hasn't accepted yet
    if (!hasAccepted) {
      setIsVisible(true)
      // Prevent scrolling on the background
      document.body.style.overflow = 'hidden'
    }

    // Cleanup: restore scrolling when component unmounts or notification is hidden
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  // Don't render anything if feature is disabled or notification shouldn't be visible
  if (!ENABLE_TOS_NOTIFICATION || !isVisible) {
    return null
  }

  // Handle TOS link click
  const handleTosClick = () => {
    // Open TOS page in new tab
    window.open(TOS_CONFIG.TOS_URL, '_blank')
    
    // Immediately mark as accepted in localStorage
    localStorage.setItem(TOS_CONFIG.STORAGE_KEY, 'true')
    
    // Restore scrolling
    document.body.style.overflow = 'unset'
    
    // Hide the notification
    setIsVisible(false)
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-slate-900/95 backdrop-blur-md animate-pulse-slow" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float-delayed" />
      </div>
      
      {/* Modal content */}
      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl max-w-lg mx-4 p-8 text-center transform transition-all duration-500 hover:scale-[1.02]">
        {/* Glass morphism effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />
        
        {/* Welcome icon with animation */}
        <div className="relative mb-8">
          <div className="w-20 h-20 mx-auto relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse" />
            <div className="relative w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white animate-bounce-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Message with modern typography */}
        <div className="relative mb-8">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Welcome to Forsyth Games
          </h2>
          <p className="text-lg text-white/90 leading-relaxed font-light">
            {TOS_CONFIG.MESSAGE}
          </p>
        </div>
        
        {/* TOS link button with modern styling */}
        <div className="relative space-y-4">
          <button
            onClick={handleTosClick}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-8 rounded-2xl transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-lg"
          >
            <span className="flex items-center justify-center gap-2">
              Read {TOS_CONFIG.LINK_TEXT}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </span>
          </button>
          
          <p className="text-sm text-white/60 font-light">
            <span className="inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              You must read the terms of service to continue
            </span>
          </p>
        </div>
      </div>
      
      {/* Custom styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(1deg); }
          66% { transform: translateY(-10px) rotate(-1deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-15px) rotate(-1deg); }
          66% { transform: translateY(-25px) rotate(1deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.95; }
          50% { opacity: 1; }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
