'use client'

import { motion } from 'framer-motion'
import { Settings as SettingsIcon } from 'lucide-react'
import { TabCloak } from '@/components/TabCloak'
import { GameSuggestionForm } from '@/components/GameSuggestionForm'

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
        {/* Tab Cloaking Section */}
        <TabCloak />

        {/* Game Suggestions Section */}
        <GameSuggestionForm />

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
