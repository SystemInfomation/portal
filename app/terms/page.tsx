'use client'

import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3">
          <FileText className="w-12 h-12 text-primary" />
          <h1 className="text-4xl md:text-5xl font-black">
            <span className="text-gradient">Terms of Service</span>
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
          <h2 className="text-2xl font-bold text-primary">Agreement to Terms</h2>
          <p className="text-muted-foreground">
            By accessing and using Forsyth Games Portal, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the portal.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-primary">Use of Service</h2>
          <p className="text-muted-foreground">
            Forsyth Games Portal provides access to a curated collection of HTML games for educational and entertainment purposes.
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground">
            <li>The portal is intended for students and users within the Forsyth County School District</li>
            <li>Games are provided for personal, non-commercial use</li>
            <li>You must use the portal in compliance with all applicable laws and school policies</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-primary">Acceptable Use</h2>
          <p className="text-muted-foreground">
            When using the portal, you agree to:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground">
            <li>Use the portal only for its intended purpose</li>
            <li>Not attempt to bypass school filters or security measures</li>
            <li>Not use the portal to distribute malware or harmful content</li>
            <li>Not abuse the game suggestion feature by submitting spam or inappropriate content</li>
            <li>Respect the intellectual property rights of game creators</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-primary">Content and Games</h2>
          <p className="text-muted-foreground">
            The games available on this portal:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground">
            <li>Are curated by the Celestrium Online Team</li>
            <li>May be hosted on third-party servers and subject to their own terms</li>
            <li>Are provided &quot;as is&quot; without warranties of any kind</li>
            <li>May be added or removed at any time without notice</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-primary">User Submissions</h2>
          <p className="text-muted-foreground">
            When you submit game suggestions:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground">
            <li>You grant us the right to review and consider your suggestions</li>
            <li>You confirm that your submission does not violate any third-party rights</li>
            <li>We reserve the right to accept or reject any suggestion without explanation</li>
            <li>We are not obligated to add any suggested games to the portal</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-primary">Disclaimers</h2>
          <p className="text-muted-foreground">
            The portal is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We make no warranties, expressed or implied, regarding:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground">
            <li>The availability, reliability, or accuracy of the portal</li>
            <li>The suitability of games for any particular purpose</li>
            <li>The security or safety of third-party game content</li>
            <li>Uninterrupted or error-free operation</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-primary">Limitation of Liability</h2>
          <p className="text-muted-foreground">
            To the fullest extent permitted by law, the Forsyth Games Portal and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the portal.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-primary">Third-Party Links</h2>
          <p className="text-muted-foreground">
            The portal may contain links to third-party websites and games. We are not responsible for the content, privacy practices, or terms of service of these third-party sites.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-primary">School Policy Compliance</h2>
          <p className="text-muted-foreground">
            Use of this portal must comply with all Forsyth County School District policies. The school district reserves the right to monitor usage and restrict access as necessary.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-primary">Modifications</h2>
          <p className="text-muted-foreground">
            We reserve the right to modify these Terms of Service at any time. Continued use of the portal after changes constitutes acceptance of the modified terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-primary">Termination</h2>
          <p className="text-muted-foreground">
            We reserve the right to terminate or suspend access to the portal at any time, without notice, for any reason, including violation of these terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-primary">Contact</h2>
          <p className="text-muted-foreground">
            If you have questions about these Terms of Service, please submit a game suggestion with your inquiry.
          </p>
        </section>
      </motion.div>
    </div>
  )
}
