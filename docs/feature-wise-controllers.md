Proceeding from the 17-module list, the final schema, and the GlobeTrotter PS/README. The PS's core requirement is an end-to-end travel-planning workflow around multi-city trips, stops, activities, dates, budgets, visualization and sharing.
GlobeTrotter — Final API Contract Plan 0. Global API structure
/api
│
├── auth
├── users
├── dashboard
│
├── cities
├── activities
│
├── trips
│ ├── :tripId
│ ├── :tripId/stops
│ ├── :tripId/stops/:stopId/activities
│ ├── :tripId/costs
│ ├── :tripId/timeline
│ └── :tripId/shares
│
├── saved-destinations
│
├── public
│ └── trips/:slug
│
├── chats
├── files
├── rag
│
└── admin

1. Authentication & Authorization
   Controller
   AuthController
   Purpose
   Controls account creation, login, password recovery and authentication identity.
   The PS explicitly specifies email/password authentication, signup and forgot-password functionality.
   Users
   Guest
   Registered User
   Admin
   Schemas
   users
   password_reset_tokens
   Routes
   Method
   Route
   Purpose
   POST
   /auth/register
   Create account
   POST
   /auth/login
   Authenticate
   POST
   /auth/logout
   Logout
   GET
   /auth/me
   Current authenticated user
   POST
   /auth/forgot-password
   Request password reset
   POST
   /auth/reset-password
   Reset password

Register
POST /api/auth/register

{
"firstName": "Aman",
"lastName": "Yadav",
"email": "aman@gmail.com",
"password": "Password@123"
}
Login
POST /api/auth/login

{
"email": "aman@gmail.com",
"password": "Password@123"
}
Business rules
Email must be unique.
Password must be hashed.
Deleted users cannot authenticate.
Inactive users cannot authenticate.
Invalid credentials return authentication failure.
Password-reset token must be valid and unexpired.
Edge cases
duplicate email
wrong password
deleted account
inactive account
expired reset token
already-used reset token
invalid JWT
missing JWT
Middleware
authenticate
authorize

2. User Profile & Account Management
   Controller
   UserController
   Users
   Authenticated user.
   Schemas
   users
   saved_destinations
   Routes
   GET /users/me
   PATCH /users/me
   DELETE /users/me
   Actions
   View profile
   Update name
   Update email
   Update profile image
   Delete account
   Update
   PATCH /api/users/me

{
"firstName": "Aman",
"lastName": "Singh",
"profileImage": "https://..."
}
Business rules
User can modify only their own account.
Email remains unique.
Account deletion should use your existing soft-delete mechanism.
Deleted users cannot access protected resources.
Edge cases
Email already exists.
Invalid image URL.
Empty name.
Updating deleted account.
Updating inactive account.

3. Dashboard / Home
   Controller
   DashboardController
   Purpose
   Aggregates information for the application's central home screen.
   The PS describes the dashboard as the central hub for upcoming trips, popular cities and quick actions.
   Schemas
   Read-only aggregation from:
   users
   trips
   trip_stops
   trip_stop_activities
   trip_cost_items
   cities
   activities
   saved_destinations
   Route
   GET /dashboard
   Response concept
   {
   "upcomingTrips": [],
   "recentTrips": [],
   "popularCities": [],
   "recommendedActivities": [],
   "savedDestinations": [],
   "budgetHighlights": {}
   }
   Important
   Do not create:
   dashboard_stats
   popular_cities
   monthly_trip_stats
   The existing database design explicitly recommends calculating these from source tables.
   Edge cases
   New user with no trips.
   No saved destinations.
   No upcoming trips.
   Empty activity dataset.
   No popular destinations.

