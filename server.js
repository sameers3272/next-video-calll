const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server } = require('socket.io')

// Dynamic imports for ES modules
let connectToDatabase, User

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

// Create Next.js app
const app = next({ dev, hostname, port })
const handler = app.getRequestHandler()

app.prepare().then(async () => {
  // Load ES modules
  try {
    const mongoModule = await import('./src/lib/mongodb.js')
    const userModule = await import('./src/models/User.js')
    connectToDatabase = mongoModule.default
    User = userModule.default
  } catch (error) {
    console.log('Warning: Could not load database modules. Socket.io will work without database integration.')
  }
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handler(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  // Create Socket.io server
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:3000'],
      methods: ['GET', 'POST']
    }
  })

  // Socket.io connection handling
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id)

    // Handle user authentication and online status
    socket.on('authenticate', async (userId) => {
      try {
        if (connectToDatabase && User) {
          await connectToDatabase()
          
          // Update user's online status and socket ID
          await User.findByIdAndUpdate(userId, {
            isOnline: true,
            socketId: socket.id,
            lastSeen: new Date()
          })
        }

        // Join user-specific room
        socket.join(`user_${userId}`)
        socket.userId = userId

        console.log(`User ${userId} authenticated with socket ${socket.id}`)

        // Broadcast to friends that user is online
        socket.broadcast.emit('user_online', { userId, socketId: socket.id })
      } catch (error) {
        console.error('Authentication error:', error)
      }
    })

    // Handle joining chat rooms
    socket.on('join_chat', (chatId) => {
      socket.join(chatId)
      console.log(`Socket ${socket.id} joined chat ${chatId}`)
    })

    // Handle leaving chat rooms
    socket.on('leave_chat', (chatId) => {
      socket.leave(chatId)
      console.log(`Socket ${socket.id} left chat ${chatId}`)
    })

    // Handle new messages
    socket.on('send_message', (data) => {
      const { chatId, message } = data
      console.log(`Message sent to chat ${chatId}:`, message)
      
      // Broadcast to all users in the chat except sender
      socket.to(chatId).emit('new_message', message)
    })

    // Handle typing indicators
    socket.on('typing_start', (data) => {
      const { chatId, userId, userName } = data
      socket.to(chatId).emit('user_typing', { userId, userName })
    })

    socket.on('typing_stop', (data) => {
      const { chatId, userId } = data
      socket.to(chatId).emit('user_stop_typing', { userId })
    })

    // Handle video call signaling
    socket.on('call_initiate', (data) => {
      const { recipientId, callId, offer } = data
      socket.to(`user_${recipientId}`).emit('incoming_call', {
        callId,
        offer,
        caller: socket.userId
      })
    })

    socket.on('call_answer', (data) => {
      const { callerId, callId, answer } = data
      socket.to(`user_${callerId}`).emit('call_answered', {
        callId,
        answer
      })
    })

    socket.on('call_decline', (data) => {
      const { callerId, callId } = data
      socket.to(`user_${callerId}`).emit('call_declined', {
        callId
      })
    })

    socket.on('call_end', (data) => {
      const { otherUserId, callId } = data
      socket.to(`user_${otherUserId}`).emit('call_ended', {
        callId
      })
    })

    // Handle WebRTC signaling
    socket.on('webrtc_offer', (data) => {
      const { recipientId, offer } = data
      socket.to(`user_${recipientId}`).emit('webrtc_offer', {
        offer,
        senderId: socket.userId
      })
    })

    socket.on('webrtc_answer', (data) => {
      const { recipientId, answer } = data
      socket.to(`user_${recipientId}`).emit('webrtc_answer', {
        answer,
        senderId: socket.userId
      })
    })

    socket.on('webrtc_ice_candidate', (data) => {
      const { recipientId, candidate } = data
      socket.to(`user_${recipientId}`).emit('webrtc_ice_candidate', {
        candidate,
        senderId: socket.userId
      })
    })

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log('User disconnected:', socket.id)
      
      if (socket.userId) {
        try {
          if (connectToDatabase && User) {
            await connectToDatabase()
            
            // Update user's online status
            await User.findByIdAndUpdate(socket.userId, {
              isOnline: false,
              socketId: '',
              lastSeen: new Date()
            })
          }

          // Broadcast to friends that user is offline
          socket.broadcast.emit('user_offline', { userId: socket.userId })
        } catch (error) {
          console.error('Disconnect error:', error)
        }
      }
    })
  })

  httpServer
    .once('error', (err) => {
      console.error('Server error:', err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
      console.log(`> Socket.io server running on port ${port}`)
    })
})