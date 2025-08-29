import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import connectToDatabase from "@/lib/mongodb"
import Call from "@/models/Call"

export async function POST(request, { params }) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()
    
    const call = await Call.findOne({
      _id: params.id,
      recipient: session.user.id,
      status: { $in: ['initiated', 'ringing'] }
    })

    if (!call) {
      return NextResponse.json({ error: "Call not found or already handled" }, { status: 404 })
    }

    call.status = 'declined'
    call.endTime = new Date()
    await call.save()

    const populatedCall = await Call.findById(call._id)
      .populate('caller', 'name email profilePicture')
      .populate('recipient', 'name email profilePicture')

    return NextResponse.json(populatedCall)
  } catch (error) {
    console.error("Error declining call:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}