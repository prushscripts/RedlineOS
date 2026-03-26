# RedlineOS — Supabase Setup Guide

## 🎯 Phase 2: Authentication & Live Data

This guide walks you through setting up Supabase for RedlineOS.

---

## 📋 Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click **"New Project"**
4. Fill in:
   - **Name:** RedlineOS
   - **Database Password:** (create a strong password - save it!)
   - **Region:** Choose closest to you
5. Click **"Create new project"**
6. Wait ~2 minutes for provisioning

---

## 🗄️ Step 2: Run Database Schema

1. In your Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New Query"**
3. Copy the entire contents of `supabase/schema.sql` from this project
4. Paste into the SQL editor
5. Click **"Run"** (or press Ctrl+Enter)
6. You should see: **"Success. No rows returned"**

This creates all tables and seeds initial data (2 drivers, 2 trucks).

---

## 🔐 Step 3: Get API Keys

1. In Supabase dashboard, click **"Settings"** (gear icon) in the left sidebar
2. Click **"API"** under Project Settings
3. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

---

## 🔑 Step 4: Add Environment Variables

### Local Development:

1. In your RedlineOS project root, create a file called `.env.local`
2. Add these lines (replace with your actual values):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

3. Save the file
4. Restart your dev server (`npm run dev`)

### Vercel Deployment:

1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your **redline-os** project
3. Click **"Settings"** tab
4. Click **"Environment Variables"** in the sidebar
5. Add both variables:
   - Key: `NEXT_PUBLIC_SUPABASE_URL` → Value: your project URL
   - Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Value: your anon key
6. Click **"Save"**
7. Redeploy your app (click `1-Deploy.bat` or trigger manually in Vercel)

---

## 📦 Step 5: Set Up Storage for Documents

1. In Supabase dashboard, click **"Storage"** in the left sidebar
2. Click **"New bucket"**
3. Name it: `redlineos-docs`
4. Set **Public bucket:** OFF (keep private)
5. Click **"Create bucket"**
6. Click on the bucket name
7. Click **"Policies"** tab
8. Click **"New Policy"**
9. Choose **"For full customization"**
10. Add this policy:

**Policy name:** `Allow authenticated users to upload and view documents`

**Allowed operations:** SELECT, INSERT, DELETE

**Policy definition:**
```sql
(bucket_id = 'redlineos-docs'::text) AND (auth.role() = 'authenticated'::text)
```

11. Click **"Save"**

---

## ✅ Step 6: Test Authentication

1. Start your dev server: `npm run dev`
2. Go to `http://localhost:3000`
3. You should be redirected to `/login`
4. Click **"Need access? Register →"**
5. Enter token: `roadmap!`
6. Create an account with your email
7. You should see the rocket animation, then land on the dashboard
8. All data should be empty (starting at $0)

---

## 🚀 You're Done!

RedlineOS is now connected to Supabase. All data is live and editable.

### What's Next:

- Edit truck revenue in the Fleet page
- Add weekly snapshots in Financials
- Upload documents (once storage is configured)
- Track roadmap progress

---

## 🔧 Troubleshooting

**"Missing Supabase environment variables" error:**
- Make sure `.env.local` exists in project root
- Restart dev server after creating `.env.local`

**Can't log in:**
- Check Supabase dashboard → Authentication → Users
- Verify your email is confirmed (check email for confirmation link)

**Data not showing:**
- Check Supabase dashboard → Table Editor
- Verify seed data was inserted (should see 2 drivers, 2 trucks)

**RLS errors:**
- Make sure you ran the full `schema.sql` including the policies
- Check Supabase dashboard → Authentication → Policies

---

*RedlineOS — Every dollar tracked. Every mile counted.*
