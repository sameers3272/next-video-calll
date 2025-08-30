import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import connectToDatabase from "@/lib/mongodb"
import WebRTCSignal from "@/models/WebRTCSignal"

export async function POST(request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { recipientId, type, data } = await request.json()

    await connectToDatabase()

    // Create WebRTC signal document
    const signal = new WebRTCSignal({
      senderId: session.user.id,
      recipientId,
      type, // 'offer', 'answer', 'ice-candidate', 'call-end'
      data,
      createdAt: new Date()
    })

    await signal.save()

    return NextResponse.json({ success: true, signalId: signal._id })
  } catch (error) {
    console.error("Error sending WebRTC signal:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const since = searchParams.get('since')

    await connectToDatabase()

    // Build query for signals intended for this user
    const query = { recipientId: session.user.id }
    
    if (since) {
      const sinceDate = new Date(since)
      query.createdAt = { $gt: sinceDate }
    }

    const signals = await WebRTCSignal.find(query)
      .populate('senderId', 'name email profilePicture')
      .sort({ createdAt: 1 })
      .limit(50)

    // Mark signals as received (delete them to avoid duplication)
    if (signals.length > 0) {
      const signalIds = signals.map(s => s._id)
      await WebRTCSignal.deleteMany({ _id: { $in: signalIds } })
    }

    return NextResponse.json(signals)
  } catch (error) {
    console.error("Error fetching WebRTC signals:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}