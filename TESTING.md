# 🧪 Testing Guide

This guide helps you thoroughly test all features of the video chat application.

## Testing Setup

### Prerequisites
- Application running locally (`npm run dev`)
- MongoDB connection established
- Google OAuth configured
- Sample data seeded (`npm run seed`)

### Test Users
The seed script creates these test users:
- **Alice Johnson** - alice@example.com
- **Bob Smith** - bob@example.com  
- **Charlie Brown** - charlie@example.com

## Manual Testing Checklist

### 1. Authentication Testing ✅

#### Google OAuth Login
- [ ] Visit `/login` page
- [ ] Click "Continue with Google" 
- [ ] Complete OAuth flow
- [ ] Verify redirect to `/dashboard`
- [ ] Check user profile appears correctly

#### Session Management
- [ ] Refresh page - session persists
- [ ] Sign out - redirected to login
- [ ] Protected pages redirect to login when not authenticated
- [ ] Session expires appropriately

### 2. User Interface Testing 📱

#### Responsive Design
- [ ] **Desktop** (1920x1080): Full sidebar visible
- [ ] **Tablet** (768x1024): Sidebar still accessible  
- [ ] **Mobile** (375x667): Mobile sidebar with hamburger menu
- [ ] All buttons and inputs accessible on small screens

#### Navigation
- [ ] All sidebar links work correctly
- [ ] Mobile hamburger menu opens/closes
- [ ] Active page highlighting works
- [ ] Back navigation maintains state

#### Dark/Light Mode
- [ ] Theme switches properly
- [ ] All components respect theme
- [ ] Local storage persistence

### 3. Friends Management Testing 👥

#### Friend Search
- [ ] Search by email finds existing users
- [ ] Search with non-existent email shows "not found"
- [ ] Search with own email shows error
- [ ] Search validates email format

#### Friend Requests
- [ ] Send friend request to found user
- [ ] Friend request appears in recipient's requests
- [ ] Can't send duplicate requests
- [ ] Accept request creates friendship
- [ ] Decline request removes it

#### Friends List
- [ ] Accepted friends appear in friends list
- [ ] Online status displays correctly
- [ ] Can message friends from friends page
- [ ] Can initiate calls from friends page
- [ ] Can remove friends

### 4. Real-time Messaging Testing 💬

#### Basic Messaging
- [ ] Send message to friend
- [ ] Message appears in chat immediately
- [ ] Recipient sees message in real-time
- [ ] Message history loads correctly
- [ ] Messages ordered chronologically

#### Real-time Features
- [ ] **Typing indicators**: Show when friend is typing
- [ ] **Online status**: Shows when friends come online/offline
- [ ] **Message delivery**: Messages send even when recipient offline
- [ ] **Read receipts**: Messages marked as read appropriately

#### Chat Interface
- [ ] Chat loads previous message history
- [ ] New messages auto-scroll to bottom
- [ ] Long messages wrap properly
- [ ] Emoji and special characters work
- [ ] Message timestamps display

### 5. Video Calling Testing 📹

**Note**: Video calling requires HTTPS in production. For local testing, use `npm run dev:https` if available.

#### Call Initiation
- [ ] Video call button visible in chat
- [ ] Audio call button works
- [ ] Call initiation shows "calling" state
- [ ] Can cancel outgoing calls

#### Call Receiving  
- [ ] Incoming call shows notification
- [ ] Can answer incoming calls
- [ ] Can decline incoming calls
- [ ] Call UI shows caller information

#### During Calls
- [ ] Local video stream displays
- [ ] Remote video stream displays
- [ ] Audio works both directions
- [ ] Can mute/unmute microphone
- [ ] Can turn camera on/off
- [ ] Can end call from either side

#### WebRTC Features
- [ ] Peer connection establishes
- [ ] Video quality acceptable
- [ ] Audio quality acceptable  
- [ ] No excessive latency
- [ ] Connection survives network hiccups

### 6. Dashboard Testing 📊

#### Stats Display
- [ ] Recent messages count accurate
- [ ] Online friends count accurate
- [ ] Call statistics display
- [ ] Quick stats update in real-time

#### Recent Activity
- [ ] Recent conversations display
- [ ] Unread message counts accurate
- [ ] Can navigate to chats from dashboard
- [ ] Online friends list updates

