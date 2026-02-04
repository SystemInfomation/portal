// Simpler Google Analytics Real-time API alternative

interface SimpleRealtimeData {
  activeUsers: number;
  lastUpdated: Date;
}

export class SimpleGoogleAnalytics {
  private trackingId: string;

  constructor() {
    this.trackingId = 'G-FGXXN9EK0N'; // Your GA4 measurement ID
  }

  // Method 1: Use GA4 Measurement Protocol for basic tracking
  async trackEvent(eventName: string, parameters: Record<string, any> = {}) {
    const payload = {
      measurement_id: this.trackingId,
      api_secret: 'YOUR_API_SECRET', // Generate in GA4 → Admin → Data Streams → API secrets
      events: [{
        name: eventName,
        parameters: parameters
      }]
    };

    try {
      const response = await fetch(`https://www.google-analytics.com/mp/collect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`GA tracking error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }

  // Method 2: Simulate active users with local storage
  getActiveUsersFromStorage(): number {
    if (typeof window === 'undefined') return 0;
    
    const activeUsers = localStorage.getItem('ga-active-users');
    const lastUpdate = localStorage.getItem('ga-last-update');
    const now = Date.now();
    
    // Clear if older than 5 minutes
    if (lastUpdate && (now - parseInt(lastUpdate)) > 5 * 60 * 1000) {
      localStorage.removeItem('ga-active-users');
      localStorage.removeItem('ga-last-update');
      return 0;
    }
    
    return activeUsers ? parseInt(activeUsers) : 0;
  }

  // Method 3: Use localStorage-based session tracking
  trackActiveUser() {
    if (typeof window === 'undefined') return;
    
    const sessionId = sessionStorage.getItem('ga-session-id');
    const now = Date.now();
    
    if (!sessionId) {
      // New session
      const newSessionId = Math.random().toString(36).substring(7);
      sessionStorage.setItem('ga-session-id', newSessionId);
      sessionStorage.setItem('ga-session-start', now.toString());
      
      this.incrementActiveUsers();
    }
    
    // Update last activity
    sessionStorage.setItem('ga-last-activity', now.toString());
  }

  private incrementActiveUsers() {
    if (typeof window === 'undefined') return;
    
    const current = this.getActiveUsersFromStorage();
    const newCount = current + 1;
    
    localStorage.setItem('ga-active-users', newCount.toString());
    localStorage.setItem('ga-last-update', Date.now().toString());
  }

  // Method 4: Simple heartbeat for active user tracking
  startHeartbeat() {
    if (typeof window === 'undefined') return;
    
    this.trackActiveUser();
    
    // Send heartbeat every 30 seconds
    setInterval(() => {
      this.trackActiveUser();
      this.trackEvent('heartbeat', {
        timestamp: Date.now(),
        page: window.location.pathname
      });
    }, 30000);
  }

  // Get simulated real-time data
  getSimulatedRealtimeData(): SimpleRealtimeData {
    return {
      activeUsers: this.getActiveUsersFromStorage(),
      lastUpdated: new Date()
    };
  }
}

export const simpleGA = new SimpleGoogleAnalytics();