4. City / Destination Discovery
   Controller
   CityController
   Users
   Guest
   User
   Admin
   Schemas
   cities
   saved_destinations
   Routes
   GET /cities
   GET /cities/:cityId
   GET /cities/:cityId/activities
   Search
   GET /cities?q=Paris
   Supported filters should correspond to the PS:
   country
   region
   cost index
   popularity
   The PS explicitly requires destination discovery/search and filtering.
   Business logic
   query
   ↓
   validate filters
   ↓
   apply filters
   ↓
   pagination
   ↓
   return cities
   Edge cases
   City doesn't exist.
   No search results.
   Invalid pagination.
   Invalid sort field.
   Negative cost filter.

5. Activity Discovery
   Controller
   ActivityController
   Schemas
   activities
   activity_images
   cities
   Routes
   GET /activities
   GET /activities/:activityId
   Filters
   cityId
   activityType
   minCost
   maxCost
   minDuration
   maxDuration
   The PS requires activity discovery with filtering by interest/type, cost and duration.
   Response
   {
   "id": "uuid",
   "name": "River Rafting",
   "description": "...",
   "activityType": "adventure",
   "cost": 1500,
   "durationMinutes": 180,
   "city": {},
   "images": []
   }
   Edge cases
   Activity doesn't exist.
   Activity belongs to another city.
   Invalid cost range.
   Invalid duration range.
   No results.

6. Trip Management
   ⭐ Core module
   Controller
   TripController
   Users
   Authenticated user
   Admin
   Schemas
   trips
   users
   The PS's central business object is the user's customized multi-city itinerary.

Routes
POST /trips
GET /trips
GET /trips/:tripId
PATCH /trips/:tripId
DELETE /trips/:tripId

PATCH /trips/:tripId/status
PATCH /trips/:tripId/visibility
Create trip
POST /api/trips

{
"name": "Rajasthan Adventure",
"description": "7 day trip",
"startDate": "2026-09-01",
"endDate": "2026-09-07"
}
Initial:
status = draft

Trip status
Your enhancement:
draft
planned
ongoing
completed
cancelled
State machine
stateDiagram-v2
[*] --> draft

    draft --> planned
    draft --> cancelled

    planned --> ongoing
    planned --> cancelled

    ongoing --> completed
    ongoing --> cancelled

    completed --> [*]
    cancelled --> [*]

Route
PATCH /trips/:tripId/status
{
"status": "planned"
}
Important
Never allow:
draft → completed
completed → ongoing
cancelled → planned
completed → cancelled
unless you deliberately add such transitions later.
Business rules
startDate <= endDate
ownerId = authenticated user
Edge cases
Trip doesn't exist.
User isn't owner.
Invalid status.
Invalid transition.
Updating completed trip.
Updating cancelled trip.

7. Trip Stops / Itinerary Management
   Controller
   TripStopController
   Schemas
   trips
   trip_stops
   cities
   Routes
   POST /trips/:tripId/stops
   GET /trips/:tripId/stops
   GET /trips/:tripId/stops/:stopId
   PATCH /trips/:tripId/stops/:stopId
   DELETE /trips/:tripId/stops/:stopId
   PATCH /trips/:tripId/stops/reorder
   Create stop
   {
   "cityId": "uuid",
   "startDate": "2026-09-01",
   "endDate": "2026-09-03"
   }
   Business rules
   trip.startDate <= stop.startDate
   stop.endDate <= trip.endDate
   stop.startDate <= stop.endDate
   These are specifically identified as backend business rules in your database documentation.
   Reorder
   PATCH /trips/:tripId/stops/reorder

{
"stops": [
{
"id": "stop1",
"sequenceOrder": 1
},
{
"id": "stop2",
"sequenceOrder": 2
}
]
}
Edge cases
Stop doesn't exist.
Stop belongs to another trip.
City doesn't exist.
Date outside trip.
Invalid sequence.
Duplicate sequence.
Missing stop during reorder.

