# WedSnap API Documentation

This document provides comprehensive information about the WedSnap API, which allows developers to integrate with the WedSnap platform programmatically.

## Base URL

All API requests should be made to:

\`\`\`
https://api.wedsnap.com/v1
\`\`\`

You can configure the base URL in your environment variables:

\`\`\`
NEXT_PUBLIC_API_URL=https://api.wedsnap.com/v1
\`\`\`

## Authentication

WedSnap API uses JSON Web Tokens (JWT) for authentication. To authenticate your requests, include the JWT token in the Authorization header:

\`\`\`
Authorization: Bearer YOUR_JWT_TOKEN
\`\`\`

### Getting a JWT Token

To obtain a JWT token, make a POST request to the authentication endpoint:

\`\`\`
POST /auth/login
\`\`\`

Request body:
\`\`\`json
{
  "email": "user@example.com",
  "password": "your_password"
}
\`\`\`

Response:
\`\`\`json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com"
  }
}
\`\`\`

## API Endpoints

### User Management

#### Create a User

\`\`\`
POST /users
\`\`\`

Request body:
\`\`\`json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure_password"
}
\`\`\`

Response:
\`\`\`json
{
  "id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2025-05-10T10:00:00Z"
}
\`\`\`

#### Get User Profile

\`\`\`
GET /users/me
\`\`\`

Response:
\`\`\`json
{
  "id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "bio": "Professional photographer with 5 years of experience",
  "location": "Lahore",
  "phone": "+92 300 1234567",
  "profileImage": "https://wedsnap.com/images/profile/user_id.jpg",
  "createdAt": "2025-01-15T08:30:00Z",
  "stats": {
    "totalEarnings": 125000,
    "activeOrders": 3,
    "completedOrders": 12,
    "rating": 4.8
  }
}
\`\`\`

#### Update User Profile

\`\`\`
PUT /users/me
\`\`\`

Request body:
\`\`\`json
{
  "name": "John Doe",
  "bio": "Professional photographer with 6 years of experience",
  "location": "Karachi",
  "phone": "+92 300 7654321"
}
\`\`\`

Response:
\`\`\`json
{
  "id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "bio": "Professional photographer with 6 years of experience",
  "location": "Karachi",
  "phone": "+92 300 7654321",
  "profileImage": "https://wedsnap.com/images/profile/user_id.jpg",
  "updatedAt": "2025-05-10T11:30:00Z"
}
\`\`\`

### Gig Management

#### Create a Gig

\`\`\`
POST /gigs
\`\`\`

Request body:
\`\`\`json
{
  "title": "Premium Wedding Photography Package",
  "description": "Complete coverage of your wedding day with artistic shots and premium editing",
  "price": 45000,
  "location": "Lahore",
  "categories": ["Wedding", "Photography"],
  "packages": [
    {
      "name": "Basic",
      "description": "8 hours of coverage, 1 photographer, 200 edited photos",
      "price": 45000,
      "deliveryTime": 14,
      "revisions": 2,
      "features": ["Pre-wedding consultation", "Digital delivery", "Basic photo editing", "Online gallery"]
    },
    {
      "name": "Standard",
      "description": "10 hours of coverage, 2 photographers, 300 edited photos",
      "price": 65000,
      "deliveryTime": 10,
      "revisions": 3,
      "features": ["Pre-wedding consultation", "Digital delivery", "Advanced photo editing", "Online gallery", "Engagement photoshoot", "Printed photo album (20 pages)"]
    }
  ],
  "faqs": [
    {
      "question": "Do you travel to other cities in Pakistan?",
      "answer": "Yes, I am available for weddings throughout Pakistan. Travel and accommodation fees may apply for locations outside Lahore."
    }
  ]
}
\`\`\`

Response:
\`\`\`json
{
  "id": "gig_id",
  "title": "Premium Wedding Photography Package",
  "description": "Complete coverage of your wedding day with artistic shots and premium editing",
  "price": 45000,
  "location": "Lahore",
  "categories": ["Wedding", "Photography"],
  "packages": [...],
  "faqs": [...],
  "createdAt": "2025-05-10T12:00:00Z",
  "isActive": true
}
\`\`\`

#### Get All Gigs

\`\`\`
GET /gigs
\`\`\`

Query parameters:
- `page` (default: 1)
- `limit` (default: 20)
- `search` (optional)
- `category` (optional)
- `location` (optional)
- `minPrice` (optional)
- `maxPrice` (optional)
- `sort` (optional, values: "newest", "popular", "price_low", "price_high")

Response:
\`\`\`json
{
  "gigs": [
    {
      "id": "gig_id_1",
      "title": "Premium Wedding Photography Package",
      "description": "Complete coverage of your wedding day with artistic shots and premium editing",
      "price": 45000,
      "location": "Lahore",
      "categories": ["Wedding", "Photography"],
      "rating": 4.9,
      "reviews": 124,
      "seller": {
        "id": "user_id_1",
        "name": "Ahmed Khan",
        "avatar": "https://wedsnap.com/images/profile/user_id_1.jpg"
      },
      "image": "https://wedsnap.com/images/gigs/gig_id_1.jpg"
    },
    // More gigs...
  ],
  "pagination": {
    "total": 150,
    "pages": 8,
    "currentPage": 1,
    "limit": 20
  }
}
\`\`\`

#### Get Gig Details

\`\`\`
GET /gigs/{gig_id}
\`\`\`

Response:
\`\`\`json
{
  "id": "gig_id",
  "title": "Premium Wedding Photography Package",
  "description": "Complete coverage of your wedding day with artistic shots and premium editing",
  "price": 45000,
  "location": "Lahore",
  "categories": ["Wedding", "Photography"],
  "packages": [...],
  "faqs": [...],
  "images": [
    "https://wedsnap.com/images/gigs/gig_id_1.jpg",
    "https://wedsnap.com/images/gigs/gig_id_2.jpg"
  ],
  "rating": 4.9,
  "reviews": [
    {
      "id": "review_id",
      "user": {
        "id": "user_id",
        "name": "Fatima Ali",
        "avatar": "https://wedsnap.com/images/profile/user_id.jpg"
      },
      "rating": 5,
      "comment": "Ahmed and his team were absolutely amazing! They captured our wedding beautifully and were so professional throughout the day.",
      "date": "2025-03-15T00:00:00Z"
    }
  ],
  "seller": {
    "id": "seller_id",
    "name": "Ahmed Khan",
    "avatar": "https://wedsnap.com/images/profile/seller_id.jpg",
    "rating": 4.9,
    "reviews": 187,
    "responseTime": "1 hour",
    "memberSince": "January 2020",
    "description": "Professional photographer with 8+ years of experience specializing in wedding photography across Pakistan."
  }
}
\`\`\`

#### Update a Gig

\`\`\`
PUT /gigs/{gig_id}
\`\`\`

Request body: (same as create gig, with fields to update)

Response:
\`\`\`json
{
  "id": "gig_id",
  "title": "Updated Wedding Photography Package",
  "description": "Updated description",
  // Other updated fields...
  "updatedAt": "2025-05-10T14:00:00Z"
}
\`\`\`

#### Delete a Gig

\`\`\`
DELETE /gigs/{gig_id}
\`\`\`

Response:
\`\`\`json
{
  "message": "Gig deleted successfully"
}
\`\`\`

### Order Management

#### Create an Order

\`\`\`
POST /orders
\`\`\`

Request body:
\`\`\`json
{
  "gigId": "gig_id",
  "packageId": "package_id",
  "message": "I'm interested in booking your services for my wedding on June 15th, 2025.",
  "date": "2025-06-15T00:00:00Z"
}
\`\`\`

Response:
\`\`\`json
{
  "id": "order_id",
  "gig": {
    "id": "gig_id",
    "title": "Premium Wedding Photography Package",
    "image": "https://wedsnap.com/images/gigs/gig_id.jpg"
  },
  "seller": {
    "id": "seller_id",
    "name": "Ahmed Khan",
    "avatar": "https://wedsnap.com/images/profile/seller_id.jpg"
  },
  "buyer": {
    "id": "buyer_id",
    "name": "John Doe",
    "avatar": "https://wedsnap.com/images/profile/buyer_id.jpg"
  },
  "package": {
    "name": "Standard",
    "description": "10 hours of coverage, 2 photographers, 300 edited photos",
    "price": 65000,
    "deliveryTime": 10,
    "revisions": 3
  },
  "status": "Pending",
  "orderDate": "2025-05-10T15:00:00Z",
  "deliveryDate": "2025-05-20T15:00:00Z",
  "price": 65000
}
\`\`\`

#### Get Buyer Orders

\`\`\`
GET /orders/buying
\`\`\`

Query parameters:
- `status` (optional, values: "active", "completed", "cancelled")
- `page` (default: 1)
- `limit` (default: 20)

Response:
\`\`\`json
{
  "orders": [
    {
      "id": "order_id_1",
      "gig": {
        "id": "gig_id",
        "title": "Premium Wedding Photography Package",
        "image": "https://wedsnap.com/images/gigs/gig_id.jpg"
      },
      "seller": {
        "id": "seller_id",
        "name": "Ahmed Khan",
        "avatar": "https://wedsnap.com/images/profile/seller_id.jpg"
      },
      "price": 65000,
      "status": "In Progress",
      "orderDate": "2025-05-01T00:00:00Z",
      "deliveryDate": "2025-05-20T00:00:00Z",
      "progress": 60
    },
    // More orders...
  ],
  "pagination": {
    "total": 5,
    "pages": 1,
    "currentPage": 1,
    "limit": 20
  }
}
\`\`\`

#### Get Seller Orders

\`\`\`
GET /orders/selling
\`\`\`

Query parameters: (same as buyer orders)

Response: (similar to buyer orders, but with buyer information instead of seller)

#### Get Order Details

\`\`\`
GET /orders/{order_id}
\`\`\`

Response:
\`\`\`json
{
  "id": "order_id",
  "gig": {
    "id": "gig_id",
    "title": "Premium Wedding Photography Package",
    "image": "https://wedsnap.com/images/gigs/gig_id.jpg"
  },
  "seller": {
    "id": "seller_id",
    "name": "Ahmed Khan",
    "avatar": "https://wedsnap.com/images/profile/seller_id.jpg"
  },
  "buyer": {
    "id": "buyer_id",
    "name": "John Doe",
    "avatar": "https://wedsnap.com/images/profile/buyer_id.jpg"
  },
  "package": {
    "name": "Standard",
    "description": "10 hours of coverage, 2 photographers, 300 edited photos",
    "price": 65000,
    "deliveryTime": 10,
    "revisions": 3
  },
  "status": "In Progress",
  "orderDate": "2025-05-01T00:00:00Z",
  "deliveryDate": "2025-05-20T00:00:00Z",
  "price": 65000,
  "progress": 60,
  "messages": [
    {
      "id": "message_id",
      "sender": {
        "id": "buyer_id",
        "name": "John Doe"
      },
      "text": "I'm excited to work with you on my wedding photography!",
      "timestamp": "2025-05-01T12:30:00Z"
    },
    {
      "id": "message_id_2",
      "sender": {
        "id": "seller_id",
        "name": "Ahmed Khan"
      },
      "text": "Thank you! I'm looking forward to capturing your special day.",
      "timestamp": "2025-05-01T13:00:00Z"
    }
  ],
  "deliverables": [
    {
      "id": "deliverable_id",
      "title": "Preview Images",
      "description": "A set of 10 preview images from the wedding",
      "files": [
        "https://wedsnap.com/files/deliverables/file_id_1.jpg",
        "https://wedsnap.com/files/deliverables/file_id_2.jpg"
      ],
      "deliveredAt": "2025-05-15T10:00:00Z"
    }
  ]
}
\`\`\`

#### Update Order Status

\`\`\`
PUT /orders/{order_id}/status
\`\`\`

Request body:
\`\`\`json
{
  "status": "Completed"
}
\`\`\`

Response:
\`\`\`json
{
  "id": "order_id",
  "status": "Completed",
  "updatedAt": "2025-05-20T16:00:00Z"
}
\`\`\`

#### Deliver Order

\`\`\`
POST /orders/{order_id}/deliver
\`\`\`

Request body:
\`\`\`json
{
  "title": "Final Delivery",
  "description": "Complete set of wedding photos as agreed",
  "files": [
    {
      "name": "wedding_photos.zip",
      "url": "https://wedsnap.com/files/deliverables/wedding_photos.zip"
    }
  ]
}
\`\`\`

Response:
\`\`\`json
{
  "id": "deliverable_id",
  "orderId": "order_id",
  "title": "Final Delivery",
  "description": "Complete set of wedding photos as agreed",
  "files": [
    {
      "id": "file_id",
      "name": "wedding_photos.zip",
      "url": "https://wedsnap.com/files/deliverables/wedding_photos.zip",
      "size": 1500000000,
      "type": "application/zip"
    }
  ],
  "deliveredAt": "2025-05-20T16:30:00Z"
}
\`\`\`

### Messaging

#### Get Conversations

\`\`\`
GET /conversations
\`\`\`

Response:
\`\`\`json
{
  "conversations": [
    {
      "id": "conversation_id_1",
      "user": {
        "id": "user_id_1",
        "name": "Ahmed Khan",
        "avatar": "https://wedsnap.com/images/profile/user_id_1.jpg",
        "isOnline": true
      },
      "lastMessage": {
        "text": "I'm interested in your wedding photography package. Is it available for June 15th?",
        "timestamp": "2025-05-10T10:30:00Z",
        "isRead": true,
        "sender": "them"
      },
      "unreadCount": 0
    },
    // More conversations...
  ]
}
\`\`\`

#### Get Messages

\`\`\`
GET /conversations/{conversation_id}/messages
\`\`\`

Query parameters:
- `page` (default: 1)
- `limit` (default: 50)

Response:
\`\`\`json
{
  "messages": [
    {
      "id": "message_id_1",
      "text": "Hi there! I'm interested in your wedding photography package. Is it available for June 15th?",
      "timestamp": "2025-05-09T14:00:00Z",
      "sender": "them"
    },
    {
      "id": "message_id_2",
      "text": "Hello! Thank you for your interest. Yes, I'm available on June 15th. Would you like to know more about the package details?",
      "timestamp": "2025-05-09T14:30:00Z",
      "sender": "you"
    },
    // More messages...
  ],
  "pagination": {
    "total": 10,
    "pages": 1,
    "currentPage": 1,
    "limit": 50
  }
}
\`\`\`

#### Send Message

\`\`\`
POST /conversations/{conversation_id}/messages
\`\`\`

Request body:
\`\`\`json
{
  "text": "Yes, please. Could you tell me what's included in your premium package and the pricing?"
}
\`\`\`

Response:
\`\`\`json
{
  "id": "message_id",
  "text": "Yes, please. Could you tell me what's included in your premium package and the pricing?",
  "timestamp": "2025-05-10T17:00:00Z",
  "sender": "you"
}
\`\`\`

### Reviews

#### Create a Review

\`\`\`
POST /gigs/{gig_id}/reviews
\`\`\`

Request body:
\`\`\`json
{
  "orderId": "order_id",
  "rating": 5,
  "comment": "Ahmed and his team were absolutely amazing! They captured our wedding beautifully and were so professional throughout the day."
}
\`\`\`

Response:
\`\`\`json
{
  "id": "review_id",
  "gig": {
    "id": "gig_id",
    "title": "Premium Wedding Photography Package"
  },
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "avatar": "https://wedsnap.com/images/profile/user_id.jpg"
  },
  "rating": 5,
  "comment": "Ahmed and his team were absolutely amazing! They captured our wedding beautifully and were so professional throughout the day.",
  "createdAt": "2025-05-20T18:00:00Z"
}
\`\`\`

#### Get Gig Reviews

\`\`\`
GET /gigs/{gig_id}/reviews
\`\`\`

Query parameters:
- `page` (default: 1)
- `limit` (default: 20)
- `sort` (optional, values: "newest", "highest", "lowest")

Response:
\`\`\`json
{
  "reviews": [
    {
      "id": "review_id_1",
      "user": {
        "id": "user_id_1",
        "name": "Fatima Ali",
        "avatar": "https://wedsnap.com/images/profile/user_id_1.jpg"
      },
      "rating": 5,
      "comment": "Ahmed and his team were absolutely amazing! They captured our wedding beautifully and were so professional throughout the day.",
      "date": "2025-03-15T00:00:00Z"
    },
    // More reviews...
  ],
  "pagination": {
    "total": 124,
    "pages": 7,
    "currentPage": 1,
    "limit": 20
  },
  "summary": {
    "averageRating": 4.9,
    "totalReviews": 124,
    "ratingDistribution": {
      "5": 100,
      "4": 20,
      "3": 3,
      "2": 1,
      "1": 0
    }
  }
}
\`\`\`

### Search and Filtering

#### Search Gigs

\`\`\`
GET /search
\`\`\`

Query parameters:
- `q` (required)
- `category` (optional)
- `location` (optional)
- `minPrice` (optional)
- `maxPrice` (optional)
- `sort` (optional, values: "newest", "popular", "price_low", "price_high")
- `page` (default: 1)
- `limit` (default: 20)

Response: (similar to Get All Gigs)

#### Get Categories

\`\`\`
GET /categories
\`\`\`

Response:
\`\`\`json
{
  "categories": [
    {
      "id": "category_id_1",
      "name": "Wedding",
      "count": 150
    },
    {
      "id": "category_id_2",
      "name": "Engagement",
      "count": 75
    },
    // More categories...
  ]
}
\`\`\`

#### Get Locations

\`\`\`
GET /locations
\`\`\`

Response:
\`\`\`json
{
  "locations": [
    {
      "name": "Lahore",
      "count": 120
    },
    {
      "name": "Karachi",
      "count": 95
    },
    // More locations...
  ]
}
\`\`\`

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of a request:

- 200 OK: The request was successful
- 201 Created: The resource was successfully created
- 400 Bad Request: The request was invalid or cannot be served
- 401 Unauthorized: Authentication is required or failed
- 403 Forbidden: The request is understood but refused
- 404 Not Found: The requested resource does not exist
- 500 Internal Server Error: An error occurred on the server

Error responses will have the following format:

\`\`\`json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "A human-readable error message",
    "details": {} // Optional additional details
  }
}
\`\`\`

## Rate Limiting

The API implements rate limiting to prevent abuse. The current limits are:

- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

Rate limit information is included in the response headers:

\`\`\`
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1620000000
\`\`\`

If you exceed the rate limit, you will receive a 429 Too Many Requests response.

## Client Implementation

### Using the API Client

WedSnap provides a built-in API client for easy integration. Here's how to use it:

\`\`\`typescript
import { apiService } from "@/lib/api";

// Authentication
const login = async (email: string, password: string) => {
  try {
    const response = await apiService.auth.login(email, password);
    console.log("Logged in successfully:", response.user);
    return response;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

// Fetching gigs
const fetchGigs = async (params: any) => {
  try {
    const response = await apiService.gigs.getAll(params);
    console.log("Gigs:", response.gigs);
    return response;
  } catch (error) {
    console.error("Failed to fetch gigs:", error);
    throw error;
  }
};

// Creating an order
const createOrder = async (orderData: any) => {
  try {
    const response = await apiService.orders.create(orderData);
    console.log("Order created:", response);
    return response;
  } catch (error) {
    console.error("Failed to create order:", error);
    throw error;
  }
};
\`\`\`

### Environment Variables

To configure the API client, set the following environment variables:

\`\`\`
NEXT_PUBLIC_API_URL=https://api.wedsnap.com/v1
\`\`\`

## Support

If you have any questions or need assistance with the API, please contact our developer support team at api-support@wedsnap.com or visit our developer forum at https://developers.wedsnap.com/forum.
