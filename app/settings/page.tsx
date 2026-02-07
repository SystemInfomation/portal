'use client'

import { motion } from 'framer-motion'
import { Settings as SettingsIcon, Shield } from 'lucide-react'
import { TabCloak } from '@/components/TabCloak'
import { GameSuggestionForm } from '@/components/GameSuggestionForm'
import { FormSuccessNotification } from '@/components/FormSuccessNotification'
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  return (
    <div className="relative min-h-screen w-full bg-white dark:bg-black">
      <FormSuccessNotification />
      
      {/* Dot Background Pattern */}
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:20px_20px]",
          "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
          "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]",
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6 mb-12"
          >
            <div className="flex items-center justify-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 backdrop-blur-sm">
                <SettingsIcon className="w-8 h-8 text-blue-400" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Settings
                </span>
              </h1>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Customize your portal experience with powerful privacy and accessibility controls
            </p>
          </motion.div>

          {/* Settings Sections Grid */}
          <div className="space-y-6 lg:space-y-8">
            {/* Tab Cloaking Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="w-full"
            >
              <TabCloak />
            </motion.div>

            {/* Game Suggestions Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full"
            >
              <GameSuggestionForm />
            </motion.div>

            {/* Privacy Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full"
            >
              <section className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative p-8 lg:p-10 space-y-6">
                  {/* Section Header */}
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30">
                      <Shield className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">Privacy & Safety</h2>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Your privacy is our priority</p>
                    </div>
                  </div>
                  
                  {/* Privacy Content */}
                  <div className="space-y-4">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      We prioritize your privacy and safety. This portal:
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        { icon: "🔒", text: "Does not collect any personal data" },
                        { icon: "🚫", text: "Does not use tracking cookies" },
                        { icon: "🛡️", text: "Does not share information with third parties" },
                        { icon: "💻", text: "All games run locally in your browser" }
                      ].map((item, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/30">
                          <span className="text-xl mt-0.5">{item.icon}</span>
                          <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                            <span className="font-semibold text-slate-900 dark:text-white">Not</span> {item.text.replace("Does not", "").replace("All games", "Games")}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
