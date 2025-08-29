import { MessageCircle, Users, Phone } from "lucide-react"

export default function DashboardLoading() {
  return (
    <div className="h-full flex">
      {/* Chat List Sidebar Skeleton */}
      <div className="w-96 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-r border-white/20 dark:border-gray-700/50 flex flex-col">
        {/* Header Skeleton */}
        <div className="p-6 border-b border-white/20 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
            <div className="flex gap-2">
              <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
          
          {/* Quick Stats Skeleton */}
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 animate-pulse">
                <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded mb-1"></div>
                <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded mb-1 w-8"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-12"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversations List Skeleton */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16 mb-3 mx-3"></div>
            <div className="space-y-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center p-3 rounded-xl animate-pulse">
                  <div className="h-12 w-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  <div className="flex-1 min-w-0 ml-3">
                    <div className="flex items-center justify-between mb-1">
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
                      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-12"></div>
                    </div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Welcome Area Skeleton */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
        <div className="text-center max-w-md px-8">
          {/* Loading Animation */}
          <div className="mb-8">
            <div className="mx-auto w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mb-6">
              <MessageCircle size={40} className="text-white animate-pulse" />
            </div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48 mx-auto mb-3"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-64 mx-auto"></div>
          </div>
          
          {/* Action Buttons Skeleton */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24 mx-auto mb-3"></div>
              <div className="flex justify-center gap-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}