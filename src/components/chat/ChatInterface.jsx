'use client'

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Send, 
  Phone, 
  Video, 
  MoreVertical, 
  Smile, 
  Paperclip,
  Mic,
  CheckCheck,
  Check
} from "lucide-react"
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
    stopTyping,
    socket
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

  // Listen for real-time messages from Socket.io
  useEffect(() => {
    if (!socket) return

    const handleNewMessage = (message) => {
      console.log('Received real-time message:', message)
      setMessages(prev => {
        // Check if message already exists to avoid duplicates
        const exists = prev.find(msg => msg._id === message._id)
        if (exists) return prev
        return [...prev, message]
      })
    }

    socket.on('new_message', handleNewMessage)

    return () => {
      socket.off('new_message', handleNewMessage)
    }
  }, [socket, setMessages])

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
        // Add message locally for immediate feedback
        setMessages(prev => [...prev, newMsg])
        // Send via socket for real-time update to other users
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
      
      <div className="flex flex-col h-full bg-gradient-to-b from-blue-50/20 to-purple-50/20 dark:from-gray-900/20 dark:to-gray-800/20">
        {/* Chat Header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-white/20 dark:border-gray-700/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-12 w-12 ring-2 ring-white/50">
                  <AvatarImage src={friend.profilePicture} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold">
                    {friend.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                {friend.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                )}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{friend.name}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {friend.isOnline ? 'Active now' : `Last seen ${friend.lastSeen ? new Date(friend.lastSeen).toLocaleDateString() : 'recently'}`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleAudioCall}
                className="h-10 w-10 p-0 hover:bg-green-100 dark:hover:bg-green-900/20"
              >
                <Phone size={20} className="text-green-600" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleVideoCall}
                className="h-10 w-10 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/20"
              >
                <Video size={20} className="text-blue-600" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-10 w-10 p-0"
              >
                <MoreVertical size={20} />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message, index) => {
              const isOwnMessage = message.sender._id === currentUserId
              const showAvatar = !isOwnMessage && (index === 0 || messages[index - 1]?.sender._id !== message.sender._id)
              const nextIsSameUser = index < messages.length - 1 && messages[index + 1]?.sender._id === message.sender._id
              
              return (
                <div
                  key={message._id}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} ${
                    nextIsSameUser ? 'mb-1' : 'mb-4'
                  }`}
                >
                  <div className={`flex items-end max-w-xs md:max-w-md lg:max-w-lg ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    {showAvatar && !isOwnMessage && (
                      <div className="mb-1 mr-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={message.sender.profilePicture} />
                          <AvatarFallback className="bg-gradient-to-r from-gray-400 to-gray-500 text-white text-xs">
                            {message.sender.name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                    {!showAvatar && !isOwnMessage && <div className="w-10" />}

                    {/* Message Bubble */}
                    <div className={`relative group ${isOwnMessage ? 'ml-2' : 'mr-2'}`}>
                      {/* Sender name for received messages */}
                      {showAvatar && !isOwnMessage && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 px-3">
                          {message.sender.name}
                        </p>
                      )}
                      
                      {/* Message bubble */}
                      <div
                        className={`px-4 py-3 rounded-3xl shadow-sm ${
                          isOwnMessage
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-lg'
                            : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-lg border border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        <p className="text-sm leading-relaxed break-words">{message.message}</p>
                        
                        {/* Message info */}
                        <div className={`flex items-center justify-end mt-2 space-x-1 ${
                          isOwnMessage ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          <span className="text-xs">
                            {new Date(message.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {isOwnMessage && (
                            <div>
                              {message.isRead ? (
                                <CheckCheck size={14} className="text-blue-200" />
                              ) : (
                                <Check size={14} className="text-blue-300" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="flex items-end">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={friend.profilePicture} />
                    <AvatarFallback className="bg-gradient-to-r from-gray-400 to-gray-500 text-white text-xs">
                      {friend.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-white dark:bg-gray-700 px-4 py-3 rounded-3xl rounded-bl-lg border border-gray-200 dark:border-gray-600 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-white/20 dark:border-gray-700/50 p-4">
          {!isConnected && (
            <div className="mb-3 text-center">
              <span className="text-xs text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/50 px-3 py-1 rounded-full">
                Connecting to chat...
              </span>
            </div>
          )}
          
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-3">
              {/* Attachment button */}
              <Button 
                type="button"
                variant="ghost" 
                size="sm"
                className="h-12 w-12 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Paperclip size={20} className="text-gray-500" />
              </Button>

              {/* Message input container */}
              <div className="flex-1 relative">
                <div className="flex items-center bg-white dark:bg-gray-700 rounded-3xl border border-gray-200 dark:border-gray-600 shadow-sm">
                  <Input
                    value={newMessage}
                    onChange={handleInputChange}
                    placeholder="Type a message..."
                    disabled={isLoading}
                    className="flex-1 border-0 rounded-3xl bg-transparent px-4 py-3 focus-visible:ring-0 text-sm"
                  />
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="sm"
                    className="h-10 w-10 p-0 mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <Smile size={18} className="text-gray-500" />
                  </Button>
                </div>
              </div>

              {/* Send/Voice button */}
              {newMessage.trim() ? (
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="h-12 w-12 p-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg"
                >
                  <Send size={18} />
                </Button>
              ) : (
                <Button 
                  type="button"
                  variant="ghost" 
                  size="sm"
                  className="h-12 w-12 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Mic size={20} className="text-gray-500" />
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  )
}