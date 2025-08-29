'use client'

import { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { MessageCircle, RefreshCw, Home } from "lucide-react"
import Link from "next/link"

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md mx-auto">
        {/* Error Visual */}
        <div className="space-y-4">
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
            <MessageCircle size={40} className="text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Oops!
            </h1>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Something went wrong
            </h2>
          </div>
        </div>

        {/* Error Description */}
        <div className="space-y-3">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            We encountered an unexpected error. Don&apos;t worry, it&apos;s not your fault!
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Try refreshing the page or return to your dashboard.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <details className="text-left mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Error Details (Development)
              </summary>
              <pre className="text-xs text-red-600 dark:text-red-400 whitespace-pre-wrap break-all">
                {error?.message || 'Unknown error'}
              </pre>
            </details>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={reset}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            <RefreshCw size={18} className="mr-2" />
            Try Again
          </Button>
          <Link href="/dashboard">
            <Button variant="outline" className="w-full sm:w-auto">
              <Home size={18} className="mr-2" />
              Go to Dashboard
            </Button>
          </Link>
        </div>

        {/* Help Text */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            If the problem persists, please refresh your browser or try again later.
          </p>
        </div>
      </div>
    </div>
  )
}