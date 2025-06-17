// Mock data for testing the chat feature
export const mockConversations = [
  {
    id: "conv1",
    user: {
      id: "user1",
      name: "Sarah Johnson",
      avatar: "/placeholder.svg",
      isOnline: true
    },
    lastMessage: {
      text: "Thanks for your interest! I'd be happy to help with your wedding photography.",
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      isRead: false,
      sender: "them"
    },
    unreadCount: 2
  },
  {
    id: "conv2",
    user: {
      id: "user2",
      name: "Mike Chen",
      avatar: "/placeholder.svg",
      isOnline: false
    },
    lastMessage: {
      text: "Perfect! I'll send you the updated designs by tomorrow.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      isRead: true,
      sender: "you"
    },
    unreadCount: 0
  },
  {
    id: "conv3",
    user: {
      id: "user3",
      name: "Emily Rodriguez",
      avatar: "/placeholder.svg",
      isOnline: true
    },
    lastMessage: {
      text: "Can we schedule a call to discuss the catering menu?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      isRead: false,
      sender: "them"
    },
    unreadCount: 1
  }
]

export const mockMessages: Record<string, any[]> = {
  conv1: [
    {
      id: "msg1",
      text: "Hi! I'm looking for a wedding photographer for my event on June 15th. Are you available?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      sender: "you"
    },
    {
      id: "msg2",
      text: "Hello! Yes, I'm available on June 15th. I'd love to help capture your special day!",
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      sender: "them"
    },
    {
      id: "msg3",
      text: "What's your photography style and what packages do you offer?",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      sender: "you"
    },
    {
      id: "msg4",
      text: "Thanks for your interest! I'd be happy to help with your wedding photography.",
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      sender: "them"
    }
  ],
  conv2: [
    {
      id: "msg5",
      text: "Hi Mike, I need some design work for my wedding invitations.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      sender: "you"
    },
    {
      id: "msg6",
      text: "I'd be happy to help! What style are you looking for?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23), // 23 hours ago
      sender: "them"
    },
    {
      id: "msg7",
      text: "Something elegant and minimalist. Here are some references...",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22), // 22 hours ago
      sender: "you"
    },
    {
      id: "msg8",
      text: "Perfect! I'll send you the updated designs by tomorrow.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      sender: "you"
    }
  ],
  conv3: [
    {
      id: "msg9",
      text: "Hi Emily! I'm interested in your catering services for my wedding.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
      sender: "you"
    },
    {
      id: "msg10",
      text: "Wonderful! I'd love to help make your wedding delicious. When is your event?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47), // 47 hours ago
      sender: "them"
    },
    {
      id: "msg11",
      text: "It's on August 20th. We're expecting about 150 guests.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 46), // 46 hours ago
      sender: "you"
    },
    {
      id: "msg12",
      text: "Can we schedule a call to discuss the catering menu?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      sender: "them"
    }
  ]
}

// Mock API functions
export const mockApiService = {
  messages: {
    getConversations: async (): Promise<any[]> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      return mockConversations
    },

    getMessages: async (conversationId: string): Promise<any[]> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      return mockMessages[conversationId] || []
    },

    sendMessage: async (data: { conversationId: string; text: string }): Promise<any> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const newMessage = {
        id: `msg_${Date.now()}`,
        text: data.text,
        timestamp: new Date(),
        sender: "you"
      }

      // Add to mock data
      if (!mockMessages[data.conversationId]) {
        mockMessages[data.conversationId] = []
      }
      mockMessages[data.conversationId].push(newMessage)

      return newMessage
    },

    markAsRead: async (conversationId: string): Promise<void> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Update mock data
      const conversation = mockConversations.find(c => c.id === conversationId)
      if (conversation) {
        conversation.unreadCount = 0
        conversation.lastMessage.isRead = true
      }
    },

    createConversation: async (userId: string): Promise<any> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const newConversation = {
        id: `conv_${Date.now()}`,
        user: {
          id: userId,
          name: "New User",
          avatar: "/placeholder.svg",
          isOnline: false
        },
        lastMessage: {
          text: "",
          timestamp: new Date(),
          isRead: true,
          sender: "you"
        },
        unreadCount: 0
      }

      mockConversations.unshift(newConversation)
      mockMessages[newConversation.id] = []

      return newConversation
    }
  }
} 