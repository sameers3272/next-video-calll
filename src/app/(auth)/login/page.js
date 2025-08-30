import { signIn } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Video, Users, Zap } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl">
                <Video className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                VideoChat
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-md">
              Connect, chat, and video call with friends in a beautiful, secure platform designed for modern communication.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl w-fit">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold">Real-time Messaging</h3>
              <p className="text-sm text-muted-foreground">
                Instant messaging with typing indicators and read receipts
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl w-fit">
                <Video className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold">HD Video Calls</h3>
              <p className="text-sm text-muted-foreground">
                Crystal clear video calls with modern WebRTC technology
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl w-fit">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold">Friend Management</h3>
              <p className="text-sm text-muted-foreground">
                Easily find and connect with friends around the world
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl w-fit">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">
                Built with Next.js 15 for optimal performance
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Login Card */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-lg lg:max-w-xl shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl w-fit mb-4">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Sign in to start connecting with your friends
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form
                action={async () => {
                  "use server"
                  await signIn("google", { redirectTo: "/dashboard" })
                }}
              >
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>
              </form>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-gray-800 text-muted-foreground">
                    Secure authentication powered by Google
                  </span>
                </div>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                By signing in, you agree to our{" "}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  Privacy Policy
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}