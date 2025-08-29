import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import connectToDatabase from "@/lib/mongodb"
import Message from "@/models/Message"

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()
    
    // Get all chat IDs where the user is involved
    const allMessages = await Message.find({
      $or: [
        { sender: session.user.id },
        { recipient: session.user.id }
      ],
      isDeleted: false
    })
    .populate('sender', 'name email profilePicture')
    .populate('recipient', 'name email profilePicture')
    .sort({ createdAt: -1 })

    // Group messages by chatId and get the most recent message for each chat
    const chatMap = new Map()
    
    for (const message of allMessages) {
      const chatId = message.chatId
      if (!chatMap.has(chatId)) {
        const otherUserId = message.sender._id.toString() === session.user.id 
          ? message.recipient._id.toString()
          : message.sender._id.toString()
        
        const otherUser = message.sender._id.toString() === session.user.id 
          ? message.recipient
          : message.sender

        // Count unread messages for this chat
        const unreadCount = await Message.countDocuments({
          chatId: chatId,
          recipient: session.user.id,
          isRead: false,
          isDeleted: false
        })

        chatMap.set(chatId, {
          _id: chatId,
          otherUserId,
          otherUser,
          lastMessage: message,
          unreadCount
        })
      }
    }

    const recentChats = Array.from(chatMap.values())
      .sort((a, b) => new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt))

    return NextResponse.json(recentChats)
  } catch (error) {
    console.error("Error fetching recent messages:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}