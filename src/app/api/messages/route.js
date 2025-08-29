import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import connectToDatabase from "@/lib/mongodb"
import Message from "@/models/Message"

export async function POST(request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { recipient, message, messageType = 'text' } = body

    if (!recipient || !message) {
      return NextResponse.json({ error: "Recipient and message are required" }, { status: 400 })
    }

    const chatId = [session.user.id, recipient].sort().join('_')

    await connectToDatabase()
    
    const newMessage = new Message({
      chatId,
      sender: session.user.id,
      recipient,
      message,
      messageType,
      isRead: false
    })

    await newMessage.save()

    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'name email profilePicture')
      .populate('recipient', 'name email profilePicture')

    return NextResponse.json(populatedMessage, { status: 201 })
  } catch (error) {
    console.error("Error creating message:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}