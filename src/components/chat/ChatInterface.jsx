'use client'

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Phone, Video } from "lucide-react"
import { useChat } from "@/hooks/useChat"
import { useWebRTC } from "@/hooks/useWebRTC"
import VideoCallModal from "@/components/video/VideoCallModal"

export default function ChatInterface({ friend, messages: initialMessages, currentUserId, chatId }) {
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  // Use real-time chat hook
  const { 
    messages, 
    setMessages, 
    typingUsers, 
    isConnected, 
    sendMessage, 
    startTyping, 
    stopTyping 
  } = useChat(currentUserId, chatId)

  // Use WebRTC hook for video calls
  const {
    localStream,
    remoteStream,
    isInCall,
    callStatus,
    currentCall,
    localVideoRef,
    remoteVideoRef,
    startCall,
    answerCall,
    declineCall,
    endCall
  } = useWebRTC(currentUserId)

  // Initialize messages
  useEffect(() => {
    setMessages(initialMessages)
  }, [initialMessages, setMessages])

  const isTyping = typingUsers.size > 0

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    
    if (!newMessage.trim() || isLoading) return

    setIsLoading(true)
    const messageText = newMessage
    setNewMessage('')
    stopTyping()

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient: friend._id,
          message: messageText,
          messageType: 'text'
        }),
      })

      if (response.ok) {
        const newMsg = await response.json()
        setMessages(prev => [...prev, newMsg])
        // Send via socket for real-time update
        sendMessage(newMsg)
      } else {
        console.error('Failed to send message')
        setNewMessage(messageText) // Restore the message if failed
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setNewMessage(messageText) // Restore the message if failed
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setNewMessage(e.target.value)
    
    // Handle typing indicators
    if (e.target.value.trim()) {
      startTyping()
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      
      // Set new timeout to stop typing
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping()
      }, 1000)
    } else {
      stopTyping()
    }
  }

  const handleVideoCall = () => {
    startCall(friend._id, 'video')
  }

  const handleAudioCall = () => {
    startCall(friend._id, 'audio')
  }

  return (
    <>
      <VideoCallModal
        isOpen={isInCall}
        callStatus={callStatus}
        currentCall={currentCall ? { ...currentCall, otherUser: friend } : null}
        localVideoRef={localVideoRef}
        remoteVideoRef={remoteVideoRef}
        onEndCall={endCall}
        onAnswer={answerCall}
        onDecline={declineCall}
        localStream={localStream}
      />
      
      <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between bg-card">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={friend.profilePicture} />
            <AvatarFallback>
              {friend.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">{friend.name}</h2>
            <p className="text-sm text-muted-foreground">
              {friend.isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleAudioCall}>
            <Phone size={16} />
          </Button>
          <Button variant="outline" size="sm" onClick={handleVideoCall}>
            <Video size={16} />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isOwnMessage = message.sender._id === currentUserId
          
          return (
            <div
              key={message._id}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex items-end space-x-2 max-w-xs lg:max-w-md">
                {!isOwnMessage && (
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={message.sender.profilePicture} />
                    <AvatarFallback className="text-xs">
                      {message.sender.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`px-3 py-2 rounded-lg ${
                    isOwnMessage
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-end space-x-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={friend.profilePicture} />
                <AvatarFallback className="text-xs">
                  {friend.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted px-3 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t p-4 bg-card">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Type a message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !newMessage.trim()}>
            <Send size={16} />
          </Button>
        </form>
        
        {!isConnected && (
          <p className="text-xs text-muted-foreground mt-2">
            Connecting to chat...
          </p>
        )}
      </div>
    </div>
    </>
  )
}