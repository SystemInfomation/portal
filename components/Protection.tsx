'use client'

import { useEffect } from 'react'

/**
 * Blocked monitoring domains
 */
const BLOCKED_DOMAINS = [
  // Linewize Filter
  'familyzone.com',
  'familyzone.com.au',
  'familyzone.io',
  'familyzone.tools',
  'linewize.com',
  'linewize.io',
  'linewize.net',
  'linewizereseller.net',
  'qoria.com',
  'qoria.cloud',
  'qoriaapis.cloud',
  'qoria-api.cloud',
  'sphirewall.net',
  'block.tools',
  'fzbox.tools',
  'home.tools',
  // Linewize Filter Content-aware Module
  'smoothwall.cloud',
  'smoothwall.com',
  // Classwize
  'ably.io',
  'ably-realtime.com',
  'xirsys.com',
  // Classwize Screen Share
  'stream-io-api.com',
  'stream-io-video.com',
  'stream-io-cdn.com',
  'getstream.io',
  // Pulse
  'educatorimpact.com',
  'zdassets.com',
  'zendesk.com',
  // Additional monitoring services
  'securly.com',
  'goguardian.com',
  'bark.us',
  'lightspeedsystems.com',
  'contentkeeper.com',
  'iboss.com',
  'fortigate.com',
  'fortinet.com'
]

/**
 * Telemetry patterns to block
 */
const TELEMETRY_PATTERNS = [
  /telemetry/i,
  /analytics/i,
  /tracking/i,
  /beacon/i,
  /metrics/i,
  /monitor/i,
  /capture/i,
  /screenshot/i,
  /screenrecord/i,
  /activity/i
]

/**
 * Check if a URL matches blocked domains
 */
function isBlockedDomain(url: string | null | undefined): boolean {
  if (!url) return false
  try {
    const urlObj = new URL(url, window.location.origin)
    const hostname = urlObj.hostname.toLowerCase()
    return BLOCKED_DOMAINS.some(domain => 
      hostname === domain || hostname.endsWith('.' + domain)
    )
  } catch {
    return false
  }
}

/**
 * Check if URL should be blocked (domains + telemetry patterns)
 */
function shouldBlockUrl(url: string | null | undefined): boolean {
  if (!url) return false
  if (isBlockedDomain(url)) return true
  
  try {
    const urlObj = new URL(url, window.location.origin)
    if (urlObj.hostname !== window.location.hostname) {
      for (const pattern of TELEMETRY_PATTERNS) {
        if (pattern.test(url)) return true
      }
    }
  } catch {
    // Ignore URL parsing errors
  }
  return false
}

/**
 * Initialize all protection mechanisms
 */
