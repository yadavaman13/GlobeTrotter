# Apex Auth Module Routing Reference Guide

This document provides a detailed mapping, technical requirements, and logic design for the authentication, admin management, and user profiling routes. It is designed to act as an exact reference guide for developers and AI agents to understand, maintain, and extend the routing system.

---

## 1. Routing Summary Table

The auth module mounts routes under three base paths in [`app.js`](../../server/src/app.js):

- **Auth Base API:** `/api/auth` (mounted to [`authRouter`](../../server/src/modules/auth/routes/auth.routes.js))
- **User Base API:** `/api/users` (mounted to [`userRouter`](../../server/src/modules/auth/routes/user.routes.js))
- **Admin Base API:** `/api/admin` (mounted to [`adminRouter`](../../server/src/modules/auth/routes/admin.routes.js))

| Route                  |  Method  | Endpoint Path                          | Access Level          | Validators & Middleware                                          | Payload Parameters                                                                                                        | Key Response Properties                                  |
| :--------------------- | :------: | :------------------------------------- | :-------------------- | :--------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------- |
| **Register**           |  `POST`  | `/api/auth/register`                   | Public (Rate-Limited) | `authRateLimiter`<br>`registerValidator`                         | `firstName` (req)<br>`lastName` (req)<br>`email` (req)<br>`password` (req, min 6)<br>`profileImage` (opt)<br>`role` (opt) | `message`, `success`, cookie `token` set (JWT)           |
| **Send OTP**           |  `POST`  | `/api/auth/send-verification-otp`      | Public (Rate-Limited) | `authRateLimiter`<br>`sendVerificationOtpValidator`              | `email` (req)                                                                                                             | `message`, `success`                                     |
| **Login**              |  `POST`  | `/api/auth/login`                      | Public (Rate-Limited) | `authRateLimiter`<br>`loginValidator`                            | `email` (req)<br>`password` (req)<br>`rememberMe` (opt)                                                                   | `message`, `success`, `user` payload, cookie `token` set |
| **Forgot Pass**        |  `POST`  | `/api/auth/forgot-password`            | Public (Rate-Limited) | `authRateLimiter`<br>`forgotPasswordValidator`                   | `email` (req)                                                                                                             | `message`, `success`                                     |
| **Reset Pass**         |  `POST`  | `/api/auth/reset-password`             | Public                | `resetPasswordValidator`                                         | `email` (req)<br>`otp` (req, 6 chars)<br>`password` (req, min 8, uppercase, number, symbol)<br>`confirmPassword` (req)    | `message`, `success`                                     |
| **Verify Reset OTP**   |  `POST`  | `/api/auth/verify-forgot-password-otp` | Public                | `verifyForgotPasswordOtpValidator`                               | `email` (req)<br>`otp` (req, 6 chars)                                                                                     | `message`, `success`                                     |
| **Verify Email**       |  `POST`  | `/api/auth/verify-email`               | Public                | None                                                             | `email` (req)<br>`otp` (req, 6 chars)                                                                                     | `message`, `success`                                     |
| **Resend OTP**         |  `POST`  | `/api/auth/resend-otp`                 | Public                | None                                                             | `email` (req)<br>`purpose` (req)                                                                                          | `message`, `success`                                     |
| **Logout**             |  `POST`  | `/api/auth/logout`                     | Public                | None                                                             | None                                                                                                                      | `message`, `success`, cookie `token` cleared             |
| **Request Recovery**   |  `POST`  | `/api/auth/recover-account/request`    | Public (Rate-Limited) | `authRateLimiter`<br>`recoverAccountValidator`                   | `email` (req)                                                                                                             | `message`, `success`                                     |
| **Verify Recovery**    |  `POST`  | `/api/auth/recover-account/verify`     | Public                | `verifyRecoverAccountValidator`                                  | `email` (req)<br>`otp` (req, 6 chars)                                                                                     | `message`, `success`                                     |
| **Get Me (Auth)**      |  `GET`   | `/api/auth/get-me`                     | Private (Auth)        | `protect`                                                        | None                                                                                                                      | `success`, `user` object                                 |
| **Change Pass (Auth)** | `PATCH`  | `/api/auth/change-password`            | Private (Auth)        | `protect`<br>`changePasswordValidator`                           | `currentPassword` (req)<br>`newPassword` (req, min 6)                                                                     | `message`, `success`                                     |
| **Get Me (User)**      |  `GET`   | `/api/users/get-me`                    | Private (Auth)        | `protect`                                                        | None                                                                                                                      | `success`, `user` object                                 |
| **Update Profile**     | `PATCH`  | `/api/users/profile`                   | Private (Auth)        | `protect`<br>`updateProfileValidator`                            | `firstName` (opt)<br>`lastName` (opt)<br>`email` (opt)<br>`profileImage` (opt)                                            | `message`, `success`, `user` object                      |
| **Upload Avatar**      | `PATCH`  | `/api/users/profile/avatar`            | Private (Auth)        | `protect`<br>multer `upload.single('avatar')`                    | Multipart Form Data (`avatar` field)                                                                                      | `message`, `success`, `imageUrl`                         |
| **Change Pass (User)** | `PATCH`  | `/api/users/change-password`           | Private (Auth)        | `protect`<br>`changePasswordValidator`                           | `currentPassword` (req)<br>`newPassword` (req, min 6)                                                                     | `message`, `success`                                     |
| **Delete Account**     | `DELETE` | `/api/users/me`                        | Private (Auth)        | `protect`<br>`deleteAccountValidator`                            | `password` (req)                                                                                                          | `message`, `success`, cookie `token` cleared             |
| **Admin List Users**   |  `GET`   | `/api/admin/users`                     | Admin Only            | `protect`<br>`restrictTo('admin')`                               | None                                                                                                                      | `success`, `users` array                                 |
| **Admin Cleanup**      |  `POST`  | `/api/admin/users/cleanup`             | Admin Only            | `protect`<br>`restrictTo('admin')`                               | None                                                                                                                      | `success`, `deletedCount`, `deletedUsers`                |
| **Admin Get User**     |  `GET`   | `/api/admin/users/:id`                 | Admin Only            | `protect`<br>`restrictTo('admin')`                               | Path parameter: `id`                                                                                                      | `success`, `user` object                                 |
| **Admin Update Role**  | `PATCH`  | `/api/admin/users/:id/role`            | Admin Only            | `protect`<br>`restrictTo('admin')`<br>`adminUpdateRoleValidator` | Path parameter: `id`<br>Body: `role` (req: `user` or `admin`)                                                             | `message`, `success`, `user` object                      |
| **Admin Delete User**  | `DELETE` | `/api/admin/users/:id`                 | Admin Only            | `protect`<br>`restrictTo('admin')`                               | Path parameter: `id`                                                                                                      | `message`, `success`                                     |

