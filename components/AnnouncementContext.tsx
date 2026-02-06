'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface AnnouncementContextType {
  currentMessage: string | null
  isVisible: boolean
}

const AnnouncementContext = createContext<AnnouncementContextType>({
  currentMessage: null,
  isVisible: false,
})

export function useAnnouncement() {
  return useContext(AnnouncementContext)
}

interface AnnouncementProviderProps {
  children: ReactNode
}

export function AnnouncementProvider({ children }: AnnouncementProviderProps) {
  const [currentMessage, setCurrentMessage] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [lastCheck, setLastCheck] = useState<number>(0)

  useEffect(() => {
    console.log('Setting up announcement polling...')
    
    // Poll for announcements every 2 seconds
    const pollAnnouncements = async () => {
      try {
        const response = await fetch('/api/announcements', {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
          },
        })
        
        if (response.ok) {
          const data = await response.json()
          
          if (data.announcement && data.announcement.timestamp > lastCheck) {
            console.log('Received new announcement:', data.announcement.message)
            
            // Update last check time
            setLastCheck(data.announcement.timestamp)
            
            // Wait 2 seconds before showing the announcement
            setTimeout(() => {
              setCurrentMessage(data.announcement.message)
              setIsVisible(true)
              
              // After 15 seconds, fade out and reset
              setTimeout(() => {
                setIsVisible(false)
                // Wait for fade out animation to complete before clearing message
                setTimeout(() => {
                  setCurrentMessage(null)
                }, 500) // Match this with CSS transition duration
              }, 15000)
            }, 2000)
          }
        }
      } catch (error) {
        console.error('Error polling announcements:', error)
      }
    }
    
    // Initial check
    pollAnnouncements()
    
    // Set up polling interval
    const interval = setInterval(pollAnnouncements, 2000)
    
    // Cleanup on unmount
    return () => {
      console.log('Cleaning up announcement polling...')
      clearInterval(interval)
    }
  }, [lastCheck])

  const value = {
    currentMessage,
    isVisible,
  }

  return (
    <AnnouncementContext.Provider value={value}>
      {children}
    </AnnouncementContext.Provider>
  )
}
