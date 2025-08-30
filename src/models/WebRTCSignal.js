import mongoose from 'mongoose'

const WebRTCSignalSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['offer', 'answer', 'ice-candidate', 'call-end', 'call-decline']
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // Auto-delete after 5 minutes
  }
})

// Index for efficient querying
WebRTCSignalSchema.index({ recipientId: 1, createdAt: 1 })
WebRTCSignalSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 })

export default mongoose.models.WebRTCSignal || mongoose.model('WebRTCSignal', WebRTCSignalSchema)