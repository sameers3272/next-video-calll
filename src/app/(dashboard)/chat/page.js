import { auth } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

async function getRecentChats(userId) {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/messages/recent`, {
      cache: 'no-store',
      headers: {
        'user-id': userId
      }
    })
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error('Failed to fetch recent chats:', error)
  }
  return []
}

export default async function ChatPage() {
  const session = await auth()
  const recentChats = await getRecentChats(session.user.id)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Chats</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Conversations</CardTitle>
        </CardHeader>
        <CardContent>
          {recentChats.length === 0 ? (
            <p className="text-muted-foreground">No conversations yet. Start chatting with your friends!</p>
          ) : (
            <div className="space-y-4">
              {recentChats.map((chat) => (
                <Link 
                  key={chat._id} 
                  href={`/chat/${chat.otherUserId}`}
                  className="flex items-center space-x-4 p-4 hover:bg-accent rounded-lg transition-colors"
                >
                  <Avatar>
                    <AvatarImage src={chat.otherUser?.profilePicture} />
                    <AvatarFallback>
                      {chat.otherUser?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">
                        {chat.otherUser?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(chat.lastMessage?.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {chat.lastMessage?.message || 'No messages yet'}
                    </p>
                  </div>
                  {chat.unreadCount > 0 && (
                    <div className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {chat.unreadCount}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}