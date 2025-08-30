'use client'

import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

export function useSocket(userId) {
  const socket = useRef(null)

  useEffect(() => {
    if (!userId) return
    
    // Don't initialize Socket.io in Vercel/production mode when Socket.io is disabled
    const isVercelCompatible = process.env.NODE_ENV === 'production' || !process.env.SOCKET_IO_ENABLED
    if (isVercelCompatible) return

    // Initialize socket connection
    socket.current = io(process.env.NODE_ENV === 'production' 
      ? '' 
      : 'http://localhost:3000'
    )

    const currentSocket = socket.current

    // Authenticate user
    currentSocket.emit('authenticate', userId)

    // Connection event handlers
    currentSocket.on('connect', () => {
      console.log('Connected to server:', currentSocket.id)
    })

    currentSocket.on('disconnect', () => {
      console.log('Disconnected from server')
    })

    // Cleanup on unmount
    return () => {
      if (currentSocket) {
        currentSocket.disconnect()
      }
    }
  }, [userId])

  return socket.current
}

export function useSocketEvent(socket, event, handler) {
  useEffect(() => {
    if (!socket) return

    socket.on(event, handler)

    return () => {
      socket.off(event, handler)
    }
  }, [socket, event, handler])
}