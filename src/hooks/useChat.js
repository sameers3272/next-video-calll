'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSocket, useSocketEvent } from './useSocket'

export function useChat(userId, chatId) {
  const [messages, setMessages] = useState([])
  const [typingUsers, setTypingUsers] = useState(new Set())
  const [isConnected, setIsConnected] = useState(false)
  const socket = useSocket(userId)

  // Join chat room when component mounts
  useEffect(() => {
    if (socket && chatId) {
      socket.emit('join_chat', chatId)
      
      return () => {
        socket.emit('leave_chat', chatId)
      }
    }
  }, [socket, chatId])

  // Handle connection status
  useSocketEvent(socket, 'connect', useCallback(() => {
    setIsConnected(true)
  }, []))

  useSocketEvent(socket, 'disconnect', useCallback(() => {
    setIsConnected(false)
  }, []))

  // Handle new messages
  useSocketEvent(socket, 'new_message', useCallback((message) => {
    setMessages(prev => [...prev, message])
  }, []))

  // Handle typing indicators
  useSocketEvent(socket, 'user_typing', useCallback(({ userId, userName }) => {
    setTypingUsers(prev => new Set(prev.add(userId)))
  }, []))

  useSocketEvent(socket, 'user_stop_typing', useCallback(({ userId }) => {
    setTypingUsers(prev => {
      const newSet = new Set(prev)
      newSet.delete(userId)
      return newSet
    })
  }, []))

  // Send message function
  const sendMessage = useCallback((message) => {
    if (socket && chatId) {
      socket.emit('send_message', { chatId, message })
    }
  }, [socket, chatId])

  // Typing functions
  const startTyping = useCallback(() => {
    if (socket && chatId && userId) {
      socket.emit('typing_start', { chatId, userId })
    }
  }, [socket, chatId, userId])

  const stopTyping = useCallback(() => {
    if (socket && chatId && userId) {
      socket.emit('typing_stop', { chatId, userId })
    }
  }, [socket, chatId, userId])

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