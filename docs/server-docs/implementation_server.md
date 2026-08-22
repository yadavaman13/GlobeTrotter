# Server Implementation Reference Guide

This document acts as the live record of implemented backend features, API contracts, routing definitions, database schemas, edge cases, and core business logic.

> [!IMPORTANT]
> **Instructions for AI Agents and Developers:**
> Before developing or modifying any backend feature:
>
> 1. Scan this entire document to verify if the feature or endpoint already exists.
> 2. Avoid redundant implementations or duplicate routes.
> 3. If you are enhancing an existing feature, update its section in this document.
> 4. If you are implementing a new feature, append it to this document with its routing, API contracts, schemas involved, edge cases, and business logic.

---

## 1. Authentication & User Profile Module

### Feature Description

Manages user authentication, secure sessions, profile details, password rotations, role-based access control, and soft deletion/recovery of accounts.

### Routings & API Contracts

All routes are prefixed with `/api/auth`, `/api/users`, or `/api/admin`.

#### Public Endpoints

- **`POST /api/auth/register`**
  - **Description:** Registers a new user account.
  - **Request Body:**
    ```json
    {
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "password": "strongpassword"
    }
    ```
  - **Response (201 Created):** Sets HTTP-only secure cookie `token`.
    ```json
    {
      "success": true,
      "message": "User registered successfully",
      "data": {
        "user": {
          "id": "uuid-v4-string",
          "name": "Jane Doe",
          "email": "jane.doe@example.com",
          "role": "USER",
          "isActive": true,
          "emailVerified": false,
          "createdAt": "timestamp",
          "updatedAt": "timestamp"
        }
      }
    }
    ```

- **`POST /api/auth/login`**
  - **Description:** Validates credentials and initializes a secure session.
  - **Request Body:**
    ```json
    {
      "email": "jane.doe@example.com",
      "password": "strongpassword"
    }
    ```
  - **Response (200 OK):** Sets HTTP-only secure cookie `token`. Returns standard user object payload.

- **`POST /api/auth/logout`**
  - **Description:** Invalidates the current session and blacklists the client JWT token.
  - **Response (200 OK):** Clears cookie `token`.
    ```json
    {
      "success": true,
      "message": "User logged out successfully"
    }
    ```

#### Authenticated User Endpoints (Requires valid cookie `token`)

- **`GET /api/auth/me`**
  - **Description:** Retrieves profile data for the currently authenticated user.
  - **Response (200 OK):** User object data.

- **`PATCH /api/auth/profile`**
  - **Description:** Updates current user's profile details.
  - **Request Body:**
    ```json
    {
      "name": "Jane Updated",
      "email": "jane.updated@example.com"
    }
    ```
  - **Response (200 OK):** Returns updated user object.

- **`PATCH /api/auth/change-password`**
  - **Description:** Rotates the user's password.
  - **Request Body:**
    ```json
    {
      "currentPassword": "strongpassword",
      "newPassword": "newstrongpassword"
    }
    ```
  - **Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Password changed successfully"
    }
    ```

- **`DELETE /api/auth/account`**
  - **Description:** Soft-deletes the logged-in user's account.
  - **Response (200 OK):** Clears cookie `token`.
    ```json
    {
      "success": true,
      "message": "Account deleted successfully"
    }
    ```

#### Admin Endpoints (Requires valid cookie `token` and role `admin`)

- **`GET /api/auth/users`** (Also mapped to `GET /api/admin/users`)
  - **Description:** Lists all registered users.
  - **Query Parameters:**
    - `includeDeleted=true` (Boolean, Optional: Include soft-deleted accounts)
  - **Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Users retrieved successfully",
      "data": {
        "users": [ ... ]
      }
    }
    ```

- **`GET /api/auth/users/:id`**
  - **Description:** Retrieves a specific user's complete profile record.
  - **Response (200 OK):** Complete user object.

