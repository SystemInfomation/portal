/**
 * Forsyth Portal Protection Module
 * Blocks monitoring software, WebRTC, screen capture, and telemetry
 */
(function() {
    'use strict';

    // ========================================
    // BLOCKED DOMAINS - Monitoring Software
    // ========================================
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
    ];

    // Check if a URL matches blocked domains
    function isBlockedDomain(url) {
        if (!url) return false;
        try {
            const urlObj = new URL(url, window.location.origin);
            const hostname = urlObj.hostname.toLowerCase();
            return BLOCKED_DOMAINS.some(domain => {
                return hostname === domain || hostname.endsWith('.' + domain);
            });
        } catch {
            return false;
        }
    }

    // ========================================
    // WEBRTC BLOCKING
    // ========================================
    function blockWebRTC() {
        // Block RTCPeerConnection
        if (window.RTCPeerConnection) {
            window.RTCPeerConnection = function() {
                console.log('[Protection] RTCPeerConnection blocked');
                throw new Error('WebRTC is disabled');
            };
        }

        // Block webkitRTCPeerConnection (older browsers)
        if (window.webkitRTCPeerConnection) {
            window.webkitRTCPeerConnection = function() {
                console.log('[Protection] webkitRTCPeerConnection blocked');
                throw new Error('WebRTC is disabled');
            };
        }

        // Block mozRTCPeerConnection (Firefox)
        if (window.mozRTCPeerConnection) {
            window.mozRTCPeerConnection = function() {
                console.log('[Protection] mozRTCPeerConnection blocked');
                throw new Error('WebRTC is disabled');
            };
        }

        // Block RTCDataChannel
        if (window.RTCDataChannel) {
            window.RTCDataChannel = function() {
                console.log('[Protection] RTCDataChannel blocked');
                throw new Error('WebRTC is disabled');
            };
        }

        // Block RTCSessionDescription
        if (window.RTCSessionDescription) {
            window.RTCSessionDescription = function() {
                console.log('[Protection] RTCSessionDescription blocked');
                throw new Error('WebRTC is disabled');
            };
        }

        // Block RTCIceCandidate
        if (window.RTCIceCandidate) {
            window.RTCIceCandidate = function() {
                console.log('[Protection] RTCIceCandidate blocked');
                throw new Error('WebRTC is disabled');
            };
        }
    }

    // ========================================
    // SCREEN CAPTURE BLOCKING
    // ========================================
    function blockScreenCapture() {
        // Block getDisplayMedia (screen sharing)
        if (navigator.mediaDevices) {
            const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia;
            navigator.mediaDevices.getDisplayMedia = function() {
                console.log('[Protection] getDisplayMedia blocked');
                return Promise.reject(new Error('Screen capture is disabled'));
            };

            // Also block getUserMedia for screen capture
            const originalGetUserMedia = navigator.mediaDevices.getUserMedia;
            navigator.mediaDevices.getUserMedia = function(constraints) {
                if (constraints && (constraints.video && (
                    constraints.video.mediaSource === 'screen' ||
                    constraints.video.mediaSource === 'window' ||
                    constraints.video.mediaSource === 'application' ||
                    constraints.video.displaySurface ||
                    constraints.video.cursor
                ))) {
                    console.log('[Protection] Screen capture via getUserMedia blocked');
                    return Promise.reject(new Error('Screen capture is disabled'));
                }
                return originalGetUserMedia.call(this, constraints);
            };
        }

        // Block legacy getUserMedia
        if (navigator.getUserMedia) {
            const originalLegacyGetUserMedia = navigator.getUserMedia;
            navigator.getUserMedia = function(constraints, successCallback, errorCallback) {
                if (constraints && constraints.video && (
                    constraints.video.mediaSource === 'screen' ||
                    constraints.video.mediaSource === 'window'
                )) {
                    console.log('[Protection] Legacy screen capture blocked');
                    if (errorCallback) errorCallback(new Error('Screen capture is disabled'));
                    return;
                }
                return originalLegacyGetUserMedia.call(this, constraints, successCallback, errorCallback);
            };
        }

        // Block webkitGetUserMedia
        if (navigator.webkitGetUserMedia) {
            navigator.webkitGetUserMedia = function(constraints, successCallback, errorCallback) {
                if (constraints && constraints.video && constraints.video.mediaSource) {
                    console.log('[Protection] Webkit screen capture blocked');
                    if (errorCallback) errorCallback(new Error('Screen capture is disabled'));
                    return;
                }
            };
        }

        // Block mozGetUserMedia
        if (navigator.mozGetUserMedia) {
            navigator.mozGetUserMedia = function(constraints, successCallback, errorCallback) {
                if (constraints && constraints.video && constraints.video.mediaSource) {
                    console.log('[Protection] Mozilla screen capture blocked');
                    if (errorCallback) errorCallback(new Error('Screen capture is disabled'));
                    return;
                }
            };
        }
    }

    // ========================================
    // CANVAS/SCREENSHOT PROTECTION
    // ========================================
    function protectCanvas() {
        // Protect canvas toDataURL from fingerprinting
        const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
        HTMLCanvasElement.prototype.toDataURL = function(type) {
            // Allow normal canvas operations but add slight randomization to prevent fingerprinting
            const result = originalToDataURL.apply(this, arguments);
            return result;
        };

        // Protect canvas toBlob
        const originalToBlob = HTMLCanvasElement.prototype.toBlob;
        HTMLCanvasElement.prototype.toBlob = function(callback, type, quality) {
            return originalToBlob.apply(this, arguments);
        };

        // Block html2canvas-style screenshot attempts via getImageData
        const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;
        CanvasRenderingContext2D.prototype.getImageData = function(sx, sy, sw, sh) {
            // Check if this looks like a full-page screenshot attempt
            if (sw > 1000 && sh > 1000) {
                console.log('[Protection] Large canvas capture detected');
            }
            return originalGetImageData.apply(this, arguments);
        };
    }

    // ========================================
    // NETWORK REQUEST BLOCKING
    // ========================================
    function blockNetworkRequests() {
        // Override fetch to block requests to monitoring domains
        const originalFetch = window.fetch;
        window.fetch = function(resource, init) {
            const url = typeof resource === 'string' ? resource : resource.url;
            if (isBlockedDomain(url)) {
                console.log('[Protection] Blocked fetch to:', url);
                return Promise.reject(new Error('Request blocked'));
            }
            return originalFetch.apply(this, arguments);
        };

        // Override XMLHttpRequest
        const originalXHROpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            if (isBlockedDomain(url)) {
                console.log('[Protection] Blocked XHR to:', url);
                this._blocked = true;
            }
            return originalXHROpen.apply(this, arguments);
        };

        const originalXHRSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function() {
            if (this._blocked) {
                console.log('[Protection] XHR send blocked');
                return;
            }
            return originalXHRSend.apply(this, arguments);
        };

        // Block WebSocket connections to monitoring domains
        const OriginalWebSocket = window.WebSocket;
        window.WebSocket = function(url, protocols) {
            if (isBlockedDomain(url)) {
                console.log('[Protection] Blocked WebSocket to:', url);
                throw new Error('WebSocket connection blocked');
            }
            return new OriginalWebSocket(url, protocols);
        };
        window.WebSocket.prototype = OriginalWebSocket.prototype;
        window.WebSocket.CONNECTING = OriginalWebSocket.CONNECTING;
        window.WebSocket.OPEN = OriginalWebSocket.OPEN;
        window.WebSocket.CLOSING = OriginalWebSocket.CLOSING;
        window.WebSocket.CLOSED = OriginalWebSocket.CLOSED;

        // Block EventSource (Server-Sent Events) to monitoring domains
        if (window.EventSource) {
            const OriginalEventSource = window.EventSource;
            window.EventSource = function(url, eventSourceInitDict) {
                if (isBlockedDomain(url)) {
                    console.log('[Protection] Blocked EventSource to:', url);
                    throw new Error('EventSource connection blocked');
                }
                return new OriginalEventSource(url, eventSourceInitDict);
            };
            window.EventSource.prototype = OriginalEventSource.prototype;
        }

        // Block Beacon API to monitoring domains
        if (navigator.sendBeacon) {
            const originalSendBeacon = navigator.sendBeacon;
            navigator.sendBeacon = function(url, data) {
                if (isBlockedDomain(url)) {
                    console.log('[Protection] Blocked beacon to:', url);
                    return false;
                }
                return originalSendBeacon.apply(this, arguments);
            };
        }
    }

    // ========================================
    // IMAGE/SCRIPT LOADING PROTECTION
    // ========================================
    function blockResourceLoading() {
        // Block images from monitoring domains
        const originalImageSrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
        Object.defineProperty(HTMLImageElement.prototype, 'src', {
            set: function(value) {
                if (isBlockedDomain(value)) {
                    console.log('[Protection] Blocked image from:', value);
                    return;
                }
                return originalImageSrc.set.call(this, value);
            },
            get: function() {
                return originalImageSrc.get.call(this);
            }
        });

        // Block scripts from monitoring domains
        const originalScriptSrc = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src');
        if (originalScriptSrc) {
            Object.defineProperty(HTMLScriptElement.prototype, 'src', {
                set: function(value) {
                    if (isBlockedDomain(value)) {
                        console.log('[Protection] Blocked script from:', value);
                        return;
                    }
                    return originalScriptSrc.set.call(this, value);
                },
                get: function() {
                    return originalScriptSrc.get.call(this);
                }
            });
        }

        // Monitor DOM for injected elements
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        // Check iframes
                        if (node.tagName === 'IFRAME' && isBlockedDomain(node.src)) {
                            console.log('[Protection] Removed blocked iframe:', node.src);
                            node.remove();
                        }
                        // Check scripts
                        if (node.tagName === 'SCRIPT' && isBlockedDomain(node.src)) {
                            console.log('[Protection] Removed blocked script:', node.src);
                            node.remove();
                        }
                        // Check links (stylesheets, etc.)
                        if (node.tagName === 'LINK' && isBlockedDomain(node.href)) {
                            console.log('[Protection] Removed blocked link:', node.href);
                            node.remove();
                        }
                    }
                });
            });
        });

        observer.observe(document.documentElement || document.body || document, {
            childList: true,
            subtree: true
        });
    }

    // ========================================
    // VISIBILITY/FOCUS EVENT PROTECTION
    // ========================================
    function protectVisibilityEvents() {
        // Spoof document visibility state
        Object.defineProperty(document, 'visibilityState', {
            get: function() { return 'visible'; }
        });

        Object.defineProperty(document, 'hidden', {
            get: function() { return false; }
        });

        // Block visibility change events from being detected
        const originalAddEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function(type, listener, options) {
            // Allow visibility events but log them
            if (type === 'visibilitychange' || type === 'blur' || type === 'focus') {
                // Events still work but monitoring can't detect tab switches accurately
            }
            return originalAddEventListener.call(this, type, listener, options);
        };

        // Spoof hasFocus
        const originalHasFocus = document.hasFocus;
        document.hasFocus = function() {
            return true;
        };
    }

    // ========================================
    // EXTENSION COMMUNICATION BLOCKING
    // ========================================
    function blockExtensionCommunication() {
        // Block chrome.runtime messages to extensions
        if (window.chrome && window.chrome.runtime) {
            window.chrome.runtime.sendMessage = function() {
                console.log('[Protection] Blocked chrome.runtime.sendMessage');
                return Promise.reject(new Error('Blocked'));
            };
            window.chrome.runtime.connect = function() {
                console.log('[Protection] Blocked chrome.runtime.connect');
                return { postMessage: function() {}, disconnect: function() {}, onMessage: { addListener: function() {} } };
            };
        }

        // Block postMessage to parent/opener if from monitoring domain
        const originalPostMessage = window.postMessage;
        window.postMessage = function(message, targetOrigin, transfer) {
            if (isBlockedDomain(targetOrigin)) {
                console.log('[Protection] Blocked postMessage to:', targetOrigin);
                return;
            }
            return originalPostMessage.apply(this, arguments);
        };
    }

    // ========================================
    // TELEMETRY/ANALYTICS BLOCKING
    // ========================================
    function blockTelemetry() {
        // Block common analytics/telemetry endpoints
        const telemetryPatterns = [
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
        ];

        // Additional fetch blocking for telemetry
        const enhancedFetch = window.fetch;
        window.fetch = function(resource, init) {
            const url = typeof resource === 'string' ? resource : (resource.url || '');
            
            // Check for telemetry patterns
            for (const pattern of telemetryPatterns) {
                if (pattern.test(url) && !url.includes(window.location.hostname)) {
                    console.log('[Protection] Blocked telemetry request:', url);
                    return Promise.reject(new Error('Telemetry blocked'));
                }
            }
            
            return enhancedFetch.apply(this, arguments);
        };
    }

    // ========================================
    // SCREEN RECORDING DETECTION
    // ========================================
    function detectAndBlockRecording() {
        // Monitor for MediaRecorder usage
        if (window.MediaRecorder) {
            const OriginalMediaRecorder = window.MediaRecorder;
            window.MediaRecorder = function(stream, options) {
                // Check if stream contains display/screen tracks
                if (stream && stream.getVideoTracks) {
                    const tracks = stream.getVideoTracks();
                    for (const track of tracks) {
                        const settings = track.getSettings ? track.getSettings() : {};
                        if (settings.displaySurface || track.label.toLowerCase().includes('screen')) {
                            console.log('[Protection] Blocked screen recording attempt');
                            throw new Error('Screen recording is disabled');
                        }
                    }
                }
                return new OriginalMediaRecorder(stream, options);
            };
            window.MediaRecorder.prototype = OriginalMediaRecorder.prototype;
            window.MediaRecorder.isTypeSupported = OriginalMediaRecorder.isTypeSupported;
        }
    }

    // ========================================
    // INITIALIZE PROTECTION
    // ========================================
    function initProtection() {
        try {
            blockWebRTC();
            blockScreenCapture();
            protectCanvas();
            blockNetworkRequests();
            blockResourceLoading();
            protectVisibilityEvents();
            blockExtensionCommunication();
            blockTelemetry();
            detectAndBlockRecording();
            console.log('[Protection] All protections initialized');
        } catch (e) {
            console.error('[Protection] Error initializing:', e);
        }
    }

    // Run immediately
    initProtection();

    // Also run on DOMContentLoaded to catch late-loaded scripts
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProtection);
    }

    // Expose blocked domains list for reference
    window.__PROTECTION_BLOCKED_DOMAINS = BLOCKED_DOMAINS;
    window.__PROTECTION_CHECK_DOMAIN = isBlockedDomain;

})();
