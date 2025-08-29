import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import SystemStatus from "@/components/system/SystemStatus"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code, Database, Users, MessageCircle, Video, Settings } from "lucide-react"

export default async function DevPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  // Only show dev page in development
  if (process.env.NODE_ENV !== 'development') {
    redirect("/dashboard")
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Developer Dashboard</h1>
        <p className="text-muted-foreground">
          Test and monitor all application features
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SystemStatus />
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Development Tools
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href="/api/users/profile" target="_blank">
                  Test API
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/friends" target="_blank">
                  Friends Page
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/chat" target="_blank">
                  Chat Page
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/settings" target="_blank">
                  Settings
                </a>
              </Button>
            </div>
            
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Environment</h4>
              <div className="text-sm space-y-1">
                <div>Node.js: {process.version}</div>
                <div>Next.js: 15.5.2</div>
                <div>Environment: {process.env.NODE_ENV}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">MongoDB</div>
            <p className="text-xs text-muted-foreground">
              User profiles & messages
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Authentication</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">OAuth</div>
            <p className="text-xs text-muted-foreground">
              Google sign-in active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Real-time</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Socket.io</div>
            <p className="text-xs text-muted-foreground">
              Instant messaging
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Video Calls</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">WebRTC</div>
            <p className="text-xs text-muted-foreground">
              P2P video calling
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Test Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Authentication</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✅ User logged in: {session.user?.name}</li>
                <li>✅ Email: {session.user?.email}</li>
                <li>✅ Session active</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Next Steps</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>1. Add friends via email search</li>
                <li>2. Test real-time messaging</li>
                <li>3. Try video calling features</li>
                <li>4. Check mobile responsiveness</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Production Ready</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Configure production MongoDB</li>
                <li>• Update OAuth redirect URIs</li>
                <li>• Enable HTTPS for WebRTC</li>
                <li>• Set up error monitoring</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}