- **`PATCH /api/auth/users/:id/role`**
  - **Description:** Changes the role of the specified user.
  - **Request Body:**
    ```json
    {
      "role": "admin"
    }
    ```
  - **Response (200 OK):** Updated user object.

- **`DELETE /api/auth/users/:id`**
  - **Description:** Admins can soft-delete any user account.
  - **Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "User soft-deleted successfully"
    }
    ```

### Database Schemas Involved

- **`users` ([`src/db/schema/users.schema.js`](../../server/src/db/schema/users.schema.js)):**
  - `id`: UUID, Primary Key, Auto-generated.
  - `firstName` / `lastName`: Text.
  - `email`: Text, Unique Index.
  - `password`: Text, Bcrypt hash.
  - `profileImage`: Text.
  - `role`: Enum (`user`, `admin`).
  - `emailVerified`: Boolean.
  - `isActive`: Boolean.
  - `isDeleted`: Boolean.
  - `deletedAt`: Timestamp with time zone.
  - `recoveryExpiresAt`: Timestamp with time zone.

### Edge Cases Handled

1.  **Duplicate Registrations:** Attempting to register with an already-used email triggers a specific validation conflict error.
2.  **Soft-deleted Logins:** If a soft-deleted user attempts to log in within the 15-day recovery window, the request is rejected with `403 Forbidden` informing them that their account is de-activated but recoverable.
3.  **Invalid OTP Attempts:** When restoring a soft-deleted account, OTP verification locks or rejects requests if the code is invalid or has expired.
4.  **Bypassing Database Operations:** Controller layers route queries strictly through DAOs (Data Access Objects) which automatically filter out soft-deleted records unless explicitly asked.

### Core Business Logic

- **Token Blacklisting:** On logout, the JWT payload's JTI/signature is blacklisted in Redis with a Time-To-Live (TTL) matching the token's remaining validity duration. Subsequent requests with that token are blocked by the `protect` middleware.
- **Sliding Window Rate Limiting:** Auth endpoints are rate-limited using Redis sliding counters (`ratelimit:{IP}:{URL}`).
- **Automatic Deactivation Cleanup:** Expired soft-deletions (older than 15 days) are permanently deleted nightly by a background cron executor ([`src/cron/cleanup.cron.js`](../../server/src/cron/cleanup.cron.js)).

---

## 2. AI Conversational Chat Module

### Feature Description

Provides real-time conversational streaming and one-off chat replies utilizing Google Gemini models, integrated search capabilities (Tavily), message history logging, and file attachment handling.

### Routings & API Contracts

All routes are prefixed with `/api/ai`.

- **`POST /api/ai/chat/stream`**
  - **Description:** Starts real-time streaming response for a conversational query.
  - **Request Body:**
    ```json
    {
      "message": "User query text",
      "chatId": "optional-uuid-string"
    }
    ```
  - **Response (200 OK):** Chunked server-sent event (SSE) token stream containing markdown formatting.

- **`POST /api/ai/chat/once`**
  - **Description:** Returns a full non-streaming AI response block.
  - **Request Body:** Similar to `/chat/stream`.
  - **Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "response": "Full AI message text"
      }
    }
    ```

- **`GET /api/ai/chats`**
  - **Description:** Retrieves all conversations associated with the logged-in user.
  - **Response (200 OK):** List of chat objects.

- **`GET /api/ai/chats/:chatId`**
  - **Description:** Retrieves a specific chat thread containing all messages.
  - **Response (200 OK):** Detailed thread of query/response logs.

- **`PATCH /api/ai/chats/:chatId`**
  - **Description:** Renames the conversation thread title.
  - **Request Body:**
    ```json
    {
      "title": "New Thread Name"
    }
    ```
  - **Response (200 OK):** Updated chat object.

- **`DELETE /api/ai/chats/:chatId`**
  - **Description:** Permanently deletes a chat conversation and all related messages/files.
  - **Response (200 OK):** Success message.

