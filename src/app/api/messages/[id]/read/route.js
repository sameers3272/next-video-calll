import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import connectToDatabase from "@/lib/mongodb"
import Message from "@/models/Message"

export async function PUT(request, { params }) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()
    
    const message = await Message.findOne({
      _id: params.id,
      recipient: session.user.id
    })

    if (!message) {
      return NextResponse.json({ error: "Message not found or unauthorized" }, { status: 404 })
    }

    message.isRead = true
    message.readAt = new Date()
    await message.save()

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email profilePicture')
      .populate('recipient', 'name email profilePicture')

    return NextResponse.json(populatedMessage)
  } catch (error) {
    console.error("Error marking message as read:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}