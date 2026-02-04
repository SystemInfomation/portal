'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Wrench } from 'lucide-react'
import { utilities } from '@/data/utilities'
import { UtilityCard } from '@/components/UtilityCard'

export default function UtilitiesPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredUtilities = useMemo(() => {
    return utilities.filter(utility =>
      utility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      utility.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3">
          <Wrench className="w-12 h-12 text-primary" />
          <h1 className="text-4xl md:text-5xl font-black">
            <span className="text-gradient">Utilities</span>
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Helpful browser tools and utilities
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="sticky top-20 z-40"
      >
        <div className="glass rounded-2xl border border-border p-4 shadow-2xl max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search utilities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-lg"
            />
          </div>
        </div>
      </motion.div>

      {/* Utilities Grid */}
      {filteredUtilities.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <p className="text-2xl text-muted-foreground">No utilities found</p>
          <p className="text-muted-foreground mt-2">Try a different search term</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredUtilities.map((utility, index) => (
            <motion.div
              key={utility.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * index }}
            >
              <UtilityCard utility={utility} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
