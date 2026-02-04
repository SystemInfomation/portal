'use client'

import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3">
          <Shield className="w-12 h-12 text-primary" />
          <h1 className="text-4xl md:text-5xl font-black">
            <span className="text-gradient">Privacy Policy</span>
          </h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Last Updated: {new Date().toLocaleDateString()}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl border border-border p-8 space-y-6"
      >
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-primary">Overview</h2>
          <p className="text-muted-foreground">
            Forsyth Games Portal is committed to protecting your privacy. This privacy policy explains how we handle information when you use our gaming portal.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-primary">Information We Collect</h2>
          <p className="text-muted-foreground">
            We do <strong className="text-foreground">not</strong> collect any personally identifiable information. The portal operates with minimal data collection:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground">
            <li>Local browser settings (theme preferences, tab cloaking settings) are stored only in your browser&apos;s local storage</li>
            <li>Game suggestions submitted through our form may include optional name and email if you choose to provide them</li>
            <li>We do not use tracking cookies or analytics</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-primary">How We Use Information</h2>
          <p className="text-muted-foreground">
            Any information voluntarily submitted through our game suggestion form is used solely for:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground">
            <li>Reviewing and considering game additions to the portal</li>
            <li>Optionally contacting you about your suggestion (if you provided contact information)</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-primary">Third-Party Services</h2>
          <p className="text-muted-foreground">
            We use the following third-party services:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground">
            <li><strong className="text-foreground">hCaptcha:</strong> Used for spam protection on our suggestion form. See <a href="https://www.hcaptcha.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">hCaptcha Privacy Policy</a></li>
            <li><strong className="text-foreground">Web3Forms:</strong> Used to process game suggestion form submissions. See <a href="https://web3forms.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Web3Forms Privacy Policy</a></li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-primary">Data Storage</h2>
          <p className="text-muted-foreground">
            All preference data (theme, tab cloaking settings) is stored locally in your browser using localStorage. This data never leaves your device and can be cleared at any time through your browser settings.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-primary">Games and Content</h2>
          <p className="text-muted-foreground">
            All games run locally in your browser. We do not monitor or track your gameplay. Some games may be hosted on third-party domains and may have their own privacy policies.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-primary">Your Rights</h2>
          <p className="text-muted-foreground">
            You have the right to:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground">
            <li>Clear all locally stored preferences at any time</li>
            <li>Use the portal without providing any personal information</li>
            <li>Request deletion of any game suggestions you have submitted</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-primary">Changes to This Policy</h2>
          <p className="text-muted-foreground">
            We may update this privacy policy from time to time. Any changes will be posted on this page with an updated date.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-primary">Contact</h2>
          <p className="text-muted-foreground">
            If you have questions about this privacy policy, please submit a game suggestion with your inquiry.
          </p>
        </section>
      </motion.div>
    </div>
  )
}
