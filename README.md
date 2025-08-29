# Video Chat App

A real-time video chat and messaging application built with Next.js 15, featuring Google OAuth authentication, MongoDB integration, Socket.io for real-time communication, and WebRTC for video calling.

## Features

- 🔐 **Google OAuth Authentication** with NextAuth v5
- 👥 **Friend Management System** - Search, add, and manage friends
- 💬 **Real-time Messaging** - Instant messaging with Socket.io
- 📹 **Video Calling** - WebRTC-powered video calls
- 🎨 **Modern UI** - Built with Tailwind CSS and shadcn/ui components
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🟢 **Online Status** - See which friends are currently online
- ⚡ **Real-time Notifications** - Live updates for messages and calls

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS 4.1, shadcn/ui
- **Backend**: Next.js API Routes, MongoDB with Mongoose
- **Authentication**: NextAuth v5 with Google OAuth
- **Real-time Communication**: Socket.io
- **Video Calling**: WebRTC with Simple Peer
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or MongoDB Atlas)
- Google OAuth credentials

### Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

3. Configure your environment variables in `.env.local`:
   ```
   MONGODB_URI=mongodb://localhost:27017/videochat
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Setting up Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

## Key Features

### Authentication
- Sign in with Google OAuth
- Automatic user profile creation
- Session management with NextAuth v5

### Friend Management
- Search users by email
- Send and receive friend requests
- Accept or decline friend requests
- Remove friends

### Real-time Chat
- Instant messaging between friends
- Typing indicators
- Message read receipts
- Online/offline status

### Video Calling
- WebRTC-based video calls
- Audio-only calling option
- Call status management
- In-call controls (mute, camera toggle)

## Project Structure

```
src/
├── app/                    # App Router pages and API routes
│   ├── (auth)/            # Authentication route group
│   ├── (dashboard)/       # Dashboard route group
│   └── api/               # API routes
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── chat/             # Chat components
│   ├── friends/          # Friend management components
│   └── video/            # Video call components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and configurations
└── models/               # MongoDB models
```

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

Make sure to:
- Set all environment variables
- Configure MongoDB Atlas for production
- Update Google OAuth redirect URIs
