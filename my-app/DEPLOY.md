# Deployment Guide - Netlify + Supabase

## Step 1: Set up Supabase (Database)

1. Go to [supabase.com](https://supabase.com) and sign up (free)
2. Create a new project
3. Wait for the database to provision
4. Go to **SQL Editor** in the left sidebar
5. Click **New Query** and paste the contents of `supabase/schema.sql`
6. Click **Run** to create tables and insert default foods
7. Go to **Settings** → **API**
8. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## Step 2: Set up Environment Variables

1. Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```
2. Edit `.env` and paste your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

## Step 3: Deploy to Netlify

### Option A: Deploy via Netlify CLI (Recommended)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the app
npm run build

# Deploy
netlify deploy --prod
```

First time, it will ask:
- **Site name**: (press enter for random, or type a name)
- **Publish directory**: `dist`
- **Build command**: `npm run build`

### Option B: Deploy via GitHub (Auto-deploy on push)

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com) and sign up
3. Click **Add new site** → **Import an existing project**
4. Connect your GitHub account and select your repo
5. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click **Deploy site**

## Step 4: Add Environment Variables to Netlify

1. In Netlify dashboard, go to **Site settings** → **Environment variables**
2. Add these variables:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
3. Click **Deploy site** to redeploy with the env vars

## Step 5: Access from Phone

Once deployed, Netlify gives you a URL like:
```
https://your-app-name.netlify.app
```

This works from any device with internet - just open the URL on your phone!

## Development

```bash
# Local development
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Free Tier Limits

- **Netlify**: 100GB bandwidth/month, unlimited sites
- **Supabase**: 500MB database, 50K monthly active users (free tier)

Both are more than enough for personal use!