_Note: `(req)` designates a required field; `(opt)` designates an optional field._

---

## 2. Route Specifications

### A. Auth Base Endpoints (`/api/auth`)

These routes handle signups, verification states, credentials verification, password recovery steps, and account reactivation flags.

#### 1. Registration (`POST /register`)

- **Middlewares:** `authRateLimiter` (sliding-window, max 3 requests per 15 minutes).
- **Validators:** `registerValidator` (asserts `firstName`, `lastName`, `email`, and `password` min 6 characters).
- **Execution Flow:**
    - Standardizes the email parameter (`normalizeEmail`).
    - Verifies that the email isn't already registered in the DB.
    - Checks Redis caching key `verified_email:${normalizedEmail}` to verify if registration email verification was completed pre-emptively.
    - If verified, sets user state `emailVerified = true`. If unverified, issues an OTP code to the email address.
    - Hashes password via bcrypt (salt work factor: 10).
    - Creates the user table record.
    - Signs a JWT and places it in an HttpOnly cookie (`token`). Returns a successful payload response.

#### 2. Send Verification OTP (`POST /send-verification-otp`)

- **Middlewares:** `authRateLimiter`.
- **Validators:** `sendVerificationOtpValidator` (asserts valid `email`).
- **Execution Flow:**
    - Standardizes email.
    - Invokes `issueOtp` with purpose `verify`. This caches the OTP values inside Redis under key `verify:${email}` and triggers an email dispatch.

