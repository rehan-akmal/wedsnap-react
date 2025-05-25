import { toast } from "@/hooks/use-toast"

// API configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"

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
        toast({
          title: "Session expired",
          description: "Please log in again to continue.",
          variant: "destructive",
        })
      } else {
        // Show error message
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      }
    } else if (error instanceof Error) {
      // Network or other errors
      toast({
        title: "Error",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      })
    } else {
      // Unknown errors
      toast({
        title: "Error",
        description: "An unknown error occurred",
        variant: "destructive",
      })
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
  },

  // User endpoints
  users: {
    getProfile: () => api.get<any>("/users/me"),

    updateProfile: (data: any) => api.put<any>("/users/me", { body: data }),
  },

  // Gig endpoints
  gigs: {
    getAll: (params?: any) => api.get<{ gigs: any; pagination: any }>("/gigs", { params }),

    getById: (id: string) => api.get<any>(`/gigs/${id}`),

    create: (data: any) => api.post<any>("/gigs", { body: data }),

    update: (id: string, data: any) => api.put<any>(`/gigs/${id}`, { body: data }),

    delete: (id: string) => api.delete<{ message: string }>(`/gigs/${id}`),
  },

  // Order endpoints
  orders: {
    create: (data: any) => api.post<any>("/orders", { body: data }),

    getBuyerOrders: (params?: any) => api.get<{ orders: any[]; pagination: any }>("/orders/buying", { params }),

    getSellerOrders: (params?: any) => api.get<{ orders: any[]; pagination: any }>("/orders/selling", { params }),

    getById: (id: string) => api.get<any>(`/orders/${id}`),

    updateStatus: (id: string, status: string) => api.put<any>(`/orders/${id}/status`, { body: { status } }),

    deliver: (id: string, data: any) => api.post<any>(`/orders/${id}/deliver`, { body: data }),
  },

  // Message endpoints
  messages: {
    getConversations: () => api.get<{ conversations: any[] }>("/conversations"),

    getMessages: (conversationId: string, params?: any) =>
      api.get<{ messages: any[]; pagination: any }>(`/conversations/${conversationId}/messages`, { params }),

    sendMessage: (conversationId: string, text: string) =>
      api.post<any>(`/conversations/${conversationId}/messages`, { body: { text } }),
  },

  // Review endpoints
  reviews: {
    create: (gigId: string, data: any) => api.post<any>(`/gigs/${gigId}/reviews`, { body: data }),

    getByGigId: (gigId: string, params?: any) =>
      api.get<{ reviews: any[]; pagination: any; summary: any }>(`/gigs/${gigId}/reviews`, { params }),
  },

  // Search endpoints
  search: {
    gigs: (params?: any) => api.get<{ gigs: any[]; pagination: any }>("/search", { params }),

    getCategories: () => api.get<{ categories: any[] }>("/categories"),

    getLocations: () => api.get<{ locations: any[] }>("/locations"),
  },
}
