# SectionHub Auth and App Usage

## Purpose

This file documents the current auth flow, local credentials, and how to use the app in development.

## Current auth setup

- Database: MongoDB
- Auth style: email/password
- Session type: cookie session
- Session cookie: `sectionhub_session`
- Auth code: `lib/auth/server.ts`

## Local development credentials

Current seeded admin credentials:

- Email: `admin@sectionhub.com`
- Password: `admin12345`

These credentials are documented here only. They are no longer prefilled in the login UI.

## Login usage

1. Open `/login`
2. Enter the admin email and password
3. Submit the form
4. On success, the app redirects to `/dashboard`
5. On failure, the form shows an inline error message

## Forgot password usage

1. Open `/forgot-password`
2. Enter the admin email
3. Submit the form
4. In the current local setup, a reset token is shown on the page
5. Use that token on `/reset-password`

## Reset password usage

1. Open `/reset-password`
2. Paste the token from the forgot-password flow
3. Enter a new password
4. Confirm the password
5. Submit to update the password

## App usage

1. Start MongoDB locally
2. Seed local data:
   - `npm run db:seed`
3. Start the app:
   - `npm run dev`
4. Sign in with the seeded admin credentials
5. Use the sidebar to access:
   - Dashboard
   - Sections
   - Bundles
   - Categories
   - Tags
   - Analytics
   - Orders
   - Customers
   - Activity
   - Settings

## Important auth behavior

- Email is normalized to lowercase before login/reset checks
- Invalid login no longer redirects back with `?error=...`
- Forgot-password is local/dev-oriented right now and does not send real email

## Main auth files

- `app/(auth)/login/page.tsx`
- `app/(auth)/forgot-password/page.tsx`
- `app/(auth)/reset-password/page.tsx`
- `components/sectionhub/forms/login-form.tsx`
- `lib/auth/server.ts`
- `app/actions.ts`

## Current limitations

- No real email delivery yet
- No 2FA yet
- No auth rate limiting yet
- No role matrix beyond admin-only use