- **`POST /api/ai/chat/upload`**
  - **Description:** Uploads one or more message files to CDN storage (ImageKit) for context indexing.
  - **Request Body:** Multi-part form data under `files` field.
  - **Response (200 OK):** List of uploaded files metadata.

### Database Schemas Involved

- **`chats` ([`src/db/schema/chats.schema.js`](../../server/src/db/schema/chats.schema.js)):**
  - `id`: UUID, Primary Key.
  - `userId`: UUID, Foreign Key reference to `users.id` (cascade delete).
  - `title`: Text (defaults to `'New chat'`).
- **`messages` ([`src/db/schema/messages.schema.js`](../../server/src/db/schema/messages.schema.js)):**
  - `id`: UUID, Primary Key.
  - `chatId`: UUID, Foreign Key reference to `chats.id` (cascade delete).
  - `content`: Text.
  - `role`: Enum (`user`, `ai`).
- **`files` ([`src/db/schema/files.schema.js`](../../server/src/db/schema/files.schema.js)):**
  - `id`: UUID, Primary Key.
  - `fileId`: ImageKit file reference ID.
  - `name`: Text.
  - `url`: Text.
  - `messageId`: UUID, Foreign Key references `messages.id` (cascade delete).

### Edge Cases Handled

1.  **Failover Resilience:** If the primary high-capacity LLM model hits a quota limit or fails, the router automatically catches the exception and falls back to a lighter fallback model (`gemini-3.1-flash-lite`) to prevent service interruption.
2.  **Orphaned Messages:** Chat threads started without a title trigger background title generation based on the first query message.
3.  **Missing Chats:** If a query references a non-existent `chatId`, the service automatically initializes a new chat thread under the authenticated user.

### Core Business Logic

- **Tool Calling:** The LangChain agent handles multi-turn decisions, dynamically invoking local tools such as current time retrieval, internet queries (Tavily API), and RAG vector searches (Pinecone).
- **History Scoping:** For each model execution, previous thread history is extracted from the database and formatted as a rolling context window to preserve conversation coherence.

---

## 3. RAG Ingestion & Vector Retrieval Module

### Feature Description

Converts uploaded documents into structured semantic markdown, splits them into indexed chunks, embeds texts, and executes localized vector searches.

### Routings & API Contracts

All routes are prefixed with `/api/rag`.

- **`POST /api/rag/admin/upload`**
  - **Description:** Admin uploads an administrative reference document for global RAG lookup.
  - **Request Body:** Multi-part form data containing the `file` field.
  - **Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Global file uploaded and indexing initiated"
    }
    ```

- **`DELETE /api/rag/admin/chunks`**
  - **Description:** Clears all global and user-uploaded chunks from database caches and vector indices.
  - **Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Vector indexing cache cleared"
    }
    ```

### Database Schemas Involved

- **`rag_files` ([`src/db/schema/rag_files.schema.js`](../../server/src/db/schema/rag_files.schema.js)):**
  - `id`: UUID, Primary Key.
  - `fileId`: ImageKit identifier.
  - `name` / `url` / `filePath`: Text.
  - `processingStatus`: Enum (`pending`, `completed`, `failed`).
  - `ragStatus`: Enum (`pending`, `completed`, `failed`).
- **`chunks` ([`src/db/schema/chunks.schema.js`](../../server/src/db/schema/chunks.schema.js)):**
  - `id`: UUID, Primary key.
  - `fileId` / `ragFileId`: Foreign Keys referencing user files or admin global documents.
  - `chatId`: Foreign Key referencing the specific chat thread boundary.
  - `text` / `markdown`: Text chunk content.
  - `metadata`: JSONB containing page boundaries and hierarchical headers.

### Edge Cases Handled

1.  **Complex Layout Parsing:** Files containing tables or charts are parsed through LlamaIndex Cloud Parser to extract structured tabular data inside the markdown outputs.
2.  **Chunk Leakage Prevention:** Vector searches verify metadata scopes. User chats can only access vector chunks that explicitly match the active session `chatId`, preventing users from retrieving context from other chats or users.
3.  **Failed Ingestion Recovery:** If vector database writes fail, the target file's `ragStatus` is set to `failed`, allowing cleanup routines to identify corrupt uploads.