8. Trip Stop Activities
   Controller
   TripStopActivityController
   Schemas
   trip_stop_activities
   trip_stops
   activities
   Routes
   POST /trips/:tripId/stops/:stopId/activities
   GET /trips/:tripId/stops/:stopId/activities
   PATCH /trips/:tripId/stops/:stopId/activities/:activityId
   DELETE /trips/:tripId/stops/:stopId/activities/:activityId
   PATCH /trips/:tripId/stops/:stopId/activities/reorder
   Add activity
   {
   "activityId": "uuid",
   "activityDate": "2026-09-02",
   "startTime": "10:00",
   "endTime": "13:00",
   "notes": "Book beforehand"
   }
   Business rules
   stop.startDate
   <=
   activityDate
   <=
   stop.endDate
   and:
   activity.cityId === stop.cityId
   These consistency rules are explicitly required by the existing schema analysis.
   Edge cases
   Activity doesn't exist.
   Stop doesn't exist.
   Activity belongs to another city.
   Activity date outside stop.
   Invalid time range.
   Duplicate activity if business rules disallow it.
   Cross-trip access.

9. Trip Budget & Cost Management
   Controller
   TripCostController
   Schemas
   trip_cost_items
   trips
   trip_stops
   trip_stop_activities
   Routes
   POST /trips/:tripId/costs
   GET /trips/:tripId/costs
   GET /trips/:tripId/budget
   PATCH /trips/:tripId/costs/:costId
   DELETE /trips/:tripId/costs/:costId
   Add cost
   {
   "category": "transport",
   "description": "Delhi to Jaipur",
   "amount": "1500",
   "currency": "INR",
   "costDate": "2026-09-01"
   }
   Categories
   Use the enum defined by your final schema rather than inventing additional categories.
   The PS specifically expects breakdowns for transport, stay, activities and meals, together with average daily cost and over-budget indications.
   Budget route
   GET /trips/:tripId/budget
   Calculate dynamically:
   total
   ↓
   category breakdown
   ↓
   daily breakdown
   ↓
   average/day
   ↓
   budget remaining
   ↓
   over-budget days
   Business rules
   Amount cannot be negative.
   Cost must belong to requested trip.
   Linked stop must belong to trip.
   Linked activity must belong to trip.
   Your schema documentation explicitly calls out cost ownership as a service-layer rule.

10. Trip Timeline / Calendar
    Controller
    TripTimelineController
    Purpose
    Read-only aggregation of itinerary data.
    The PS calls for a calendar/vertical timeline, expandable days, activities and drag-to-reorder behavior.
    Schema dependencies
    trips
    trip_stops
    cities
    trip_stop_activities
    activities
    trip_cost_items
    Route
    GET /trips/:tripId/timeline
    Response structure
    Trip
    ├── Day
    │ ├── City
    │ ├── Activities
    │ └── Costs
    │
    ├── Day
    │ ├── City
    │ └── Activities
    Important
    Timeline should not have its own table.
    It is a view generated from existing relational data.

11. Trip Sharing & Collaboration
    Controller
    TripShareController
    Schemas
    trip_shares
    trips
    users
    Routes
    POST /trips/:tripId/shares
    GET /trips/:tripId/shares
    DELETE /trips/:tripId/shares/:userId
    Share
    {
    "userId": "uuid"
    }
    Business rules
    Only the trip owner can create/remove shares. This is explicitly stated in your finalized schema/business rules.
    Prevent:
    owner sharing with self
    duplicate share
    sharing nonexistent user
    sharing deleted user
    Permission model
    For the MVP:
    OWNER
    → read/write

SHARED USER
→ read

PUBLIC
→ read-only
INFERENCE: The PS says trips can be shared with friends but does not define collaborative editing permissions. Therefore don't invent collaborative editing.

