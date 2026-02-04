'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Github, Heart, Gamepad2, Shield, FileText, Sparkles } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className="relative mt-20"
    >
      {/* Gradient divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      {/* Glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-24 bg-primary/10 blur-3xl -z-10" />

      <div className="glass border-t border-border/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {/* Brand section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">Forsyth Games</h3>
                  <p className="text-xs text-muted-foreground">Portal v5.0.0</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A fast, curated portal for playing HTML games. Built to be simple, safe, and enjoyable.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Quick Links
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <Link 
                  href="/games" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                  All Games
                </Link>
                <Link 
                  href="/utilities" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                  Utilities
                </Link>
                <Link 
                  href="/settings" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                  Settings
                </Link>
              </div>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Legal
              </h4>
              <div className="space-y-2">
                <Link 
                  href="/privacy" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <FileText className="w-3 h-3 text-primary/50 group-hover:text-primary transition-colors" />
                  Privacy Policy
                </Link>
                <Link 
                  href="/terms" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <FileText className="w-3 h-3 text-primary/50 group-hover:text-primary transition-colors" />
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-border/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
                <span>by the Weather Man</span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-primary font-medium">Protected</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  © {currentYear} Forsyth Games Portal
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
