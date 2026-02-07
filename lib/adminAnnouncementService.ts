import { announcementService, type AnnouncementData } from './announcementService'

class AdminAnnouncementService {
  private backendUrl: string
  private apiKey: string

  constructor() {
    this.backendUrl = 'https://portal-t795.onrender.com/api/announcements'
    // API key for secure admin operations
    this.apiKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY || '9f3c7a2b8d4e6c1a0b5f9e'
  }

  // Create or update announcement via backend API
  async createAnnouncement(message: string, type: 'info' | 'warning' | 'success', enabled: boolean = true): Promise<{success: boolean, announcement?: AnnouncementData, error?: string}> {
    try {
      const response = await fetch(this.backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
        },
        body: JSON.stringify({
          message: message.trim(),
          type,
          enabled
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
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
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
        }
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
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

  // Validate API key is configured
  isApiKeyConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.length > 0 && this.apiKey !== 'your-api-key-here')
  }
}

export const adminAnnouncementService = new AdminAnnouncementService()
