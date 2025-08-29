'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageCircle, Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md mx-auto">
        {/* 404 Visual */}
        <div className="space-y-4">
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <MessageCircle size={40} className="text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              404
            </h1>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Page Not Found
            </h2>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Let&apos;s get you back to your conversations!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
              <Home size={18} className="mr-2" />
              Go to Dashboard
            </Button>
          </Link>
          <Button 
            variant="outline" 
            onClick={() => window.history.back()} 
            className="w-full sm:w-auto"
          >
            <ArrowLeft size={18} className="mr-2" />
            Go Back
          </Button>
        </div>

        {/* Additional Links */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Need help? Try these links:
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link href="/friends" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
              Friends
            </Link>
            <Link href="/chat" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
              All Chats
            </Link>
            <Link href="/settings" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
              Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}