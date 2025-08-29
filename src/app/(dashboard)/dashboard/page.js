import { auth } from "@/lib/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  MessageCircle, 
  Users, 
  Phone, 
  Video, 
  Plus,
  Search,
  MoreHorizontal,
  Clock,
  CheckCheck
} from "lucide-react"

async function getRecentMessages() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/messages/recent`, {
      cache: 'no-store'
    })
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error('Failed to fetch recent messages:', error)
  }
  return []
}

async function getOnlineFriends() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/users/online`, {
      cache: 'no-store'
    })
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error('Failed to fetch online friends:', error)
  }
  return []
}

export default async function DashboardPage() {
  const session = await auth()
  const recentMessages = await getRecentMessages()
  const onlineFriends = await getOnlineFriends()

  return (
    <div className="h-full flex">
      {/* Chat List Sidebar */}
      <div className="w-96 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-r border-white/20 dark:border-gray-700/50 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/20 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Chats</h1>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" className="h-9 w-9 p-0">
                <Search size={18} />
              </Button>
              <Button size="sm" variant="ghost" className="h-9 w-9 p-0">
                <Plus size={18} />
              </Button>
              <Button size="sm" variant="ghost" className="h-9 w-9 p-0">
                <MoreHorizontal size={18} />
              </Button>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50">
              <MessageCircle size={20} className="mx-auto mb-1 text-blue-600" />
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">{recentMessages.length}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400">Chats</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50">
              <div className="w-5 h-5 mx-auto mb-1 bg-green-500 rounded-full"></div>
              <p className="text-sm font-semibold text-green-700 dark:text-green-300">{onlineFriends.length}</p>
              <p className="text-xs text-green-600 dark:text-green-400">Online</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
              <Phone size={20} className="mx-auto mb-1 text-purple-600" />
              <p className="text-sm font-semibold text-purple-700 dark:text-purple-300">0</p>
              <p className="text-xs text-purple-600 dark:text-purple-400">Calls</p>
            </div>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 px-3">Recent</h3>
            {recentMessages.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p className="text-gray-500 dark:text-gray-400 mb-2">No conversations yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">Start chatting with your friends</p>
                <Link href="/friends">
                  <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                    <Users size={16} className="mr-2" />
                    Find Friends
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
                {recentMessages.map((chat) => (
                  <Link 
                    key={chat._id} 
                    href={`/chat/${chat.otherUserId}`}
                    className="flex items-center p-3 rounded-xl hover:bg-white/60 dark:hover:bg-gray-700/60 transition-all duration-200 group"
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={chat.otherUser?.profilePicture} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                          {chat.otherUser?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      {chat.otherUser?.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 ml-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">
                          {chat.otherUser?.name}
                        </p>
                        <div className="flex items-center gap-1">
                          {chat.lastMessage?.isRead && <CheckCheck size={14} className="text-blue-500" />}
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {chat.lastMessage?.createdAt && new Date(chat.lastMessage.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {chat.lastMessage?.message || 'No messages yet'}
                        </p>
                        {chat.unreadCount > 0 && (
                          <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Online Friends Section */}
          {onlineFriends.length > 0 && (
            <div className="p-3 border-t border-white/20 dark:border-gray-700/50">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 px-3">Online Friends</h3>
              <div className="space-y-1">
                {onlineFriends.slice(0, 5).map((friend) => (
                  <div key={friend._id} className="flex items-center p-3 rounded-xl hover:bg-white/60 dark:hover:bg-gray-700/60 transition-all duration-200">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={friend.profilePicture} />
                        <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm">
                          {friend.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    </div>
                    <div className="flex-1 min-w-0 ml-3">
                      <p className="font-medium text-gray-900 dark:text-white truncate">{friend.name}</p>
                      <p className="text-sm text-green-600 dark:text-green-400">Online</p>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <MessageCircle size={14} />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Video size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Welcome Area */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
        <div className="text-center max-w-md px-8">
          <div className="mb-8">
            <div className="mx-auto w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mb-6">
              <MessageCircle size={40} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Welcome back, {session.user?.name?.split(' ')[0]}! 👋
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Select a conversation to start chatting, or connect with friends to begin messaging.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Link href="/friends">
                <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                  <Users size={18} className="mr-2" />
                  Add Friends
                </Button>
              </Link>
              <Link href="/chat">
                <Button variant="outline" className="w-full">
                  <MessageCircle size={18} className="mr-2" />
                  All Chats
                </Button>
              </Link>
            </div>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Quick actions</p>
              <div className="flex justify-center gap-4">
                <Button variant="ghost" size="sm">
                  <Phone size={16} className="mr-2" />
                  Recent Calls
                </Button>
                <Button variant="ghost" size="sm">
                  <Clock size={16} className="mr-2" />
                  Message History
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}