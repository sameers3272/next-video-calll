import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export default async function AuthLayout({ children }) {
  const session = await auth()
  
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8">
        {children}
      </div>
    </div>
  )
}