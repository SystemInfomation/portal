'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Gamepad2 } from 'lucide-react'
import HCaptcha from '@hcaptcha/react-hcaptcha'

export function GameSuggestionForm() {
  const [result, setResult] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string>("")
  const captchaRef = useRef<HCaptcha>(null)
  const [cooldownRemaining, setCooldownRemaining] = useState(0)

  // Check for cooldown on mount
  useEffect(() => {
    const lastSubmission = localStorage.getItem('forsyth-form-last-submit')
    if (lastSubmission) {
      const timeSinceSubmit = Date.now() - parseInt(lastSubmission)
      const cooldownPeriod = 60000 // 60 seconds
      
      if (timeSinceSubmit < cooldownPeriod) {
        const remaining = Math.ceil((cooldownPeriod - timeSinceSubmit) / 1000)
        setCooldownRemaining(remaining)
        
        // Start countdown
        const interval = setInterval(() => {
          const newRemaining = Math.ceil((cooldownPeriod - (Date.now() - parseInt(lastSubmission))) / 1000)
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
  }, [])

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    // Check rate limit
    const lastSubmission = localStorage.getItem('forsyth-form-last-submit')
    if (lastSubmission) {
      const timeSinceSubmit = Date.now() - parseInt(lastSubmission)
      if (timeSinceSubmit < 60000) { // 60 seconds cooldown
        const remaining = Math.ceil((60000 - timeSinceSubmit) / 1000)
        setResult(`Please wait ${remaining} seconds before submitting another suggestion.`)
        return
      }
    }
    
    if (!captchaToken) {
      setResult("Please complete the captcha verification")
      return
    }
    
    setIsSubmitting(true)
    setResult("Sending....")
    
    const formData = new FormData(event.target as HTMLFormElement)
    formData.append("access_key", "e93c5755-8acb-4e64-872b-2ba9d3b00e54")
    formData.append("h-captcha-response", captchaToken)

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      })

      const data = await response.json()
      
      if (data.success) {
        setResult("Game suggestion submitted successfully! Thank you!")
        ;(event.target as HTMLFormElement).reset()
        setCaptchaToken("")
        captchaRef.current?.resetCaptcha()
        
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
        setResult(data.message || "Error submitting form. Please try again.")
      }
    } catch (error) {
      console.error("Form submission error:", error)
      setResult("Unable to submit your suggestion. Please check your connection and try again.")
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
        {/* Honeypot field - must be hidden and empty */}
        <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
        
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-foreground">
            Your Name <span className="text-muted-foreground text-xs">(optional)</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder-muted-foreground transition-all"
            placeholder="Enter your name (optional)"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-foreground">
            Email Address <span className="text-muted-foreground text-xs">(optional)</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder-muted-foreground transition-all"
            placeholder="your.email@example.com (optional)"
            disabled={isSubmitting}
          />
        </div>

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
          <HCaptcha
            ref={captchaRef}
            sitekey="50b2fe65-b00b-4b9e-ad62-3ba471098be2"
            onVerify={(token) => setCaptchaToken(token)}
            onExpire={() => setCaptchaToken("")}
            theme="dark"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || cooldownRemaining > 0}
          className="w-full px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cooldownRemaining > 0 
            ? `Please wait ${cooldownRemaining}s` 
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
    </motion.section>
  )
}
