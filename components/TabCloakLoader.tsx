'use client'

import { useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { createSolidColorFavicon, CLOAK_OPTIONS } from '@/lib/tabCloakUtils'

// Helper to remove all cloak classes from body
const removeCloakClasses = () => {
  CLOAK_OPTIONS.forEach(option => {
    document.body.classList.remove(option.cssClass)
  })
}

export function TabCloakLoader() {
  const pathname = usePathname()

  const applyCloak = useCallback(() => {
    if (typeof window === 'undefined') return
    
    const savedCloak = localStorage.getItem('forsyth-tab-cloak')
    
    if (savedCloak && savedCloak !== 'none') {
      const option = CLOAK_OPTIONS.find(o => o.id === savedCloak)
      if (option) {
        // Set title
        document.title = option.title
        
        // Set favicon with solid color matching background
        let favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement
        if (!favicon) {
          favicon = document.createElement('link')
          favicon.rel = 'icon'
          document.head.appendChild(favicon)
        }
        favicon.href = createSolidColorFavicon(option.bgColor)
        
        // Remove existing cloak classes and apply the saved one
        removeCloakClasses()
        document.body.classList.add(option.cssClass)
      }
    }
  }, [])

  // Apply cloak on mount and whenever pathname changes
  useEffect(() => {
    applyCloak()
    
    // Small delays to override Next.js metadata changes after navigation
    const initialCloakTimeout = setTimeout(applyCloak, 50)
    const secondaryCloakTimeout = setTimeout(applyCloak, 150)
    
    return () => {
      clearTimeout(initialCloakTimeout)
      clearTimeout(secondaryCloakTimeout)
    }
  }, [pathname, applyCloak])

  // Use MutationObserver to prevent title changes
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const savedCloak = localStorage.getItem('forsyth-tab-cloak')
    if (!savedCloak || savedCloak === 'none') return
    
    const option = CLOAK_OPTIONS.find(o => o.id === savedCloak)
    if (!option) return

    // Watch for title changes and revert them
    const titleObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && document.title !== option.title) {
          document.title = option.title
        }
      }
    })

    const titleElement = document.querySelector('title')
    if (titleElement) {
      titleObserver.observe(titleElement, { childList: true, characterData: true, subtree: true })
    }

    // Also watch for title element being added/changed in head
    const headObserver = new MutationObserver(() => {
      if (document.title !== option.title) {
        document.title = option.title
      }
    })

    headObserver.observe(document.head, { childList: true, subtree: true })

    return () => {
      titleObserver.disconnect()
      headObserver.disconnect()
    }
  }, [pathname])

  return null
}
