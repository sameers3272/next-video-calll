import { auth } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import FriendSearch from "@/components/friends/FriendSearch"
import FriendRequestCard from "@/components/friends/FriendRequestCard"
import Link from "next/link"
import connectToDatabase from "@/lib/mongodb"
import Friendship from "@/models/Friendship"
import { 
  MessageCircle, 
  Video, 
  Phone, 
  UserPlus, 
  Users, 
  Check,
  X,
  Search,
  MoreVertical,
  UserCheck
} from "lucide-react"

async function getFriends() {
  try {
    // Get session to use in direct database query instead of API call
    const session = await auth()
    if (!session) return []

    await connectToDatabase()
    
    const friendships = await Friendship.find({
      $or: [
        { requester: session.user.id, status: 'accepted' },
        { recipient: session.user.id, status: 'accepted' }
      ]
    }).populate('requester recipient')

    const friends = friendships.map(friendship => {
      const friend = friendship.requester._id.toString() === session.user.id
        ? friendship.recipient
        : friendship.requester
      
      return {
        _id: friend._id,
        name: friend.name,
        email: friend.email,
        profilePicture: friend.profilePicture,
        isOnline: friend.isOnline,
        lastSeen: friend.lastSeen
      }
    })

    return friends
  } catch (error) {
    console.error('Failed to fetch friends:', error)
    return []
  }
}

async function getFriendRequests() {
  try {
    // Get session to use in direct database query instead of API call
    const session = await auth()
    if (!session) return []

    await connectToDatabase()
    
    const friendRequests = await Friendship.find({
      recipient: session.user.id,
      status: 'pending'
    }).populate('requester', 'name email profilePicture')

    return friendRequests
  } catch (error) {
    console.error('Failed to fetch friend requests:', error)
    return []
  }
}

export default async function FriendsPage() {
  const session = await auth()
  const friends = await getFriends()
  const friendRequests = await getFriendRequests()

  const onlineFriends = friends.filter(friend => friend.isOnline)
  const offlineFriends = friends.filter(friend => !friend.isOnline)

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-blue-50/20 to-purple-50/20 dark:from-gray-900/20 dark:to-gray-800/20">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-white/20 dark:border-gray-700/50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500">
              <Users size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Friends</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your connections and discover new friends
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
              <Search size={20} />
            </Button>
            <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
              <UserPlus size={18} className="mr-2" />
              Add Friend
            </Button>
          </div>
        </div>

      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Friend Search */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500">
                <Search size={20} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Find Friends</h2>
            </div>
            <FriendSearch />
          </div>

          {/* Friend Requests */}
          {friendRequests.length > 0 && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                    <UserPlus size={20} className="text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Friend Requests ({friendRequests.length})
                  </h2>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {friendRequests.map((request) => (
                  <FriendRequestCard key={request._id} request={request} />
                ))}
              </div>
            </div>
          )}

          {/* Online Friends */}
          {onlineFriends.length > 0 && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
                  <div className="w-5 h-5 bg-white rounded-full" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Online Friends ({onlineFriends.length})
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {onlineFriends.map((friend) => (
                  <div key={friend._id} className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 p-4 rounded-xl border border-green-200/50 dark:border-green-700/50 hover:shadow-lg transition-all duration-200 group">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={friend.profilePicture} />
                          <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold">
                            {friend.name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">{friend.name}</p>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <p className="text-sm text-green-600 dark:text-green-400">Online</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Link href={`/chat/${friend._id}`} className="flex-1">
                        <Button size="sm" variant="outline" className="w-full group-hover:border-green-300 group-hover:text-green-600">
                          <MessageCircle size={16} className="mr-2" />
                          Message
                        </Button>
                      </Link>
                      <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                        <Video size={16} className="mr-2" />
                        Call
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Friends */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
                  <Users size={20} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  All Friends ({friends.length})
                </h2>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical size={18} />
              </Button>
            </div>
            
            {friends.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                  <Users size={32} className="text-white" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-2">No friends yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">Start connecting with people to see them here</p>
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                  <UserPlus size={16} className="mr-2" />
                  Find Friends
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {friends.map((friend) => (
                  <div key={friend._id} className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl border border-gray-200/50 dark:border-gray-600/50 hover:shadow-lg transition-all duration-200 group">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={friend.profilePicture} />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold">
                            {friend.name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        {friend.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">{friend.name}</p>
                        <div className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${friend.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          <p className={`text-sm ${friend.isOnline ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            {friend.isOnline ? 'Online' : 'Offline'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Link href={`/chat/${friend._id}`} className="flex-1">
                        <Button size="sm" variant="outline" className="w-full">
                          <MessageCircle size={16} className="mr-2" />
                          Message
                        </Button>
                      </Link>
                      <Button size="sm" className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                        <Phone size={16} className="mr-2" />
                        Call
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}