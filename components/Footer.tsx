'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Heart, Gamepad2, Shield, FileText, Sparkles, Github, Twitter, Mail, ArrowUp } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className="relative mt-20"
    >
      {/* Enhanced gradient divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      {/* Subtle glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-32 bg-gradient-to-b from-primary/5 to-transparent blur-3xl -z-10" />

      <div className="glass border-t border-border/30 backdrop-blur-xl bg-gradient-to-b from-background/80 to-background/40">
        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Brand section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-secondary flex items-center justify-center shadow-lg shadow-primary/25">
                  <Gamepad2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-foreground tracking-tight">Forsyth Games</h3>
                  <p className="text-xs text-muted-foreground font-mono">Portal v5.0.0</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                A fast, curated portal for playing HTML games. Built to be simple, safe, and enjoyable.
              </p>
              
              {/* Social links */}
              <div className="flex items-center gap-3">
                <button className="w-9 h-9 rounded-lg bg-muted/50 hover:bg-muted border border-border/50 flex items-center justify-center transition-all hover:scale-105">
                  <Github className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="w-9 h-9 rounded-lg bg-muted/50 hover:bg-muted border border-border/50 flex items-center justify-center transition-all hover:scale-105">
                  <Twitter className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="w-9 h-9 rounded-lg bg-muted/50 hover:bg-muted border border-border/50 flex items-center justify-center transition-all hover:scale-105">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Quick Links
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <Link 
                  href="/games" 
                  className="text-sm text-muted-foreground hover:text-primary transition-all duration-200 flex items-center gap-2 group py-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                  <span className="group-hover:translate-x-1 transition-transform">All Games</span>
                </Link>
                <Link 
                  href="/utilities" 
                  className="text-sm text-muted-foreground hover:text-primary transition-all duration-200 flex items-center gap-2 group py-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                  <span className="group-hover:translate-x-1 transition-transform">Utilities</span>
                </Link>
                <Link 
                  href="/settings" 
                  className="text-sm text-muted-foreground hover:text-primary transition-all duration-200 flex items-center gap-2 group py-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                  <span className="group-hover:translate-x-1 transition-transform">Settings</span>
                </Link>
                <Link 
                  href="/about" 
                  className="text-sm text-muted-foreground hover:text-primary transition-all duration-200 flex items-center gap-2 group py-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                  <span className="group-hover:translate-x-1 transition-transform">About</span>
                </Link>
              </div>
            </div>

            {/* Legal */}
            <div className="space-y-6">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Legal
              </h4>
              <div className="space-y-3">
                <Link 
                  href="/privacy" 
                  className="text-sm text-muted-foreground hover:text-primary transition-all duration-200 flex items-center gap-3 group py-1"
                >
                  <FileText className="w-3.5 h-3.5 text-primary/40 group-hover:text-primary transition-colors" />
                  <span className="group-hover:translate-x-1 transition-transform">Privacy Policy</span>
                </Link>
                <Link 
                  href="/terms" 
                  className="text-sm text-muted-foreground hover:text-primary transition-all duration-200 flex items-center gap-3 group py-1"
                >
                  <FileText className="w-3.5 h-3.5 text-primary/40 group-hover:text-primary transition-colors" />
                  <span className="group-hover:translate-x-1 transition-transform">Terms of Service</span>
                </Link>
                <Link 
                  href="/contact" 
                  className="text-sm text-muted-foreground hover:text-primary transition-all duration-200 flex items-center gap-3 group py-1"
                >
                  <Mail className="w-3.5 h-3.5 text-primary/40 group-hover:text-primary transition-colors" />
                  <span className="group-hover:translate-x-1 transition-transform">Contact Us</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Enhanced bottom bar */}
          <div className="pt-8 border-t border-border/20">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-3 text-sm text-muted-foreground text-center lg:text-left">
                <span>Made with</span>
                <a 
                  href="https://www.heart.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:scale-125 transition-transform"
                  aria-label="Visit Heart.org"
                >
                  <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse cursor-pointer" />
                </a>
                <span>by the Weather Man</span>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 backdrop-blur-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-sm shadow-green-500/50" />
                  <span className="text-xs text-primary font-medium">Protected</span>
                </div>
                <span className="text-xs text-muted-foreground text-center">
                  © {currentYear} Forsyth Games Portal
                </span>
                
                {/* Back to top button */}
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="w-8 h-8 rounded-lg bg-muted/50 hover:bg-muted border border-border/50 flex items-center justify-center transition-all hover:scale-105 hover:bg-primary/10 hover:border-primary/30"
                  aria-label="Back to top"
                >
                  <ArrowUp className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
