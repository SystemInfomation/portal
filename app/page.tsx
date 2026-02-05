'use client'

import { motion } from 'framer-motion'
import { Sparkles, Dices } from 'lucide-react'
import { editorsPicks } from '@/data/editors-picks'
import { games } from '@/data/games'
import { GameCard } from '@/components/GameCard'
import { Footer } from '@/components/Footer'
import { BookmarkNotification } from '@/components/BookmarkNotification'
import { WelcomeNotification } from '@/components/WelcomeNotification'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { GridBackground } from '@/components/ui/grid-background-demo'

export default function Home() {
  const router = useRouter()
  const [isRandomizing, setIsRandomizing] = useState(false)

  const playRandom = () => {
    setIsRandomizing(true)
    
    // Pick any random game from ALL available games
    const randomGame = games[Math.floor(Math.random() * games.length)]
    setTimeout(() => {
      router.push(`/play/${randomGame.id}`)
    }, 300)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-16">
      <GridBackground />
      <BookmarkNotification />
      <WelcomeNotification />
      
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-6 py-12"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium"
        >
          <Sparkles className="w-4 h-4" />
          <span>Version 5.0 - Complete Overhaul</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-5xl md:text-7xl font-black tracking-tight"
        >
          <span className="block mb-2">Welcome to</span>
          <span className="text-gradient">Forsyth Games</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
        >
          A Fast, Curated Portal for Playing HTML Games — Built to Be Simple, Safe, & Enjoyable
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="text-lg text-yellow-500/80 font-medium"
        >
          ⚠️ Please use this website responsibly
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="pt-4"
        >
          <button
            onClick={playRandom}
            disabled={isRandomizing}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-full font-bold text-lg text-black hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl animate-pulse-glow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Dices className={`w-6 h-6 ${isRandomizing ? 'animate-spin' : 'group-hover:rotate-12'} transition-transform`} />
            <span>Play Random Game</span>
          </button>
          <p className="text-sm text-muted-foreground mt-3">
            Instantly Start a Random Editor&apos;s Pick — Try Something New!
          </p>
        </motion.div>
      </motion.section>

      {/* Editor's Picks - Auto-scrolling Carousel */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="space-y-6"
      >
        <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="text-gradient">Editor&apos;s Picks</span>
          </h2>
          <p className="text-muted-foreground">
            Hand-selected games curated by the Celestium Online Team
          </p>
        </div>

        <div className="relative overflow-hidden">
          {/* Gradient fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          
          {/* Scrolling container */}
          <div className="flex animate-scroll hover:pause-animation">
            {/* First set of games */}
            <div className="flex gap-6 px-4 shrink-0">
              {editorsPicks.map((game, index) => (
                <motion.div
                  key={`first-${game.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                  className="shrink-0"
                >
                  <GameCard game={game} />
                </motion.div>
              ))}
            </div>
            {/* Duplicate set for seamless loop */}
            <div className="flex gap-6 px-4 shrink-0">
              {editorsPicks.map((game) => (
                <div key={`second-${game.id}`} className="shrink-0">
                  <GameCard game={game} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
