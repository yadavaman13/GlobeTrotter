# Apex Backend Documentation Hub & Agent Reference Index

Welcome to the **Apex Backend Server Documentation Hub**. This directory contains specialized technical reference guides designed to help human developers and AI coding agents build, extend, test, and debug the server application.

---

## 1. Document Catalog & Agent Dispatch Guidelines

Use this section to determine exactly which reference document is required based on your current task or query.

### 📂 File 1: [Server Architecture Guide](server-architecture.md)

- **Filename:** `server-architecture.md`
- **Core Purpose:** Provides the high-level master architectural blueprint of the backend application, serving as the baseline entry point.
- **Key Contents:**
    - System overview and global technology stack specifications.
    - Complete server directory map and module descriptions.
    - Full ER diagram and basic Drizzle schema fields.
    - Sequence flow diagrams for key flows (Auth, AI Streaming, RAG Ingestion, Razorpay).
    - Global error handling and middleware execution hierarchy.
    - Mini-blueprints for database additions, DAOs, modular controller/routes, and cron jobs.
- **🤖 When to Use (Agent Instructions):**
    - Read this file **first** during session onboarding to build a mental model of the codebase layout.
    - Consult this file when designing a feature spanning multiple layers (e.g., an Express module containing schema, routing, services, and middlewares).
    - Refer to this file to understand global configurations (caching, rate-limiting, error handling, SMTP mail dispatchers).

---

### 📂 File 2: [Auth Module Routing Reference Guide](auth-routes-guide.md)

- **Filename:** `auth-routes-guide.md`
- **Core Purpose:** A deep dive into the authentication, authorization, admin, and user profile management endpoint routes.
- **Key Contents:**
    - Master routing summary table detailing endpoints, HTTP methods, access levels, validators, parameters, and return payloads.
    - Detailed route specifications and execution flows (such as signup, OTP caching in Redis, soft-delete recovery bounds).
    - Step-by-step blueprints for implementing validation rule arrays and mounting Express routing pipelines.
- **🤖 When to Use (Agent Instructions):**
    - Consult this file before modifying or creating authentication routes under `/api/auth`, user profile routes under `/api/users`, or admin routes under `/api/admin`.
    - Refer to this file when auditing input validation checks (`express-validator`), rate-limits, or RBAC (Role-Based Access Control) restrictions.
    - Read this file to modify account lifecycle states (registration, OTP verification, recovery, password reset flows).

---

### 📂 File 3: [PostgreSQL Database & Drizzle ORM Manual](pg-db.md)

- **Filename:** `pg-db.md`
- **Core Purpose:** Complete guide dedicated to database schemas, relational designs, migration pipelines, and queries.
- **Key Contents:**
    - Pool and Drizzle connection lifecycle flowcharts.
    - Entity-Relationship Diagram (ERD) mapping users, chats, messages, files, RAG files, chunks, and payments.
    - Detailed column specifications, indices, primary/foreign keys, and cascade deletion properties for every table.
    - Step-by-step developer guidelines on writing Drizzle schemas, registering tables, generating/applying migrations, writing DAOs, and database seeding.
- **🤖 When to Use (Agent Instructions):**
    - Consult this file before writing database schemas, updating column definitions, or running Drizzle-Kit CLI migration operations.
    - Read this file to implement the **Data Access Object (DAO)** pattern for raw query queries.
    - Refer to this file when troubleshooting database connection pools, transaction boundaries, index optimizations, or table cascading behaviors.

---

### 📂 File 4: [HTML-to-PDF Service Architecture Guide](pdf-service-guide.md)

- **Filename:** `pdf-service-guide.md`
- **Core Purpose:** Specialized manual for the lightweight, chromium-free PDF generation engine (`makePDF`).
- **Key Contents:**
    - Rendering pipeline layout (`Data -> Template -> makePDF -> html-pdf-lite -> PDF Buffer`).
    - CSS and HTML markup styling compatibility guides (supported borders, flexbox limitations, page-break variables).
    - Font registration guides (registering custom TTF/OTF fonts in the canvas renderer).
    - Client download helper implementations (`pdfDownload.js`).
    - Detailed blueprints for creating templates and testing visual styles.
- **🤖 When to Use (Agent Instructions):**
    - Consult this file before designing a new HTML template (e.g., invoices, receipts, reports) destined for rendering.
    - Read this file to debug rendering issues, layout breaks, page-overflow bugs, or custom font issues.
    - Refer to this file to set up inline rendering, file downloads, or PDF attachment dispatch functions.

---

### 📂 File 5: [Server Implementation Reference Guide](implementation_server.md)

