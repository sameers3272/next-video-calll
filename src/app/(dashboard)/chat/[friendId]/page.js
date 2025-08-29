import { auth } from "@/lib/auth"
import { notFound } from "next/navigation"
import ChatInterface from "@/components/chat/ChatInterface"

async function getUser(userId) {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/users/${userId}`, {
      cache: 'no-store'
    })
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error('Failed to fetch user:', error)
  }
  return null
}

async function getMessages(chatId) {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/messages/chat/${chatId}`, {
      cache: 'no-store'
    })
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error('Failed to fetch messages:', error)
  }
  return []
}

export default async function ChatWithFriendPage({ params }) {
  const session = await auth()
  const friendId = params.friendId
  
  const friend = await getUser(friendId)
  if (!friend) {
    notFound()
  }
  
  const chatId = [session.user.id, friendId].sort().join('_')
  const messages = await getMessages(chatId)

  return (
    <div className="flex flex-col h-screen">
      <ChatInterface
        friend={friend}
        messages={messages}
        currentUserId={session.user.id}
        chatId={chatId}
      />
    </div>
  )
}