#### Developer Dashboard (Development Only)
- [ ] System status shows all services healthy
- [ ] Quick links work correctly
- [ ] Environment info displays
- [ ] Test actions function

### 7. Error Handling Testing ⚠️

#### Network Issues
- [ ] Offline message when network disconnected
- [ ] Graceful reconnection when network restored
- [ ] Failed API calls show user feedback
- [ ] Socket.io reconnects automatically

#### Invalid Data
- [ ] Invalid email addresses rejected
- [ ] Empty messages can't be sent
- [ ] Special characters handled properly
- [ ] SQL injection attempts blocked

#### Browser Compatibility
- [ ] **Chrome**: Full functionality
- [ ] **Firefox**: Full functionality
- [ ] **Safari**: WebRTC works
- [ ] **Edge**: All features work
- [ ] **Mobile browsers**: Core features work

## Automated Testing

### API Testing
```bash
# Test API endpoints
curl -X GET http://localhost:3000/api/users/profile
curl -X POST http://localhost:3000/api/friends/search -d '{"email":"alice@example.com"}'
```

### Database Testing
```bash
# Run seed script
npm run seed

# Verify data in MongoDB
# Use MongoDB Compass or command line
```

### Performance Testing
```bash
# Build and analyze bundle
npm run build
npm run analyze  # if configured

# Lighthouse testing
npx lighthouse http://localhost:3000 --output html
```

## Load Testing

### Socket.io Testing
Test real-time features under load:
- Multiple concurrent users
- High message frequency
- Multiple simultaneous calls

### Database Performance
- Monitor query response times
- Check connection pool usage
- Test with large datasets

## Security Testing

### Authentication
- [ ] Can't access protected routes without login
- [ ] JWT tokens properly validated
- [ ] Session expiration works
- [ ] CSRF protection enabled

### Data Validation
- [ ] Input sanitization works
- [ ] No SQL injection vulnerabilities
- [ ] XSS protection enabled
- [ ] Rate limiting prevents abuse

### Privacy
- [ ] Users can only see their own data
- [ ] Friend requests properly validated
- [ ] Messages only visible to participants
- [ ] Video calls properly secured

## Browser DevTools Testing

### Network Tab
- [ ] API calls return appropriate status codes
- [ ] WebSocket connection establishes
- [ ] No unnecessary network requests
- [ ] Static assets load efficiently

### Console
- [ ] No JavaScript errors
- [ ] WebRTC connection logs visible
- [ ] Socket.io connection confirmed
- [ ] Performance warnings addressed

### Application Tab
- [ ] Local storage contains session data
- [ ] Service worker registered (if applicable)
- [ ] Cookies set properly
- [ ] Cache storage working

## Common Issues & Solutions

### Video Calling Issues
**Problem**: Video calls don't work
**Solution**: Ensure HTTPS enabled, browser permissions granted

**Problem**: No audio/video streams
**Solution**: Check browser permissions, try different browser

### Real-time Issues
**Problem**: Messages not appearing in real-time
**Solution**: Check Socket.io connection, verify server running

**Problem**: Typing indicators not working
**Solution**: Check Socket.io events, verify chat room joining

### Authentication Issues
**Problem**: Google OAuth fails
**Solution**: Check redirect URIs, verify credentials

**Problem**: Session doesn't persist
**Solution**: Check NEXTAUTH_SECRET, verify domain settings

## Testing Environments

### Local Development
```bash
npm run dev
npm run seed
# Test at http://localhost:3000
```

### Local Production Build
```bash
npm run build
npm start
# Test production optimizations
```

### Staging/Production
- Test with real Google OAuth
- Verify MongoDB Atlas connection
- Check HTTPS functionality
- Validate all environment variables

## Reporting Issues

When reporting bugs, include:
- Browser and version
- Operating system
- Steps to reproduce
- Expected vs actual behavior
- Console errors
- Network tab information

---

## Test Scripts

Create automated tests for critical paths:

```javascript
// Example test structure
describe('Authentication', () => {
  test('should redirect to dashboard after login', () => {
    // Test implementation
  })
})

describe('Messaging', () => {
  test('should send and receive messages', () => {
    // Test implementation  
  })
})
```

Happy testing! 🚀