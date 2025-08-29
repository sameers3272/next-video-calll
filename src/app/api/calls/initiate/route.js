import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import connectToDatabase from "@/lib/mongodb"
import Call from "@/models/Call"

export async function POST(request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { recipient, callType = 'video' } = body

    if (!recipient) {
      return NextResponse.json({ error: "Recipient is required" }, { status: 400 })
    }

    if (recipient === session.user.id) {
      return NextResponse.json({ error: "Cannot call yourself" }, { status: 400 })
    }

    await connectToDatabase()
    
    const newCall = new Call({
      caller: session.user.id,
      recipient,
      callType,
      status: 'initiated'
    })

    await newCall.save()

    const populatedCall = await Call.findById(newCall._id)
      .populate('caller', 'name email profilePicture')
      .populate('recipient', 'name email profilePicture')

    return NextResponse.json(populatedCall, { status: 201 })
  } catch (error) {
    console.error("Error initiating call:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}