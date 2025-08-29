import { auth } from "@/lib/auth"
import { notFound } from "next/navigation"
import ChatInterface from "@/components/chat/ChatInterface"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import Message from "@/models/Message"

async function getUser(userId) {
  try {
    await connectToDatabase()
    const user = await User.findById(userId).select('-googleId')
    return user
  } catch (error) {
    console.error('Failed to fetch user:', error)
    return null
  }
}

async function getMessages(chatId, currentUserId) {
  try {
    await connectToDatabase()
    
    // Verify the user is part of this chat
    const chatParticipants = chatId.split('_')
    if (!chatParticipants.includes(currentUserId)) {
      return []
    }

    const messages = await Message.find({
      chatId: chatId,
      isDeleted: false
    })
    .populate('sender', 'name email profilePicture')
    .populate('recipient', 'name email profilePicture')
    .sort({ createdAt: 1 }) // Oldest first for chat display
    .limit(50)

    // Mark messages as read for the current user
    await Message.updateMany(
      {
        chatId: chatId,
        recipient: currentUserId,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    )

    return messages
  } catch (error) {
    console.error('Failed to fetch messages:', error)
    return []
  }
}

export default async function ChatWithFriendPage({ params }) {
  const session = await auth()
  const friendId = params.friendId
  
  const friend = await getUser(friendId)
  if (!friend) {
    notFound()
  }
  
  const chatId = [session.user.id, friendId].sort().join('_')
  const messages = await getMessages(chatId, session.user.id)

  return (
    <div className="flex flex-col h-screen">
      <ChatInterface
        friend={friend}
        messages={messages}
        currentUserId={session.user.id}
        chatId={chatId}
      />
    </div>
  )
}