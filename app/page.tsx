'use client'

import { motion } from 'framer-motion'
import { Sparkles, Dices } from 'lucide-react'
import { editorsPicks } from '@/data/editors-picks'
import { games } from '@/data/games'
import { GameCard } from '@/components/GameCard'
import { Footer } from '@/components/Footer'
import { BookmarkNotification } from '@/components/BookmarkNotification'
import { RatingPopup } from '@/components/RatingPopup'
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
      <WelcomeNotification />
      <BookmarkNotification />
      <RatingPopup />
      
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-6 py-8"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium"
        >
          <Sparkles className="w-4 h-4" />
          <span>Start Your Adventure</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center space-y-8 py-12"
        >
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-5xl md:text-7xl font-black tracking-tight"
          >
            <span className="text-gradient">Forsyth Games</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Discover a world of educational games, interactive tools, and study resources — all in one fast, safe, and engaging platform designed to help you succeed.
          </motion.p>
          <motion.hr
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="w-3/4 mx-auto border-0 h-px bg-gradient-to-r from-transparent via-border to-transparent my-12"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="py-8"
        >
          <button
            onClick={playRandom}
            disabled={isRandomizing}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-full font-bold text-lg text-white hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl hover:from-purple-700 hover:via-pink-700 hover:to-red-700 animate-pulse-glow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className={`w-6 h-6 ${isRandomizing ? 'animate-spin' : 'group-hover:rotate-12'} transition-transform`} />
            <span className="drop-shadow-lg">Feeling Lucky? 🎲</span>
          </button>
          <p className="text-sm text-muted-foreground mt-3 text-center">
            Discover an unexpected gaming adventure — Perfect for when you're bored!
          </p>
        </motion.div>
      </motion.section>

      {/* Editor's Picks - Auto-scrolling Carousel */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="space-y-8 py-12"
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
          
          {/* Scrolling container with enhanced controls */}
          <div className="relative">
            {/* Scroll controls */}
            <div className="absolute top-4 left-4 z-20 flex gap-2 bg-black/20 backdrop-blur-sm rounded-lg p-2 opacity-0 hover:opacity-100 transition-opacity">
              <button
                onClick={() => {
                  const container = document.querySelector('.animate-scroll');
                  if (container) {
                    container.scrollBy({ left: -300, behavior: 'smooth' });
                  }
                }}
                className="text-white/80 hover:text-white p-2 rounded bg-blue-500/20 hover:bg-blue-600 transition-colors"
                title="Scroll left"
              >
                ←
              </button>
              <button
                onClick={() => {
                  const container = document.querySelector('.animate-scroll');
                  if (container) {
                    container.scrollBy({ left: 300, behavior: 'smooth' });
                  }
                }}
                className="text-white/80 hover:text-white p-2 rounded bg-blue-500/20 hover:bg-blue-600 transition-colors"
                title="Scroll right"
              >
                →
              </button>
              <button
                onClick={() => {
                  const container = document.querySelector('.animate-scroll');
                  if (container) {
                    container.scrollTo({ left: 0, behavior: 'smooth' });
                  }
                }}
                className="text-white/80 hover:text-white p-2 rounded bg-green-500/20 hover:bg-green-600 transition-colors"
                title="Reset position"
              >
                ⏸
              </button>
            </div>
            
            <div className="flex animate-scroll hover:pause-animation overflow-x-auto">
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
      </div>
      </motion.section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
