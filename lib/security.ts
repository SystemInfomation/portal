// Security utilities for admin panel

export class SecurityUtils {
  // Generate a secure random token
  static generateSecureToken(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }

  // Validate password strength
  static validatePasswordStrength(password: string): {
    isValid: boolean
    issues: string[]
  } {
    const issues: string[] = []
    
    if (password.length < 8) {
      issues.push('Password must be at least 8 characters long')
    }
    
    if (!/[A-Z]/.test(password)) {
      issues.push('Password must contain at least one uppercase letter')
    }
    
    if (!/[a-z]/.test(password)) {
      issues.push('Password must contain at least one lowercase letter')
    }
    
    if (!/[0-9]/.test(password)) {
      issues.push('Password must contain at least one number')
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      issues.push('Password must contain at least one special character')
    }
    
    return {
      isValid: issues.length === 0,
      issues
    }
  }

  // Check for suspicious activity patterns
  static detectSuspiciousActivity(attempts: number, timeWindow: number): boolean {
    // More than 10 attempts in 5 minutes is suspicious
    return attempts > 10 && timeWindow < 5 * 60 * 1000
  }

  // Sanitize input to prevent XSS
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim()
  }

  // Rate limiting helper
  static createRateLimiter(maxRequests: number, windowMs: number) {
    const requests: number[] = []
    
    return () => {
      const now = Date.now()
      const windowStart = now - windowMs
      
      // Remove old requests outside the window
      while (requests.length > 0 && requests[0] < windowStart) {
        requests.shift()
      }
      
      // Check if limit exceeded
      if (requests.length >= maxRequests) {
        return false
      }
      
      // Add current request
      requests.push(now)
      return true
    }
  }

  // Content Security Policy helper
  static getCSPHeader(): string {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "connect-src 'self' https://api.posthog.com https://analyticsdata.googleapis.com",
      "font-src 'self'",
      "object-src 'none'",
      "media-src 'self'",
      "frame-src 'none'",
      "child-src 'none'",
      "worker-src 'self'",
      "manifest-src 'self'",
      "upgrade-insecure-requests"
    ].join('; ')
  }

  // Log security events
  static logSecurityEvent(event: string, details: Record<string, any>) {
    const securityLog = {
      timestamp: new Date().toISOString(),
      event,
      details,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      ip: details.ip || 'unknown'
    }
    
    // In production, send this to a secure logging service
    console.warn('Security Event:', securityLog)
    
    // Store in localStorage for debugging (remove in production)
    if (typeof window !== 'undefined') {
      const logs = JSON.parse(localStorage.getItem('security-logs') || '[]')
      logs.push(securityLog)
      // Keep only last 50 events
      if (logs.length > 50) {
        logs.shift()
      }
      localStorage.setItem('security-logs', JSON.stringify(logs))
    }
  }

  // Check for common attack patterns
  static containsAttackPatterns(input: string): boolean {
    const attackPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /eval\s*\(/gi,
      /expression\s*\(/gi,
      /@import/i,
      /union\s+select/gi,
      /drop\s+table/gi,
      /insert\s+into/gi,
      /delete\s+from/gi
    ]
    
    return attackPatterns.some(pattern => pattern.test(input))
  }

  // Generate a fingerprint for browser identification
  static generateBrowserFingerprint(): string {
    if (typeof window === 'undefined') return 'server'
    
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return 'no-canvas'
    
    ctx.textBaseline = 'top'
    ctx.font = '14px Arial'
    ctx.fillText('Browser fingerprint', 2, 2)
    
    const fingerprint = canvas.toDataURL().slice(-50)
    return fingerprint
  }
}

export const rateLimiter = SecurityUtils.createRateLimiter(5, 60000) // 5 requests per minute
