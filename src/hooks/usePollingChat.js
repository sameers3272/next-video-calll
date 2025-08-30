'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

export function usePollingChat(userId, chatId) {
  const [messages, setMessages] = useState([])
  const [typingUsers, setTypingUsers] = useState(new Set())
  const [isConnected, setIsConnected] = useState(false)
  const pollingInterval = useRef(null)
  const lastMessageId = useRef(null)

  // Polling function to get new messages
  const pollMessages = useCallback(async () => {
    if (!chatId) return

    try {
      const response = await fetch(`/api/messages/chat/${chatId}?since=${lastMessageId.current || ''}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const newMessages = await response.json()
        
        if (newMessages.length > 0) {
          // Update last message ID for next poll
          lastMessageId.current = newMessages[newMessages.length - 1]._id
          
          setMessages(prev => {
            // Merge new messages, avoiding duplicates
            const existingIds = new Set(prev.map(msg => msg._id))
            const uniqueNewMessages = newMessages.filter(msg => !existingIds.has(msg._id))
            
            if (uniqueNewMessages.length > 0) {
              return [...prev, ...uniqueNewMessages]
            }
            return prev
          })
        }
        setIsConnected(true)
      } else {
        setIsConnected(false)
      }
    } catch (error) {
      console.error('Polling error:', error)
      setIsConnected(false)
    }
  }, [chatId])

  // Start polling when chat ID changes
  useEffect(() => {
    if (!chatId) return

    setIsConnected(true)
    
    // Poll immediately
    pollMessages()
    
    // Set up polling interval (every 2 seconds)
    pollingInterval.current = setInterval(pollMessages, 2000)

    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current)
      }
    }
  }, [chatId, pollMessages])

  // Send message function
  const sendMessage = useCallback(async (messageText) => {
    if (!chatId || !messageText.trim()) return false

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient: chatId.split('_').find(id => id !== userId), // Get other user ID
          message: messageText,
          messageType: 'text'
        }),
      })

      if (response.ok) {
        const newMessage = await response.json()
        
        // Add message locally for immediate feedback
        setMessages(prev => [...prev, newMessage])
        lastMessageId.current = newMessage._id
        
        // Poll again soon to catch any updates
        setTimeout(pollMessages, 500)
        
        return true
      }
      return false
    } catch (error) {
      console.error('Error sending message:', error)
      return false
    }
  }, [chatId, userId, pollMessages])

  // Typing functions (simplified for Vercel)
  const startTyping = useCallback(() => {
    // In a Vercel deployment, typing indicators would need a different approach
    // For now, we'll skip real-time typing indicators
  }, [])

  const stopTyping = useCallback(() => {
    // Skip for Vercel compatibility
  }, [])

  return {
    messages,
    setMessages,
    typingUsers,
    isConnected,
    sendMessage,
    startTyping,
    stopTyping,
    socket: null // No socket in polling mode
  }
}