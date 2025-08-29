'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, UserPlus } from "lucide-react"

export default function FriendSearch() {
  const [searchEmail, setSearchEmail] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isSendingRequest, setIsSendingRequest] = useState(false)
  const [message, setMessage] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchEmail.trim() || isSearching) return

    setIsSearching(true)
    setSearchResult(null)
    setMessage('')

    try {
      const response = await fetch('/api/friends/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: searchEmail }),
      })

      if (response.ok) {
        const user = await response.json()
        setSearchResult(user)
      } else {
        const error = await response.json()
        setMessage(error.error || 'User not found')
      }
    } catch (error) {
      console.error('Search error:', error)
      setMessage('An error occurred while searching')
    } finally {
      setIsSearching(false)
    }
  }

  const handleSendFriendRequest = async (recipientId) => {
    if (isSendingRequest) return

    setIsSendingRequest(true)

    try {
      const response = await fetch('/api/friends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          recipientId,
          requestMessage: 'Hi! I would like to add you as a friend.' 
        }),
      })

      if (response.ok) {
        setMessage('Friend request sent successfully!')
        setSearchResult(null)
        setSearchEmail('')
      } else {
        const error = await response.json()
        setMessage(error.error || 'Failed to send friend request')
      }
    } catch (error) {
      console.error('Friend request error:', error)
      setMessage('An error occurred while sending the request')
    } finally {
      setIsSendingRequest(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search size={20} />
          Find Friends
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter friend's email address"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            disabled={isSearching}
          />
          <Button type="submit" disabled={isSearching || !searchEmail.trim()}>
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </form>

        {message && (
          <p className={`text-sm ${
            message.includes('successfully') ? 'text-green-600' : 'text-red-600'
          }`}>
            {message}
          </p>
        )}

        {searchResult && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={searchResult.profilePicture} />
                    <AvatarFallback>
                      {searchResult.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{searchResult.name}</p>
                    <p className="text-sm text-muted-foreground">{searchResult.email}</p>
                  </div>
                </div>
                <Button
                  onClick={() => handleSendFriendRequest(searchResult._id)}
                  disabled={isSendingRequest}
                  size="sm"
                >
                  <UserPlus size={16} className="mr-1" />
                  {isSendingRequest ? 'Sending...' : 'Add Friend'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}