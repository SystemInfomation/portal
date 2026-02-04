'use client'

import { motion } from 'framer-motion'
import { Settings as SettingsIcon, Info } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3">
          <SettingsIcon className="w-12 h-12 text-primary" />
          <h1 className="text-4xl md:text-5xl font-black">
            <span className="text-gradient">Settings</span>
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Configure your portal experience
        </p>
      </motion.div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* About Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl border border-border p-8 space-y-4"
        >
          <div className="flex items-center gap-3">
            <Info className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-primary">About</h2>
          </div>
          
          <div className="space-y-4 text-muted-foreground">
            <p>
              <strong className="text-foreground">Forsyth Games Portal</strong> is a modern, curated gaming platform 
              built with Next.js 14+ and React. We provide a fast, safe, and enjoyable experience for playing 
              HTML5 games.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 pt-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Features</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Dark mode by default</li>
                  <li>Premium UI/UX design</li>
                  <li>112+ games</li>
                  <li>Fast search & filtering</li>
                  <li>Responsive on all devices</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Technology</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Next.js 14+ (App Router)</li>
                  <li>React 19</li>
                  <li>Tailwind CSS</li>
                  <li>Framer Motion</li>
                  <li>TypeScript</li>
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-sm">
                <strong className="text-foreground">Version:</strong> 5.0.0
              </p>
              <p className="text-sm mt-1">
                <strong className="text-foreground">Created by:</strong> Celestium Online Team
              </p>
            </div>
          </div>
        </motion.section>

        {/* Privacy Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl border border-border p-8 space-y-4"
        >
          <h2 className="text-2xl font-bold text-primary">Privacy & Safety</h2>
          
          <div className="space-y-3 text-muted-foreground">
            <p>
              We prioritize your privacy and safety. This portal:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Does <strong className="text-foreground">not</strong> collect any personal data</li>
              <li>Does <strong className="text-foreground">not</strong> use tracking cookies</li>
              <li>Does <strong className="text-foreground">not</strong> share information with third parties</li>
              <li>All games run locally in your browser</li>
            </ul>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
