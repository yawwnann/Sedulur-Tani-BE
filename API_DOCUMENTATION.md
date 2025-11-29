# API Documentation - Sedulur Tani Backend

Base URL: `http://localhost:8686/api/v1`

## Table of Contents
- [Authentication](#authentication)
- [Users](#users)
- [Addresses](#addresses)
- [Products](#products)
- [Cart](#cart)
- [Checkout](#checkout)
- [Payments](#payments)
- [Orders](#orders)
- [Shipping](#shipping)
- [Cloudinary](#cloudinary)

---

## Authentication

### Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "buyer" // or "seller"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "buyer"
  }
}
```

---

### Login
**POST** `/auth/login`

Login to get authentication token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "buyer"
    }
  }
}
```

---

### Get Profile
**GET** `/auth/me`

Get current user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "buyer"
  }
}
```

---

## Users

### Get User by ID
**GET** `/users/:id`

Get user details by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "buyer"
  }
}
```

---

### Update User Profile
**PUT** `/users/:id`

Update user profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "081234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Updated",
    "phone": "081234567890"
  }
}
```

---

## Addresses

### Create Address
**POST** `/addresses`

Create a new address for the user.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "label": "Rumah",
  "recipient_name": "John Doe",
  "phone": "081234567890",
  "address_line": "Jl. Contoh No. 123",
  "city": "Surabaya",
  "province": "Jawa Timur",
  "postal_code": "60123",
  "is_default": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Address created successfully",
  "data": {
    "address": {
      "id": "address-id",
      "label": "Rumah",
      "recipient_name": "John Doe",
      "phone": "081234567890",
      "address_line": "Jl. Contoh No. 123",
      "city": "Surabaya",
      "province": "Jawa Timur",
      "postal_code": "60123",
      "is_default": true
    }
  }
}
```

---

### Get All Addresses
**GET** `/addresses`

Get all addresses for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Addresses retrieved successfully",
  "data": {
    "addresses": [
      {
        "id": "address-id",
        "label": "Rumah",
        "recipient_name": "John Doe",
        "phone": "081234567890",
        "address_line": "Jl. Contoh No. 123",
        "city": "Surabaya",
        "province": "Jawa Timur",
        "postal_code": "60123",
        "is_default": true
      }
    ]
  }
}
```

---

### Get Address by ID
**GET** `/addresses/:id`

Get specific address details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Address retrieved successfully",
  "data": {
    "address": {
      "id": "address-id",
      "label": "Rumah",
      "recipient_name": "John Doe",
      "phone": "081234567890",
      "address_line": "Jl. Contoh No. 123",
      "city": "Surabaya",
      "province": "Jawa Timur",
      "postal_code": "60123",
      "is_default": true
    }
  }
}
```

---

### Update Address
**PUT** `/addresses/:id`

Update an existing address.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "label": "Kantor",
  "recipient_name": "John Doe",
  "phone": "081234567890",
  "address_line": "Jl. Updated No. 456",
  "city": "Jakarta",
  "province": "DKI Jakarta",
  "postal_code": "12345"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Address updated successfully",
  "data": {
    "address": {
      "id": "address-id",
      "label": "Kantor",
      "address_line": "Jl. Updated No. 456",
      "city": "Jakarta",
      "province": "DKI Jakarta"
    }
  }
}
```

---

### Delete Address
**DELETE** `/addresses/:id`

Delete an address.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Address deleted successfully"
}
```

---

## Products

### Create Product
**POST** `/products`

Create a new product (Seller only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Beras Premium",
  "description": "Beras kualitas terbaik",
  "price": 15000,
  "stock": 100,
  "weight": 1,
  "category": "Beras",
  "imageUrl": "https://example.com/image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "product-id",
    "name": "Beras Premium",
    "price": 15000,
    "stock": 100
  }
}
```

---

### Get All Products
**GET** `/products`

Get all available products (Public).

**Query Parameters:**
- `category` (optional): Filter by category
- `search` (optional): Search by name
- `minPrice` (optional): Minimum price
- `maxPrice` (optional): Maximum price

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "product-id",
      "name": "Beras Premium",
      "description": "Beras kualitas terbaik",
      "price": 15000,
      "stock": 100,
      "weight": 1,
      "category": "Beras",
      "imageUrl": "https://example.com/image.jpg",
      "seller": {
        "id": "seller-id",
        "name": "Toko Tani"
      }
    }
  ]
}
```

---

### Get Product by ID
**GET** `/products/:id`

Get specific product details (Public).

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "product-id",
    "name": "Beras Premium",
    "description": "Beras kualitas terbaik",
    "price": 15000,
    "stock": 100,
    "weight": 1,
    "category": "Beras",
    "imageUrl": "https://example.com/image.jpg",
    "seller": {
      "id": "seller-id",
      "name": "Toko Tani"
    }
  }
}
```

---

### Update Product
**PUT** `/products/:id`

Update product information (Seller only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Beras Premium Updated",
  "price": 16000,
  "stock": 150
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "id": "product-id",
    "name": "Beras Premium Updated",
    "price": 16000,
    "stock": 150
  }
}
```

