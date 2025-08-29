import mongoose from 'mongoose';

const FriendshipSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'blocked'],
    default: 'pending',
  },
  requestMessage: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

FriendshipSchema.index({ requester: 1, recipient: 1 }, { unique: true });

export default mongoose.models.Friendship || mongoose.model('Friendship', FriendshipSchema);