'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, X, UserPlus } from "lucide-react"
import { useRouter } from 'next/navigation'

export default function FriendRequestCard({ request }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const router = useRouter()

  const handleFriendRequest = async (action) => {
    if (isProcessing) return

    setIsProcessing(true)
    
    try {
      const response = await fetch(`/api/friends/requests/${request._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        setIsHidden(true)
        router.refresh() // Refresh the server component data
      } else {
        const error = await response.json()
        console.error('Failed to process friend request:', error.error)
      }
    } catch (error) {
      console.error('Error processing friend request:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (isHidden) return null

  return (
    <div className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl border border-gray-200/50 dark:border-gray-600/50 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="h-12 w-12 ring-2 ring-purple-200">
              <AvatarImage src={request.requester?.profilePicture} />
              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
                {request.requester?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
              <UserPlus size={12} className="text-white" />
            </div>
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{request.requester?.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{request.requester?.email}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            onClick={() => handleFriendRequest('accept')}
            disabled={isProcessing}
          >
            <Check size={16} className="mr-1" />
            {isProcessing ? 'Processing...' : 'Accept'}
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="hover:bg-red-50 hover:border-red-200 hover:text-red-600"
            onClick={() => handleFriendRequest('decline')}
            disabled={isProcessing}
          >
            <X size={16} className="mr-1" />
            Decline
          </Button>
        </div>
      </div>
    </div>
  )
}