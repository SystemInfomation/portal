'use client'

import { useEffect } from 'react'

const DEFAULT_FAVICON = 'https://site.imsglobal.org/sites/default/files/orgs/logos/primary/fcslogo_hexagon.png'

const CLOAK_OPTIONS = [
  {
    id: 'google-drive',
    title: 'My Drive - Google Drive',
    icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgPhsxRI-t33a1g_wvkRX5IhEKUB-2lHfQ5A&s',
    backgroundColor: '#e3f2fd'
  },
  {
    id: 'canvas',
    title: 'Dashboard',
    icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYWy6tLxBPdE65jokTz4cBuyyNGDkupZVdtg&s',
    backgroundColor: '#ffebee'
  },
  {
    id: 'classlink',
    title: 'ClassLink LaunchPad',
    icon: 'https://play-lh.googleusercontent.com/ujsa1M8GdT-fo-GfPazpUwgPXVWEOWKUgKZk-SdnUhmcL3opS24MiHe6ypEgqxGpllw',
    backgroundColor: '#e1f5fe'
  },
  {
    id: 'linewize',
    title: 'Linewize',
    icon: 'https://gdm-catalog-fmapi-prod.imgix.net/ProductLogo/f23cec1c-1e86-4dc3-9e77-ce04c063ef21.jpeg?w=128&h=128&fit=max&dpr=3&auto=format&q=50',
    backgroundColor: '#e0f7fa'
  },
  {
    id: 'infinite-campus',
    title: 'Campus Portal',
    icon: 'https://3.files.edl.io/2e70/22/08/03/181301-467a6df0-d6f0-4a65-a41a-cb9e96558e30.png',
    backgroundColor: '#e8f5e9'
  }
]

export function TabCloakLoader() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const savedCloak = localStorage.getItem('forsyth-tab-cloak')
    
    if (savedCloak && savedCloak !== 'none') {
      const option = CLOAK_OPTIONS.find(o => o.id === savedCloak)
      if (option) {
        document.title = option.title
        
        let favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement
        if (!favicon) {
          favicon = document.createElement('link')
          favicon.rel = 'icon'
          document.head.appendChild(favicon)
        }
        favicon.href = option.icon
        
        // Apply background color
        document.body.style.backgroundColor = option.backgroundColor
      }
    }
  }, [])

  return null
}
