import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import connectToDatabase from "@/lib/mongodb"
import Message from "@/models/Message"

export async function GET(request, { params }) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit')) || 50
    const page = parseInt(searchParams.get('page')) || 1
    const skip = (page - 1) * limit

    await connectToDatabase()
    
    // Verify the user is part of this chat
    const chatParticipants = params.chatId.split('_')
    if (!chatParticipants.includes(session.user.id)) {
      return NextResponse.json({ error: "Unauthorized to access this chat" }, { status: 403 })
    }

    const messages = await Message.find({
      chatId: params.chatId,
      isDeleted: false
    })
    .populate('sender', 'name email profilePicture')
    .populate('recipient', 'name email profilePicture')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)

    // Mark messages as read for the current user
    await Message.updateMany(
      {
        chatId: params.chatId,
        recipient: session.user.id,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    )

    return NextResponse.json(messages.reverse())
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}