# API Documentation

Backend base URL (dev): `http://localhost:3001`

- **Healthcheck**: `GET /health` → `{ status: 'ok', timestamp: ISOString }`
- All responses are JSON. Errors return `{ error: string, details?: any }`.

## Products
Prefix: `/products`

- `GET /products`
  - Description: List all products (most recent first). Includes category info.
  - Response: `{ data: Product[] }`

- `GET /products/:id`
  - Params: `id` (string)
  - Description: Get a single product by id. Includes category info.
  - 404 if not found.
  - Response: `{ data: Product }`

- `GET /products/category/:categoryId`
  - Params: `categoryId` (string)
  - Description: List products for a given category id.
  - Response: `{ data: Product[] }`

- `GET /products/search/:term`
  - Params: `term` (string)
  - Description: Case-insensitive search in `name` and `description`.
  - Response: `{ data: Product[] }`

Example
```bash
curl http://localhost:3001/products | jq
curl http://localhost:3001/products/abc123 | jq
curl http://localhost:3001/products/category/cat_123 | jq
curl http://localhost:3001/products/search/figurine | jq
```

Product shape (normalized)
```ts
interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;           // normalized from Decimal
  stock: number;
  category_id?: string;
  categories?: { id: string; name: string };
  images?: string[];       // optional array
  image_url?: string;      // optional main image URL
  details?: string[];      // optional list
  created_at?: string;     // ISO string
}
```

## Categories
Prefix: `/categories`

- `GET /categories`
  - Description: List categories with product counts.
  - Response: `{ data: CategoryWithCount[] }`

- `GET /categories/:id`
  - Params: `id`
  - Description: Get a category with its products and count.
  - 404 if not found.
  - Response: `{ data: CategoryWithProducts }`

- `GET /categories/stats`
  - Description: Simplified stats for homepage.
  - Response: `{ data: { id: string; name: string; description?: string; count: number }[] }`

Example
```bash
curl http://localhost:3001/categories | jq
curl http://localhost:3001/categories/cat_123 | jq
curl http://localhost:3001/categories/stats | jq
```

## Billing (Stripe)
No auth for demo; secure in production. Prefix: `/` (root)

- `POST /billing/create-checkout-session`
  - Modes:
    - Subscription: pass `mode: 'subscription', priceId`
    - One-off payment: pass `mode: 'payment', items: [{ productId, quantity }]`
      - Backend will load products by id and compute line_items from DB.
    - Alternatively, you can pass Stripe `lineItems` directly for payment mode.
  - Optional fields: `successUrl`, `cancelUrl`, `customerId`, `userId`
  - Response: `{ url: string }` — Redirect to this URL to continue checkout

  Request examples
  ```bash
  # Subscription (price-based)
  curl -X POST http://localhost:3001/billing/create-checkout-session \
    -H 'Content-Type: application/json' \
    -d '{
      "mode": "subscription",
      "priceId": "price_123",
      "successUrl": "http://localhost:3000/success",
      "cancelUrl": "http://localhost:3000/cancel",
      "userId": "user_123"
    }'

  # One-off payment (from DB products)
  curl -X POST http://localhost:3001/billing/create-checkout-session \
    -H 'Content-Type: application/json' \
    -d '{
      "mode": "payment",
      "items": [ { "productId": "abc123", "quantity": 2 } ],
      "userId": "user_123"
    }'
  ```

- `POST /billing/create-portal-session`
  - Body: `{ customerId: string, returnUrl?: string }`
  - Response: `{ url: string }`

- `POST /webhooks/stripe`
  - Stripe webhook endpoint. Raw body verification is enabled.
  - Set `STRIPE_WEBHOOK_SECRET` in backend env.

## Users (demo)
Prefix: `/users`

- `POST /users`
  - Body:
    ```json
    {
      "id": "uuid",
      "email": "email@example.com",
      "name": "John",
      "password": "plaintext"
    }
    ```
  - Validated with Zod.
  - Response: `{ data: User }`



## CORS
CORS is configured via `@fastify/cors` in `src/plugins/cors.ts`. Allowed origins (dev):
- `http://localhost:3000`
- `http://127.0.0.1:3000`
- `http://localhost:3001`

You can override with `CORS_ORIGIN` env (comma-separated) by adjusting the plugin if needed.

## Error handling
- 4xx for validation (Zod) errors with `details`.
- 500 for server errors with `error` message and logs.

## Postman / Thunder Client
You can import this documentation or re-create a collection with:
- Environment: `API_BASE_URL=http://localhost:3001`
- Requests matching each endpoint above.
