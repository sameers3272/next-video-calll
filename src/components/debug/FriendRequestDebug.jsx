'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function FriendRequestDebug() {
  const [friendRequests, setFriendRequests] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchFriendRequests = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/friends/requests')
      
      if (response.ok) {
        const data = await response.json()
        setFriendRequests(data)
        console.log('Friend requests fetched:', data)
      } else {
        const errorData = await response.json()
        setError(`Error ${response.status}: ${errorData.error}`)
        console.error('Failed to fetch friend requests:', errorData)
      }
    } catch (err) {
      setError(`Network error: ${err.message}`)
      console.error('Network error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFriendRequests()
  }, [])

  return (
    <Card className="mb-6 border-orange-200 bg-orange-50 dark:bg-orange-950/20">
      <CardHeader>
        <CardTitle className="text-orange-700 dark:text-orange-400">
          🔍 Debug: Friend Requests (Remove this component in production)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={fetchFriendRequests} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Refresh Friend Requests'}
          </Button>

          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="text-sm">
            <p><strong>Friend Requests Found:</strong> {friendRequests.length}</p>
            
            {friendRequests.length > 0 ? (
              <div className="mt-3 space-y-2">
                {friendRequests.map((request, index) => (
                  <div key={request._id} className="p-2 bg-white dark:bg-gray-800 border rounded">
                    <p><strong>Request #{index + 1}:</strong></p>
                    <p>ID: {request._id}</p>
                    <p>From: {request.requester?.name} ({request.requester?.email})</p>
                    <p>Status: {request.status}</p>
                    <p>Created: {new Date(request.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                No friend requests found. Try sending yourself a friend request from another account to test.
              </p>
            )}
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            <p><strong>How to test:</strong></p>
            <ol className="list-decimal list-inside mt-1 space-y-1">
              <li>Create a second Google account</li>
              <li>Sign up for the app with that account</li>
              <li>Search for your main account's email</li>
              <li>Send a friend request</li>
              <li>Sign back into your main account</li>
              <li>Check if the request appears here and in the main UI</li>
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}