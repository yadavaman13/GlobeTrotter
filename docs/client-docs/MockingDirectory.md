# Mocking & Backend Integration Directory

This document details every instance in the frontend codebase where mock data, network delay simulations (`setTimeout`), or client-side caching are used. Each entry maps out the corresponding backend routes, database schemas, and architectural patterns required to upgrade to a production-ready, full-stack environment.

---

## 1. Authentication & Session Management

These components handle credentials validation, signups, lockouts, and password resets. To maintain responsiveness, they simulate API latency using timers and store session details in localStorage.

### A. [LoginForm.jsx](file:///d:/Hackathon-UI/UI/src/components/Login/LoginLayout/LoginForm/LoginForm.jsx)

- **Mock Implementation**:
    - Simulates authentication delay using a 5-second wait: `await new Promise((resolve) => setTimeout(resolve, 5000))`.
    - Implements brute-force protection (lockout after consecutive failures) purely in client state and `localStorage` (`login_attempts`, `locked_until`).
- **Required Production Integration**:
    - **API Endpoint**: `POST /api/auth/login` (body: `{ email, password }`).
    - **Security Layer**:
        - Verify password hash using a library like `bcrypt`.
        - Retrieve user lockout history from a server-side cache (e.g. Redis) and block login if active.
    - **Database Tables**:
        - **Users**: `id`, `email`, `password_hash`, `first_name`, `last_name`, `role`, `created_at`.
        - **Lockouts (Redis Cache)**: Key: `lockout:user:<email>`, Value: `{ failed_attempts: Integer, locked_until: Timestamp }`.

### B. [ForgotPasswordForm.jsx](file:///d:/Hackathon-UI/UI/src/components/Login/LoginLayout/ForgotPasswordForm/ForgotPasswordForm.jsx)

- **Mock Implementation**:
    - Simulates dynamic OTP delivery to email and matches OTPs using React state checks.
    - Simulates password update confirmation using a mock success callback.
- **Required Production Integration**:
    - **API Endpoints**:
        - `POST /api/auth/forgot-password` (triggers SMTP delivery of a 6-digit OTP using SendGrid/NodeMailer).
        - `POST /api/auth/verify-otp` (compares user OTP input against the value stored in a temporary server-side storage).
        - `POST /api/auth/reset-password` (updates hashed password credentials in database).
    - **Database Cache**:
        - **OTP Store (Redis/Memory)**: Key: `otp:user:<email>`, Value: `{ code: String, expires_at: Timestamp }` (configured with a TTL of 10 minutes).

### C. [RegisterForm.jsx](file:///d:/Hackathon-UI/UI/src/components/Register/RegisterLayout/RegisterForm/RegisterForm.jsx)

- **Mock Implementation**:
    - Simulates onboarding transitions, verification OTP codes, avatar file uploads, and workspace creation within standard local hooks.
- **Required Production Integration**:
    - **API Endpoints**:
        - `POST /api/auth/register` (initializes registration flow, sends verification code).
        - `POST /api/auth/verify-register-otp` (validates registration verification code).
        - `POST /api/users/profile-photo` (handles profile avatar file uploading via middleware like Multer and streams files to AWS S3/Cloudinary).
    - **Database Tables**:
        - **Users**: User record creation with `avatar_url` path.
        - **Workspaces**: `id`, `name`, `owner_id`, `created_at`.
        - **Workspace Members**: `id`, `workspace_id`, `user_id`, `role`, `joined_at`.

### D. [RememberMe.jsx](file:///d:/Hackathon-UI/UI/src/components/Login/LoginLayout/LoginForm/RememberMe/RememberMe.jsx)

- **Mock Implementation**:
    - Renders a mock information popover showing a hardcoded session duration of "30 days".
- **Required Production Integration**:
    - **API Integration**: Integrates directly with `POST /api/auth/login` (the `rememberMe` checkbox determines whether the backend issues a long-lived JWT refresh token with `30 days` expiration, stored in a secure HttpOnly cookie, instead of a transient session cookie).

---

## 2. Dynamic Data Grids & Tables

These components render record lists, search parameters, tab filtering, and page navigation dynamically.

