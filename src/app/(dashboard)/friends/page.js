import { auth } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import FriendSearch from "@/components/friends/FriendSearch"

async function getFriends(userId) {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/friends`, {
      cache: 'no-store',
      headers: {
        'user-id': userId
      }
    })
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error('Failed to fetch friends:', error)
  }
  return []
}

async function getFriendRequests(userId) {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/friends/requests`, {
      cache: 'no-store',
      headers: {
        'user-id': userId
      }
    })
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error('Failed to fetch friend requests:', error)
  }
  return []
}

export default async function FriendsPage() {
  const session = await auth()
  const friends = await getFriends(session.user.id)
  const friendRequests = await getFriendRequests(session.user.id)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Friends</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FriendSearch />
        
        <Card>
          <CardHeader>
            <CardTitle>Friend Requests ({friendRequests.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {friendRequests.length === 0 ? (
              <p className="text-muted-foreground">No pending requests</p>
            ) : (
              <div className="space-y-4">
                {friendRequests.map((request) => (
                  <div key={request._id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={request.requester?.profilePicture} />
                        <AvatarFallback>
                          {request.requester?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{request.requester?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {request.requester?.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="default">
                        Accept
                      </Button>
                      <Button size="sm" variant="outline">
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Your Friends ({friends.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {friends.length === 0 ? (
            <p className="text-muted-foreground">No friends yet. Add some friends to get started!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {friends.map((friend) => (
                <div key={friend._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={friend.profilePicture} />
                      <AvatarFallback>
                        {friend.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{friend.name}</p>
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${friend.isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                        <p className="text-sm text-muted-foreground">
                          {friend.isOnline ? 'Online' : 'Offline'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      Message
                    </Button>
                    <Button size="sm">
                      Call
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}