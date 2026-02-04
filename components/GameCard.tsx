'use client'

import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Game } from '@/lib/types'
import { cn, withBasePath } from '@/lib/utils'

interface GameCardProps {
  game: Game
  className?: string
  disabled?: boolean
}

export function GameCard({ game, className, disabled }: GameCardProps) {
  const router = useRouter()

  const handleClick = () => {
    if (!disabled) {
      router.push(`/play/${game.id}`)
    }
  }

  return (
    <motion.div
      whileHover={!disabled ? { y: -8, scale: 1.02 } : {}}
      transition={{ type: 'spring', stiffness: 300 }}
      onClick={handleClick}
      className={cn(
        'group relative w-64',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className
      )}
    >
      <div className="glass rounded-2xl border border-border p-6 h-full flex flex-col items-center gap-4 transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:glow-cyan relative overflow-hidden">
        {/* Disabled Overlay */}
        {disabled && (
          <div className="absolute inset-0 bg-red-500/20 backdrop-blur-sm border-2 border-red-500/50 rounded-2xl flex items-center justify-center z-10">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <span className="text-red-500 font-bold text-xl uppercase tracking-wider">Disabled</span>
            </div>
          </div>
        )}

        {/* Game Icon */}
        <div className={cn(
          "relative w-20 h-20 rounded-xl overflow-hidden bg-muted flex items-center justify-center shadow-lg transition-shadow",
          !disabled && "group-hover:shadow-xl",
          disabled && "opacity-50"
        )}>
          <Image
            src={withBasePath(game.iconUrl)}
            alt={game.name}
            width={80}
            height={80}
            className="object-cover"
            unoptimized
          />
        </div>

        {/* Game Info */}
        <div className={cn(
          "text-center space-y-2 flex-1",
          disabled && "opacity-50"
        )}>
          <h3 className={cn(
            "font-bold text-lg transition-colors line-clamp-2",
            disabled ? "text-muted-foreground" : "text-foreground group-hover:text-primary"
          )}>
            {game.name}
          </h3>
          <span className={cn(
            "inline-block px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider",
            disabled 
              ? "bg-muted/50 text-muted-foreground" 
              : "bg-secondary/20 text-secondary"
          )}>
            {game.category}
          </span>
        </div>

        {/* Play Button */}
        <motion.div
          whileHover={!disabled ? { scale: 1.1 } : {}}
          whileTap={!disabled ? { scale: 0.95 } : {}}
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-shadow",
            disabled 
              ? "bg-muted/50 text-muted-foreground cursor-not-allowed" 
              : "bg-gradient-to-r from-primary to-secondary text-black cursor-pointer group-hover:shadow-2xl"
          )}
        >
          <Play className="w-5 h-5 fill-current" />
        </motion.div>
      </div>
    </motion.div>
  )
}
