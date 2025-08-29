import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import connectToDatabase from "@/lib/mongodb"
import Message from "@/models/Message"

export async function DELETE(request, { params }) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()
    
    const message = await Message.findOne({
      _id: params.id,
      sender: session.user.id
    })

    if (!message) {
      return NextResponse.json({ error: "Message not found or unauthorized" }, { status: 404 })
    }

    message.isDeleted = true
    await message.save()

    return NextResponse.json({ message: "Message deleted successfully" })
  } catch (error) {
    console.error("Error deleting message:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}