12. Public Trip / Shared Itinerary
    Controller
    PublicTripController
    Schema
    trips
    trip_stops
    trip_stop_activities
    trip_cost_items
    cities
    activities
    Routes
    GET /public/trips/:slug
    POST /public/trips/:slug/copy
    Public GET
    No authentication.
    But:
    trip.visibility === public
    must be true.
    That is an explicit business rule from the finalized design.
    Copy Trip
    Authentication required.
    POST /api/public/trips/:slug/copy
    Copy process
    Public Trip
    ↓
    Create new trip
    ↓
    Copy stops
    ↓
    Copy activities
    ↓
    Copy costs
    ↓
    New owner = current user
    ↓
    New status = draft
    Do not copy:
    trip_shares
    publicSlug
    old owner
    Edge cases
    Invalid slug.
    Private trip.
    Deleted trip.
    Copy without authentication.
    Copy transaction partially fails.
    Use a DB transaction for copy.
    The PS explicitly specifies public URL, read-only itinerary and a “Copy Trip” action.

13. Saved Destinations
    Controller
    SavedDestinationController
    Schema
    saved_destinations
    cities
    users
    Routes
    GET /saved-destinations
    POST /saved-destinations
    DELETE /saved-destinations/:cityId
    Add
    {
    "cityId": "uuid"
    }
    Business rules
    The composite key:
    user_id + city_id
    prevents duplicate saves.
    Edge cases
    City doesn't exist.
    Already saved.
    Delete unsaved destination.
    Unauthorized access.

14. AI Chat
    Controller
    ChatController
    Existing schemas
    chats
    messages
    Routes
    POST /chats
    GET /chats
    GET /chats/:chatId
    POST /chats/:chatId/messages
    DELETE /chats/:chatId
    Workflow
    User
    ↓
    Chat
    ↓
    Message
    ↓
    AI
    ↓
    Optional tool/RAG
    ↓
    Assistant response
    ↓
    Message history
    Business rules
    Chat belongs to user.
    User can access only own chats.
    Messages belong to chat.
    Chat history must remain scoped to user/chat.
    Empty messages rejected.
    Your existing implementation already scopes chat history and supports the AI/tool/RAG workflow, so this should be treated as an existing supporting module rather than rebuilt from scratch.

15. File Management
    Controller
    FileController
    Schemas
    files
    messages
    Routes
    POST /files
    GET /files/:fileId
    DELETE /files/:fileId
    Purpose
    Handles files attached to the existing AI/chat workflow.
    Business rules
    File must have an owner/context.
    User cannot access another user's file.
    File deletion should cascade where schema specifies it.
    Unsupported file types should be rejected.

16. RAG / Knowledge Management
    Controller
    RagController
    Schemas
    rag_files
    chunks
    files
    chats
    The existing schema deliberately keeps ragFileId mandatory while fileId and chatId can be nullable, supporting both global/admin documents and chat-specific sources.
    Routes
    POST /rag/files
    GET /rag/files
    DELETE /rag/files/:fileId
    DELETE /rag/admin/chunks
    Admin upload
    POST /rag/admin/files
    Workflow
    Document
    ↓
    RAG file
    ↓
    Parse
    ↓
    Markdown
    ↓
    Chunk
    ↓
    Store chunks
    ↓
    Vector index
    ↓
    Retrieve during AI query
    Critical security rule
    RAG retrieval must respect:
    global/admin scope

-

user/chat scope
The existing implementation intentionally uses metadata filtering to prevent cross-user document leakage.

17. Admin & Analytics
    Controller
    AdminController
    AnalyticsController
    User
    admin
    Routes
    GET /admin/users
    GET /admin/users/:userId
    PATCH /admin/users/:userId/status

GET /admin/analytics
Analytics
Calculate from:
users
trips
trip_stops
trip_stop_activities
cities
activities
trip_cost_items
Possible metrics:
total users
total trips
trips by status
popular cities
popular activities
average trip duration
budget statistics
Important
Admin analytics is optional in the PS, so don't allow it to consume time before the core itinerary flow works.
The existing schema analysis explicitly classifies analytics as derived data rather than persisted dashboard tables.