#### 3. Log In (`POST /login`)

- **Middlewares:** `authRateLimiter`.
- **Validators:** `loginValidator` (asserts `email` and `password` presence).
- **Execution Flow:**
    - Fetches the user record by email, including soft-deleted entries.
    - If the user has soft-delete enabled (`isDeleted = true`) and is within the 15-day recovery window, returns a `403 Forbidden` response offering account recovery.
    - If the recovery window has expired, returns a `410 Gone` response.
    - Compares credentials using `bcrypt.compare`.
    - Sets an HttpOnly cookie containing the signed JWT payload. If `rememberMe = true` is passed, set cookie expiration for 15 days (default: 1 day).

#### 4. Account Soft-Delete Request Recovery (`POST /recover-account/request`)

- **Middlewares:** `authRateLimiter`.
- **Validators:** `recoverAccountValidator`.
- **Execution Flow:**
    - Verifies that the account is flagged as soft-deleted in Postgres.
    - Generates and dispatches an account recovery verification OTP to the user's email, caching it under Redis key `recover-account:${email}`.

#### 5. Verify Account Recovery (`POST /recover-account/verify`)

- **Validators:** `verifyRecoverAccountValidator` (asserts `email` and 6-char `otp`).
- **Execution Flow:**
    - Validates the code against Redis cache value `recover-account:${email}`.
    - If valid, sets user state fields: `isDeleted = false`, `isActive = true`, `deletedAt = null`, `recoveryExpiresAt = null`.
    - Sends a confirmation notification email to the user.

#### 6. Forgot Password (`POST /forgot-password`)

- **Middlewares:** `authRateLimiter`.
- **Validators:** `forgotPasswordValidator`.
- **Execution Flow:**
    - Generates and sends a reset password OTP using cache key `forgot-password:${email}`.

#### 7. Verify Forgot Password OTP (`POST /verify-forgot-password-otp`)

- **Validators:** `verifyForgotPasswordOtpValidator`.
- **Execution Flow:**
    - Validates the token against Redis key `forgot-password:${email}`. Returns a validation success message.

#### 8. Reset Password (`POST /reset-password`)

- **Validators:** `resetPasswordValidator` (asserts `email`, 6-char `otp`, `password` meeting complexity guidelines, and matching `confirmPassword`).
- **Execution Flow:**
    - Verifies the OTP cached under Redis key `forgot-password:${email}`.
    - Hashes the new password via bcrypt and updates the user table record.
    - Deletes the cached Redis OTP key.

#### 9. Log Out (`POST /logout`)

- **Execution Flow:**
    - Extracts the JWT `token` from incoming cookies or headers.
    - Computes the remaining TTL validity of the token.
    - Caches the token inside the Redis blacklist (`blacklist:${token}`) using the calculated TTL.
    - Clears the client-side cookie `token`.

---

### B. User Profile Endpoints (`/api/users`)

All routes require authentication via the [`protect`](../../server/src/modules/auth/middleware/auth.middleware.js) middleware.

#### 1. Retrieve Current Profile (`GET /get-me`)

- **Execution Flow:**
    - Reads the active user payload attached to `req.user` by the `protect` middleware and returns a sanitized JSON user profile object.

#### 2. Update Profile Properties (`PATCH /profile`)

