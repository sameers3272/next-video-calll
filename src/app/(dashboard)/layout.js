import { redirect } from "next/navigation"
import { auth, signOut } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import MobileSidebar from "@/components/layout/MobileSidebar"
import Link from "next/link"
import { MessageCircle, Users, Settings, Phone } from "lucide-react"

export default async function DashboardLayout({ children }) {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900">
      <div className="flex h-screen">
        {/* Desktop Navigation Sidebar */}
        <div className="hidden md:flex md:w-80 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-r border-white/20 dark:border-gray-700/50 flex-col">
          {/* User Header */}
          <div className="p-6 border-b border-white/20 dark:border-gray-700/50">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-12 w-12 ring-2 ring-white/50">
                  <AvatarImage src={session.user?.image} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold">
                    {session.user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-gray-900 dark:text-white truncate">{session.user?.name}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">Online now</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="p-4">
            <nav className="space-y-2">
              <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-200 group">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:scale-110 transition-transform">
                  <MessageCircle size={16} className="text-white" />
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Dashboard</span>
              </Link>
              <Link href="/friends" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-200 group">
                <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 group-hover:scale-110 transition-transform">
                  <Users size={16} className="text-white" />
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Friends</span>
              </Link>
              <Link href="/chat" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-200 group">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 group-hover:scale-110 transition-transform">
                  <Phone size={16} className="text-white" />
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Chats</span>
              </Link>
              <Link href="/settings" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-200 group">
                <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 group-hover:scale-110 transition-transform">
                  <Settings size={16} className="text-white" />
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Settings</span>
              </Link>
              {process.env.NODE_ENV === 'development' && (
                <Link href="/dev" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-200 group">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 group-hover:scale-110 transition-transform">
                    <Settings size={16} className="text-white" />
                  </div>
                  <span className="font-medium text-orange-600 dark:text-orange-400">Dev Tools</span>
                </Link>
              )}
            </nav>
          </div>

          {/* Bottom Actions */}
          <div className="mt-auto p-4 border-t border-white/20 dark:border-gray-700/50">
            <form
              action={async () => {
                "use server"
                await signOut({ redirectTo: "/login" })
              }}
            >
              <Button 
                variant="ghost" 
                type="submit" 
                className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
              >
                <div className="p-1 rounded-lg bg-gray-200 dark:bg-gray-700 mr-3">
                  <Settings size={14} />
                </div>
                Sign Out
              </Button>
            </form>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col">
          {/* Mobile Header & Sidebar */}
          <MobileSidebar user={session.user} />
          
          {/* Main Content Area */}
          <main className="flex-1 overflow-auto bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}