---

### Delete Product
**DELETE** `/products/:id`

Delete a product (Seller only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## Cart

### Add to Cart
**POST** `/cart`

Add a product to cart.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "productId": "product-id",
  "quantity": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product added to cart",
  "data": {
    "id": "cart-item-id",
    "productId": "product-id",
    "quantity": 2
  }
}
```

---

### Get Cart
**GET** `/cart`

Get user's cart items.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "cart-item-id",
        "product": {
          "id": "product-id",
          "name": "Beras Premium",
          "price": 15000,
          "imageUrl": "https://example.com/image.jpg"
        },
        "quantity": 2,
        "subtotal": 30000
      }
    ],
    "total": 30000
  }
}
```

---

### Update Cart Item
**PUT** `/cart/:itemId`

Update cart item quantity.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cart item updated",
  "data": {
    "id": "cart-item-id",
    "quantity": 3
  }
}
```

---

### Remove Cart Item
**DELETE** `/cart/:itemId`

Remove item from cart.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Item removed from cart"
}
```

---

## Checkout

### Create Checkout
**POST** `/checkout`

Create a checkout session.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "addressId": "address-id",
  "items": [
    {
      "productId": "product-id",
      "quantity": 2
    }
  ],
  "shippingCost": 25000,
  "notes": "Kirim pagi"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Checkout created successfully",
  "data": {
    "id": "checkout-id",
    "totalAmount": 55000,
    "shippingCost": 25000,
    "items": [...]
  }
}
```

---

### Get Checkout by ID
**GET** `/checkout/:id`

Get checkout details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "checkout-id",
    "totalAmount": 55000,
    "shippingCost": 25000,
    "status": "pending",
    "items": [...]
  }
}
```

---

## Payments

### Test Midtrans Config
**GET** `/payments/test-config`

Test Midtrans configuration (Development only).

**Response:**
```json
{
  "success": true,
  "message": "Midtrans configured correctly",
  "data": {
    "serverKey": "SB-xxx",
    "clientKey": "SB-xxx",
    "isProduction": false
  }
}
```

---

### Test Create Transaction
**POST** `/payments/test-transaction`

Test creating a Midtrans transaction (Development only).

**Request Body:**
```json
{
  "amount": 50000,
  "orderId": "test-order-123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "midtrans-token",
    "redirect_url": "https://app.sandbox.midtrans.com/snap/v2/..."
  }
}
```

---

### Create Payment
**POST** `/payments/create`

Create a payment for checkout.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "checkoutId": "checkout-id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment created successfully",
  "data": {
    "token": "midtrans-snap-token",
    "redirect_url": "https://app.sandbox.midtrans.com/snap/v2/..."
  }
}
```

---

### Payment Webhook
**POST** `/payments/webhook`

Midtrans payment notification webhook (Called by Midtrans).

**Request Body:**
```json
{
  "transaction_status": "settlement",
  "order_id": "order-id",
  "gross_amount": "55000.00"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Webhook processed"
}
```

---

### Get Payment Status
**GET** `/payments/:checkoutId`

Get payment status for a checkout.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "checkoutId": "checkout-id",
    "status": "paid",
    "transactionId": "midtrans-transaction-id",
    "paidAt": "2025-11-29T10:00:00Z"
  }
}
```

