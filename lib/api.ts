import toast from "react-hot-toast"

// API configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"

// Active Storage URL configuration
export const getActiveStorageUrl = (path: string): string => {
  if (path?.startsWith('http')) return path
  return `${API_BASE_URL.replace('/api/v1', '')}${path}`
}

// Error handling
export class ApiError extends Error {
  status: number
  data: any

  constructor(status: number, message: string, data?: any) {
    super(message)
    this.status = status
    this.data = data
    this.name = "ApiError"
  }
}

// Request options type
type RequestOptions = {
  headers?: Record<string, string>
  params?: Record<string, string>
  body?: any
  requiresAuth?: boolean
}

// API client
export const api = {
  /**
   * Get the authentication token from local storage
   */
  getToken: (): string | null => {
    if (typeof window === "undefined") return null
    return localStorage.getItem("token")
  },

  /**
   * Build request headers
   */
  buildHeaders: (options?: RequestOptions): Headers => {
    const headers = new Headers(options?.headers)

    // Set default headers
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json")
    }

    // Add auth token if required
    if (options?.requiresAuth !== false) {
      const token = api.getToken()
      if (token) {
        headers.set("Authorization", `Bearer ${token}`)
      }
    }

    return headers
  },

  /**
   * Build URL with query parameters
   */
  buildUrl: (endpoint: string, params?: Record<string, string>): string => {
    const url = new URL(endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value)
        }
      })
    }

    return url.toString()
  },

  /**
   * Handle API response
   */
  async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData
      try {
        errorData = await response.json()
      } catch (e) {
        errorData = { message: "An unknown error occurred" }
      }

      const errorMessage = errorData.message || `Error: ${response.status} ${response.statusText}`
      throw new ApiError(response.status, errorMessage, errorData)
    }

    // Handle empty responses
    if (response.status === 204 || response.headers.get("Content-Length") === "0") {
      return {} as T
    }

    return (await response.json()) as T
  },

  /**
   * Make a GET request
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    try {
      const url = api.buildUrl(endpoint, options?.params)
      const headers = api.buildHeaders(options)

      const response = await fetch(url, {
        method: "GET",
        headers,
        credentials: "include",
      })

      return await api.handleResponse<T>(response)
    } catch (error) {
      api.handleError(error)
      throw error
    }
  },

  /**
   * Make a POST request
   */
  async post<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    try {
      const url = api.buildUrl(endpoint, options?.params)
      const headers = api.buildHeaders(options)

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: options?.body ? JSON.stringify(options.body) : undefined,
        credentials: "include",
      })

      return await api.handleResponse<T>(response)
    } catch (error) {
      api.handleError(error)
      throw error
    }
  },

  /**
   * Make a PUT request
   */
  async put<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    try {
      const url = api.buildUrl(endpoint, options?.params)
      const headers = api.buildHeaders(options)

      const response = await fetch(url, {
        method: "PUT",
        headers,
        body: options?.body ? JSON.stringify(options.body) : undefined,
        credentials: "include",
      })

      return await api.handleResponse<T>(response)
    } catch (error) {
      api.handleError(error)
      throw error
    }
  },

  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    try {
      const url = api.buildUrl(endpoint, options?.params)
      const headers = api.buildHeaders(options)

      const response = await fetch(url, {
        method: "DELETE",
        headers,
        credentials: "include",
      })

      return await api.handleResponse<T>(response)
    } catch (error) {
      api.handleError(error)
      throw error
    }
  },

  /**
   * Handle API errors
   */
  handleError: (error: unknown): void => {
    if (error instanceof ApiError) {
      // Handle specific error codes
      if (error.status === 401) {
        // Unauthorized - clear token and redirect to login
        // localStorage.removeItem("token")
        //window.location.href = "/auth/login"
        toast.error("Session expired. Please log in again to continue.")
      } else {
        // Show error message
        toast.error(error.message || "An error occurred")
      }
    } else if (error instanceof Error) {
      // Network or other errors
      toast.error(error.message || "An unknown error occurred")
    } else {
      // Unknown errors
      toast.error("An unknown error occurred")
    }

    console.error("API Error:", error)
  },
}