### Core Business Logic

- **Recursive Markdown Splitting:** Documents are split into segments of roughly `700` characters with `120` overlapping characters. The splitting pipeline respects markdown headings to group paragraphs contextually.
- **Pinecone Indexing:** Text chunks are embedded using Mistral embeddings and stored in Pinecone with explicit filter tags `{ file, chat, ragFile }`.

---

## 4. Chromium-Free PDF Generation Module

### Feature Description

Compiles application data and HTML layouts into static lightweight PDF document streams without the overhead of heavy headless web browsers.

### Routings & API Contracts

All routes are prefixed with `/api/pdf`.

- **`GET /api/pdf/invoice/:id`**
  - **Description:** Compiles transaction details and generates an invoice PDF.
  - **Query Parameters:**
    - `inline=true` (Boolean, Optional: Streams the PDF inline to render directly in the browser instead of forcing an attachment download)
  - **Response (200 OK):** Binary stream with `Content-Type: application/pdf`.

- **`GET /api/pdf/invoice/:id/preview`**
  - **Description:** Generates raw HTML markup preview of the invoice layout.
  - **Response (200 OK):** Rendered HTML preview.

- **`GET /api/pdf/receipt/:id`**
  - **Description:** Generates and downloads a payment receipt PDF.
  - **Response (200 OK):** Binary PDF stream.

- **`POST /api/pdf/render`**
  - **Description:** Accepts a raw custom HTML template and compiles it directly to a PDF buffer.
  - **Request Body:**
    ```json
    {
      "html": "<html><body><h1>Custom PDF Report</h1></body></html>"
    }
    ```
  - **Response (200 OK):** Binary PDF stream.

### Database Schemas Involved

No custom schemas are unique to this module; it references transaction structures in **`payments`** and profiles in **`users`**.

### Edge Cases Handled

1.  **HTML Injection Mitigation:** All template variables derived from user inputs are passed through `escapeHtml()` sanitizers.
2.  **Rasterization Compliance:** The layout rendering is limited to safe layouts compatible with standard canvas borders and basic flexbox. Unsupported modern CSS styles are stripped out to prevent canvas breakages.
3.  **Self-Contained Styling:** Custom fonts, layout scripts, and background vector assets are bundled inline or pre-loaded locally to avoid external request timeouts.

### Core Business Logic

- **Chromium-Free Engine:** The pipeline uses `html-pdf-lite` utilizing PDFKit and `@resvg/resvg-js` to compile vector elements and rasterize text structures fast, using low server memory.
- **Flexible Streaming Responses:** The controller integrates `sendPdfResponse` to map correct attachment parameters dynamically in headers.

---

## 5. City & Destination Discovery Module

### Feature Description

Provides destination search, filtering, and detailed retrieval capabilities, allowing users to discover cities based on country, region, cost indices, and popularity.

### Routings & API Contracts

All routes are prefixed with `/api/cities`.