18. Payments / PDF compatibility
    Controller
    No new GlobeTrotter payment controller.
    Your existing schema documentation specifically says the PS does not specify payments and recommends retaining the existing payment table only if current PDF/utility code requires it.
    Therefore:
    payments.schema.js
    │
    └── compatibility only
    Do not build:
    PaymentController
    InvoiceController
    BookingController
    ReservationController
    for this PS.

Final controller list
Your backend should therefore have:
controllers/
│
├── auth.controller.js
├── user.controller.js
├── dashboard.controller.js
│
├── city.controller.js
├── activity.controller.js
│
├── trip.controller.js
├── trip-stop.controller.js
├── trip-stop-activity.controller.js
├── trip-cost.controller.js
├── trip-share.controller.js
├── trip-timeline.controller.js
├── public-trip.controller.js
├── saved-destination.controller.js
│
├── chat.controller.js
├── file.controller.js
├── rag.controller.js
│
├── admin.controller.js
└── analytics.controller.js
Final API dependency map
┌──────────────┐
│ AUTH │
└──────┬───────┘
│
▼
┌──────────────┐
│ USER │
└──────┬───────┘
│
┌────────────┴────────────┐
▼ ▼
┌───────────┐ ┌──────────────┐
│ CITIES │ │ ACTIVITIES │
└─────┬─────┘ └──────┬───────┘
│ │
└──────────┬───────────────┘
▼
┌───────────┐
│ TRIPS │
└─────┬─────┘
│
┌────┴────┐
▼ ▼
┌────────┐ ┌─────────┐
│ STOPS │ │ COSTS │
└───┬────┘ └─────────┘
│
▼
┌─────────────┐
│ STOP │
│ ACTIVITIES │
└──────┬──────┘
│
▼
┌─────────────┐
│ TIMELINE │
└──────┬──────┘
│
▼
┌───────────┐
│ BUDGET │
└───────────┘

TRIPS ──────────► SHARING ─────────► PUBLIC TRIP
│
▼
COPY TRIP

USER ───────────► SAVED DESTINATIONS

USER ───────────► CHAT ──► FILES ──► RAG
Most important implementation principle
For your team, TripService should be the central business service, not TripController.
The core transaction is:
CREATE TRIP
↓
ADD STOPS
↓
ADD ACTIVITIES
↓
ADD COSTS
↓
CALCULATE BUDGET
↓
GENERATE TIMELINE
↓
CHANGE STATUS
↓
SHARE
↓
PUBLIC VIEW
↓
COPY TRIP
That is the flow that should be completely functional before spending time on dashboard polish, admin analytics or additional AI features. The PS's stated mission is specifically to let users add/manage stops and durations, explore destinations/activities, estimate budgets, visualize timelines and share plans.
Recommended P0 API surface
POST /auth/register
POST /auth/login

GET /cities
GET /activities

POST /trips
GET /trips
GET /trips/:tripId
PATCH /trips/:tripId
PATCH /trips/:tripId/status

POST /trips/:tripId/stops
GET /trips/:tripId/stops
PATCH /trips/:tripId/stops/:stopId
DELETE /trips/:tripId/stops/:stopId
PATCH /trips/:tripId/stops/reorder

POST /trips/:tripId/stops/:stopId/activities
GET /trips/:tripId/stops/:stopId/activities
PATCH /trips/:tripId/stops/:stopId/activities/:activityId
DELETE /trips/:tripId/stops/:stopId/activities/:activityId

POST /trips/:tripId/costs
GET /trips/:tripId/costs
GET /trips/:tripId/budget

GET /trips/:tripId/timeline

PATCH /trips/:tripId/visibility
POST /trips/:tripId/shares

GET /public/trips/:slug
POST /public/trips/:slug/copy
This is the business-critical API contract. Everything else should be layered on top of this rather than allowed to block it.