function initProtection(): void {
  if (typeof window === 'undefined') return

  // ========================================
  // WEBRTC BLOCKING
  // ========================================
  const blockWebRTC = () => {
    const blockedRTC = function() {
      throw new Error('WebRTC is disabled')
    }
    
    if ((window as any).RTCPeerConnection) {
      (window as any).RTCPeerConnection = blockedRTC
    }
    if ((window as any).webkitRTCPeerConnection) {
      (window as any).webkitRTCPeerConnection = blockedRTC
    }
    if ((window as any).mozRTCPeerConnection) {
      (window as any).mozRTCPeerConnection = blockedRTC
    }
    if ((window as any).RTCDataChannel) {
      (window as any).RTCDataChannel = blockedRTC
    }
    if ((window as any).RTCSessionDescription) {
      (window as any).RTCSessionDescription = blockedRTC
    }
    if ((window as any).RTCIceCandidate) {
      (window as any).RTCIceCandidate = blockedRTC
    }
  }

  // ========================================
  // SCREEN CAPTURE BLOCKING
  // ========================================
  const blockScreenCapture = () => {
    if (navigator.mediaDevices) {
      navigator.mediaDevices.getDisplayMedia = function() {
        return Promise.reject(new Error('Screen capture is disabled'))
      }
      
      const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices)
      navigator.mediaDevices.getUserMedia = function(constraints: MediaStreamConstraints) {
        if (constraints?.video && typeof constraints.video === 'object') {
          const videoConstraints = constraints.video as any
          if (
            videoConstraints.mediaSource === 'screen' ||
            videoConstraints.mediaSource === 'window' ||
            videoConstraints.mediaSource === 'application' ||
            videoConstraints.displaySurface ||
            videoConstraints.cursor
          ) {
            return Promise.reject(new Error('Screen capture is disabled'))
          }
        }
        return originalGetUserMedia(constraints)
      }
    }
  }

  // ========================================
  // NETWORK REQUEST BLOCKING
  // ========================================
  const blockNetworkRequests = () => {
    // Override fetch
    const originalFetch = window.fetch.bind(window)
    window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : (input as Request).url
      if (shouldBlockUrl(url)) {
        return Promise.reject(new Error('Request blocked'))
      }
      return originalFetch(input, init)
    }

    // Override XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open
    XMLHttpRequest.prototype.open = function(method: string, url: string | URL, ...args: any[]) {
      const urlString = url instanceof URL ? url.href : url
      if (shouldBlockUrl(urlString)) {
        (this as any)._blocked = true
      }
      return originalXHROpen.apply(this, [method, url, ...args] as any)
    }

    const originalXHRSend = XMLHttpRequest.prototype.send
    XMLHttpRequest.prototype.send = function(body?: Document | XMLHttpRequestBodyInit | null) {
      if ((this as any)._blocked) {
        return
      }
      return originalXHRSend.call(this, body)
    }

    // Block WebSocket
    const OriginalWebSocket = window.WebSocket
    ;(window as any).WebSocket = function(url: string | URL, protocols?: string | string[]) {
      const urlString = url instanceof URL ? url.href : url
      if (shouldBlockUrl(urlString)) {
        throw new Error('WebSocket connection blocked')
      }
      return new OriginalWebSocket(url, protocols)
    }
    ;(window as any).WebSocket.prototype = OriginalWebSocket.prototype
    ;(window as any).WebSocket.CONNECTING = OriginalWebSocket.CONNECTING
    ;(window as any).WebSocket.OPEN = OriginalWebSocket.OPEN
    ;(window as any).WebSocket.CLOSING = OriginalWebSocket.CLOSING
    ;(window as any).WebSocket.CLOSED = OriginalWebSocket.CLOSED

    // Block Beacon API
    if (navigator.sendBeacon) {
      const originalSendBeacon = navigator.sendBeacon.bind(navigator)
      navigator.sendBeacon = function(url: string | URL, data?: BodyInit | null) {
        const urlString = url instanceof URL ? url.href : url
        if (shouldBlockUrl(urlString)) {
          return false
        }
        return originalSendBeacon(url, data)
      }
    }
  }

  // ========================================
  // VISIBILITY/FOCUS SPOOFING
  // ========================================
  const protectVisibility = () => {
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      enumerable: true,
      get: () => 'visible'
    })

    Object.defineProperty(document, 'hidden', {
      configurable: true,
      enumerable: true,
      get: () => false
    })

    document.hasFocus = () => true
  }

  // ========================================
  // EXTENSION COMMUNICATION BLOCKING
  // ========================================
  const blockExtensions = () => {
    if ((window as any).chrome?.runtime) {
      (window as any).chrome.runtime.sendMessage = () => Promise.reject(new Error('Blocked'))
      ;(window as any).chrome.runtime.connect = () => ({
        postMessage: () => {},
        disconnect: () => {},
        onMessage: { addListener: () => {}, removeListener: () => {}, hasListener: () => false },
        onDisconnect: { addListener: () => {}, removeListener: () => {}, hasListener: () => false },
        name: '',
        sender: undefined
      })
    }
  }

  // ========================================
  // DOM MUTATION OBSERVER
  // ========================================
  const blockDOMInjection = () => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            const element = node as HTMLElement
            if (element.tagName === 'IFRAME' && isBlockedDomain((element as HTMLIFrameElement).src)) {
              element.remove()
            }
            if (element.tagName === 'SCRIPT' && isBlockedDomain((element as HTMLScriptElement).src)) {
              element.remove()
            }
            if (element.tagName === 'LINK' && isBlockedDomain((element as HTMLLinkElement).href)) {
              element.remove()
            }
          }
        })
      })
    })

    observer.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true
    })
  }

  // ========================================
  // SCREEN RECORDING BLOCKING
  // ========================================
  const blockRecording = () => {
    if (window.MediaRecorder) {
      const OriginalMediaRecorder = window.MediaRecorder
      ;(window as any).MediaRecorder = function(stream: MediaStream, options?: MediaRecorderOptions) {
        if (stream?.getVideoTracks) {
          const tracks = stream.getVideoTracks()
          for (const track of tracks) {
            const settings = track.getSettings?.() || {}
            if ((settings as any).displaySurface || track.label.toLowerCase().includes('screen')) {
              throw new Error('Screen recording is disabled')
            }
          }
        }
        return new OriginalMediaRecorder(stream, options)
      }
      ;(window as any).MediaRecorder.prototype = OriginalMediaRecorder.prototype
      ;(window as any).MediaRecorder.isTypeSupported = OriginalMediaRecorder.isTypeSupported
    }
  }

  // Run all protections
  try {
    blockWebRTC()
    blockScreenCapture()
    blockNetworkRequests()
    protectVisibility()
    blockExtensions()
    blockDOMInjection()
    blockRecording()
  } catch {
    // Silent fail
  }
}

/**
 * Protection component - blocks monitoring software, WebRTC, screen capture
 */
export function Protection() {
  useEffect(() => {
    initProtection()
  }, [])

  return null
}
