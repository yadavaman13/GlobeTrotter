# Hi Theja Sir!!! 👋

We are team **ByteBuilders** and we building **Globe Trotter**.

Globe Trotter is a collaborative travel planning and destination discovery platform. It provides users with destination discovery, nested activity curation, multi-city stops scheduling, trip sharing, budget logging, and an intelligent context-aware AI travel assistant. Built on a modern tech stack utilizing React, Node.js, Express, PostgreSQL, Drizzle ORM, and Redis, the platform focuses on modular features, strong RBAC middleware, and optimized page speed performance.

- **Project Hosted Link:** [http://localhost:5173](http://localhost:5173)
- **Presentation Video Link:** [https://globetrotter.demo.com](https://globetrotter.demo.com)

**Project Screenshot:**
![Project Screenshot](https://ik.imagekit.io/cuq3fe9wm/sheryians-backend/Globetrotter-landing-page.png)

## Table of Contents

1. [Team Members & Roles](#team-members--roles)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Core Modules & Features](#core-modules--features)
5. [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
6. [Frontend Routes](#frontend-routes)
7. [API Endpoint Reference](#api-endpoint-reference)
8. [Prerequisites](#prerequisites)
9. [Getting Started](#getting-started)
10. [Challenges We Overcame](#challenges-we-overcame)

---

## Team Members & Roles

| Member Name              | Role                 | Core Responsibilities                                                                                    | GitHub Profile                                                                                                                                                                        |
| :----------------------- | :------------------- | :------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Iteshkumar Prajapati** | Full Stack Developer | Landing page development, cities/activities integration, Community Feature, app configuration and setup. | <a href="https://github.com/iteshprajapati"><img src="https://github.com/iteshprajapati.png?size=40" width="40" height="40" style="border-radius:50%;" alt="iteshprajapati" /></a>    |
| **Aryan Patel**          | Full Stack Developer | Core trip planning, stops orchestration, activity schedules, and budget logging.                         | <a href="https://github.com/aryanpatel287"><img src="https://github.com/aryanpatel287.png?size=40" width="40" height="40" style="border-radius:50%;" alt="aryanpatel287" /></a>       |
| **Yadav Aman Singh**     | Full Stack Developer | Destination search, activity discovery module, and integration testing.                                  | <a href="https://github.com/yadavaman13"><img src="https://github.com/yadavaman13.png?size=40" width="40" height="40" style="border-radius:50%;" alt="yadavaman13" /></a>             |
| **Ankur Singh**          | Database & Testing   | AI policy ,Database, Testing, audit logs                                                                 | <a href="https://github.com/Ankursingh018as"><img src="https://github.com/Ankursingh018as.png?size=40" width="40" height="40" style="border-radius:50%;" alt="Ankursingh018as" /></a> |

---

## Tech Stack

### Frontend Client Layer

- **Core Library** --> React 19 (`react`, `react-dom`)
- **Routing** --> React Router v7 (`react-router`)
- **State Management** --> React Context API
- **Styling & Theming** --> Sass / SCSS (`sass`, `sass-embedded`)
- **Charts & Data Visualization** --> Apache ECharts (`echarts`)
- **Network Interface** --> Axios (`axios`)
- **Iconography** --> Lucide React (`lucide-react`)
- **Bundler & Dev Server** --> Vite (`vite` v8)

### Backend API Layer

- **Runtime & Web Framework** --> Node.js + Express (`express` v5)
- **Relational ORM** --> Drizzle ORM (`drizzle-orm`)
- **Authentication** --> JWT (`jsonwebtoken`) + cookies (`cookie-parser`)
- **Password Hashing** --> `bcryptjs`
- **Rate Limiting** --> `express-rate-limit`
- **Request Validation** --> `express-validator` and `zod`
- **Logging & Monitoring** --> Morgan (`morgan`)
- **File Upload Middleware** --> Multer (`multer`)

### Data Access & Storage Layer

- **Relational Database Engine** --> PostgreSQL (`pg` library)
- **Cache Store** --> Redis (`ioredis`)
- **Database Tools & Dashboards** --> Drizzle Kit (`drizzle-kit` migrations & Studio)

### Third-Party Integrations

- **Document & Image Hosting** --> ImageKit (`@imagekit/nodejs`)
- **SMTP Transport** --> Nodemailer (`nodemailer`) and Node-Mailjet (`node-mailjet`)
- **Google API Client** --> Google APIs (`googleapis`), LangChain Google (`@langchain/google`), LangChain Mistral (`@langchain/mistralai`), Pinecone (`@pinecone-database/pinecone`), Tavily Core (`@tavily/core`), LlamaIndex (`@llamaindex/llama-cloud`), Razorpay (`razorpay`)

### Quality Assurance & Testing

- **Test Runner Framework** --> Jest (`jest` v30) for integration tests, Node.js native test runner (`node --test`) for unit tests.
- **API Integration Asserts** --> Supertest (`supertest` v7)

### Overall Project Architecture

```mermaid
flowchart TB
    subgraph Presentation_Layer["🖥️ Presentation & Client Layer"]
        LandingPage["Landing Page (Discovery & Search)"]
        Dashboard["Traveler Dashboard"]
        CommunityPage["Community Feed (CRUD, Likes, Comments)"]
        AiChat["Intelligent AI Travel Assistant Chat"]
        InsightsPage["Analytics & Budget Insights (ECharts)"]
    end

    subgraph Gateway_Layer["🛡️ API Gateway & Security Layer"]
        AuthMiddleware["JWT HTTPOnly Cookie Validator"]
        RBAC["Role-Based Access Control (User / Admin)"]
        ValidationMiddleware["Request Validations (Express Validator / Zod)"]
    end

    subgraph Core_Services["⚙️ GlobeTrotter Domain Services"]
        AuthService["Auth & Verification OTP Service"]
        CityService["City & Region Discovery Service"]
        ActivityService["Activity Catalog Service"]
        TripService["Trip & Stops Itinerary Planner"]
        BudgetService["Expense Tracker & Calculation Service"]
        AiRAGService["LangChain RAG Context Service"]
        PdfService["Invoice & Receipts Engine (PDFKit)"]
    end

    subgraph Data_Layer["🗄️ PostgreSQL Database (Drizzle ORM) & Redis"]
        direction TB
        UserTables["Users & Verification OTPs"]
        CityTables["Cities & Categories"]
        ActivityTables["Activities & Images"]
        TripTables["Trips, Stops & Schedules"]
        BudgetTables["Expense Categories & Logs"]
        CommunityTables["Community Posts, Likes & Comments"]
        RedisCache["Redis Blacklist & Sessions Cache"]
    end

    subgraph Third_Party["☁️ Third-Party Integrations"]
        GoogleAI["Pinecone & Gemini (LLM RAG)"]
        Mailjet["Mailjet SMTP (OTP Emails)"]
        ImageKit["ImageKit Storage"]
    end

    Presentation_Layer --> Gateway_Layer
    Gateway_Layer --> Core_Services

    AuthService --> UserTables & RedisCache & Mailjet
    CityService --> CityTables
    ActivityService --> ActivityTables & ImageKit
    TripService --> TripTables
    BudgetService --> BudgetTables
    AiRAGService --> GoogleAI
    PdfService --> TripTables

    TripService -.->|"Aggregates Expenses"| BudgetService
    TripService -.->|"Exports PDF"| PdfService
    AiRAGService -.->|"Reads Context"| TripTables & CityTables
```

**Activity Diagram:**

- **Authentication Flow:**
  ![Authentication Flow](https://ik.imagekit.io/hci5kelnn/readme/globe-trotter/GlobeTrotter/authentication_flow.svg)

- **Trip Planning Flow:**
  ![Trip Planning Flow](https://ik.imagekit.io/hci5kelnn/readme/globe-trotter/GlobeTrotter/trip_planning.png)

- **Destination Flow:**
  ![Destination Flow](https://ik.imagekit.io/hci5kelnn/readme/globe-trotter/GlobeTrotter/destination.svg)

**ER Diagram:**
![ER Diagram]([er_diagram.png])

**Frontend Data Flow:**
![Frontend Data Flow]([frontend_data_flow.png])

**Backend Architecture Data Flow:**
![Backend Architecture Data Flow]([backend_architecture_data_flow.png])

---

## Project Structure

The project is structured into two main subdirectories:

- **`client/`**: React SPA using Vite, configured with dynamic module loading. Features are structured modularly inside `src/app/features`.
- **`server/`**: Express application partitioned into configurations, DAOs, schemas, and API modules.

### Directory Layout

```text
GlobeTrotter/
├── client/                                  # Frontend React application (Vite-powered SPA)
│   ├── src/
│   │   ├── app/
│   │   │   ├── features/                    # Modular, domain-driven feature modules
│   │   │   │   ├── admin/                   # Administrative panel views
│   │   │   │   │   ├── components/          # Admin-specific UI elements
│   │   │   │   │   ├── hooks/               # Admin state loaders
│   │   │   │   │   └── pages/               # Admin analytics & log views
│   │   │   │   ├── ai/                      # AI assistant chat interface
│   │   │   │   │   ├── components/          # Chat message window & suggestions
│   │   │   │   │   └── services/            # Chat history api service
│   │   │   │   ├── analytics/               # Interactive charts panels
│   │   │   │   │   ├── components/          # metric cards & ECharts elements
│   │   │   │   │   └── services/            # Reports statistics fetcher
│   │   │   │   ├── auth/                    # Verification, recovery & signup workflows
│   │   │   │   │   ├── login/               # Password resets & LoginForm
│   │   │   │   │   └── register/            # Email OTP validation modal
│   │   │   │   ├── community/               # User forums & social page
│   │   │   │   │   ├── components/          # CreatePostModal & comments drawers
│   │   │   │   │   ├── hooks/               # useCommunityData hook
│   │   │   │   │   └── services/            # Posts CRUD api helpers
│   │   │   │   ├── dashboard/               # Sidebar navigation modules
│   │   │   │   ├── landing/                 # Destination discovery grid & search bar
│   │   │   │   │   ├── hooks/               # useLandingData hook
│   │   │   │   │   └── services/            # Cities API interfaces
│   │   │   │   ├── settings/                # Profile editing page
│   │   │   │   └── userProfile/             # Personal profile page & trip cards
│   │   │   │
│   │   │   ├── App.jsx                      # Root application layout
│   │   │   ├── App.routes.jsx               # Navigation route map
│   │   │   └── routes.loader.jsx            # Autodiscovery routes aggregator
│   │   │
│   │   ├── components/                      # Global UI components
│   │   │   ├── ai-elements/                 # Prompt Inputs, Suggestion pills, Codeblocks
│   │   │   └── Shared/                      # Generic shared component library
│   │   │       ├── Buttons/                 # Pill inputs, toggles, edit buttons
│   │   │       ├── DataDisplay/             # AdvancedTable, KanbanBoard, Timeline
│   │   │       ├── Feedback/                # Modal dialogs, Toast notifications, Drawers
│   │   │       ├── Form/                    # Date picker, role selector, OTP inputs
│   │   │       └── Navigation/              # Sidebars, Topbars, Breadcrumbs
│   │   │
│   │   ├── context/                         # Context API state providers
│   │   │   ├── auth.context.jsx             # User credentials provider
│   │   │   └── theme.context.jsx            # dark/light theme state
│   │   ├── hooks/                           # Common helper hooks (debounce, viewport)
│   │   ├── styles/                          # SCSS variables, mixins & resets
│   │   │   ├── variables.scss               # Color tokens & elevation maps
│   │   │   └── foundation.scss              # Global margins & default layouts
│   │   └── main.jsx                         # React DOM application mount point
│
├── server/                                  # Backend API Layer (Node.js + Express)
│   ├── src/
│   │   ├── config/                          # Configuration files
│   │   │   ├── db.config.js                 # PostgreSQL connection pool
│   │   │   ├── env.config.js                # env parser & validator
│   │   │   └── redis.config.js              # Redis cache connection
│   │   │
│   │   ├── controllers/                     # Global routing handlers
│   │   ├── cron/                            # Background task schedules
│   │   ├── db/                              # Database schema definitions
│   │   │   ├── schema/                      # PostgreSQL Drizzle ORM model schemas
│   │   │   │   ├── auth.schema.js           # Users, sessions, & verification OTPs
│   │   │   │   ├── city-activities.schema.js# Cities and activities definitions
│   │   │   │   ├── community.schema.js      # Community posts, likes, and comments
│   │   │   │   └── trips-budget.schema.js   # Trips, stops, schedules, & expense items
│   │   │   └── seed_realistic_data.js       # Database seeder execution script
│   │   │
│   │   ├── modules/                         # Domain-driven backend modules
│   │   │   ├── activity/                    # Attraction catalog controller
│   │   │   ├── ai/                          # LangChain vector chatbot endpoints
│   │   │   ├── auth/                        # Credentials validation & session token creation
│   │   │   ├── city/                        # paginated discovery search
│   │   │   ├── community/                   # Forum posts & social likes/comments
│   │   │   │   ├── controllers/             # Post feed request handlers
│   │   │   │   ├── routes/                  # Express path endpoints registry
│   │   │   │   ├── services/                # Drizzle CRUD helper methods
│   │   │   │   └── validators/              # Input validator checks
│   │   │   ├── pdf/                         # invoice & tickets generation (PDFKit)
│   │   │   ├── rag/                         # Pinecone vector indexing services
│   │   │   └── trips/                       # stops orchestration, schedules & budgets
│   │   │
│   │   ├── utils/                           # Core utilities (response helper, hashing)
│   │   ├── validators/                      # Shared route validation checkers
│   │   └── app.js                           # Express base configuration setup
│   │
│   ├── server.js                            # HTTP backend application server listener
│   └── package.json                         # Node dependencies index
│
└── README.md                                # Root workspace documentation
```

---

## Core Modules & Features

1. **Authentication & Authorization**: Email/password registration, verification using email-transported OTP, secure JWT login with HTTPOnly cookies, password recovery flow, and restrictive RBAC middleware.
2. **City / Destination Discovery**: Advanced search query filters on target cities (popularity index ranges, cost indexes, country, and region) to support user exploration.
3. **Activity Discovery**: Detail curation of specific attractions, including description, activity types (museum, adventure, sightseeing), cost, duration, and associated image galleries.
4. **Core Itinerary Planner**: CRUD for planning trips with dates, visibility controls (private, public, shared), status checks, and collaborative shares.
5. **Multi-City Route Planner**: Organizes sequential stops inside a trip. Supports stop additions, updates, deletions, and path reordering.
6. **Stop Activity Curator**: Maps specific activities to specific stops, allowing users to build detailed day-by-day schedules.
7. **Trip Budget Tracker**: Tracks costs and logs detailed expense categories. Integrates a budget summaries controller to calculate averages and metrics.
8. **AI Travel Assistant**: Conversational assistant with file upload support, streaming message responses, and Pinecone RAG semantic searches for vector-embedded documents.
9. **Chromium-Free Report Engine**: Generates Invoice and Receipt PDF streams dynamically in Express with minimal memory utilization using PDFKit canvas-based compiler.

---

## Role-Based Access Control (RBAC)

Globe Trotter enforces role limits on both frontend routes and backend APIs:

- **`user`**:
  - Frontend access to personal profile, settings, insights page, and AI chat.
  - Personal access to create, view, edit, reorder, and delete their own trips, stops, activities, and budget items.
- **`admin`**:
  - Full access to administrative management views.
  - CRUD on global users, user role updates, and system cleanups.
  - CRUD on company documents, vector store chunks, and Pinecone indices.

---

## Frontend Routes

### Authentication (Public)

| Path               | Component            | Description                   |
| :----------------- | :------------------- | :---------------------------- |
| `/`                | `LandingPage`        | Exploration and search portal |
| `/login`           | `LoginLayout`        | User login                    |
| `/register`        | `RegisterLayout`     | User sign-up                  |
| `/reset-password`  | `LoginLayout`        | Password reset interface      |
| `/recover-account` | `LoginLayout`        | Account recovery trigger      |
| `/components`      | `ComponentsShowcase` | UI component showcase sandbox |

### Dashboard (User / Admin)

| Path                                 | Component         | Description                 | Allowed Roles |
| :----------------------------------- | :---------------- | :-------------------------- | :------------ |
| `/dashboard/user/home`               | `DashboardLayout` | User dashboard welcome home | `user`        |
| `/dashboard/user/settings/general`   | `GeneralSettings` | User general configuration  | `user`        |
| `/dashboard/user/settings/account`   | `AccountSettings` | Personal account settings   | `user`        |
| `/dashboard/user/ai`                 | `AiChat`          | Conversational AI planner   | `user`        |
| `/dashboard/user/analytics/insight`  | `InsightsPage`    | Charts, trips summaries     | `user`        |
| `/dashboard/admin/home`              | `DashboardLayout` | Admin dashboard overview    | `admin`       |
| `/dashboard/admin/settings/general`  | `GeneralSettings` | Admin configuration panel   | `admin`       |
| `/dashboard/admin/ai`                | `AiChat`          | Conversational AI planner   | `admin`       |
| `/dashboard/admin/analytics/insight` | `InsightsPage`    | Global metrics and logs     | `admin`       |

---

## API Endpoint Reference

All endpoints are prefix-routed through `/api` and require authorization unless specified.

### Authentication Endpoints

- Router: [`server/src/modules/auth/routes/auth.routes.js`](file:///home/iteshprajapati/Odoo-LD/GlobeTrotter/server/src/modules/auth/routes/auth.routes.js)

| Method  | Endpoint                          | Description                       | Allowed Roles   |
| :------ | :-------------------------------- | :-------------------------------- | :-------------- |
| `POST`  | `/api/auth/register`              | Sign up a new account (Public)    | All             |
| `POST`  | `/api/auth/send-verification-otp` | Trigger verification OTP (Public) | All             |
| `POST`  | `/api/auth/login`                 | Log in a user (Public)            | All             |
| `POST`  | `/api/auth/logout`                | Log out and clear JWT session     | All             |
| `GET`   | `/api/auth/get-me`                | Fetch active user object          | `user`, `admin` |
| `PATCH` | `/api/auth/change-password`       | Update current login password     | `user`, `admin` |

### City Discovery Endpoints

- Router: [`server/src/modules/city/routes/city.routes.js`](file:///home/iteshprajapati/Odoo-LD/GlobeTrotter/server/src/modules/city/routes/city.routes.js)

| Method | Endpoint                         | Description                     | Allowed Roles   |
| :----- | :------------------------------- | :------------------------------ | :-------------- |
| `GET`  | `/api/cities`                    | List paginated, filtered cities | `user`, `admin` |
| `GET`  | `/api/cities/:cityId`            | Fetch single city details       | `user`, `admin` |
| `GET`  | `/api/cities/:cityId/activities` | List activities linked to city  | `user`, `admin` |

### Activity Discovery Endpoints

- Router: [`server/src/modules/activity/routes/activity.routes.js`](file:///home/iteshprajapati/Odoo-LD/GlobeTrotter/server/src/modules/activity/routes/activity.routes.js)

| Method | Endpoint                      | Description                           | Allowed Roles   |
| :----- | :---------------------------- | :------------------------------------ | :-------------- |
| `GET`  | `/api/activities`             | List paginated activities with images | `user`, `admin` |
| `GET`  | `/api/activities/:activityId` | Fetch activity details                | `user`, `admin` |

### Trip Management Endpoints

- Router: [`server/src/modules/trips/trip.routes.js`](file:///home/iteshprajapati/Odoo-LD/GlobeTrotter/server/src/modules/trips/trip.routes.js)

| Method   | Endpoint                                      | Description                      | Allowed Roles           |
| :------- | :-------------------------------------------- | :------------------------------- | :---------------------- |
| `POST`   | `/api/trips`                                  | Create a new trip                | `user`, `admin`         |
| `GET`    | `/api/trips`                                  | List user trips                  | `user`, `admin`         |
| `GET`    | `/api/trips/:tripId`                          | Retrieve trip itinerary          | `user`, `admin`         |
| `PATCH`  | `/api/trips/:tripId`                          | Update trip general settings     | `user`, `admin` (Owner) |
| `DELETE` | `/api/trips/:tripId`                          | Delete trip                      | `user`, `admin` (Owner) |
| `POST`   | `/api/trips/:tripId/stops`                    | Append stop to trip itinerary    | `user`, `admin` (Owner) |
| `PATCH`  | `/api/trips/:tripId/stops/reorder`            | Reorder stops array index        | `user`, `admin` (Owner) |
| `POST`   | `/api/trips/:tripId/stops/:stopId/activities` | Add activity to specific stop    | `user`, `admin` (Owner) |
| `POST`   | `/api/trips/:tripId/costs`                    | Log cost item                    | `user`, `admin` (Owner) |
| `GET`    | `/api/trips/:tripId/budget`                   | Get budget & cost totals summary | `user`, `admin`         |

---

## Prerequisites

Make sure the following are installed locally:

- [Node.js](https://nodejs.org/) (v20+ recommended)
- [PostgreSQL](https://www.postgresql.org/) (v14+ relational engine)
- [Redis](https://redis.io/) (for auth session blacklist cache)

---

## Getting Started

### 1. Environment Setup

Configure environment variables for both the client and server.

#### Server Configuration (`server/.env`)

Create a `.env` file inside the `server/` directory:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:[password]@localhost:5432/globetrotter
CLIENT_ORIGINS=http://localhost:5173
JWT_SECRET=your_jwt_secret_token
REDIS_URL=redis://localhost:6379
```

#### Client Configuration (`client/.env`)

Create a `.env` file inside the `client/` directory:

```env
VITE_API_URL=http://localhost:3000
```

### 2. Dependency Installation & Startup

#### Run Backend Server

Open a terminal in the root directory and run:

```bash
cd server
npm install
node src/db/seed.js     # Seed base metadata
npm run dev             # Start dev server (nodemon)
```

#### Run Frontend Client

Open another terminal in the root directory and run:

```bash
cd client
npm install
npm run dev             # Start client dev server (Vite)
```

---

## Challenges We Overcame till now

During the development of Globe Trotter, we tackled several major engineering challenges:

- **N+1 Query Performance in Activity Curation**: Resolving query performance bottlenecks when loading list pages displaying activities and their nested image galleries by executing single-batch `inArray` image fetches and nesting them post-query in JS.
- **FK Constraints Teardown during Unit Testing**: Handling foreign key constraint errors (`RESTRICT` onDelete constraint) in PostgreSQL during test setup/cleanup by resetting tables in sequential reverse-dependency order.
- **dynamic Routes Autodiscovery**: Structuring a highly scalable, dynamic routing setup in Vite using `import.meta.glob` to scan and partition public routes, protected user routes, and admin routes.

---

_Developed with ❤️ by Team **ByteBuilders**._