// API service with endpoints
export const apiService = {
  // Auth endpoints
  auth: {
    login: (email: string, password: string) =>
      api.post<{ token: string; user: any }>("/auth/login", {
        body: { email, password },
        requiresAuth: false,
      }),

    signup: (name: string, email: string, password: string) =>
      api.post<{ token: string; user: any }>("/auth/signup", {
        body: {
          user: {
            name,
            email,
            password,
            password_confirmation: password,
          }
        },
        requiresAuth: false,
      }),

    forgotPassword: (email: string) =>
      api.post<{ message: string }>("/auth/forgot-password", {
        body: { email },
        requiresAuth: false,
      }),

    resetPassword: (token: string, password: string) =>
      api.post<{ message: string }>("/auth/reset-password", {
        body: { token, password },
        requiresAuth: false,
      }),

    profile: () => api.get<{ user: any }>("/auth/profile"),
  },

  // Dashboard endpoints
  dashboard: {
    seller: {
      getStats: () => api.get<any>("/dashboard/seller/stats"),
    },
    buyer: {
      getStats: () => api.get<any>("/dashboard/buyer/stats"),
    },
    overview: {
      getStats: () => api.get<any>("/dashboard/overview"),
    },
  },

  // Seller endpoints
  seller: {
    getGigs: () => api.get<any[]>("/gigs"),
    getStats: () => api.get<any>("/dashboard/seller/stats"),
  },

  // Buyer endpoints
  buyer: {
    getSavedGigs: () => api.get<any[]>("/gigs/saved"),
    getStats: () => api.get<any>("/dashboard/buyer/stats"),
  },

  // User endpoints
  users: {
    getProfile: () => api.get<any>("/users/me"),
    updateProfile: (data: any) => api.put<any>("/users/me", { body: data }),
    getAvailability: (userId: string) => api.get<any[]>(`/users/${userId}/availability`),
  },

  // User settings endpoints
  user: {
    getSettings: () => api.get<any>("/auth/profile"),
    updateProfile: (data: any) => api.put<any>("/auth/profile", { body: data }),
    uploadProfileImage: (formData: FormData) => {
      const url = api.buildUrl("/auth/profile/avatar")
      const headers = new Headers()
      const token = api.getToken()
      if (token) {
        headers.set("Authorization", `Bearer ${token}`)
      }
      
      return fetch(url, {
        method: "POST",
        headers,
        body: formData,
        credentials: "include",
      }).then(response => api.handleResponse<any>(response))
    },
    updatePassword: (data: { currentPassword: string; newPassword: string }) => 
      api.put<any>("/auth/password", { body: data }),
    updateNotificationSettings: (data: any) => 
      api.put<any>("/auth/notifications", { body: data }),
    updateAvailability: (data: any) => 
      api.put<any>("/auth/availability", { body: data }),
    deleteAccount: () => api.delete<any>("/auth/account"),
  },

  // Availability endpoints
  availability: {
    getAll: () => api.get<any[]>("/availabilities"),
    getById: (id: string) => api.get<any>(`/availabilities/${id}`),
    create: (data: { date: string; available: boolean }) => 
      api.post<any>("/availabilities", { body: { availability: { date: data.date, is_available: data.available } } }),
    update: (id: string, data: { date: string; available: boolean }) => 
      api.put<any>(`/availabilities/${id}`, { body: { availability: { date: data.date, is_available: data.available } } }),
    delete: (id: string) => api.delete<{ message: string }>(`/availabilities/${id}`),
    check: (date: string) => api.get<any>(`/availabilities/check/${date}`),
  },

  // Gig endpoints
  gigs: {
    getAll: (params?: any) => api.get<{ gigs: any; pagination: any }>("/gigs", { params }),
    getById: (id: string) => api.get<any>(`/gigs/${id}`),
    create: (data: any) => api.post<any>("/gigs", { body: data }),
    createWithCustomErrorHandling: async (data: any): Promise<any> => {
      try {
        const url = api.buildUrl("/gigs")
        const headers = new Headers(api.buildHeaders({ requiresAuth: true }))
        
        // Create FormData for file upload
        const formData = new FormData()
        
        // Add images to FormData
        if (data.gig.images && data.gig.images.length > 0) {
          data.gig.images.forEach((image: File) => {
            formData.append('gig[images][]', image)
          })
        }
        
        // Add other gig data
        const gigData = { ...data.gig }
        delete gigData.images // Remove images from the JSON data
        
        // Add basic fields
        formData.append('gig[title]', gigData.title)
        formData.append('gig[description]', gigData.description)
        formData.append('gig[location]', gigData.location)
        formData.append('gig[phone_number]', gigData.phone_number)
        
        // Add category_ids
        if (gigData.category_ids) {
          gigData.category_ids.forEach((category: string) => {
            formData.append('gig[category_ids][]', category)
          })
        }
        
        // Add packages
        if (gigData.packages_attributes) {
          gigData.packages_attributes.forEach((pkg: any, index: number) => {
            formData.append(`gig[packages_attributes][${index}][name]`, pkg.name)
            formData.append(`gig[packages_attributes][${index}][description]`, pkg.description)
            formData.append(`gig[packages_attributes][${index}][price]`, pkg.price.toString())
            formData.append(`gig[packages_attributes][${index}][delivery_days]`, pkg.delivery_days.toString())
            formData.append(`gig[packages_attributes][${index}][revisions]`, pkg.revisions.toString())
          })
        }
        
        // Add features
        if (gigData.features_attributes) {
          gigData.features_attributes.forEach((feature: any, index: number) => {
            formData.append(`gig[features_attributes][${index}][name]`, feature.name)
          })
        }
        
        // Add FAQs
        if (gigData.faqs_attributes) {
          gigData.faqs_attributes.forEach((faq: any, index: number) => {
            formData.append(`gig[faqs_attributes][${index}][question]`, faq.question)
            formData.append(`gig[faqs_attributes][${index}][answer]`, faq.answer)
          })
        }
        
        // Remove Content-Type header to let the browser set it with the boundary
        headers.delete('Content-Type')
        
        const response = await fetch(url, {
          method: "POST",
          headers,
          body: formData,
          credentials: "include",
        })
        return await api.handleResponse<any>(response)
      } catch (error) {
        // Don't call api.handleError to avoid automatic toast
        console.error("Gig creation error:", error)
        throw error
      }
    },
    update: (id: string, data: any) => api.put<any>(`/gigs/${id}`, { body: data }),
    updateWithCustomErrorHandling: async (id: string, data: any): Promise<any> => {
      try {
        const url = api.buildUrl(`/gigs/${id}`)
        const headers = api.buildHeaders({ requiresAuth: true })
        const response = await fetch(url, {
          method: "PUT",
          headers,
          body: JSON.stringify(data),
          credentials: "include",
        })
        return await api.handleResponse<any>(response)
      } catch (error) {
        // Don't call api.handleError to avoid automatic toast
        console.error("Gig update error:", error)
        throw error
      }
    },
    delete: (id: string) => api.delete<{ message: string }>(`/gigs/${id}`),
  },

  // Message endpoints
  messages: {
    getConversations: () => api.get<any[]>("/conversations"),

    getMessages: (conversationId: string, params?: any) =>
      api.get<any[]>(`/conversations/${conversationId}/messages`, { params }),

    sendMessage: (data: { conversationId: string; text: string }) =>
      api.post<any>(`/conversations/${data.conversationId}/messages`, { body: { text: data.text } }),

    markAsRead: (conversationId: string) =>
      api.put<any>(`/conversations/${conversationId}/read`, {}),

    createConversation: (userId: string) =>
      api.post<any>("/conversations", { body: { userId } }),
  },

  // Search endpoints
  search: {
    gigs: (params?: any) => api.get<{ gigs: any[]; pagination: any }>("/search", { params }),

    getCategories: () => api.get<{ categories: any[] }>("/categories"),

    getLocations: () => api.get<{ locations: any[] }>("/locations"),
  },
}
