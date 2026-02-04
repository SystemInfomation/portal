'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Lock, Send, Trash2, Bell, CheckCircle, AlertTriangle, Copy, Download, Eye, Users, Activity, TrendingUp, RefreshCw, Globe } from 'lucide-react'
import { withBasePath } from '@/lib/utils'
import { posthogAPI } from '@/lib/posthog'
import { googleAnalyticsAPI } from '@/lib/google-analytics'
import { simpleGA } from '@/lib/ga-realtime-simple'

const ADMIN_PASSCODE = '1140' // Admin passcode
const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes
const MAX_LOGIN_ATTEMPTS = 3 // Maximum failed attempts
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes lockout
// Removed IP whitelist to allow access from anywhere

interface AnalyticsData {
  totalViews: number;
  activeUsers: number;
  totalUsers: number;
  currentSessions: number;
  lastUpdated: Date;
  gaActiveUsers?: number;
  gaActiveUsersByCountry?: Array<{country: string; users: number}>;
  gaActiveUsersByPage?: Array<{page: string; users: number}>;
  simpleGAActiveUsers?: number;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passcode, setPasscode] = useState('')
  const [passcodeError, setPasscodeError] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const [announcementType, setAnnouncementType] = useState<'info' | 'warning' | 'success'>('info')
  const [currentAnnouncement, setCurrentAnnouncement] = useState<{message: string, type: string, enabled: boolean} | null>(null)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [generatedJSON, setGeneratedJSON] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [analyticsError, setAnalyticsError] = useState('')
  const [sessionStartTime] = useState(Date.now())
  
  // Security state
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isLockedOut, setIsLockedOut] = useState(false)
  const [lockoutEndTime, setLockoutEndTime] = useState(0)
  const [userIP, setUserIP] = useState('')
  const [userLocation, setUserLocation] = useState('')
  const [isSecureConnection, setIsSecureConnection] = useState(false)

  useEffect(() => {
    // Security checks
    const performSecurityChecks = async () => {
    // Check for secure connection (HTTPS in production) - but allow access from anywhere
    const isSecure = typeof window !== 'undefined' && 
      (window.location.protocol === 'https:' || window.location.hostname === 'localhost')
    setIsSecureConnection(isSecure)

      // Get user IP and location (client-side approximation)
      if (typeof window !== 'undefined') {
        // Try to get real IP using a public service (fallback to hostname)
        try {
          const [ipResponse, locationResponse] = await Promise.allSettled([
            fetch('https://api.ipify.org?format=json'),
            fetch('https://ipapi.co/json/')
          ])
          
          if (ipResponse.status === 'fulfilled') {
            const ipData = await ipResponse.value.json()
            setUserIP(ipData.ip || 'Unknown')
          }
          
          if (locationResponse.status === 'fulfilled') {
            const locationData = await locationResponse.value.json()
            setUserLocation(`${locationData.city}, ${locationData.country_name}` || 'Unknown')
          }
        } catch {
          setUserIP(window.location.hostname)
          setUserLocation('Unknown')
        }
      }

      // Check lockout status
      const lockoutEnd = parseInt(localStorage.getItem('forsyth-admin-lockout') || '0')
      if (Date.now() < lockoutEnd) {
        setIsLockedOut(true)
        setLockoutEndTime(lockoutEnd)
        return
      }

      // Check if already authenticated this session
      const authSession = sessionStorage.getItem('forsyth-admin-auth')
      const sessionTime = sessionStorage.getItem('forsyth-admin-time')
      
      if (authSession === 'true' && sessionTime) {
        const sessionAge = Date.now() - parseInt(sessionTime)
        if (sessionAge < SESSION_TIMEOUT) {
          setIsAuthenticated(true)
        } else {
          // Session expired
          sessionStorage.removeItem('forsyth-admin-auth')
          sessionStorage.removeItem('forsyth-admin-time')
        }
      }

      // Check login attempts
      const attempts = parseInt(localStorage.getItem('forsyth-admin-attempts') || '0')
      setLoginAttempts(attempts)
    }

    performSecurityChecks()

    // Load current announcement from public JSON
    const loadCurrentAnnouncement = async () => {
      try {
        const response = await fetch(withBasePath('/announcement.json'), {
          cache: 'no-store'
        })
        if (response.ok) {
          const data = await response.json()
          if (data.enabled && data.message) {
            setCurrentAnnouncement(data)
          }
        }
      } catch {
        // Ignore
      }
    }
    loadCurrentAnnouncement()

    // Check for session timeout
    const checkSession = setInterval(() => {
      if (isAuthenticated) {
        const currentTime = Date.now()
        if (currentTime - sessionStartTime >= SESSION_TIMEOUT) {
          setIsAuthenticated(false)
          sessionStorage.removeItem('forsyth-admin-auth')
          sessionStorage.removeItem('forsyth-admin-time')
        }
      }
    }, 60000) // Check every minute

    return () => clearInterval(checkSession)
  }, [isAuthenticated, sessionStartTime])

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if locked out
    if (isLockedOut) {
      setPasscodeError(`Account locked. Try again in ${Math.ceil((lockoutEndTime - Date.now()) / 60000)} minutes.`)
      return
    }

    // Check for secure connection in production (but allow access from anywhere)
    // Note: In production, you might want to enforce HTTPS, but for now we allow any connection

    // Rate limiting check
    const newAttempts = loginAttempts + 1
    setLoginAttempts(newAttempts)
    localStorage.setItem('forsyth-admin-attempts', newAttempts.toString())

    if (passcode === ADMIN_PASSCODE) {
      // Successful login
      setIsAuthenticated(true)
      sessionStorage.setItem('forsyth-admin-auth', 'true')
      sessionStorage.setItem('forsyth-admin-time', Date.now().toString())
      setPasscodeError('')
      setLoginAttempts(0)
      localStorage.removeItem('forsyth-admin-attempts')
      
      // Log successful login attempt (in production, send to security monitoring)
      console.log('Admin login successful from:', userIP)
    } else {
      // Failed login
      const remainingAttempts = MAX_LOGIN_ATTEMPTS - newAttempts
      
      if (remainingAttempts <= 0) {
        // Lockout the user
        const lockoutEnd = Date.now() + LOCKOUT_DURATION
        setIsLockedOut(true)
        setLockoutEndTime(lockoutEnd)
        localStorage.setItem('forsyth-admin-lockout', lockoutEnd.toString())
        setPasscodeError(`Too many failed attempts. Account locked for ${LOCKOUT_DURATION / 60000} minutes.`)
        
        // Log security breach attempt
        console.warn('Admin lockout triggered from:', userIP)
      } else {
        setPasscodeError(`Incorrect passcode. ${remainingAttempts} attempts remaining.`)
      }
      
      setPasscode('')
    }
  }

  const handleAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!announcement.trim()) return

    const announcementData = {
      message: announcement.trim(),
      type: announcementType,
      timestamp: Date.now(),
      id: Math.random().toString(36).substring(7) + Date.now().toString(36),
      enabled: true
    }

    const jsonContent = JSON.stringify(announcementData, null, 2)
    setGeneratedJSON(jsonContent)
    setSubmitStatus('success')
  }

  const handleCopyJSON = async () => {
    try {
      await navigator.clipboard.writeText(generatedJSON)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch {
      // Ignore
    }
  }

  const handleDownloadJSON = () => {
    const blob = new Blob([generatedJSON], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'announcement.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const loadAnalytics = async () => {
    setAnalyticsLoading(true)
    setAnalyticsError('')
    
    try {
      // Get PostHog stats
      const posthogStats = await posthogAPI.getRealtimeStats()
      
      // Try to get Google Analytics real-time data
      let gaData = null
      try {
        gaData = await googleAnalyticsAPI.getRealtimeActiveUsers()
      } catch (gaError) {
        console.log('Google Analytics real-time data not available:', gaError)
        // Don't fail the entire analytics load if GA is not configured
      }
      
      // Get simple GA tracking data as fallback
      let simpleGAData = null
      try {
        simpleGAData = simpleGA.getSimulatedRealtimeData()
      } catch (simpleGAError) {
        console.log('Simple GA tracking not available:', simpleGAError)
      }
      
      setAnalytics({
        ...posthogStats,
        gaActiveUsers: gaData?.activeUsers || 0,
        gaActiveUsersByCountry: gaData?.activeUsersByCountry || [],
        gaActiveUsersByPage: gaData?.activeUsersByPage || [],
        simpleGAActiveUsers: simpleGAData?.activeUsers || 0,
        lastUpdated: new Date(),
      })
    } catch (error) {
      console.error('Failed to load analytics:', error)
      setAnalyticsError('Failed to load analytics. Please check your PostHog configuration.')
    } finally {
      setAnalyticsLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadAnalytics()
      // Refresh analytics every 30 seconds
      const interval = setInterval(loadAnalytics, 30000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  const clearAnnouncement = () => {
    const emptyAnnouncement = {
      message: '',
      type: 'info',
      timestamp: 0,
      id: '',
      enabled: false
    }
    const jsonContent = JSON.stringify(emptyAnnouncement, null, 2)
    setGeneratedJSON(jsonContent)
    setCurrentAnnouncement(null)
    setSubmitStatus('idle')
  }

  // Passcode screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl border border-border p-8 max-w-md w-full mx-4"
        >
          <div className="text-center space-y-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Admin Access</h1>
            <p className="text-muted-foreground text-sm">
              Enter the admin passcode to continue
            </p>
            
            {/* Security Status */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isSecureConnection ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                <span className={isSecureConnection ? 'text-green-400' : 'text-yellow-400'}>
                  {isSecureConnection ? 'Secure Connection' : 'Insecure Connection'}
                </span>
              </div>
              <div className="text-muted-foreground">
                IP: {userIP || 'Detecting...'}
              </div>
              {userLocation && (
                <div className="text-muted-foreground">
                  📍 {userLocation}
                </div>
              )}
              <div className="flex items-center justify-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span className="text-green-400">
                  Accessible from Anywhere
                </span>
              </div>
              {loginAttempts > 0 && (
                <div className="text-orange-400">
                  Attempts: {loginAttempts}/{MAX_LOGIN_ATTEMPTS}
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handlePasscodeSubmit} className="space-y-4">
            {isLockedOut && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                <Lock className="w-4 h-4 inline mr-2" />
                Account locked. Try again in {Math.ceil((lockoutEndTime - Date.now()) / 60000)} minutes.
              </div>
            )}
            
            <div className="space-y-2">
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode"
                disabled={isLockedOut}
                className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder-muted-foreground text-center text-lg tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                autoFocus
              />
              <AnimatePresence>
                {passcodeError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`text-sm text-center ${isLockedOut ? 'text-red-400' : 'text-orange-400'}`}
                  >
                    {passcodeError}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <button
              type="submit"
              disabled={isLockedOut || !passcode.trim()}
              className="w-full px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLockedOut ? (
                <>
                  <Lock className="w-4 h-4" />
                  Locked Out
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Authenticate
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  // Admin dashboard
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
          <CheckCircle className="w-4 h-4" />
          <span>Admin Authenticated</span>
        </div>
        <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage site-wide announcements and view analytics</p>
      </motion.div>

      {/* Analytics Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass rounded-2xl border border-border p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Real-time Analytics
          </h2>
          <button
            onClick={loadAnalytics}
            disabled={analyticsLoading}
            className="px-3 py-1.5 text-sm bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${analyticsLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {analyticsError ? (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
            <p className="text-sm">{analyticsError}</p>
            <p className="text-xs mt-2">Make sure to set POSTHOG_PERSONAL_API_KEY and POSTHOG_PROJECT_ID in your environment variables.</p>
          </div>
        ) : analyticsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 rounded-xl bg-background/50 border border-border animate-pulse">
                <div className="h-4 bg-background/70 rounded mb-2 w-1/2"></div>
                <div className="h-8 bg-background/70 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : analytics ? (
          <div className="space-y-6">
            {/* PostHog Analytics */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                PostHog Analytics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-background/50 border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <Eye className="w-4 h-4" />
                    Total Views
                  </div>
                  <div className="text-2xl font-bold text-foreground">{analytics.totalViews.toLocaleString()}</div>
                </div>
                
                <div className="p-4 rounded-xl bg-background/50 border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <Users className="w-4 h-4" />
                    Active Users
                  </div>
                  <div className="text-2xl font-bold text-green-400">{analytics.activeUsers.toLocaleString()}</div>
                </div>
                
                <div className="p-4 rounded-xl bg-background/50 border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <Activity className="w-4 h-4" />
                    Current Sessions
                  </div>
                  <div className="text-2xl font-bold text-blue-400">{analytics.currentSessions.toLocaleString()}</div>
                </div>
                
                <div className="p-4 rounded-xl bg-background/50 border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <TrendingUp className="w-4 h-4" />
                    Total Users
                  </div>
                  <div className="text-2xl font-bold text-purple-400">{analytics.totalUsers.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Google Analytics Real-time */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-400" />
                Google Analytics Real-time
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-background/50 border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <Users className="w-4 h-4" />
                    Real-time Active Users
                  </div>
                  <div className="text-2xl font-bold text-blue-400">
                    {analytics.gaActiveUsers ? analytics.gaActiveUsers.toLocaleString() : 
                     analytics.simpleGAActiveUsers ? analytics.simpleGAActiveUsers.toLocaleString() : 'N/A'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {analytics.gaActiveUsers ? 'GA API (Last 30 min)' : 
                     analytics.simpleGAActiveUsers ? 'Local Tracking' : 'Not configured'}
                  </p>
                </div>

                {analytics.gaActiveUsersByCountry && analytics.gaActiveUsersByCountry.length > 0 && (
                  <div className="p-4 rounded-xl bg-background/50 border border-border md:col-span-2">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                      <Globe className="w-4 h-4" />
                      Active Users by Country
                    </div>
                    <div className="space-y-1">
                      {analytics.gaActiveUsersByCountry.slice(0, 3).map((country, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-foreground">{country.country}</span>
                          <span className="text-blue-400 font-medium">{country.users}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {analytics.gaActiveUsersByPage && analytics.gaActiveUsersByPage.length > 0 && (
                <div className="mt-4 p-4 rounded-xl bg-background/50 border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                    <Eye className="w-4 h-4" />
                    Active Users by Page
                  </div>
                  <div className="space-y-1">
                    {analytics.gaActiveUsersByPage.slice(0, 3).map((page, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-foreground truncate">{page.page}</span>
                        <span className="text-blue-400 font-medium">{page.users}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="text-xs text-muted-foreground text-center">
              Last updated: {analytics.lastUpdated.toLocaleTimeString()}
            </div>
          </div>
        ) : null}
      </motion.section>

      {/* Current Announcement */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl border border-border p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Current Active Announcement
          </h2>
          {currentAnnouncement && (
            <button
              onClick={clearAnnouncement}
              className="px-3 py-1.5 text-sm bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Disable
            </button>
          )}
        </div>

        {currentAnnouncement ? (
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
            <p className="text-foreground">{currentAnnouncement.message}</p>
            <p className="text-xs text-muted-foreground mt-2">Type: {currentAnnouncement.type}</p>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm italic">No active announcement</p>
        )}
      </motion.section>

      {/* Create Announcement */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl border border-border p-6 space-y-4"
      >
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Send className="w-5 h-5 text-primary" />
          Create Announcement
        </h2>

        <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Announcement Type
            </label>
            <div className="flex gap-2">
              {(['info', 'warning', 'success'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setAnnouncementType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    announcementType === type
                      ? type === 'info'
                        ? 'bg-blue-500/20 border-2 border-blue-500 text-blue-400'
                        : type === 'warning'
                        ? 'bg-yellow-500/20 border-2 border-yellow-500 text-yellow-400'
                        : 'bg-green-500/20 border-2 border-green-500 text-green-400'
                      : 'bg-background/50 border-2 border-border text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Message
            </label>
            <textarea
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              placeholder="Enter your announcement message..."
              rows={4}
              className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder-muted-foreground resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={!announcement.trim()}
            className="w-full px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            Broadcast Announcement
          </button>

          <AnimatePresence>
            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-center">
                  JSON generated successfully! Copy or download the content below.
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-foreground">
                      Generated JSON (Copy this to /public/announcement.json)
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleCopyJSON}
                        className="px-3 py-1.5 text-sm bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors flex items-center gap-2"
                      >
                        {copySuccess ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copySuccess ? 'Copied!' : 'Copy'}
                      </button>
                      <button
                        type="button"
                        onClick={handleDownloadJSON}
                        className="px-3 py-1.5 text-sm bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                  <pre className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground text-sm overflow-x-auto">
                    {generatedJSON}
                  </pre>
                  <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm">
                    <p className="font-semibold mb-1">📝 Instructions:</p>
                    <ol className="list-decimal list-inside space-y-1 text-xs">
                      <li>Copy the JSON content above</li>
                      <li>Update /public/announcement.json with this content</li>
                      <li>Commit and push to the repository</li>
                      <li>The announcement will appear for all users after deployment</li>
                    </ol>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.section>

      {/* Preview */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl border border-border p-6 space-y-4"
      >
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-primary" />
          Preview
        </h2>
        <p className="text-muted-foreground text-sm">
          This is how the announcement will appear to users:
        </p>

        {announcement.trim() && (
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            announcementType === 'info'
              ? 'bg-blue-500/10 border-blue-500/30'
              : announcementType === 'warning'
              ? 'bg-yellow-500/10 border-yellow-500/30'
              : 'bg-green-500/10 border-green-500/30'
          }`}>
            <Bell className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
              announcementType === 'info'
                ? 'text-blue-400'
                : announcementType === 'warning'
                ? 'text-yellow-400'
                : 'text-green-400'
            }`} />
            <p className="text-foreground text-sm">{announcement}</p>
          </div>
        )}
      </motion.section>
    </div>
  )
}
