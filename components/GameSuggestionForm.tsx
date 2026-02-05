'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Gamepad2 } from 'lucide-react'
import { useTurnstile } from '@/lib/useTurnstile'

const FORM_COOLDOWN_MS = 60 * 60 * 1000 // 60 minutes

/**
 * SECURITY NOTICE - CLIENT-SIDE ONLY BOT PROTECTION
 * 
 * This form uses Cloudflare Turnstile in INVISIBLE mode as a basic spam deterrent.
 * 
 * IMPORTANT LIMITATIONS:
 * - This is CLIENT-SIDE ONLY - the token is NOT validated server-side
 * - GitHub Pages cannot run server-side code for validation
 * - This provides basic protection against simple bots only
 * - Determined attackers can bypass client-side checks
 * 
 * WHY THIS APPROACH:
 * - Better than nothing for deterring basic spam bots
 * - Invisible mode = no user friction for legitimate users
 * - Combined with rate limiting provides reasonable protection
 * 
 * FOR FULL SECURITY:
 * - Migrate to Cloudflare Pages + Workers/Functions
 * - Or use Vercel/Netlify with serverless functions
 * - Then implement proper server-side token validation
 * - See: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */

export function GameSuggestionForm() {
  const [result, setResult] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cooldownRemaining, setCooldownRemaining] = useState(0)
  const [submitEnabled, setSubmitEnabled] = useState(false)
  const [lastSubmissionSuccess, setLastSubmissionSuccess] = useState(false)

  // Cloudflare Turnstile integration
  const { containerRef, token, reset: resetTurnstile } = useTurnstile({
    sitekey: '0x4AAAAAACXz0aRXoDOkVLOC',
    theme: 'auto',
    onSuccess: (token) => {
      console.log('Turnstile verification complete (client-side only)')
      setSubmitEnabled(true)
    },
    onError: (error) => {
      console.error('Turnstile error:', error)
      setSubmitEnabled(false)
      setResult('Security verification failed. Please refresh the page and try again.')
    },
    onExpire: () => {
      console.warn('Turnstile token expired')
      setSubmitEnabled(false)
    },
  })

  // Check for cooldown on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const lastSubmission = localStorage.getItem('forsyth-form-last-submit')
      if (lastSubmission) {
        const timeSinceSubmit = Date.now() - parseInt(lastSubmission)
        
        if (timeSinceSubmit < FORM_COOLDOWN_MS) {
          const remaining = Math.ceil((FORM_COOLDOWN_MS - timeSinceSubmit) / 1000)
          setCooldownRemaining(remaining)
          
          // Start countdown
          const interval = setInterval(() => {
            const newRemaining = Math.ceil((FORM_COOLDOWN_MS - (Date.now() - parseInt(lastSubmission))) / 1000)
            if (newRemaining <= 0) {
              setCooldownRemaining(0)
              clearInterval(interval)
            } else {
              setCooldownRemaining(newRemaining)
            }
          }, 1000)
          
          return () => clearInterval(interval)
        }
      }
    }
  }, [])

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    // Check rate limit
    if (typeof window !== 'undefined') {
      const lastSubmission = localStorage.getItem('forsyth-form-last-submit')
      if (lastSubmission) {
        const timeSinceSubmit = Date.now() - parseInt(lastSubmission)
        if (timeSinceSubmit < FORM_COOLDOWN_MS) {
          const remaining = Math.ceil((FORM_COOLDOWN_MS - timeSinceSubmit) / 1000)
          setResult(`Please wait ${remaining} seconds before submitting another suggestion.`)
          return
        }
      }
    }
    
    // Check Turnstile token (client-side only - no server validation possible)
    if (!token) {
      setResult('Security verification incomplete. Please wait a moment and try again.')
      return
    }
    
    setIsSubmitting(true)
    setResult("Sending....")
    
    const formData = new FormData(event.target as HTMLFormElement)
    
    // Add Turnstile token to form data
    // Note: This token is NOT validated server-side (GitHub Pages limitation)
    // It serves as a basic client-side deterrent only
    formData.append('cf-turnstile-response', token)

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      })

      const data = await response.json()
      
      // Log the response for debugging
      console.log("Web3Forms Response:", data)
      console.log("Response status:", response.status)
      
      if (data.success) {
        setResult("Game suggestion submitted successfully! Thank you!")
        setLastSubmissionSuccess(true)
        ;(event.target as HTMLFormElement).reset()
        
        // Reset Turnstile widget
        resetTurnstile()
        setSubmitEnabled(false)
        
        // Set cooldown
        localStorage.setItem('forsyth-form-last-submit', Date.now().toString())
        setCooldownRemaining(60)
        
        // Start countdown
        const interval = setInterval(() => {
          setCooldownRemaining(prev => {
            if (prev <= 1) {
              clearInterval(interval)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      } else {
        console.error("Form submission failed:", data)
        setResult(`Error: ${data.message || "Unknown error occurred. Please try again."}`)
        setLastSubmissionSuccess(false)
        // Reset Turnstile on error to allow retry
        resetTurnstile()
        setSubmitEnabled(false)
      }
    } catch (error) {
      console.error("Form submission error:", error)
      setResult("Unable to submit your suggestion. Please check your connection and try again.")
      setLastSubmissionSuccess(false)
      // Reset Turnstile on error to allow retry
      resetTurnstile()
      setSubmitEnabled(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass rounded-2xl border border-border p-8 space-y-4"
    >
      <div className="flex items-center gap-3">
        <Gamepad2 className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold text-primary">Game Suggestions</h2>
      </div>
      
      <p className="text-muted-foreground text-sm">
        Have a game you&apos;d like to see added to the portal? Let us know!
      </p>

      <form onSubmit={onSubmit} className="space-y-4 mt-6">
        {/* Hidden fields for Web3Forms */}
        <input type="hidden" name="access_key" value="e93c5755-8acb-4e64-872b-2ba9d3b00e54" />
        <input type="hidden" name="subject" value="New Game Suggestion from Forsyth Games Portal" />
        <input type="hidden" name="from_name" value="Forsyth Games Portal User" />
        
        {/* Honeypot field - must be hidden and empty */}
        <input type="checkbox" name="botcheck" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
        
        {/* Cloudflare Turnstile - Invisible Container */}
        {/* This is hidden as the widget runs in invisible mode */}
        <div ref={containerRef} id="cf-turnstile" style={{ display: 'none' }} />

        <div className="space-y-2">
          <label htmlFor="message" className="block text-sm font-medium text-foreground">
            Game Suggestion
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder-muted-foreground transition-all resize-none"
            placeholder="Tell us about the game you'd like to see added (name, description, link if available)"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex justify-center">
          {/* Turnstile widget is invisible - no visible element needed */}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || cooldownRemaining > 0 || !submitEnabled}
          className="w-full px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cooldownRemaining > 0 
            ? `Please wait ${cooldownRemaining}s` 
            : !submitEnabled && !isSubmitting
              ? "Verifying security..."
              : isSubmitting 
                ? "Submitting..." 
                : "Submit Suggestion"}
        </button>

        {result && (
          <div
            className={`p-4 rounded-xl text-center ${
              result.includes("successfully")
                ? "bg-green-500/10 border border-green-500/20 text-green-400"
                : result.includes("Error") || result.includes("captcha")
                ? "bg-red-500/10 border border-red-500/20 text-red-400"
                : "bg-blue-500/10 border border-blue-500/20 text-blue-400"
            }`}
          >
            {result}
          </div>
        )}
      </form>

      <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-sm text-blue-200/80">
          <strong>Note:</strong> Your suggestion will be reviewed by our team. We appreciate your input in making this portal better!
        </p>
      </div>
      
      <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <p className="text-xs text-yellow-200/70">
          <strong>Security Info:</strong> This form uses Cloudflare Turnstile for basic spam protection. 
          Due to GitHub Pages limitations (no server-side code), the security token is only validated client-side. 
          This provides deterrence against simple bots but not full security. 
          For enhanced protection, consider migrating to Cloudflare Pages or similar platforms with serverless functions.
        </p>
      </div>
    </motion.section>
  )
}
