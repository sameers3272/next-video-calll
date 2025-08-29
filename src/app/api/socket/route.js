import { NextResponse } from 'next/server'
import { initializeSocket } from '@/lib/socket'

export async function GET() {
  try {
    if (!global.socketServer) {
      // Create a mock server for Socket.io in development
      const server = {
        listen: () => {},
        on: () => {}
      }
      
      global.socketServer = initializeSocket(server)
    }
    
    return NextResponse.json({ success: true, message: 'Socket.io initialized' })
  } catch (error) {
    console.error('Socket initialization error:', error)
    return NextResponse.json({ error: 'Failed to initialize socket' }, { status: 500 })
  }
}