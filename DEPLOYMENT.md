# 🚀 Deployment Guide - Next.js Video Chat App

## ⚡ **Quick Deploy Summary**

**✅ Vercel-Ready:** This application is fully compatible with Vercel serverless deployment using polling-based real-time messaging.

**🔄 Two Modes:**
- **Production (Vercel):** Polling every 2 seconds - scalable and serverless
- **Development (Local):** Socket.io real-time - instant messaging for development

---

## Prerequisites

- Working application in development
- MongoDB Atlas account (recommended for production)
- Google OAuth credentials configured for production
- Domain name (optional but recommended)

## 🚀 **Vercel Deployment (Recommended)**

### **✅ Vercel-Compatible Architecture:**
- **Polling-based messaging** - Updates every 2 seconds (no WebSocket needed)
- **Serverless functions** - Auto-scaling API routes  
- **WebRTC video calls** - Peer-to-peer (works with serverless)
- **MongoDB integration** - Database queries in serverless functions

### **🔧 Step 1: Environment Setup**

**Required Environment Variables in Vercel:**
```bash
# Authentication (Required)
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=https://your-app-name.vercel.app
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database (Required)
MONGODB_URI=your-mongodb-connection-string

# Deployment Mode (Important!)
NODE_ENV=production
SOCKET_IO_ENABLED=false
```

### **🚀 Step 2: One-Click Deploy**

1. **Push to GitHub** and connect to Vercel
2. **Add environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically use `npm run vercel-build`
4. **Done!** - Your app runs on serverless architecture with polling

### **📱 Step 3: Test Polling Messaging**

1. **Open your deployed app** in two browser windows
2. **Sign in with different Google accounts**
3. **Send messages** - they should appear within 2-4 seconds
4. **Video calls** work instantly (WebRTC is peer-to-peer)

### Step 4: Configure Custom Domain (Optional)

1. **Add Domain in Vercel**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update Environment Variables**
   - Update `NEXTAUTH_URL` to your custom domain
   - Update Google OAuth redirect URIs

## Option 2: Deploy to Other Platforms

### Railway

1. **Connect Repository**
   - Go to [Railway](https://railway.app)
   - Create new project from GitHub

2. **Add MongoDB Service**
   - Add MongoDB service to your project
   - Copy connection string

3. **Set Environment Variables**
   ```env
   MONGODB_URI=your-railway-mongodb-connection
   NEXTAUTH_SECRET=your-production-secret
   NEXTAUTH_URL=https://your-app.railway.app
   GOOGLE_CLIENT_ID=your-google-client-id  
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   PORT=3000
   ```

### Netlify

1. **Build Settings**
   ```bash
   Build command: npm run build
   Publish directory: .next
   ```

2. **Install Netlify Plugin**
   ```bash
   npm install @netlify/plugin-nextjs
   ```

3. **Create netlify.toml**
   ```toml
   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

## Production Checklist

### Security
- [ ] Strong `NEXTAUTH_SECRET` (32+ characters)
- [ ] MongoDB authentication enabled
- [ ] Environment variables properly set
- [ ] HTTPS enabled (automatic with most providers)
- [ ] Google OAuth redirect URIs updated

### Performance
- [ ] Enable caching headers
- [ ] Optimize images (Next.js handles this automatically)
- [ ] Enable compression
- [ ] Monitor bundle size

### Monitoring
- [ ] Set up error tracking (Sentry recommended)
- [ ] Monitor uptime
- [ ] Set up logging
- [ ] Database performance monitoring

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `NEXTAUTH_SECRET` | NextAuth encryption secret | `super-secret-key-32-chars-long` |
| `NEXTAUTH_URL` | Your application URL | `https://yourapp.com` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `123456789.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | `GOCSPX-abcdefghijklmnop` |

## Post-Deployment Testing

1. **Authentication**
   - [ ] Google login works
   - [ ] User profile creation
   - [ ] Session persistence

2. **Core Features**
   - [ ] Friend search and requests
   - [ ] Real-time messaging
   - [ ] Video calling (requires HTTPS)
   - [ ] Mobile responsiveness

3. **Performance**
   - [ ] Page load times < 3 seconds
   - [ ] API response times < 500ms
   - [ ] Real-time features working

## Troubleshooting

### Common Issues

**"NEXTAUTH_URL mismatch"**
- Ensure `NEXTAUTH_URL` matches your deployed domain exactly

**"MongoDB connection failed"**
- Check connection string format
- Verify database user permissions
- Ensure IP whitelist includes deployment servers

**"Google OAuth not working"**
- Verify redirect URIs in Google Cloud Console
- Check client ID and secret are for production app

**"Video calls not working"**
- Ensure HTTPS is enabled (required for WebRTC)
- Check browser permissions for camera/microphone
- Test with different browsers

### Performance Issues

**Slow initial load**
- Enable Next.js caching
- Optimize database queries
- Use CDN for static assets

**Real-time features slow**
- Check server location vs users
- Monitor database performance
- Consider Redis for session storage

## Scaling Considerations

### Database
- Enable MongoDB replica sets
- Add database indexes for queries
- Consider connection pooling
- Monitor database performance

### Application
- Enable Next.js caching strategies
- Use database query optimization
- Consider implementing rate limiting
- Add request/response compression

### Real-time Features
- Consider Socket.io Redis adapter for multiple instances
- Implement connection throttling
- Add message rate limiting
- Monitor WebSocket connection counts

## Security Hardening

### Production Security
- Regular dependency updates
- Enable security headers
- Implement rate limiting
- Monitor for suspicious activity
- Regular security audits

### Data Protection
- Encrypt sensitive data
- Implement data retention policies
- Regular database backups
- GDPR compliance measures

---

## Quick Start Commands

```bash
# Generate production secret
openssl rand -base64 32

# Test production build locally
npm run build && npm start

# Check for security vulnerabilities
npm audit

# Database backup (MongoDB Atlas)
# Use MongoDB Compass or Atlas backup features
```

Need help? Check the main [README.md](./README.md) or [SETUP.md](./SETUP.md) for more information.