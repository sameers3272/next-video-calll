import { auth } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Users, Phone } from "lucide-react"

async function getRecentMessages() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/messages/recent`, {
      cache: 'no-store'
    })
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error('Failed to fetch recent messages:', error)
  }
  return []
}

async function getOnlineFriends() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/users/online`, {
      cache: 'no-store'
    })
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error('Failed to fetch online friends:', error)
  }
  return []
}

export default async function DashboardPage() {
  const session = await auth()
  const recentMessages = await getRecentMessages()
  const onlineFriends = await getOnlineFriends()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Welcome back, {session.user?.name}!
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recent Messages
            </CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentMessages.length}</div>
            <p className="text-xs text-muted-foreground">
              unread conversations
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Online Friends
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{onlineFriends.length}</div>
            <p className="text-xs text-muted-foreground">
              currently online
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Video Calls
            </CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              missed calls today
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            {recentMessages.length === 0 ? (
              <p className="text-muted-foreground">No recent messages</p>
            ) : (
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div key={message._id} className="flex items-center space-x-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {message.sender?.name || 'Unknown'}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {message.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Online Friends</CardTitle>
          </CardHeader>
          <CardContent>
            {onlineFriends.length === 0 ? (
              <p className="text-muted-foreground">No friends online</p>
            ) : (
              <div className="space-y-4">
                {onlineFriends.map((friend) => (
                  <div key={friend._id} className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {friend.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Online now
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}