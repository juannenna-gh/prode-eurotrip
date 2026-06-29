# Vercel Deployment Guide

## Prerequisites
1. Vercel account (sign up at https://vercel.com)
2. Vercel CLI installed: `npm install -g vercel`

## Deployment Steps

### 1. Install Vercel CLI (if not already installed)
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy from the project directory
```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? Choose your account
- Link to existing project? **No**
- Project name? **prode-eurotrip** (or your preferred name)
- Directory? **./** (current directory)
- Override settings? **No**

### 4. Set Environment Variables

After initial deployment, add your environment variables:

```bash
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add SESSION_SECRET
vercel env add ADMIN_EMAIL
vercel env add SERVER_URL
```

Or add them via the Vercel Dashboard:
1. Go to your project on https://vercel.com
2. Go to Settings → Environment Variables
3. Add each variable:
   - `GOOGLE_CLIENT_ID` → Your Google OAuth Client ID
   - `GOOGLE_CLIENT_SECRET` → Your Google OAuth Client Secret
   - `SESSION_SECRET` → Random secret (use the one from your local .env)
   - `ADMIN_EMAIL` → `juan.a.nenna@gmail.com`
   - `SERVER_URL` → Your Vercel URL (e.g., `https://prode-eurotrip.vercel.app`)

### 5. Update Google OAuth Callback URL

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to your OAuth credentials
3. Add your Vercel URL to "Authorized JavaScript origins":
   ```
   https://your-app-name.vercel.app
   ```
4. Add to "Authorized redirect URIs":
   ```
   https://your-app-name.vercel.app/auth/google/callback
   ```

### 6. Redeploy with Environment Variables
```bash
vercel --prod
```

## Important Notes

- The `data.json` file will NOT persist on Vercel (serverless functions are stateless)
- For production, you should use a database instead of a JSON file
- Consider using:
  - MongoDB Atlas (free tier available)
  - PostgreSQL (via Vercel Postgres or Railway)
  - Firebase Firestore

## Data Persistence Options

### Option 1: Vercel KV (Redis-based storage)
Quick setup for small datasets

### Option 2: MongoDB Atlas
1. Create free cluster at https://www.mongodb.com/atlas
2. Add MongoDB URI to environment variables
3. Update `server.js` to use MongoDB instead of `data.json`

### Option 3: Vercel Postgres
Built-in database solution

Would you like help setting up a database for persistence?
