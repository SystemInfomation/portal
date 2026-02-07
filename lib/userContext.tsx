'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Filter } from 'bad-words'

interface UserContextType {
  userName: string | null
  setUserName: (name: string | null) => void
  clearUserName: () => void
  isLoaded: boolean
  error: string | null
  setError: (error: string | null) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

const filter = new Filter()

export function UserProvider({ children }: { children: ReactNode }) {
  const [userName, setUserNameState] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load name from localStorage on mount
  useEffect(() => {
    try {
      const storedName = localStorage.getItem('forsyth-user-name')
      if (storedName) {
        setUserNameState(storedName.trim())
      }
    } catch (error) {
      console.warn('Failed to read user name from localStorage:', error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  const setUserName = (name: string | null) => {
    try {
      if (name && name.trim()) {
        const trimmedName = name.trim()
        
        // Check for profanity using the bad-words filter
        if (filter.isProfane(trimmedName)) {
          setError('Please enter a name without inappropriate language.')
          return false
        }
        
        // Clear any existing error
        setError(null)
        setUserNameState(trimmedName)
        localStorage.setItem('forsyth-user-name', trimmedName)
        return true
      } else {
        setUserNameState(null)
        localStorage.removeItem('forsyth-user-name')
        setError(null)
        return true
      }
    } catch (error) {
      console.warn('Failed to save user name to localStorage:', error)
      setError('Failed to save name. Please try again.')
      return false
    }
  }

  const clearUserName = () => {
    try {
      setUserNameState(null)
      localStorage.removeItem('forsyth-user-name')
      setError(null)
    } catch (error) {
      console.warn('Failed to clear user name from localStorage:', error)
      setError('Failed to clear name. Please try again.')
    }
  }

  return (
    <UserContext.Provider value={{ userName, setUserName, clearUserName, isLoaded, error, setError }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
