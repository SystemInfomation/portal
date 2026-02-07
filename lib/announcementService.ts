interface AnnouncementData {
  message: string
  type: 'info' | 'warning' | 'success'
  timestamp: number
  id: string
  enabled: boolean
}

class AnnouncementService {
  private backendUrl: string
  private fallbackUrl: string
  private lastFetch: number = 0
  private cache: AnnouncementData | null = null
  private cacheDuration: number = 10000 // 10 seconds cache

  constructor() {
    // Hardcoded Render backend URL
    this.backendUrl = 'https://portal-t795.onrender.com/api/announcements'
    this.fallbackUrl = '/announcement.json'
  }

  async fetchAnnouncement(): Promise<AnnouncementData | null> {
    const now = Date.now()
    
    // Return cached data if still fresh
    if (this.cache && (now - this.lastFetch) < this.cacheDuration) {
      return this.cache.enabled ? this.cache : null
    }

    try {
      // Try backend API first
      const response = await fetch(this.backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        cache: 'no-store',
      })

      if (response.ok) {
        const data = await response.json()
        this.cache = data
        this.lastFetch = now
        return data.enabled ? data : null
      }
    } catch (error) {
      console.warn('Backend announcement fetch failed, trying fallback:', error)
    }

    try {
      // Fallback to static JSON file
      const response = await fetch(this.fallbackUrl, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        }
      })

      if (response.ok) {
        const data = await response.json()
        this.cache = data
        this.lastFetch = now
        return data.enabled ? data : null
      }
    } catch (error) {
      console.error('Fallback announcement fetch failed:', error)
    }

    return null
  }

  // Method to check for real-time updates more frequently
  async checkForUpdates(): Promise<AnnouncementData | null> {
    // Bypass cache for real-time checks
    this.lastFetch = 0
    return this.fetchAnnouncement()
  }

  // Clear cache manually
  clearCache(): void {
    this.cache = null
    this.lastFetch = 0
  }
}

export const announcementService = new AnnouncementService()
export type { AnnouncementData }
