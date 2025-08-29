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
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex md:w-64 border-r bg-card p-4 flex-col">
          <div className="flex items-center gap-3 mb-6">
            <Avatar>
              <AvatarImage src={session.user?.image} />
              <AvatarFallback>
                {session.user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{session.user?.name}</p>
              <p className="text-sm text-muted-foreground">{session.user?.email}</p>
            </div>
          </div>
          
          <nav className="space-y-2 flex-1">
            <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent">
              <MessageCircle size={20} />
              Dashboard
            </Link>
            <Link href="/friends" className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent">
              <Users size={20} />
              Friends
            </Link>
            <Link href="/chat" className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent">
              <Phone size={20} />
              Chats
            </Link>
            <Link href="/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent">
              <Settings size={20} />
              Settings
            </Link>
            {process.env.NODE_ENV === 'development' && (
              <Link href="/dev" className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent text-orange-600">
                <Settings size={20} />
                Dev Tools
              </Link>
            )}
          </nav>
          
          <div className="mt-auto pt-4">
            <form
              action={async () => {
                "use server"
                await signOut({ redirectTo: "/login" })
              }}
            >
              <Button variant="outline" type="submit" className="w-full">
                Sign Out
              </Button>
            </form>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col">
          {/* Mobile Header & Sidebar */}
          <MobileSidebar user={session.user} />
          
          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}