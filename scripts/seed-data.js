#!/usr/bin/env node

// Sample data seeder for testing
require('dotenv').config({ path: '.env.local' });

const mongoose = require('mongoose');

// Simple schema definitions for seeding
const UserSchema = new mongoose.Schema({
  googleId: String,
  email: String,
  name: String,
  profilePicture: String,
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now },
  socketId: { type: String, default: '' },
}, { timestamps: true });

const FriendshipSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'accepted', 'declined', 'blocked'], default: 'pending' },
  requestMessage: { type: String, default: '' },
}, { timestamps: true });

const MessageSchema = new mongoose.Schema({
  chatId: String,
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
  messageType: { type: String, enum: ['text', 'image', 'file', 'emoji'], default: 'text' },
  isRead: { type: Boolean, default: false },
  readAt: Date,
  isDeleted: { type: Boolean, default: false },
  editedAt: Date,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Friendship = mongoose.models.Friendship || mongoose.model('Friendship', FriendshipSchema);
const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);

const sampleUsers = [
  {
    googleId: 'demo1',
    email: 'alice@example.com',
    name: 'Alice Johnson',
    profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b381a157?w=150&h=150&fit=crop&crop=face',
    isOnline: true
  },
  {
    googleId: 'demo2', 
    email: 'bob@example.com',
    name: 'Bob Smith',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    isOnline: false
  },
  {
    googleId: 'demo3',
    email: 'charlie@example.com', 
    name: 'Charlie Brown',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    isOnline: true
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database with sample data...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data (be careful in production!)
    if (process.env.NODE_ENV === 'development') {
      await User.deleteMany({ googleId: { $in: ['demo1', 'demo2', 'demo3'] } });
      await Friendship.deleteMany({});
      await Message.deleteMany({});
      console.log('🧹 Cleared existing demo data');
    }

    // Create sample users
    const users = await User.insertMany(sampleUsers);
    console.log(`✅ Created ${users.length} sample users`);

    // Create friendships
    const friendships = [
      {
        requester: users[0]._id,
        recipient: users[1]._id, 
        status: 'accepted'
      },
      {
        requester: users[0]._id,
        recipient: users[2]._id,
        status: 'accepted' 
      },
      {
        requester: users[1]._id,
        recipient: users[2]._id,
        status: 'pending'
      }
    ];

    await Friendship.insertMany(friendships);
    console.log(`✅ Created ${friendships.length} friendships`);

    // Create sample messages
    const chatId1 = [users[0]._id, users[1]._id].sort().join('_');
    const chatId2 = [users[0]._id, users[2]._id].sort().join('_');

    const messages = [
      {
        chatId: chatId1,
        sender: users[0]._id,
        recipient: users[1]._id,
        message: "Hey Bob! How are you doing?",
        isRead: true,
        readAt: new Date()
      },
      {
        chatId: chatId1, 
        sender: users[1]._id,
        recipient: users[0]._id,
        message: "Hi Alice! I'm doing great, thanks for asking! 😊",
        isRead: false
      },
      {
        chatId: chatId2,
        sender: users[2]._id, 
        recipient: users[0]._id,
        message: "Alice, are we still on for the video call later?",
        isRead: false
      },
      {
        chatId: chatId2,
        sender: users[0]._id,
        recipient: users[2]._id, 
        message: "Absolutely! Looking forward to it 📹",
        isRead: true,
        readAt: new Date()
      }
    ];

    await Message.insertMany(messages);
    console.log(`✅ Created ${messages.length} sample messages`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Sample data created:');
    console.log('• 3 demo users (alice@example.com, bob@example.com, charlie@example.com)');
    console.log('• 3 friendships (2 accepted, 1 pending)');
    console.log('• 4 sample messages');
    console.log('\n💡 Tip: You can now test friend features and messaging!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the seeder
seedDatabase();