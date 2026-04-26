# City Roll

City Roll is a Next.js 14 loyalty app for bill uploads, reward unlocks, and admin review.

## Stack

- Next.js 14
- Supabase Auth
- Supabase Postgres
- Supabase Storage
- Tailwind CSS
- Framer Motion
- Three.js

## Environment

Copy `.env.example` to `.env.local` and fill in:

```bash
cp .env.example .env.local
```

Required variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAILS`
- `NEXT_PUBLIC_APP_URL`

## Supabase setup

1. Create a Supabase project.
2. In Supabase SQL Editor, run [supabase/schema.sql](/Users/rishabhyash/Desktop/city-roll-full/supabase/schema.sql).
3. In Authentication, enable email OTP / email sign-in.
4. Confirm the `bills` storage bucket exists after running the SQL.

The app expects:

- `users` table for profile and reward progress
- `uploads` table for bill submissions
- `rewards` table for issued codes
- `bills` storage bucket for uploaded receipts

## Local run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Admin access

Add one or more admin emails to `ADMIN_EMAILS`, separated by commas.

Admins can:

- review pending uploads
- approve or reject bills
- view users and rewards
- redeem reward codes through the admin API

## Auth flow

- Login uses Supabase email OTP from the client.
- Public profile rows are created in `users` after verification.
- Deprecated Firebase OTP routes now return `410 Gone`.

## Notes

- Uploaded receipts are currently served from a public storage bucket because the app uses public URLs for previews and admin review.
- Reward creation is server-side only.
- Admin actions use the Supabase service role and bearer token validation.
# cityrollsweb
