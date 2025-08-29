import mongoose from 'mongoose';

const CallSchema = new mongoose.Schema({
  caller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  callType: {
    type: String,
    enum: ['video', 'audio'],
    default: 'video',
  },
  status: {
    type: String,
    enum: ['initiated', 'ringing', 'answered', 'ended', 'declined'],
    default: 'initiated',
  },
  startTime: {
    type: Date,
    default: Date.now,
  },
  endTime: {
    type: Date,
  },
  duration: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Call || mongoose.model('Call', CallSchema);