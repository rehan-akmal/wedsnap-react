"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Send, Search, ImageIcon, Paperclip } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { formatDistanceToNow } from "date-fns"
import { apiService } from "@/lib/api"

export default function MessagesPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<any[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [sendingMessage, setSendingMessage] = useState(false)

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return

      try {
        setLoading(true)
        const data = await apiService.messages.getConversations()
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
  }, [user, selectedConversation])

  // Fetch messages for selected conversation
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation) return

      try {
        const data = await apiService.messages.getMessages(selectedConversation)
        setMessages(data)

        // Mark messages as read
        if (conversations.find((conv) => conv.id === selectedConversation)?.unreadCount > 0) {
          await apiService.messages.markAsRead(selectedConversation)

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
  }, [selectedConversation, conversations])

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

      const newMsg = await apiService.messages.sendMessage(messageData)

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

  // Loading state
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search conversations..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversation === conversation.id ? "bg-gray-50" : ""
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage
                          src={conversation.user.avatar || "/placeholder.svg"}
                          alt={conversation.user.name}
                        />
                        <AvatarFallback>{conversation.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {conversation.user.isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-medium truncate">{conversation.user.name}</h3>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(conversation.lastMessage.timestamp), { addSuffix: true })}
                        </span>
                      </div>
                      <p
                        className={`text-sm truncate ${
                          !conversation.lastMessage.isRead && conversation.lastMessage.sender === "them"
                            ? "font-semibold text-gray-900"
                            : "text-gray-500"
                        }`}
                      >
                        {conversation.lastMessage.sender === "you" ? "You: " : ""}
                        {conversation.lastMessage.text}
                      </p>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <span className="bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                {loading ? "Loading conversations..." : "No conversations found"}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="md:col-span-2 border rounded-lg overflow-hidden flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={conversations.find((c) => c.id === selectedConversation)?.user.avatar || "/placeholder.svg"}
                      alt={conversations.find((c) => c.id === selectedConversation)?.user.name}
                    />
                    <AvatarFallback>
                      {conversations.find((c) => c.id === selectedConversation)?.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">
                      {conversations.find((c) => c.id === selectedConversation)?.user.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {conversations.find((c) => c.id === selectedConversation)?.user.isOnline ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "you" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.sender === "you" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p>{message.text}</p>
                        <p className={`text-xs mt-1 ${message.sender === "you" ? "text-purple-200" : "text-gray-500"}`}>
                          {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No messages yet. Start the conversation!</p>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex items-end gap-2">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Paperclip className="h-5 w-5 text-gray-500" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <ImageIcon className="h-5 w-5 text-gray-500" />
                  </Button>
                  <div className="flex-1">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="rounded-full"
                      disabled={sendingMessage}
                    />
                  </div>
                  <Button
                    size="icon"
                    className="rounded-full bg-purple-600 hover:bg-purple-700"
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sendingMessage}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <Card className="w-[80%] max-w-md">
                <CardContent className="pt-6 text-center">
                  <h3 className="text-xl font-semibold mb-2">No conversation selected</h3>
                  <p className="text-gray-500">Select a conversation from the list to start chatting</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
