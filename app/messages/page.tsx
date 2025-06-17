"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Send, Search, RefreshCw } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { formatDistanceToNow } from "date-fns"
import { apiService } from "@/lib/api"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Calendar } from "@/components/ui/calendar"

export default function MessagesPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [conversations, setConversations] = useState<any[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Use real API service now that backend is implemented
  const messageApi = apiService.messages

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please log in to access messages")
      router.push("/auth/login")
      return
    }
  }, [user, authLoading, router])

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return

      try {
        setLoading(true)
        const data = await messageApi.getConversations()
        setConversations(data)

        // Select the first conversation by default if available
        if (data.length > 0 && !selectedConversation) {
          setSelectedConversation(data[0].id)
        }
      } catch (error) {
        console.error("Error fetching conversations:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchConversations()
    }
  }, [user, selectedConversation, messageApi])

  // Fetch messages for selected conversation
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation) return

      try {
        const data = await messageApi.getMessages(selectedConversation)
        setMessages(data)

        // Mark messages as read
        if (conversations.find((conv) => conv.id === selectedConversation)?.unreadCount > 0) {
          await messageApi.markAsRead(selectedConversation)

          // Update conversations to reflect read status
          setConversations((prev) =>
            prev.map((conv) =>
              conv.id === selectedConversation
                ? { ...conv, unreadCount: 0, lastMessage: { ...conv.lastMessage, isRead: true } }
                : conv,
            ),
          )
        }
      } catch (error) {
        console.error("Error fetching messages:", error)
      }
    }

    if (selectedConversation) {
      fetchMessages()
    }
  }, [selectedConversation, conversations, messageApi])

  // Filter conversations based on search query
  const filteredConversations = conversations.filter((conversation) =>
    conversation.user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Send a new message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sendingMessage) return

    try {
      setSendingMessage(true)

      const messageData = {
        conversationId: selectedConversation,
        text: newMessage,
      }

      const newMsg = await messageApi.sendMessage(messageData)

      // Add the new message to the messages list
      setMessages((prev) => [...prev, newMsg])

      // Update the conversation with the new last message
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversation
            ? {
                ...conv,
                lastMessage: {
                  text: newMessage,
                  timestamp: new Date(),
                  isRead: true,
                  sender: "you",
                },
              }
            : conv,
        ),
      )

      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setSendingMessage(false)
    }
  }

  // Handle key press for sending message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Add refresh function
  const handleRefresh = async () => {
    if (!user || refreshing) return

    try {
      setRefreshing(true)
      const data = await messageApi.getConversations()
      setConversations(data)

      // If there's a selected conversation, refresh its messages too
      if (selectedConversation) {
        const messagesData = await messageApi.getMessages(selectedConversation)
        setMessages(messagesData)
      }
    } catch (error) {
      console.error("Error refreshing messages:", error)
      toast.error("Failed to refresh messages")
    } finally {
      setRefreshing(false)
    }
  }

  // Render loading state while checking authentication
  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  // Render nothing if user is not authenticated (redirect will happen via useEffect)
  if (!user) {
    return null
  }

  // Render loading state for conversations
  if (loading && conversations.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Messages</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)] min-h-[500px]">
          <div className="md:col-span-1 border rounded-lg overflow-hidden flex flex-col">
            <div className="p-4 border-b">
              <div className="h-10 bg-gray-200 animate-pulse rounded-md"></div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-4 border-b">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 animate-pulse rounded-md w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 animate-pulse rounded-md w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-2 border rounded-lg overflow-hidden flex flex-col">
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">Loading conversations...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Messages</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)] min-h-[500px]">
        {/* Conversations List */}
        <div className="md:col-span-1 border rounded-lg overflow-hidden flex flex-col">
          <div className="p-4 border-b">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                disabled={refreshing}
                className="shrink-0"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedConversation === conversation.id ? "bg-gray-50" : ""
                }`}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={conversation.user.avatar || "/placeholder.svg"} alt={conversation.user.name} />
                    <AvatarFallback>{conversation.user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">{conversation.user.name}</p>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(conversation.lastMessage.timestamp), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {conversation.lastMessage.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="md:col-span-2 border rounded-lg overflow-hidden flex flex-col">
          {selectedConversation ? (
            <>
              <div className="flex-1 overflow-y-auto p-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "you" ? "justify-end" : "justify-start"} mb-4`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.sender === "you"
                          ? "bg-red-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p>{message.text}</p>
                      <span className="text-xs opacity-70">
                        {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <Button onClick={sendMessage} disabled={sendingMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
