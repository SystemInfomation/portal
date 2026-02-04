'use client'

import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Game } from '@/lib/types'
import { cn } from '@/lib/utils'

interface GameCardProps {
  game: Game
  className?: string
}

export function GameCard({ game, className }: GameCardProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/play/${game.id}`)
  }

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
      onClick={handleClick}
      className={cn(
        'group relative w-64 cursor-pointer',
        className
      )}
    >
      <div className="glass rounded-2xl border border-border p-6 h-full flex flex-col items-center gap-4 transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:glow-cyan">
        {/* Game Icon */}
        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
          <Image
            src={game.iconUrl}
            alt={game.name}
            width={80}
            height={80}
            className="object-cover"
            unoptimized
          />
        </div>

        {/* Game Info */}
        <div className="text-center space-y-2 flex-1">
          <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {game.name}
          </h3>
          <span className="inline-block px-3 py-1 rounded-full bg-secondary/20 text-secondary text-xs font-medium uppercase tracking-wider">
            {game.category}
          </span>
        </div>

        {/* Play Button */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-black shadow-lg group-hover:shadow-2xl transition-shadow"
        >
          <Play className="w-5 h-5 fill-current" />
        </motion.div>
      </div>
    </motion.div>
  )
}