### A. [AdvancedTable.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/DataDisplay/AdvancedTable/AdvancedTable.jsx), [DataTable.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/DataDisplay/DataTable/DataTable.jsx) & [FilterTable.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/DataDisplay/FilterTable/FilterTable.jsx)

- **Mock Implementation**:
    - Performs searching, column filtering, sorting, and slicing/pagination in local JavaScript arrays in memory.
- **Required Production Integration**:
    - **API Endpoint**: `GET /api/records`
        - Parameters: `?page=1&limit=10&search=john&sort_field=amount&sort_dir=desc&status=paid`
    - **Server-Side Operations**:
        - **Pagination**: Implement SQL limits and offsets: `SELECT * FROM invoices LIMIT ? OFFSET ?`.
        - **Search Indexing**: Use indexing for search columns (`CREATE INDEX idx_search ON invoices(client_name)` or full-text query structures in PostgreSQL / Elasticsearch).
        - **Filtering**: Construct dynamically generated SQL clauses based on query params: `WHERE status = ? AND amount >= ?`.

---

## 3. Data Visualization & Dashboard KPIs

These components aggregate business metrics and plot chronological time-series chart data.

### A. [KpiLineChartCard.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/DataDisplay/KpiLineChartCard/KpiLineChartCard.jsx) & [AnalyticsLineChartCard.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/AnalyticsLineChartCard/AnalyticsLineChartCard.jsx)

- **Mock Implementation**:
    - Renders hardcoded JSON coordinate maps for charts representing revenues, counts, and performance averages.
- **Required Production Integration**:
    - **API Endpoint**: `GET /api/analytics/charts/:card_id?period=30d`
    - **Server-Side Aggregations**:
        - Run time-series databases or SQL date grouping queries:
            ```sql
            SELECT
              date_trunc('day', payment_date) AS chart_date,
              SUM(amount) AS total_value
            FROM payments
            WHERE payment_date >= NOW() - INTERVAL '30 days'
            GROUP BY chart_date
            ORDER BY chart_date;
            ```

---

## 4. Kanban Task Management

The Kanban system organizes cards across progress states using drag-and-drop.

### A. [KanbanBoard.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/DataDisplay/KanbanBoard/KanbanBoard.jsx)

- **Mock Implementation**:
    - Reorders cards and transfers items between column groups using local React arrays.
- **Required Production Integration**:
    - **API Endpoints**:
        - `PATCH /api/kanban/cards/:card_id` (updates card status, position, or column assignments: `{ status: String, position_rank: Number }`).
    - **Real-Time Sync**: Use WebSockets (`Socket.io` or Server-Sent Events) to broadcast drag updates to all active sessions, preventing card position conflicts.
    - **Database Tables**:
        - **Kanban Columns**: `id`, `title`, `workspace_id`, `order_rank`.
        - **Kanban Cards**: `id`, `column_id`, `title`, `description`, `position_rank`, `progress`, `comments_count`, `assigned_users`, `created_at`.

---

## 5. Shell Components

These shell items represent background stats, notifications, and active session details.

### A. [Topbar.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/Navigation/Topbar/Topbar.jsx)

- **Mock Implementation**:
    - Unread count indicator and mock notifications dropdown are hardcoded in local state.
- **Required Production Integration**:
    - **API Endpoints**:
        - `GET /api/notifications/unread-count` (retrieves the raw integer of active unseen logs).
        - `GET /api/notifications` (paginated list of user notifications).
        - `PATCH /api/notifications/:id/read` (marks single items as read).
    - **Database Tables**:
        - **Notifications**: `id`, `user_id`, `title`, `message`, `is_read`, `created_at`.

### B. [DashboardLayout.jsx](file:///d:/Hackathon-UI/UI/src/components/Dashboard/DashboardLayout/DashboardLayout.jsx)

- **Mock Implementation**:
    - Static configuration object for the user profile data: `{ name: 'Alexander', email: 'alexander@example.com', role: 'developer' }`.
- **Required Production Integration**:
    - **API Endpoint**: `GET /api/users/profile` (authorized using JWT token inside Request Authorization headers).
    - **Backend Validation**: Decodes JWT, validates session state in database, and returns active User Profile info.
