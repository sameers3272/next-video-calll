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

export default function ChatInterfaceSimple({ friend, messages: initialMessages, currentUserId, chatId }) {
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState(initialMessages || [])
  const messagesEndRef = useRef(null)

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
      } else {
        console.error('Failed to send message')
        setNewMessage(messageText)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setNewMessage(messageText)
    } finally {
      setIsLoading(false)
    }
  }

  return (
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
              className="h-10 w-10 p-0 hover:bg-green-100 dark:hover:bg-green-900/20"
            >
              <Phone size={20} className="text-green-600" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
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
            
            return (
              <div
                key={message._id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
              >
                <div className={`flex items-end max-w-xs md:max-w-md lg:max-w-lg ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  {!isOwnMessage && (
                    <div className="mb-1 mr-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={message.sender.profilePicture} />
                        <AvatarFallback className="bg-gradient-to-r from-gray-400 to-gray-500 text-white text-xs">
                          {message.sender.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div className={`relative group ${isOwnMessage ? 'ml-2' : 'mr-2'}`}>
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
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-white/20 dark:border-gray-700/50 p-4">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3">
            {/* Message input container */}
            <div className="flex-1 relative">
              <div className="flex items-center bg-white dark:bg-gray-700 rounded-3xl border border-gray-200 dark:border-gray-600 shadow-sm">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
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

            {/* Send button */}
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
  )
}