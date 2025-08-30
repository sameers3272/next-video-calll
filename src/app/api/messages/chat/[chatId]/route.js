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
    const since = searchParams.get('since') // For polling: get only new messages since this ID

    await connectToDatabase()
    
    // Verify the user is part of this chat
    const chatParticipants = params.chatId.split('_')
    if (!chatParticipants.includes(session.user.id)) {
      return NextResponse.json({ error: "Unauthorized to access this chat" }, { status: 403 })
    }

    // Build query based on whether this is polling (since parameter) or initial load
    const query = {
      chatId: params.chatId,
      isDeleted: false
    }

    // If "since" parameter is provided, only get messages newer than that ID
    if (since) {
      const sinceMessage = await Message.findById(since)
      if (sinceMessage) {
        query.createdAt = { $gt: sinceMessage.createdAt }
      }
    }

    const messages = await Message.find(query)
      .populate('sender', 'name email profilePicture')
      .populate('recipient', 'name email profilePicture')
      .sort({ createdAt: since ? 1 : -1 }) // Ascending for new messages, descending for initial load
      .limit(since ? 100 : limit) // More messages for polling, paginated for initial load
      .skip(since ? 0 : skip) // No skip for polling

    // Mark messages as read for the current user (only if not polling)
    if (!since) {
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
    }

    return NextResponse.json(since ? messages : messages.reverse())
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}