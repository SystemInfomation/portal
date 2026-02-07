'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface UserContextType {
  userName: string | null
  setUserName: (name: string | null) => void
  clearUserName: () => void
  isLoaded: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [userName, setUserNameState] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

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
        setUserNameState(trimmedName)
        localStorage.setItem('forsyth-user-name', trimmedName)
      } else {
        setUserNameState(null)
        localStorage.removeItem('forsyth-user-name')
      }
    } catch (error) {
      console.warn('Failed to save user name to localStorage:', error)
    }
  }

  const clearUserName = () => {
    try {
      setUserNameState(null)
      localStorage.removeItem('forsyth-user-name')
    } catch (error) {
      console.warn('Failed to clear user name from localStorage:', error)
    }
  }

  return (
    <UserContext.Provider value={{ userName, setUserName, clearUserName, isLoaded }}>
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
