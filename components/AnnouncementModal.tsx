'use client'

import { useEffect } from 'react'
import { useAnnouncement } from './AnnouncementContext'

export function AnnouncementModal() {
  const { currentMessage, isVisible } = useAnnouncement()

  console.log('AnnouncementModal state:', { currentMessage, isVisible })

  // Prevent body scroll when modal is visible
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden'
      console.log('Modal should be visible now')
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isVisible])

  if (!currentMessage) {
    console.log('No current message, modal not rendering')
    return null
  }

  console.log('Rendering modal with message:', currentMessage)

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center p-4 transition-all duration-500 ${
        isVisible
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Centered announcement card */}
      <div
        className={`relative max-w-2xl w-full bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 transform transition-all duration-500 ${
          isVisible
            ? 'scale-100 translate-y-0 opacity-100'
            : 'scale-95 translate-y-4 opacity-0'
        }`}
      >
        {/* Red announcement header */}
        <div className="flex items-center justify-center mb-6">
          <div className="px-6 py-2 bg-red-500 rounded-full">
            <h2 className="text-white font-bold text-xl tracking-wide uppercase">
              📢 Announcement
            </h2>
          </div>
        </div>

        {/* Message content */}
        <div className="text-center">
          <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap break-words">
            {currentMessage}
          </p>
        </div>

        {/* Dismiss hint */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            This message will automatically dismiss in 15 seconds
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        <div className="absolute top-4 right-8 w-2 h-2 bg-yellow-500 rounded-full animate-pulse delay-75" />
        <div className="absolute top-4 right-12 w-2 h-2 bg-green-500 rounded-full animate-pulse delay-150" />
      </div>

      {/* Custom styles for animation delays */}
      <style jsx>{`
        .delay-75 {
          animation-delay: 75ms;
        }
        .delay-150 {
          animation-delay: 150ms;
        }
      `}</style>
    </div>
  )
}
