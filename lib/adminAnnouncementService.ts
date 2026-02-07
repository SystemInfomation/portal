import { announcementService, type AnnouncementData } from './announcementService'

class AdminAnnouncementService {
  private backendUrl: string

  constructor() {
    this.backendUrl = 'https://portal-t795.onrender.com/api/announcements'
  }

  // Create or update announcement via backend API
  async createAnnouncement(message: string, type: 'info' | 'warning' | 'success', enabled: boolean = true): Promise<{success: boolean, announcement?: AnnouncementData, error?: string}> {
    try {
      const response = await fetch(this.backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          type,
          enabled
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        // Clear the cache to force refresh
        announcementService.clearCache()
        return { success: true, announcement: data.announcement }
      } else {
        return { success: false, error: 'Failed to create announcement' }
      }
    } catch (error) {
      console.error('Error creating announcement:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Disable current announcement via backend API
  async disableAnnouncement(): Promise<{success: boolean, error?: string}> {
    try {
      const response = await fetch(this.backendUrl, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        // Clear the cache to force refresh
        announcementService.clearCache()
        return { success: true }
      } else {
        return { success: false, error: 'Failed to disable announcement' }
      }
    } catch (error) {
      console.error('Error disabling announcement:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Get current announcement status (combines backend and fallback)
  async getCurrentAnnouncement(): Promise<AnnouncementData | null> {
    return await announcementService.fetchAnnouncement()
  }

  // Check if backend is available
  async checkBackendHealth(): Promise<boolean> {
    try {
      const healthUrl = this.backendUrl.replace('/announcements', '/health')
      const response = await fetch(healthUrl)
      return response.ok
    } catch {
      return false
    }
  }
}

export const adminAnnouncementService = new AdminAnnouncementService()
