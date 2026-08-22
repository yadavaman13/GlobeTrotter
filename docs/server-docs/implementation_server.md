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
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane.doe@example.com",
      "password": "strongpassword",
      "phone": "+15551234567",
      "city": "Paris",
      "country": "France",
      "additionalInformation": "Bio details",
      "googleId": "google-id"
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
          "firstName": "Jane",
          "lastName": "Doe",
          "email": "jane.doe@example.com",
          "role": "user",
          "isActive": true,
          "emailVerified": false,
          "phone": "+15551234567",
          "city": "Paris",
          "country": "France",
          "additionalInformation": "Bio details",
          "googleId": "google-id",
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
      "firstName": "Jane",
      "lastName": "Updated",
      "email": "jane.updated@example.com",
      "phone": "+15559876543",
      "city": "Rome",
      "country": "Italy",
      "additionalInformation": "Updated Bio details",
      "googleId": "new-google-id"
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

## 5. Community & Travel Experiences Module

### Feature Description

Enables users to write travel experiences/opinions about their travel plans (Trips) or global locations (Activities), and view, search, filter, and sort a feed of community entries.

### Routings & API Contracts

All routes are prefixed with `/api/community`.

#### Public Endpoints

- **`GET /api/community/posts`**
  - **Description:** Retrieves the paginated community posts feed.
  - **Query Parameters:**
    - `search` (String, Optional: Search title and content case-insensitively)
    - `type` (String, Optional: Filter by post type `'trip'` or `'activity'`)
    - `cityId` (UUID, Optional: Filter by city)
    - `activityId` (UUID, Optional: Filter by specific activity)
    - `sortBy` (String, Optional: `'recent'` or `'oldest'`)
    - `groupBy` (String, Optional: `'type'`)
    - `page` (Integer, Optional: Page number, defaults to `1`)
    - `limit` (Integer, Optional: Items per page, defaults to `20`)
  - **Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Community feed retrieved successfully",
      "data": {
        "items": [
          {
            "id": "post-uuid",
            "postType": "trip",
            "title": "My Jaipur Trip",
            "content": "Had an amazing time in Jaipur...",
            "createdAt": "timestamp",
            "updatedAt": "timestamp",
            "author": {
              "id": "user-uuid",
              "firstName": "John",
              "lastName": "Doe",
              "profileImage": "http://..."
            },
            "trip": {
              "id": "trip-uuid",
              "name": "Jaipur Getaway"
            },
            "activity": null
          }
        ],
        "pagination": {
          "page": 1,
          "limit": 20,
          "total": 1,
          "totalPages": 1
        }
      }
    }
    ```

- **`GET /api/community/posts/:postId`**
  - **Description:** Retrieves details for a specific post.
  - **Response (200 OK):** Post object detail.

#### Authenticated Endpoints (Requires valid cookie `token`)

- **`POST /api/community/posts`**
  - **Description:** Creates a new community post.
  - **Request Body (Trip Experience):**
    ```json
    {
      "postType": "trip",
      "tripId": "trip-uuid",
      "title": "My Jaipur Trip",
      "content": "Had an amazing time in Jaipur..."
    }
    ```
  - **Request Body (Activity Experience):**
    ```json
    {
      "postType": "activity",
      "activityId": "activity-uuid",
      "title": "Jaipur City Tour",
      "content": "The sightseeing tour was incredible..."
    }
    ```
  - **Response (201 Created):** Created community post object.

- **`PATCH /api/community/posts/:postId`**
  - **Description:** Updates the title or content of a post. Note that target entities (tripId, activityId, postType) are immutable.
  - **Request Body:**
    ```json
    {
      "title": "Updated title",
      "content": "Updated content..."
    }
    ```
  - **Response (200 OK):** Updated post object.

- **`DELETE /api/community/posts/:postId`**
  - **Description:** Deletes a community post.
  - **Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Community post deleted successfully"
    }
    ```

