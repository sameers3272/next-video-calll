import { io } from 'socket.io-client'

let socket = null

export const initializeSocket = (userId) => {
  if (!socket && typeof window !== 'undefined') {
    socket = io({
      query: { userId },
      transports: ['websocket', 'polling']
    })

    socket.on('connect', () => {
      console.log('Connected to Socket.io server')
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.io server')
    })

    socket.on('error', (error) => {
      console.error('Socket.io error:', error)
    })
  }

  return socket
}

export const getSocket = () => socket

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}