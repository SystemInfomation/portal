'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Key, Shield, X } from 'lucide-react'

/**
 * TimeBasedAccessControl - Enforces time-based access control client-side
 * 
 * Allowed hours: 6 AM - 4 PM Eastern Time
 * Blocked hours: 4 PM - 6 AM Eastern Time
 * 
 * During after-school hours (blocked hours), only the /settings page is accessible.
 * All other pages show a passkey authentication prompt for admin bypass.
 * 
 * Multiple layers of protection:
 * - Immediate redirect on mount
 * - Continuous checking every second
 * - Blocks all navigation attempts (except /settings during blocked hours)
 * - Admin bypass via WebAuthn passkey during restricted hours
 */
export function TimeBasedAccessControl() {
  const router = useRouter()
  const pathname = usePathname()
  const [isBlocked, setIsBlocked] = useState(false)
  const [showPasskeyPrompt, setShowPasskeyPrompt] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [authError, setAuthError] = useState('')

  const authenticateWithPasskey = async () => {
    setIsAuthenticating(true)
    setAuthError('')

    try {
      console.log('Starting WebAuthn authentication...')
      
      // Start authentication
      const startResponse = await fetch('/api/webauthn/authenticate/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!startResponse.ok) {
        throw new Error(`Failed to start authentication: ${startResponse.status}`)
      }

      const { challenge } = await startResponse.json()
      console.log('Got challenge:', challenge)

      // Check if WebAuthn is supported
      if (!window.navigator || !window.navigator.credentials) {
        throw new Error('WebAuthn is not supported on this device/browser')
      }

      // Get credential from user
      console.log('Requesting credential from user...')
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: Uint8Array.from(atob(challenge), c => c.charCodeAt(0)),
          allowCredentials: [],
          userVerification: 'required',
          timeout: 60000
        }
      }) as PublicKeyCredential

      if (!credential) {
        throw new Error('Authentication cancelled by user')
      }

      console.log('Got credential:', credential.id)

      // Finish authentication
      const finishResponse = await fetch('/api/webauthn/authenticate/finish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credential: {
            id: credential.id,
            response: {
              authenticatorData: btoa(String.fromCharCode(...new Uint8Array((credential.response as any).authenticatorData))),
              clientDataJSON: btoa(String.fromCharCode(...new Uint8Array((credential.response as any).clientDataJSON))),
              signature: btoa(String.fromCharCode(...new Uint8Array((credential.response as any).signature))),
              userHandle: (credential.response as any).userHandle ? btoa(String.fromCharCode(...new Uint8Array((credential.response as any).userHandle))) : null
            }
          },
          challenge
        })
      })

      if (!finishResponse.ok) {
        const errorText = await finishResponse.text()
        throw new Error(`Authentication failed: ${finishResponse.status} - ${errorText}`)
      }

      const { success, sessionToken } = await finishResponse.json()

      if (success) {
        // Store admin bypass flag
        localStorage.setItem('adminBypassActive', 'true')
        localStorage.setItem('adminBypassToken', sessionToken)
        setShowPasskeyPrompt(false)
        setIsBlocked(false)
        console.log('✅ Admin bypass granted')
      } else {
        throw new Error('Invalid credentials')
      }

    } catch (error) {
      console.error('WebAuthn authentication error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed'
      
      // Provide more user-friendly error messages
      if (errorMessage.includes('invalid domain') || errorMessage.includes('NotAllowedError')) {
        setAuthError('Passkey authentication not allowed on this domain. Please ensure you\'re using the correct website.')
      } else if (errorMessage.includes('cancelled')) {
        setAuthError('Authentication was cancelled.')
      } else if (errorMessage.includes('not supported')) {
        setAuthError('Your browser or device does not support WebAuthn passkeys.')
      } else {
        setAuthError(errorMessage)
      }
    } finally {
      setIsAuthenticating(false)
    }
  }

  useEffect(() => {
    const checkTime = () => {
      // Check if admin bypass is active
      const adminBypassActive = typeof window !== 'undefined' 
        ? localStorage.getItem('adminBypassActive') === 'true'
        : false

      // If admin bypass is active, don't block anything
      if (adminBypassActive) {
        setIsBlocked(false)
        
        // If we're on the locked page and bypass is active, redirect home
        const normalizedPath = pathname.replace(/\/$/, '')
        const isOnLockedPage = normalizedPath === '/locked'
        if (isOnLockedPage) {
          router.replace('/')
        }
        return
      }

      // Get current time in Eastern timezone
      const now = new Date()
      // Use a more reliable method to get Eastern Time
      const easternTimeString = now.toLocaleString('en-US', { 
        timeZone: 'America/New_York',
        year: 'numeric',
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
      const easternTime = new Date(easternTimeString)
      const hours = easternTime.getHours()
      
      // Debug logging (can be removed in production)
      console.log('Current time check:', {
        localTime: now.toLocaleString(),
        easternTime: easternTime.toLocaleString(),
        easternHour: hours,
        shouldBlock: hours < 6 || hours >= 16
      })
      
      // Block if outside 6 AM - 4 PM (Eastern Time)
      // Allowed: 6:00 AM (6) to 3:59 PM (15:59)
      // Blocked: 4:00 PM (16) to 5:59 AM (5:59)
      const blocked = hours < 6 || hours >= 16

      setIsBlocked(blocked)

      // Normalize pathname for comparison (remove trailing slash)
      const normalizedPath = pathname.replace(/\/$/, '')
      const isOnLockedPage = normalizedPath === '/locked'
      const isOnSettingsPage = normalizedPath === '/settings'

      // During after-school hours, allow access to settings page only
      // or show passkey prompt for admin bypass
      if (blocked) {
        // If not on locked page or settings page, show passkey prompt
        if (!isOnLockedPage && !isOnSettingsPage) {
          setShowPasskeyPrompt(true)
        } else {
          setShowPasskeyPrompt(false)
        }
      } else {
        setShowPasskeyPrompt(false)
      }

      // If not blocked and on locked page, redirect to home
      if (!blocked && isOnLockedPage) {
        router.replace('/')
      }
    }

    // Check immediately on mount
    checkTime()

    // Check every second for instant response at unlock/lock times
    const interval = setInterval(checkTime, 1000)

    return () => clearInterval(interval)
  }, [router, pathname])

  // Render passkey prompt if blocked and not on locked page or settings page
  const normalizedPath = pathname.replace(/\/$/, '')
  const isOnLockedPage = normalizedPath === '/locked'
  const isOnSettingsPage = normalizedPath === '/settings'
  
  if (showPasskeyPrompt && isBlocked && !isOnLockedPage && !isOnSettingsPage) {
    return (
      <div className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
          <div className="text-center space-y-6">
            {/* Header */}
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Access Restricted
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                The portal is only available during school hours (6 AM - 4 PM ET). 
                Admins can bypass this restriction using a passkey.
              </p>
            </div>

            {/* Error Message */}
            {authError && (
              <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-700 dark:text-red-300 text-sm">{authError}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={authenticateWithPasskey}
                disabled={isAuthenticating}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
              >
                {isAuthenticating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    Admin Bypass (Passkey)
                  </>
                )}
              </button>

              <button
                onClick={() => router.replace('/locked')}
                className="w-full px-4 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors"
              >
                Go to Locked Page
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowPasskeyPrompt(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
