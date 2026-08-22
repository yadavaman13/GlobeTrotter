# Dashboard / Home Design Specification

## Overview

The Dashboard module acts as the central hub for the GlobeTrotter application. It aggregates key user-specific and system-wide metrics, including upcoming and recent trips, popular destinations, recommended activities, saved destinations, and budget breakdowns.

## API Route Contract

- **Route:** `GET /api/dashboard`
- **Access:** Private (Requires authentication via `protect` JWT middleware)
- **Headers:** `Authorization: Bearer <JWT_TOKEN>` or via HTTP-only cookie
- **Status Code:** `200 OK`
- **Response Body:**

```json
{
  "success": true,
  "message": "Dashboard data retrieved successfully",
  "data": {
    "upcomingTrips": [
      {
        "id": "uuid",
        "name": "Trip name",
        "description": "...",
        "startDate": "YYYY-MM-DD",
        "endDate": "YYYY-MM-DD",
        "coverPhotoUrl": "...",
        "status": "planned",
        "visibility": "private"
      }
    ],
    "recentTrips": [
      {
        "id": "uuid",
        "name": "Trip name",
        "description": "...",
        "startDate": "YYYY-MM-DD",
        "endDate": "YYYY-MM-DD",
        "coverPhotoUrl": "...",
        "status": "completed",
        "visibility": "private"
      }
    ],
    "popularCities": [
      {
        "id": "uuid",
        "name": "City Name",
        "country": "Country",
        "region": "...",
        "costIndex": "4.50",
        "popularity": "9.20",
        "stopCount": 12
      }
    ],
    "recommendedActivities": [
      {
        "id": "uuid",
        "cityId": "uuid",
        "name": "Activity Name",
        "description": "...",
        "activityType": "sightseeing",
        "cost": "150.00",
        "durationMinutes": 120,
        "currency": "INR",
        "cityName": "City Name",
        "countryName": "Country",
        "bookingCount": 4
      }
    ],
    "savedDestinations": [
      {
        "id": "uuid",
        "name": "City Name",
        "country": "Country",
        "region": "...",
        "costIndex": "4.20",
        "popularity": "8.50",
        "savedAt": "ISO_TIMESTAMP"
      }
    ],
    "budgetHighlights": {
      "totalBudget": 25000.0,
      "totalExpenses": 12000.0,
      "currency": "INR",
      "categoryBreakdown": {
        "transport": 4000.0,
        "stay": 5000.0,
        "activity": 2000.0,
        "meal": 1000.0
      }
    }
  }
}
```

## Architectural Components

### 1. Database Schema

No database changes are needed since this is a read-only aggregation computed from:

- `users`
- `trips`
- `trip_stops`
- `trip_stop_activities`
- `trip_cost_items`
- `cities`
- `activities`
- `saved_destinations`

### 2. DAO (Data Access Object)

We introduce `dashboard.dao.js` to execute all queries in parallel:

- `getDashboardData(userId)`: Runs Drizzle queries concurrently via `Promise.all` and aggregates findings.

### 3. Controller

`DashboardController` parses the user ID from `req.user.id`, calls `getDashboardData`, and formats the response using `sendResponse` from `response.utlis.js`.

### 4. Routes

`dashboard.routes.js` defines:

- `GET /` -> protected by `protect` middleware -> calls `DashboardController.getDashboardData`.

### 5. Mounting

We will register `dashboardRouter` in `server/src/app.js` under `/api/dashboard`.

## Edge Cases

1. **New User with No Data:** Queries will safely return empty arrays/objects with zero totals instead of failing or returning null.
2. **Missing Currency Info:** Default currency will fall back to `"INR"`.
3. **No Popular/Recommended Items:** System returns cities by default `popularity` column and activities by creation order.
