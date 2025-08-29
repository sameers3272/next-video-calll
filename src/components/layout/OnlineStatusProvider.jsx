'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function OnlineStatusProvider({ children }) {
  const pathname = usePathname()

  useEffect(() => {
    let heartbeatInterval

    const updateOnlineStatus = async (isOnline = true) => {
      try {
        await fetch('/api/users/online', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isOnline }),
        })
      } catch (error) {
        console.error('Failed to update online status:', error)
      }
    }

    // Set user as online when component mounts
    updateOnlineStatus(true)

    // Send heartbeat every 2 minutes to keep user online
    heartbeatInterval = setInterval(() => {
      updateOnlineStatus(true)
    }, 2 * 60 * 1000) // 2 minutes

    // Handle page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User switched away from tab/app
        updateOnlineStatus(false)
      } else {
        // User came back to tab/app
        updateOnlineStatus(true)
      }
    }

    // Handle beforeunload (user closing tab/browser)
    const handleBeforeUnload = () => {
      updateOnlineStatus(false)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      clearInterval(heartbeatInterval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      
      // Set offline when component unmounts
      updateOnlineStatus(false)
    }
  }, [])

  // Update online status when navigating between pages
  useEffect(() => {
    const updateOnlineStatus = async () => {
      try {
        await fetch('/api/users/online', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isOnline: true }),
        })
      } catch (error) {
        console.error('Failed to update online status on navigation:', error)
      }
    }

    updateOnlineStatus()
  }, [pathname])

  return children
}