"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Send } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { apiService } from "@/lib/api"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

interface StartConversationProps {
  recipientId: string
  recipientName: string
  recipientAvatar?: string
  gigTitle?: string
  className?: string
  variant?: "default" | "outline" | "ghost" | "link"
  size?: "sm" | "lg" | "icon" | "default"
}

export function StartConversation({ 
  recipientId, 
  recipientName, 
  recipientAvatar,
  gigTitle,
  className,
  variant = "default",
  size = "default"
}: StartConversationProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  // Use real API service now that backend is implemented
  const messageApi = apiService.messages

  const handleStartConversation = async () => {
    if (!user) {
      toast.error("Please log in to send messages")
      router.push("/auth/login")
      return
    }

    if (!message.trim()) {
      toast.error("Please enter a message")
      return
    }

    try {
      setLoading(true)

      // Create conversation with the recipient
      const conversation = await messageApi.createConversation(recipientId)
      
      // Send the initial message
      await messageApi.sendMessage({
        conversationId: conversation.id,
        text: message
      })

      toast.success("Message sent successfully!")
      setOpen(false)
      setMessage("")
      
      // Redirect to messages page
      router.push("/messages")
    } catch (error: any) {
      console.error("Error starting conversation:", error)
      toast.error(error.message || "Failed to send message")
    } finally {
      setLoading(false)
    }
  }

  const handleButtonClick = () => {
    if (!user) {
      toast.error("Please log in to send messages")
      router.push("/auth/login")
      return
    }
    setOpen(true)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={variant} 
          size={size}
          className={className}
          onClick={handleButtonClick}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Contact Seller
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Message</DialogTitle>
          <DialogDescription>
            Start a conversation with {recipientName}
            {gigTitle && (
              <span className="block mt-1 text-sm text-gray-600">
                About: {gigTitle}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
              {recipientAvatar ? (
                <img 
                  src={recipientAvatar} 
                  alt={recipientName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-medium">
                  {recipientName?.slice(0, 2)?.toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900">{recipientName}</p>
              <p className="text-sm text-gray-500">Freelancer</p>
            </div>
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Your Message
            </label>
            <Textarea
              id="message"
              placeholder="Hi! I'm interested in your service..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full"
            />
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleStartConversation}
              disabled={loading || !message.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Send Message
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 