'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Hexagon } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Games', href: '/games' },
  { name: 'Utilities', href: '/utilities' },
  { name: 'Settings', href: '/settings' },
]

export function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden md:block">
        <div className="glass border border-border rounded-full px-8 py-3 shadow-2xl">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
              <Hexagon className="w-6 h-6" />
              <span className="font-bold text-lg">Forsyth</span>
            </Link>
            
            <div className="flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-all duration-200 hover:text-primary',
                    pathname === item.href
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 md:hidden">
        <div className="glass border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-primary">
              <Hexagon className="w-6 h-6" />
              <span className="font-bold text-lg">Forsyth</span>
            </Link>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed left-0 top-0 bottom-0 w-64 glass border-r border-border z-50 md:hidden"
            >
              <div className="p-6">
                <Link 
                  href="/" 
                  className="flex items-center gap-2 text-primary mb-8"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Hexagon className="w-8 h-8" />
                  <span className="font-bold text-xl">Forsyth Games</span>
                </Link>
                
                <div className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'text-lg font-medium transition-all duration-200 hover:text-primary py-2 px-4 rounded-lg',
                        pathname === item.href
                          ? 'text-primary bg-primary/10'
                          : 'text-muted-foreground'
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
