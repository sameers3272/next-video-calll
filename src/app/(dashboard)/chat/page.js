import { auth } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import connectToDatabase from "@/lib/mongodb"
import Message from "@/models/Message"
import User from "@/models/User"
import mongoose from "mongoose"

async function getRecentChats() {
  try {
    const session = await auth()
    if (!session) return []

    await connectToDatabase()

    // Convert user ID to ObjectId
    const userId = new mongoose.Types.ObjectId(session.user.id)

    // Get all messages where current user is sender or recipient
    const recentMessages = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: userId },
            { recipient: userId }
          ],
          isDeleted: false
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: "$chatId",
          lastMessage: { $first: "$$ROOT" }
        }
      },
      {
        $limit: 20
      }
    ])

    // Populate the messages with user data
    const populatedChats = await Promise.all(
      recentMessages.map(async (chat) => {
        const message = await Message.findById(chat.lastMessage._id)
          .populate('sender', 'name email profilePicture')
          .populate('recipient', 'name email profilePicture')

        const otherUserId = message.sender._id.toString() === session.user.id 
          ? message.recipient._id 
          : message.sender._id
          
        const otherUser = message.sender._id.toString() === session.user.id 
          ? message.recipient 
          : message.sender

        // Count unread messages
        const unreadCount = await Message.countDocuments({
          chatId: chat._id,
          recipient: userId,
          isRead: false
        })

        return {
          _id: chat._id,
          otherUserId: otherUserId.toString(),
          otherUser,
          lastMessage: message,
          unreadCount
        }
      })
    )

    return populatedChats
  } catch (error) {
    console.error('Failed to fetch recent chats:', error)
    return []
  }
}

export default async function ChatPage() {
  const session = await auth()
  const recentChats = await getRecentChats()

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