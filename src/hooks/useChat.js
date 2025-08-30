'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSocket, useSocketEvent } from './useSocket'

export function useChat(userId, chatId) {
  const [messages, setMessages] = useState([])
  const [typingUsers, setTypingUsers] = useState(new Set())
  const [isConnected, setIsConnected] = useState(false)
  const socket = useSocket(userId)

  // Check if we should use Socket.io
  const shouldUseSocket = process.env.NODE_ENV !== 'production' && process.env.SOCKET_IO_ENABLED !== 'false'

  // Join chat room when component mounts
  useEffect(() => {
    if (socket && chatId && shouldUseSocket) {
      socket.emit('join_chat', chatId)
      
      return () => {
        socket.emit('leave_chat', chatId)
      }
    }
  }, [socket, chatId, shouldUseSocket])

  // Handle connection status
  useSocketEvent(socket, 'connect', useCallback(() => {
    if (shouldUseSocket) {
      setIsConnected(true)
    }
  }, [shouldUseSocket]))

  useSocketEvent(socket, 'disconnect', useCallback(() => {
    if (shouldUseSocket) {
      setIsConnected(false)
    }
  }, [shouldUseSocket]))

  // Handle new messages
  useSocketEvent(socket, 'new_message', useCallback((message) => {
    if (shouldUseSocket) {
      setMessages(prev => [...prev, message])
    }
  }, [shouldUseSocket]))

  // Handle typing indicators
  useSocketEvent(socket, 'user_typing', useCallback(({ userId, userName }) => {
    if (shouldUseSocket) {
      setTypingUsers(prev => new Set(prev.add(userId)))
    }
  }, [shouldUseSocket]))

  useSocketEvent(socket, 'user_stop_typing', useCallback(({ userId }) => {
    if (shouldUseSocket) {
      setTypingUsers(prev => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }
  }, [shouldUseSocket]))

  // Send message function
  const sendMessage = useCallback((message) => {
    if (socket && chatId && shouldUseSocket) {
      socket.emit('send_message', { chatId, message })
    }
  }, [socket, chatId, shouldUseSocket])

  // Typing functions
  const startTyping = useCallback(() => {
    if (socket && chatId && userId && shouldUseSocket) {
      socket.emit('typing_start', { chatId, userId })
    }
  }, [socket, chatId, userId, shouldUseSocket])

  const stopTyping = useCallback(() => {
    if (socket && chatId && userId && shouldUseSocket) {
      socket.emit('typing_stop', { chatId, userId })
    }
  }, [socket, chatId, userId, shouldUseSocket])

  return {
    messages,
    setMessages,
    typingUsers,
    isConnected,
    sendMessage,
    startTyping,
    stopTyping,
    socket
  }
}