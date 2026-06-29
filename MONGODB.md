# MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for a free account
3. Create a new organization (or use default)

## Step 2: Create a Cluster

1. Click "Build a Database"
2. Select **FREE** tier (M0 Sandbox)
3. Choose your preferred cloud provider and region (pick one close to where you'll deploy)
4. Name your cluster (e.g., "Prode")
5. Click "Create"

## Step 3: Create Database User

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Enter username (e.g., `prode-admin`)
5. Click "Autogenerate Secure Password" and **SAVE THIS PASSWORD**
6. Set role to "Read and write to any database"
7. Click "Add User"

## Step 4: Configure Network Access

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (or add specific IPs)
   - For development: 0.0.0.0/0
   - For production: Add your server's IP
4. Click "Confirm"

## Step 5: Get Connection String

1. Go back to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and version "4.1 or later"
5. Copy the connection string (looks like):
   ```
   mongodb+srv://prode-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with the password you saved earlier
7. Add `/prode` before the `?` to specify the database name:
   ```
   mongodb+srv://prode-admin:yourpassword@cluster0.xxxxx.mongodb.net/prode?retryWrites=true&w=majority
   ```

## Step 6: Update .env File

Add the MongoDB URI to your `.env` file:

```bash
MONGODB_URI=mongodb+srv://prode-admin:yourpassword@cluster0.xxxxx.mongodb.net/prode?retryWrites=true&w=majority
```

## Step 7: Install MongoDB Driver

```bash
npm install
```

## Step 8: Migrate Existing Data

If you have existing data in `data.json`, run the migration script:

```bash
node migrate.js
```

This will copy all your existing matches to MongoDB.

## Step 9: Test Locally

```bash
npm start
```

Your app should now connect to MongoDB Atlas!

## Step 10: Add to Vercel

When deploying to Vercel, add `MONGODB_URI` as an environment variable in the Vercel dashboard.

## Important Notes

- **Free Tier Limits**: 512 MB storage, shared RAM/CPU
- **Connection Limit**: Keep connections minimal (the code reuses connections)
- **Backups**: Free tier doesn't include automatic backups - consider exporting data periodically
- **Security**: Never commit your MongoDB URI to git (it's in .gitignore)

## Troubleshooting

**Connection timeout?**
- Check Network Access allows your IP
- Verify connection string format
- Check firewall/VPN settings

**Authentication failed?**
- Verify password is correct (no special chars that need URL encoding)
- Check username matches database user

**Database not found?**
- Make sure `/prode` is in the connection string before `?`
