'use client'

import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Utility } from '@/lib/types'
import { cn, withBasePath } from '@/lib/utils'

interface UtilityCardProps {
  utility: Utility
  className?: string
}

export function UtilityCard({ utility, className }: UtilityCardProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/play/${utility.id}`)
  }

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
      onClick={handleClick}
      className={cn(
        'group relative cursor-pointer',
        className
      )}
    >
      <div className="glass rounded-2xl border border-border p-6 h-full flex flex-col items-center gap-4 transition-all duration-300 hover:border-secondary/50 hover:shadow-2xl hover:glow-purple">
        {/* Utility Icon */}
        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
          <Image
            src={withBasePath(utility.iconUrl)}
            alt={utility.name}
            width={80}
            height={80}
            className="object-cover"
            unoptimized
          />
        </div>

        {/* Utility Info */}
        <div className="text-center space-y-2 flex-1">
          <h3 className="font-bold text-lg text-foreground group-hover:text-secondary transition-colors">
            {utility.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {utility.description}
          </p>
        </div>

        {/* Open Button */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-secondary to-accent flex items-center justify-center text-white shadow-lg group-hover:shadow-2xl transition-shadow"
        >
          <Play className="w-5 h-5 fill-current" />
        </motion.div>
      </div>
    </motion.div>
  )
}