---

## Orders

### Get All Orders
**GET** `/orders`

Get all orders for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): Filter by status (pending, processing, shipped, delivered, cancelled)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "order-id",
      "orderNumber": "ORD-20251129-001",
      "totalAmount": 55000,
      "status": "processing",
      "createdAt": "2025-11-29T10:00:00Z",
      "items": [...]
    }
  ]
}
```

---

### Get Order by ID
**GET** `/orders/:id`

Get specific order details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "order-id",
    "orderNumber": "ORD-20251129-001",
    "totalAmount": 55000,
    "shippingCost": 25000,
    "status": "processing",
    "address": {...},
    "items": [...],
    "createdAt": "2025-11-29T10:00:00Z"
  }
}
```

---

### Update Order Status
**PUT** `/orders/:id/status`

Update order status (Seller only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "shipped",
  "trackingNumber": "JNE123456789"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order status updated",
  "data": {
    "id": "order-id",
    "status": "shipped",
    "trackingNumber": "JNE123456789"
  }
}
```

---

## Shipping

### Get Provinces
**GET** `/shipping/provinces`

Get all provinces in Indonesia.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "11",
      "name": "ACEH"
    },
    {
      "id": "35",
      "name": "JAWA TIMUR"
    }
  ]
}
```

---

### Get Regencies
**GET** `/shipping/regencies/:provinceId`

Get all regencies/cities in a province.

**Parameters:**
- `provinceId`: Province ID (e.g., "35" for Jawa Timur)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "3578",
      "provinceId": "35",
      "name": "KOTA SURABAYA"
    },
    {
      "id": "3501",
      "provinceId": "35",
      "name": "KABUPATEN PACITAN"
    }
  ]
}
```

---

### Get Districts
**GET** `/shipping/districts/:regencyId`

Get all districts in a regency/city.

**Parameters:**
- `regencyId`: Regency ID (e.g., "3578" for Kota Surabaya)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "357801",
      "regencyId": "3578",
      "name": "GENTENG"
    },
    {
      "id": "357802",
      "regencyId": "3578",
      "name": "TEGALSARI"
    }
  ]
}
```

---

### Calculate Shipping Cost
**POST** `/shipping/cost`

Calculate shipping cost based on destination and weight.

**Request Body:**
```json
{
  "provinceId": "35",
  "weight": 2.5
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "cost": 75000,
    "courier": "JNE (Estimasi)",
    "etd": "2-3 Hari"
  }
}
```

**Notes:**
- Weight is in kilograms (kg)
- Weight is rounded up (e.g., 2.5 kg becomes 3 kg)
- Minimum weight is 1 kg
- Cost calculation: Base cost per province × rounded weight

**Province Base Costs (per kg):**
- DKI Jakarta: Rp 10,000
- Jawa Barat: Rp 15,000
- Jawa Tengah: Rp 20,000
- Jawa Timur: Rp 25,000
- Banten: Rp 15,000
- Sumatera: Rp 30,000 - 55,000
- Kalimantan: Rp 45,000 - 55,000
- Sulawesi: Rp 45,000 - 55,000
- Papua: Rp 100,000

---

## Cloudinary

### Test Cloudinary Config
**GET** `/cloudinary/test-config`

Test Cloudinary configuration (Development only).

**Response:**
```json
{
  "success": true,
  "message": "Cloudinary configured correctly",
  "data": {
    "cloudName": "your-cloud-name",
    "apiKey": "***"
  }
}
```

---

### Test Upload
**POST** `/cloudinary/test-upload`

Test file upload to Cloudinary (Development only).

**Headers:**
```
Content-Type: multipart/form-data
```

**Request Body:**
- `image`: File (image file)

**Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "folder/image-id"
  }
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "email": "Email is required",
    "password": "Password must be at least 6 characters"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized. Please login first."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. Seller role required."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details"
}
```

---

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

To get a token, use the `/auth/login` endpoint.

---

## Rate Limiting

Currently, there is no rate limiting implemented. This may be added in future versions.

---

## Versioning

Current API version: **v1**

All endpoints are prefixed with `/api/v1`.

---

## Support

For issues or questions, please contact the development team.
