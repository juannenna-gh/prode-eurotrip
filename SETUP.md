# Authentication Setup Guide

## 1. Install Dependencies

```bash
npm install
```

## 2. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen if needed
6. Choose "Web application" as application type
7. Add authorized redirect URI: `http://localhost:3000/auth/google/callback`
8. For production, also add: `https://yourdomain.com/auth/google/callback`
9. Copy the Client ID and Client Secret

## 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

```
GOOGLE_CLIENT_ID=your-actual-client-id-here
GOOGLE_CLIENT_SECRET=your-actual-client-secret-here
SESSION_SECRET=some-random-long-string-here
ADMIN_EMAIL=your-email@gmail.com
SERVER_URL=http://localhost:3000
```

To generate a random session secret, you can use:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 4. Start the Server

```bash
npm start
```

## 5. Access the Application

- **Public view**: http://localhost:3000/view.html (no login required)
- **Admin login**: http://localhost:3000/login.html
- **Admin panel**: http://localhost:3000/admin.html (requires authentication)

## 6. For Production Deployment

1. Update `.env` with production values:
   - Set `SERVER_URL` to your production domain
   - Set `NODE_ENV=production` for secure cookies
2. Add production callback URL to Google OAuth settings
3. Keep `.env` file secure and never commit it to version control

## Security Notes

- Only the email specified in `ADMIN_EMAIL` can access the admin panel
- All admin API endpoints (POST, PUT, DELETE) are protected
- Public endpoints (GET matches, GET rankings) remain accessible to everyone
- The view page is completely public
