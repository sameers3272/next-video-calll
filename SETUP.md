# 🚀 Video Chat App Setup Guide

This guide will help you set up the video chat application for development.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js 18+** and npm
- **MongoDB** (local installation or MongoDB Atlas account)
- **Google Account** (for OAuth setup)

## Step 1: Environment Setup

1. **Clone and Install Dependencies**
   ```bash
   git clone <your-repo-url>
   cd next-video-call
   npm install
   ```

2. **Copy Environment Variables**
   ```bash
   cp .env.example .env.local
   ```

## Step 2: MongoDB Setup

### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Your connection string: `mongodb://localhost:27017/videochat`

### Option B: MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create a database user
4. Get your connection string
5. Replace `<password>` with your actual password

## Step 3: Google OAuth Setup

1. **Go to Google Cloud Console**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Google+ API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it

3. **Create OAuth Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://yourdomain.com/api/auth/callback/google` (for production)

4. **Copy Credentials**
   - Copy the Client ID and Client Secret

## Step 4: Configure Environment Variables

Edit your `.env.local` file:

```env
# Database
MONGODB_URI=your-mongodb-connection-string

# NextAuth
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Important Notes:**
- Generate a random `NEXTAUTH_SECRET`: `openssl rand -base64 32`
- For production, update `NEXTAUTH_URL` to your domain

## Step 5: Start Development

1. **Run the development server**
   ```bash
   npm run dev
   ```

2. **Open your browser**
   - Go to [http://localhost:3000](http://localhost:3000)
   - You should see the login page

## Step 6: Test the Application

### Test Authentication
1. Click "Continue with Google"
2. Complete OAuth flow
3. You should be redirected to dashboard

### Test Features
1. **Friends**: Search for users by email
2. **Chat**: Send messages between friends  
3. **Video Calls**: Initiate video calls (requires HTTPS for WebRTC)

## Common Issues & Solutions

### Issue: "Please define the MONGODB_URI environment variable"
**Solution**: Make sure `.env.local` exists and has correct MongoDB URI

### Issue: Google OAuth not working
**Solution**: 
- Check redirect URIs in Google Cloud Console
- Ensure `NEXTAUTH_URL` matches your domain
- Verify Google+ API is enabled

### Issue: Video calls not working in development
**Solution**: 
- Use `https://localhost:3000` instead of `http://`
- WebRTC requires secure context
- Consider using tools like `mkcert` for local SSL

### Issue: Real-time features not working
**Solution**: 
- Check if Socket.io is connecting properly
- Look for connection errors in browser console
- Ensure no firewall blocking WebSocket connections

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Production Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Update `NEXTAUTH_URL` to your Vercel domain
4. Update Google OAuth redirect URIs

### Other Platforms
- Ensure all environment variables are set
- Use MongoDB Atlas for database
- Update OAuth redirect URIs
- Enable HTTPS for WebRTC functionality

## Folder Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth route group
│   ├── (dashboard)/       # Dashboard route group
│   └── api/               # API endpoints
├── components/            # React components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and config
└── models/               # MongoDB models
```

## Need Help?

1. Check the main [README.md](./README.md) for more details
2. Review the [PRD.txt](./PRD.txt) for feature specifications
3. Open an issue in the repository for bugs

## Security Notes

- Never commit real credentials to version control
- Use strong, unique secrets for production
- Regularly rotate API keys and secrets
- Enable MongoDB authentication for production
- Use HTTPS in production for security