- **Filename:** `implementation_server.md` (located in this directory)
- **Core Purpose:** Acts as the live record of implemented backend features, API contracts, routing definitions, database schemas, edge cases, and core business logic.
- **🤖 When to Use & Maintenance Rules (Agent Instructions):**
    - **SCAN FIRST:** You **MUST** scan the entire [`implementation_server.md`](implementation_server.md) file before writing or modifying any backend code to check if that information or route already exists.
    - **AVOID REDUNDANCY:** If an endpoint or feature is already defined, do not create duplicate logic or conflicting routes.
    - **KEEP IT UPDATED:** Based on each new feature development or enhancement, you **MUST** update this file so that it keeps on updating along with the codebase. Add details of the new API contracts, routings, description, schemas involved, edge cases, and business logic involved.
    - **ENHANCE EXISTING:** If your task modifies/extends an existing feature, append/enhance its section in [`implementation_server.md`](implementation_server.md) accordingly.

---

## 2. Agent Decision Matrix

| Target Development / Debugging Task                                | Primary File to Consult                                                          | Secondary File for Context                                      |
| :----------------------------------------------------------------- | :------------------------------------------------------------------------------- | :-------------------------------------------------------------- |
| **Adding a new feature or endpoint**                               | [`implementation_server.md`](implementation_server.md) (Scan first, then update) | [`server-architecture.md`](server-architecture.md)              |
| **Reviewing active API routes/contracts**                          | [`implementation_server.md`](implementation_server.md)                           | –                                                               |
| **Adding a new database table or changing columns**                | [`pg-db.md`](pg-db.md)                                                           | [`server-architecture.md`](server-architecture.md)              |
| **Writing queries, inserts, updates, or deletes**                  | [`pg-db.md`](pg-db.md) _(DAO Blueprint)_                                         | –                                                               |
| **Adding, modifying, or testing REST API routes**                  | [`auth-routes-guide.md`](auth-routes-guide.md)                                   | [`server-architecture.md`](server-architecture.md)              |
| **Fixing JWT cookies, authorization middleware, or CORS**          | [`server-architecture.md`](server-architecture.md) _(Global Middleware)_         | [`auth-routes-guide.md`](auth-routes-guide.md)                  |
| **Implementing rate limiting or caching operations**               | [`server-architecture.md`](server-architecture.md) _(Redis cache)_               | [`auth-routes-guide.md`](auth-routes-guide.md)                  |
| **Debugging AI chat streaming, Pinecone indexing, or RAG vectors** | [`server-architecture.md`](server-architecture.md) _(AI Streaming & RAG)_        | –                                                               |
| **Creating templates or rendering PDF invoices / receipts**        | [`pdf-service-guide.md`](pdf-service-guide.md)                                   | [`server-architecture.md`](server-architecture.md) _(PDF flow)_ |
| **Troubleshooting background schedules (crons)**                   | [`server-architecture.md`](server-architecture.md) _(Background Cron)_           | –                                                               |

---

## 3. Core Architectural Rules (Cheat Sheet)

Human developers and AI agents must adhere to the following coding conventions established in the guidelines:

1.  **Strict Layer Separation:**
    - **Routes:** Define URLs, call middlewares, apply validator arrays, and mount controller handlers.
    - **Validators:** Use `express-validator` to validate and sanitize incoming payloads before controller execution.
    - **Controllers:** Parse requests, invoke DAOs/services, wrap executions in `try/catch(next)` blocks, and return responses using [`response.utils.js`](../../server/src/utils/response.utlis.js).
    - **DAOs (Data Access Objects):** Execute Drizzle queries (`db.select()`, `db.insert()`, etc.) against PostgreSQL tables. **Controllers must not access the Drizzle database object `db` directly.**
2.  **PDF Safety:**
    - Always validate HTML parameters using template functions.
    - Wrap variables inside template functions in `escapeHtml()`.
    - Ensure all CSS properties used inside templates match supported styles outlined in [`pdf-service-guide.md`](pdf-service-guide.md).
3.  **Testing & Visual Regressions:**
    - **Unit/Visual Testing**: Write and run automated unit tests using Node's native test runner (`node --test`). Run them via `npm run test` or `npm run test:pdf`.
    - **Integration/API Testing**: Use the **Jest + Supertest** testing framework for full HTTP request/response API validation. Store tests feature-wise inside `src/tests/` (e.g. `src/tests/auth/login.test.js`).
    - **Jest Commands**:
        - Run all Jest integration tests: `npm run test:jest`
        - Run a specific feature test suite (e.g., auth): `npm run test:jest:auth`
    - **Environment Precaution**:
        > [!WARNING]
        > Jest integration tests clear/truncate database tables (specifically the `users` table via `src/tests/setup.js`) before each test. Ensure that the database URL configured in your local `server/.env` is set to a dedicated local/test database to avoid losing production or staging data.
4.  **Keep Server Docs Up to Date:**
    - Always update the [`implementation_server.md`](implementation_server.md) file after completing or modifying any API route, database schema, or backend business logic. Scan it first to avoid redundancy.