- **`GET /api/cities`**
  - **Description:** Retrieves a list of cities matching search queries and filters.
  - **Query Parameters:**
    - `q` (String, Optional: Search term matching city name, country, or region)
    - `country` / `region` (String, Optional: Match country or region)
    - `minCostIndex` / `maxCostIndex` (Float, Optional: Filter by cost index range)
    - `minPopularity` / `maxPopularity` (Float, Optional: Filter by popularity range)
    - `page` / `limit` (Integer, Optional: Pagination control, defaults to page=1, limit=10)
    - `sortBy` (String, Optional: Options: `'name'`, `'country'`, `'region'`, `'costIndex'`, `'popularity'`, defaults to `'popularity'`)
    - `sortOrder` (String, Optional: `'asc'` or `'desc'`, defaults to `'desc'`)
  - **Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Cities retrieved successfully",
      "data": {
        "cities": [
          {
            "id": "uuid-string",
            "name": "Paris",
            "country": "France",
            "region": "Europe",
            "costIndex": "4.50",
            "popularity": "4.90",
            "createdAt": "timestamp",
            "updatedAt": "timestamp"
          }
        ],
        "pagination": {
          "page": 1,
          "limit": 10,
          "total": 1,
          "totalPages": 1
        }
      }
    }
    ```

- **`GET /api/cities/:cityId`**
  - **Description:** Retrieves details of a specific city.
  - **Response (200 OK):** Standard JSON object containing the city details block.

- **`GET /api/cities/:cityId/activities`**
  - **Description:** Retrieves all activities linked to the specified city.
  - **Response (200 OK):** Paginated array list of activities matching the city ID.

### Database Schemas Involved

- **`cities` ([`src/db/schema/cities.schema.js`](../../server/src/db/schema/cities.schema.js)):**
  - `id`: UUID, Primary Key.
  - `name` / `country`: Text, Non-nullable.
  - `region`: Text.
  - `costIndex` / `popularity`: Numeric.

### Edge Cases Handled

1. **Negative Filter Values:** Handled in validators to reject negative `minCostIndex`, `maxCostIndex`, `minPopularity`, or `maxPopularity` with `400 Bad Request`.
2. **Missing Search Matches:** Returns a `200 OK` response with `cities: []` and `total: 0`.
3. **Invalid UUID Format:** Param validation enforces valid UUID formats, rejecting malformed requests immediately.

---

## 6. Activity Discovery Module

### Feature Description

Provides activity discovery and details retrieval. Supports filtering by destination, activity type, cost thresholds, and duration ranges.

### Routings & API Contracts

All routes are prefixed with `/api/activities`.

- **`GET /api/activities`**
  - **Description:** Retrieves activities matching query parameters.
  - **Query Parameters:**
    - `cityId` (UUID, Optional: Filter by specific destination)
    - `activityType` (String, Optional: Sightseeing, adventure, museum, etc.)
    - `minCost` / `maxCost` (Float, Optional: Cost constraints)
    - `minDuration` / `maxDuration` (Integer, Optional: Duration boundaries in minutes)
    - `q` (String, Optional: Keyword matching name or description)
    - `page` / `limit` (Integer, Optional)
    - `sortBy` (String, Optional: `'name'`, `'cost'`, `'durationMinutes'`, `'createdAt'`)
    - `sortOrder` (String, Optional)
  - **Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Activities retrieved successfully",
      "data": {
        "activities": [
          {
            "id": "uuid-string",
            "name": "Eiffel Tower Access",
            "description": "Guided visit...",
            "activityType": "sightseeing",
            "cost": "2500.00",
            "durationMinutes": 120,
            "currency": "INR",
            "city": {
              "id": "city-uuid",
              "name": "Paris",
              "country": "France"
            },
            "images": [
              {
                "id": "image-uuid",
                "imageUrl": "https://...",
                "displayOrder": 1
              }
            ]
          }
        ]
      }
    }
    ```

- **`GET /api/activities/:activityId`**
  - **Description:** Retrieves detailed activity item profiling, including city context and sorted image gallery array.
  - **Response (200 OK):** Standard JSON object detailing the activity block.

### Database Schemas Involved

- **`activities` ([`src/db/schema/activities.schema.js`](../../server/src/db/schema/activities.schema.js))**
- **`activity_images` ([`src/db/schema/activity_images.schema.js`](../../server/src/db/schema/activity_images.schema.js))**

### Edge Cases Handled

1. **N+1 Query Resolution:** Rather than querying images inside a loop for each activity, the DAO performs a bulk `inArray` query matching all returned activity IDs, grouping and nesting them in JavaScript.
2. **Invalid Cost/Duration Filters:** Validation rules enforce positive float/integer bounds, preventing SQL range errors.
3. **No Image Assets:** Returns the activity with `images: []` instead of omitting the key or returning null.
