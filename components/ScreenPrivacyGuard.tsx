'use client'

import { useEffect, useState, useRef } from 'react'

/**
 * ScreenPrivacyGuard - Enhanced web-based screen capture protection
 * Inspired by react-native-screen-capture functionality for web
 */
export function ScreenPrivacyGuard() {
  const [isBlackScreen, setIsBlackScreen] = useState(false)
  const originalGetDisplayMedia = useRef<typeof navigator.mediaDevices.getDisplayMedia | null>(null)
  const originalGetUserMedia = useRef<typeof navigator.mediaDevices.getUserMedia | null>(null)

  useEffect(() => {
    // ========================================
    // SCREEN RECORDING DETECTION
    // ========================================

    const checkForScreenRecording = () => {
      // ========================================
      // ENHANCED SCREEN CAPTURE PROTECTION
      // ========================================
      
      // Store original methods if not already stored
      if (!originalGetDisplayMedia.current && navigator.mediaDevices?.getDisplayMedia) {
        originalGetDisplayMedia.current = navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices)
      }
      if (!originalGetUserMedia.current && navigator.mediaDevices?.getUserMedia) {
        originalGetUserMedia.current = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices)
      }

      // Override getDisplayMedia to block all screen capture attempts
      if (navigator.mediaDevices) {
        navigator.mediaDevices.getDisplayMedia = function() {
          console.log('🚫 Screen capture attempt blocked')
          setIsBlackScreen(true)
          
          // Send alert to monitoring system
          if (typeof window !== 'undefined' && 'gtag' in window) {
            // Use type assertion for gtag - matches Google Analytics interface
            type GtagFunction = (...args: unknown[]) => void;
            (window.gtag as GtagFunction)('event', 'screen_capture_blocked', {
              event_category: 'security',
              event_label: 'screen_capture_attempt'
            })
          }
          
          return Promise.reject(new DOMException('Screen capture is disabled for security reasons', 'NotAllowedError'))
        }

        // Enhanced getUserMedia blocking for screen/video capture
        navigator.mediaDevices.getUserMedia = function(constraints: MediaStreamConstraints) {
          // Check if requesting screen or display capture
          if (constraints?.video) {
            const videoConstraints = constraints.video as MediaTrackConstraints & {
              mediaSource?: string
              displaySurface?: string
              cursor?: string
              logicalSurface?: string
            }
            
            // Block any screen-related capture
            if (
              videoConstraints.mediaSource === 'screen' ||
              videoConstraints.mediaSource === 'window' ||
              videoConstraints.mediaSource === 'application' ||
              videoConstraints.displaySurface ||
              videoConstraints.cursor ||
              videoConstraints.logicalSurface ||
              (typeof videoConstraints === 'object' && 
               Object.values(videoConstraints).some(val => 
                 typeof val === 'string' && val.toLowerCase().includes('screen')
               ))
            ) {
              console.log('🚫 Video capture attempt blocked')
              setIsBlackScreen(true)
              
              return Promise.reject(new DOMException('Video capture is disabled for security reasons', 'NotAllowedError'))
            }
          }
          
          // Allow normal camera access but monitor for abuse
          return originalGetUserMedia.current!(constraints).then(stream => {
            // Monitor the stream for screen-like characteristics
            const videoTracks = stream.getVideoTracks()
            videoTracks.forEach(track => {
              const settings = track.getSettings()
              
              // Define extended settings type
              type ExtendedSettings = MediaTrackSettings & {
                displaySurface?: string
                logicalSurface?: string
              }
              
              // Check if track looks like screen capture
              if (
                (settings as ExtendedSettings).displaySurface ||
                (settings as ExtendedSettings).logicalSurface ||
                track.label.toLowerCase().includes('screen') ||
                track.label.toLowerCase().includes('display') ||
                (settings.width && settings.height && 
                 (settings.width >= 1920 || settings.height >= 1080) &&
                 (settings.frameRate || 0) <= 30) // Typical screen capture characteristics
              ) {
                console.log('🚫 Suspicious video track detected')
                setIsBlackScreen(true)
                track.stop()
                throw new DOMException('Suspicious video capture detected', 'NotAllowedError')
              }
            })
            
            return stream
          })
        }
      }

      // ========================================
      // MEDIA RECORDER MONITORING
      // ========================================
      if (typeof window.MediaRecorder !== 'undefined') {
        const OriginalMediaRecorder = window.MediaRecorder
        
        const CustomMediaRecorder = function(stream: MediaStream, options?: MediaRecorderOptions) {
          // Analyze all tracks in the stream
          const tracks = stream.getTracks()
          
          for (const track of tracks) {
            if (track.kind === 'video') {
              const settings = track.getSettings?.() || {}
              const extendedSettings = settings as MediaTrackSettings & { 
                displaySurface?: string
                logicalSurface?: string
              }
              
              // Check for screen capture indicators
              if (
                extendedSettings.displaySurface ||
                extendedSettings.logicalSurface ||
                track.label.toLowerCase().includes('screen') ||
                track.label.toLowerCase().includes('display') ||
                track.label.toLowerCase().includes('window')
              ) {
                console.log('🚫 Screen recording attempt detected')
                setIsBlackScreen(true)
                throw new DOMException('Screen recording is disabled', 'NotAllowedError')
              }
            }
          }
          
          return new OriginalMediaRecorder(stream, options)
        }
        
        // Copy static methods and prototype
        CustomMediaRecorder.prototype = OriginalMediaRecorder.prototype
        Object.defineProperty(CustomMediaRecorder, 'isTypeSupported', {
          value: OriginalMediaRecorder.isTypeSupported,
          writable: false,
          enumerable: true,
          configurable: true
        })
        
        window.MediaRecorder = CustomMediaRecorder as unknown as typeof MediaRecorder
      }

      // ========================================
      // EXTENSION AND PLUGIN DETECTION
      // ========================================
      
      // Check for common screen recording extensions
      const extensionIndicators = [
        'screen capture',
        'screen recording',
        'video capture',
        'desktop capture',
        'window capture'
      ]
      
      // Scan for injected elements that might indicate screen recording
      const allElements = document.querySelectorAll('*')
      for (const element of allElements) {
        const id = element.id?.toLowerCase() || ''
        let className = ''
        
        if (typeof element.className === 'string') {
          className = element.className.toLowerCase()
        } else if (element.className && typeof element.className === 'object' && 'toString' in element.className) {
          className = String(element.className).toLowerCase()
        }
        
        if (extensionIndicators.some(indicator => 
          id.includes(indicator) || className.includes(indicator)
        )) {
          console.log('🚫 Screen recording extension detected')
          setIsBlackScreen(true)
          break
        }
      }

      // Check for suspicious canvas usage (common in screen recording)
      const canvases = document.querySelectorAll('canvas')
      for (const canvas of canvases) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.getImageData(0, 0, 1, 1)
          // If canvas is capturing screen content, it might be suspicious
          if (canvas.width > 1920 || canvas.height > 1080) {
            console.log('🚫 Suspicious canvas activity detected')
            setIsBlackScreen(true)
            break
          }
        }
      }
    }

    // Check periodically for screen recording attempts (reduced frequency)
    const recordingCheckInterval = setInterval(checkForScreenRecording, 5000) // Changed from 1000ms to 5000ms

    // ========================================
    // TAB VISIBILITY DETECTION (Less aggressive)
    // ========================================
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User switched tabs or minimized window - don't immediately black screen
        // Only black screen if we detect actual capture attempts
      } else {
        setIsBlackScreen(false)
      }
    }

    // ========================================
    // WINDOW FOCUS/BLUR DETECTION (Less aggressive)
    // ========================================
    const handleBlur = () => {
      // Window lost focus - don't immediately black screen, just monitor
      // Only black screen if we detect actual capture attempts
    }

    const handleFocus = () => {
      // Window regained focus
      setIsBlackScreen(false)
    }

    // ========================================
    // PAGE HIDE HANDLER (Alternative to beforeunload)
    // ========================================
    const handlePageHide = () => {
      // Show black screen when page is being hidden/unloaded
      setIsBlackScreen(true)
    }

    // ========================================
    // MOUSE LEAVE DETECTION (Disabled for better UX)
    // ========================================
    const handleMouseLeave = () => {
      // Disabled - was causing issues during normal gameplay
      // If mouse leaves the window (moving to another monitor or application)
      // if (e.clientY <= 0 || e.clientX <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
      //   setIsBlackScreen(true)
      // }
    }

    const handleMouseEnter = () => {
      // Disabled - was causing issues during normal gameplay
      // Mouse re-entered the window
      // setIsBlackScreen(false)
    }

    // ========================================
    // KEYBOARD DETECTION (Disabled for better UX)
    // ========================================
    const handleKeyDown = () => {
      // Disabled - was interfering with gameplay
      // Detect common tab switching combinations
      // if (e.altKey && e.key === 'Tab') {
      //   setIsBlackScreen(true)
      // }
      // if (e.key === 'F11') {
      //   // F11 for fullscreen toggle
      //   setIsBlackScreen(true)
      // }
    }

    const handleKeyUp = () => {
      // Disabled - was interfering with gameplay
      // Reset when keys are released
      // if (e.altKey && e.key === 'Tab') {
      //   setTimeout(() => setIsBlackScreen(false), 100)
      // }
    }

    // ========================================
    // DEVTOOLS DETECTION (Less aggressive)
    // ========================================

    const checkDevTools = () => {
      const threshold = 160
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        // DevTools might be open - but don't immediately black screen
        // Only log for monitoring purposes
        console.log('🔍 DevTools detected (monitoring only)')
        // setIsBlackScreen(true) // Disabled for better UX
      }
    }

    const devtoolsCheckInterval = setInterval(checkDevTools, 2000) // Reduced frequency

    // ========================================
    // EVENT LISTENERS
    // ========================================
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleBlur)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('pagehide', handlePageHide)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    // Initial checks
    checkForScreenRecording()
    checkDevTools()

    // ========================================
    // CLEANUP
    // ========================================
    return () => {
      clearInterval(recordingCheckInterval)
      clearInterval(devtoolsCheckInterval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleBlur)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('pagehide', handlePageHide)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
      
      // Restore original media methods
      if (originalGetDisplayMedia.current && navigator.mediaDevices) {
        navigator.mediaDevices.getDisplayMedia = originalGetDisplayMedia.current
      }
      if (originalGetUserMedia.current && navigator.mediaDevices) {
        navigator.mediaDevices.getUserMedia = originalGetUserMedia.current
      }
    }
  }, [])

  // ========================================
  // BLACK SCREEN OVERLAY
  // ========================================
  if (isBlackScreen) {
    return (
      <div 
        className="fixed inset-0 bg-black z-[9999] cursor-default"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#000000',
          zIndex: 9999,
          pointerEvents: 'none'
        }}
      />
    )
  }

  return null
}
