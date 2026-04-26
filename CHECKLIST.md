# ⚡ City Roll — Setup Checklist

## Local setup
- [ ] Install Node.js v18+
- [ ] `npm install` inside city-roll/
- [ ] Copy `.env.example` → `.env.local`

## Firebase
- [ ] Create project at console.firebase.google.com
- [ ] Enable **Authentication** → Email/Password
- [ ] Enable **Firestore** (production, asia-south1)
- [ ] Enable **Storage** (production, asia-south1)
- [ ] Copy Web app config → `.env.local`
- [ ] Generate Service Account key → copy to `.env.local`
- [ ] Publish `firestore.rules` in Firebase Console
- [ ] Publish `storage.rules` in Firebase Console

## Email
- [ ] Enable 2FA on Gmail
- [ ] Generate app password at myaccount.google.com/apppasswords
- [ ] Add `EMAIL_USER` and `EMAIL_APP_PASSWORD` to `.env.local`

## Admin
- [ ] Add your email to `ADMIN_EMAILS`

## Test locally
- [ ] `npm run dev`
- [ ] Open http://localhost:3000
- [ ] Sign up with your admin email, receive OTP
- [ ] Visit /admin → should have access
- [ ] Upload 3 test bills, approve each in /admin
- [ ] Reward unlocks → click "Claim Mojito" → see QR

## Deploy
- [ ] Push to GitHub
- [ ] Import repo in Vercel
- [ ] Add all env variables to Vercel
- [ ] Deploy
- [ ] Update `NEXT_PUBLIC_APP_URL` to production URL
- [ ] Generate QR code pointing to production URL
- [ ] Print & stick on bills, posters 🎉

## Before scaling
- [ ] Switch from Gmail to Resend/SendGrid (Gmail: 500/day limit)
- [ ] Set Firebase budget alerts
- [ ] Add Sentry or error tracking
- [ ] Add analytics (Plausible / Posthog)
