'use client'

import { motion } from 'framer-motion'
import { Sparkles, Dices, Zap, Shield, BookOpen, Gamepad2, Trophy, Star, TrendingUp } from 'lucide-react'
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

  // Get featured games by category
  const featuredByCategory = [
    { id: 'slope', name: 'Slope', category: 'RACING', iconUrl: '/games/slope/favicon.png', iframeSrc: '/games/slope/' },
    { id: '1v1lol', name: '1v1.LOL', category: 'ACTION', iconUrl: '/games/1v1lol/favicon.png', iframeSrc: '/games/1v1lol/' },
    { id: 'retrobowl', name: 'Retro Bowl', category: 'SPORTS', iconUrl: '/games/retrobowl/favicon.png', iframeSrc: '/games/retrobowl/' },
    { id: 'cookie-click', name: 'Cookie Clicker', category: 'PUZZLE', iconUrl: '/games/cookie-click/favicon.png', iframeSrc: '/games/cookie-click/' },
    { id: 'monkey-mart', name: 'Monkey Mart', category: 'ADVENTURE', iconUrl: '/games/monkey-mart/favicon.png', iframeSrc: '/games/monkey-mart/' },
    { id: 'stumble-guys', name: 'Stumble Guys', category: 'PLATFORMER', iconUrl: '/games/stumble-guys/favicon.png', iframeSrc: '/games/stumble-guys/' },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <GridBackground />
      <WelcomeNotification />
      <BookmarkNotification />
      <RatingPopup />
      
      {/* Hero Section - Redesigned */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-8 py-4 relative"
      >
        {/* Floating elements for visual interest */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl animate-float [animation-delay:1s]" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 text-primary text-sm font-semibold shadow-lg"
        >
          <Star className="w-4 h-4 animate-pulse" />
          <span>Start your learning adventure today!</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="space-y-6"
        >
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-6xl md:text-8xl font-black tracking-tight leading-tight"
          >
            <span className="text-gradient">Level Up</span>
            <br />
            <span className="text-foreground">Your Learning</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Turn study time into <span className="text-primary font-semibold">game time</span>. Hundreds of educational games, tools, and resources —{' '}
            <span className="text-secondary font-semibold">fast, safe, and actually fun.</span>
          </motion.p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
        >
          <button
            onClick={() => router.push('/games')}
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-primary to-secondary rounded-2xl font-bold text-xl text-black hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-primary/50"
          >
            <Gamepad2 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            <span>Start Playing Now</span>
          </button>
          
          <button
            onClick={playRandom}
            disabled={isRandomizing}
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl font-bold text-xl text-white hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed animate-pulse-glow"
          >
            <Dices className={`w-6 h-6 ${isRandomizing ? 'animate-spin' : 'group-hover:rotate-12'} transition-transform`} />
            <span>Feeling Lucky?</span>
          </button>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-sm text-muted-foreground"
        >
          <span className="text-primary">Feeling Lucky?</span> takes you to a random game — perfect when you&apos;re bored!
        </motion.p>
      </motion.section>

      {/* Value Proposition Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-4"
      >
        {[
          { icon: Zap, title: 'Lightning Fast', description: 'No loading screens. No delays. Just pure fun.', color: 'from-yellow-400 to-orange-500' },
          { icon: Shield, title: 'Safe & Ad-Free', description: 'No ads, no tracking, no distractions. Just learning.', color: 'from-green-400 to-emerald-500' },
          { icon: BookOpen, title: 'Hundreds of Tools', description: 'Games, quizzes, utilities — all in one place.', color: 'from-blue-400 to-cyan-500' },
          { icon: Trophy, title: 'Actually Fun', description: 'Learning disguised as gaming. You won&apos;t even notice.', color: 'from-purple-400 to-pink-500' },
        ].map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 + index * 0.1, duration: 0.4 }}
            className="group glass rounded-2xl border border-border p-6 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-xl text-center"
          >
            <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${item.color} mb-4 group-hover:scale-110 transition-transform`}>
              <item.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-foreground">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* Featured Games Grid */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        className="space-y-8 py-4"
      >
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-semibold"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Trending Now</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="text-gradient">Popular Games</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Jump into the most-played games on Forsyth — from action-packed to brain-teasing
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {featuredByCategory.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
            >
              <GameCard game={game} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="text-center pt-8"
        >
          <button
            onClick={() => router.push('/games')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 rounded-xl font-semibold text-foreground hover:scale-105 transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
          >
            <span>Explore All Games</span>
            <Sparkles className="w-5 h-5" />
          </button>
        </motion.div>
      </motion.section>

      {/* Category Highlights */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="space-y-8 py-4"
      >
        <div className="text-center space-y-2">
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="text-gradient">Browse by Category</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Find exactly what you&apos;re in the mood for
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-4">
          {[
            { name: 'Action', color: 'from-red-500 to-orange-500', emoji: '⚔️' },
            { name: 'Sports', color: 'from-blue-500 to-cyan-500', emoji: '⚽' },
            { name: 'Puzzle', color: 'from-purple-500 to-pink-500', emoji: '🧩' },
            { name: 'Racing', color: 'from-green-500 to-emerald-500', emoji: '🏎️' },
            { name: 'Adventure', color: 'from-yellow-500 to-amber-500', emoji: '🗺️' },
          ].map((category, index) => (
            <motion.button
              key={category.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5 + index * 0.1, duration: 0.4 }}
              onClick={() => router.push('/games')}
              className={`group glass rounded-2xl border border-border p-6 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-xl text-center`}
              aria-label={`Browse ${category.name} games`}
            >
              <div className={`text-4xl mb-3 group-hover:scale-110 transition-transform`} aria-hidden="true">
                {category.emoji}
              </div>
              <h3 className="font-bold text-lg text-foreground">{category.name}</h3>
              <div className={`h-1 w-full bg-gradient-to-r ${category.color} rounded-full mt-3 opacity-50 group-hover:opacity-100 transition-opacity`} />
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* Editor's Picks - Auto-scrolling Carousel */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="space-y-8 py-4"
      >
        <div className="text-center space-y-2">
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="text-gradient">Editor&apos;s Picks</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Hand-selected favorites from the Forsyth team
          </p>
        </div>

        <div className="relative overflow-hidden">
          {/* Gradient fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          
          {/* Scrolling container */}
          <div className="relative">
            <div className="flex animate-scroll hover:pause-animation overflow-x-auto scrollbar-hide">
              {/* First set of games */}
              <div className="flex gap-6 px-4 shrink-0">
                {editorsPicks.map((game, index) => (
                  <motion.div
                    key={`first-${game.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.7 + index * 0.1, duration: 0.4 }}
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