- **Validators:** `updateProfileValidator` (asserts string formats for optional properties `firstName`, `lastName`, `email`, and `profileImage`).
- **Execution Flow:**
    - Performs an update query on the `users` table scoped to `req.user.id`.
    - Returns the updated, sanitized user profile document.

#### 3. Upload Profile Avatar (`PATCH /profile/avatar`)

- **Middlewares:** Multer middleware configuration `upload.single('avatar')` (buffers standard incoming images to system RAM memory).
- **Execution Flow:**
    - Invokes `uploadImageOnImageKit()` using the buffered file.
    - Performs a Drizzle table update mapping `req.user.id`'s `profileImage` to the returned ImageKit asset CDN URL.

#### 4. Delete Account / Soft-Delete Trigger (`DELETE /me`)

- **Validators:** `deleteAccountValidator` (asserts current user `password` payload to confirm intent).
- **Execution Flow:**
    - Verifies password authenticity via bcrypt.
    - Calls `softDeleteUser(req.user.id)`. This sets `isDeleted = true`, `isActive = false`, and sets `recoveryExpiresAt = NOW + 15 days`.
    - Logs the user out by blacklisting their active JWT in Redis and clearing the cookie context.

---

### C. Admin Endpoints (`/api/admin`)

These administrative routes require both [`protect`](../../server/src/modules/auth/middleware/auth.middleware.js) and [`restrictTo('admin')`](../../server/src/modules/auth/middleware/auth.middleware.js) middlewares.

#### 1. List Users (`GET /users`)

- **Execution Flow:**
    - Reads all users from Postgres (`users` table). Accepts query filters to include or exclude soft-deleted entries.

#### 2. Admin Trigger Soft-Deleted Cleanup Sweep (`POST /users/cleanup`)

- **Execution Flow:**
    - Intercepts and triggers the cleanup job on-demand.
    - Permanently deletes users from the database whose soft-delete recovery bounds (`recoveryExpiresAt`) are in the past.
    - Returns a list of permanently removed profiles and a deletion count.

#### 3. Modify Role (`PATCH /users/:id/role`)

- **Validators:** `adminUpdateRoleValidator` (asserts body `role` is either `user` or `admin`).
- **Execution Flow:**
    - Performs a target update modifying `users.role` on the user referenced in path parameter `id`.

---

## 3. Extension Blueprints

Use the following architectural guidelines to add validation rules or construct new route files.

### A. How to Add a Validator to Auth Rules

Add validation sequences to [`src/modules/auth/validators/auth.validator.js`](../../server/src/modules/auth/validators/auth.validator.js):

```js
export const customActionValidator = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required')
        .isAlphanumeric()
        .withMessage('Username must be alphanumeric')
        .isLength({ min: 4, max: 15 })
        .withMessage('Username must be 4-15 characters long'),
    body('age').optional().isInt({ min: 18 }).withMessage('Must be at least 18 years of age'),
    validateRequest, // Validates constraints and throws a 400 error if validation fails
];
```

### B. Registering and Mounting New Routing Files

1. Create a route file (e.g., `src/modules/auth/routes/session.routes.js`):
    ```js
    import { Router } from 'express';
    import { protect } from '../middleware/auth.middleware.js';
    import { sendResponse } from '../../../utils/response.utlis.js';

    const sessionRouter = Router();

    sessionRouter.get('/active', protect, (req, res) => {
        return sendResponse({
            res,
            statusCode: 200,
            success: true,
            message: 'Session is active',
            data: { userId: req.user.id },
        });
    });

    export default sessionRouter;
    ```
2. Mount the router in the module index (`src/modules/auth/index.js`):
    ```js
    import sessionRouter from './routes/session.routes.js';
    // ...
    export { authRouter, userRouter, adminRouter, sessionRouter };
    ```
3. Expose the router in the primary express router mount pipeline ([`src/app.js`](../../server/src/app.js)):
    ```js
    import { sessionRouter } from './modules/auth/index.js';
    // ...
    app.use('/api/sessions', sessionRouter);
    ```
