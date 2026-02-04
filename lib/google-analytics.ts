// Google Analytics Data API for real-time analytics

interface RealtimeReport {
  dimensionHeaders: Array<{
    name: string;
  }>;
  metricHeaders: Array<{
    name: string;
    type: string;
  }>;
  rows: Array<{
    dimensionValues: string[];
    metricValues: Array<{
      value: string;
    }>;
  }>;
  totals: Array<{
    metricValues: Array<{
      value: string;
    }>;
  }>;
  rowCount: number;
  metadata: {
    currencyCode: string;
    timeZone: string;
    incomplete: boolean;
    samplingThresholdMet: boolean;
  };
}

interface RealtimeActiveUsers {
  activeUsers: number;
  activeUsersByCountry: Array<{
    country: string;
    users: number;
  }>;
  activeUsersByPage: Array<{
    page: string;
    users: number;
  }>;
  lastUpdated: Date;
}

export class GoogleAnalyticsAPI {
  private propertyId: string;
  private accessToken: string;

  constructor() {
    // For GA Data API, you need OAuth2 access token, not API key
    this.propertyId = '523244119'; // Your GA4 property ID
    this.accessToken = 'YOUR_OAUTH2_ACCESS_TOKEN'; // This needs to be generated via OAuth2 flow
  }

  async getRealtimeReport(): Promise<RealtimeReport> {
    const url = `https://analyticsdata.googleapis.com/v1beta/properties/${this.propertyId}:runRealtimeReport`;
    
    const requestBody = {
      metrics: [
        {
          name: 'activeUsers'
        }
      ],
      dimensions: [
        {
          name: 'country'
        },
        {
          name: 'unifiedScreenName'
        }
      ]
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`GA API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching GA realtime report:', error);
      throw error;
    }
  }

  async getRealtimeActiveUsers(): Promise<RealtimeActiveUsers> {
    try {
      const report = await this.getRealtimeReport();
      
      // Parse the report data
      const activeUsersByCountry: Array<{country: string; users: number}> = [];
      const activeUsersByPage: Array<{page: string; users: number}> = [];
      let totalActiveUsers = 0;

      if (report.rows && report.rows.length > 0) {
        report.rows.forEach(row => {
          const country = row.dimensionValues[0] || 'Unknown';
          const page = row.dimensionValues[1] || 'Unknown';
          const users = parseInt(typeof row.metricValues[0] === 'string' ? row.metricValues[0] : row.metricValues[0]?.value || '0');

          if (country !== 'Unknown') {
            activeUsersByCountry.push({ country, users });
          }
          if (page !== 'Unknown') {
            activeUsersByPage.push({ page, users });
          }
        });

        // Get total from totals if available
        if (report.totals && report.totals[0]) {
          const totalValue = report.totals[0].metricValues[0];
          totalActiveUsers = parseInt(typeof totalValue === 'string' ? totalValue : totalValue?.value || '0');
        }
      }

      return {
        activeUsers: totalActiveUsers,
        activeUsersByCountry,
        activeUsersByPage,
        lastUpdated: new Date(),
      };
    } catch (error) {
      console.error('Error getting realtime active users:', error);
      // Return fallback data
      return {
        activeUsers: 0,
        activeUsersByCountry: [],
        activeUsersByPage: [],
        lastUpdated: new Date(),
      };
    }
  }

  // Alternative method using gtag.js for basic active user tracking
  async getBasicActiveUsers(): Promise<number> {
    // This is a simplified approach using gtag.js
    // Note: This won't give you exact real-time data but can be used for estimation
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        // This is a workaround - gtag doesn't directly expose real-time data
        // You would need to use the GA Data API for accurate real-time data
        resolve(0);
      } else {
        resolve(0);
      }
    });
  }
}

export const googleAnalyticsAPI = new GoogleAnalyticsAPI();