### Database Schemas Involved

- **`community_posts` ([`src/db/schema/community_posts.schema.js`](../../server/src/db/schema/community_posts.schema.js)):**
  - `id`: UUID, Primary Key.
  - `authorId`: UUID, References `users.id` (cascade delete).
  - `postType`: Enum (`trip`, `activity`).
  - `tripId`: UUID, References `trips.id` (cascade delete).
  - `activityId`: UUID, References `activities.id` (restrict delete).
  - `title`: Text.
  - `content`: Text.
  - `createdAt` / `updatedAt`: Timestamps with time zone.

### Edge Cases Handled

1. **Trip Ownership Check:** A user can only write experience posts about their own trips. The backend verifies `trip.ownerId === req.user.id` when `postType` is `'trip'`.
2. **Mutual Exclusivity:** A check constraint and validation array ensure a post specifies either a `tripId` or an `activityId` exactly matching its `postType`.
3. **Immutable Fields:** Attempts to modify `postType`, `tripId`, or `activityId` on updates are blocked at the validation layer.
4. **Author Protection:** Only the creator of a community post can edit (PATCH) or delete (DELETE) it.
5. **Soft-Deleted Users:** The DAO / Auth protection automatically blocks soft-deleted users from interacting.

### Core Business Logic

- **City-based Feed Filtering:** When filtering the community feed by `cityId`, the service joins `activities` for activity-type posts, and checks for `tripStops` city matching via an EXISTS subquery for trip-type posts.
- **Client Grouping:** If `groupBy=type` is provided on GET, the controller formats the feed items sorted under `trips` and `activities` groups.

---

## 7. Admin & Analytics Module

### Feature Description

Provides administrative oversight, user lifecycle control, and real-time analytical telemetry across all platform domains (users, trips, itineraries, destinations, bookings, expense ledgers).

### Routings & API Contracts

All admin endpoints are protected by `protect` and `restrictTo('admin')` middlewares.

- **`GET /api/admin/analytics`**
  - **Description:** Aggregates live system-wide KPIs, growth trends, catalog totals, financial ledgers, and timeframe-scoped time-series metrics.
  - **Query Parameters:**
    - `timeframe` (optional): `'7d'` | `'30d'` | `'ytd'` (default: `'30d'`).
    - `search` (optional): Keyword search for analytics records.
  - **Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Analytics retrieved successfully",
      "data": {
        "analytics": {
          "users": { "total": 18540, "active": 18000, "deleted": 540, "newThisMonth": 2200 },
          "trips": { "total": 42318, "byStatus": {}, "byVisibility": {}, "publicCount": 7320 },
          "catalog": { "totalCities": 560, "totalActivities": 1240, "popularCities": [], "popularActivities": [] },
          "financials": { "totalExpensesRecorded": 1500000, "expensesByCategory": [] },
          "kpis": {
            "totalUsers": 18540,
            "usersTrend": "+12%",
            "tripsCreated": 42318,
            "tripsTrend": "+8%",
            "publicItineraries": 7320,
            "publicTrend": "Static",
            "activeCities": 560,
            "activitiesBookmarked": 84900,
            "bookmarksTrend": "+24%",
            "communityEngagement": 95
          },
          "timeSeries": [
            { "date": "2026-08-16", "label": "Mon", "trips": 230, "users": 105, "bookmarks": 420 }
          ],
          "timeframe": "30d"
        }
      }
    }
    ```

- **`GET /api/admin/users`**
  - **Description:** Lists users with search, role filters, and pagination.

- **`PATCH /api/admin/users/:userId/status`**
  - **Description:** Updates active/soft-deleted user status.

- **`PATCH /api/admin/users/:id/role`**
  - **Description:** Updates user role (`admin` vs `user`).

- **`POST /api/admin/users/cleanup`**
  - **Description:** Cleans up expired soft-deleted users beyond the 30-day retention window.

