# Supabase Setup Guide

This guide will help you set up the Supabase backend for the portfolio application.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- A Supabase project created

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings** > **API**
3. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

4. Create a `.env` file in the `portfolio-react` directory:
   ```bash
   cp .env.example .env
   ```

5. Update the `.env` file with your credentials:
   ```
   VITE_SUPABASE_URL=your_project_url_here
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

## Step 2: Create Database Schema

1. In your Supabase dashboard, navigate to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `supabase-schema.sql`
4. Paste it into the SQL Editor
5. Click **Run** to execute the script

This will create:
- ✅ `projects` table with proper columns and constraints
- ✅ `testimonials` table with rating validation
- ✅ `metrics` table with initial data
- ✅ Indexes for performance optimization
- ✅ Row Level Security (RLS) policies for public read and authenticated write access

## Step 3: Create Storage Bucket

1. In your Supabase dashboard, navigate to **Storage**
2. Click **Create a new bucket**
3. Configure the bucket:
   - **Name**: `portfolio-images`
   - **Public bucket**: ✅ Enable (check the box)
   - Click **Create bucket**

### Configure Storage Policies

After creating the bucket, set up the following policies:

1. Click on the `portfolio-images` bucket
2. Go to **Policies** tab
3. Click **New Policy** and create these 4 policies:

#### Policy 1: Public Read Access
- **Policy name**: Allow public read access
- **Allowed operation**: SELECT
- **Policy definition**:
  ```sql
  (bucket_id = 'portfolio-images')
  ```

#### Policy 2: Authenticated Upload
- **Policy name**: Allow authenticated users to upload
- **Allowed operation**: INSERT
- **Target roles**: authenticated
- **Policy definition**:
  ```sql
  (bucket_id = 'portfolio-images')
  ```

#### Policy 3: Authenticated Update
- **Policy name**: Allow authenticated users to update
- **Allowed operation**: UPDATE
- **Target roles**: authenticated
- **Policy definition**:
  ```sql
  (bucket_id = 'portfolio-images')
  ```

#### Policy 4: Authenticated Delete
- **Policy name**: Allow authenticated users to delete
- **Allowed operation**: DELETE
- **Target roles**: authenticated
- **Policy definition**:
  ```sql
  (bucket_id = 'portfolio-images')
  ```

## Step 4: Create Admin User

1. Navigate to **Authentication** > **Users**
2. Click **Add user** > **Create new user**
3. Enter email and password for your admin account
4. Click **Create user**
5. (Optional) Confirm the user email if auto-confirm is not enabled

## Step 5: Verify Setup

Run these queries in the SQL Editor to verify everything is set up correctly:

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('projects', 'testimonials', 'metrics');

-- Check metrics initialized
SELECT * FROM metrics;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('projects', 'testimonials', 'metrics');
```

Expected results:
- 3 tables should be listed
- 2 metrics rows (visits and cv_downloads) with count = 0
- All 3 tables should have `rowsecurity = true`

## Step 6: Test Connection

1. Start your React development server:
   ```bash
   cd portfolio-react
   npm run dev
   ```

2. The Supabase client should initialize without errors
3. Check the browser console for any connection issues

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Make sure your `.env` file exists in the `portfolio-react` directory
- Verify the variable names start with `VITE_` prefix
- Restart the dev server after creating/updating `.env`

### Error: "Invalid API key"
- Double-check you copied the **anon/public** key, not the service_role key
- Ensure there are no extra spaces in the `.env` file

### Storage upload fails
- Verify the `portfolio-images` bucket is set to **public**
- Check that all 4 storage policies are created correctly
- Ensure you're authenticated when uploading

### RLS policy errors
- Make sure RLS is enabled on all tables
- Verify policies are created for both public and authenticated roles
- Check that authenticated users can write and public users can only read

## Next Steps

Once setup is complete, you can:
- Start implementing the admin panel (Task 7)
- Test CRUD operations for projects and testimonials
- Verify metrics tracking functionality

## Database Schema Reference

### Projects Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | Primary Key, Auto-generated |
| title | TEXT | NOT NULL |
| category | TEXT | NOT NULL, CHECK (Diseño/Web/App) |
| image_url | TEXT | - |
| link | TEXT | - |
| created_at | TIMESTAMP | Default NOW() |

### Testimonials Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | Primary Key, Auto-generated |
| name | TEXT | NOT NULL |
| image_url | TEXT | - |
| rating | INTEGER | NOT NULL, CHECK (1-5) |
| comment | TEXT | NOT NULL |
| created_at | TIMESTAMP | Default NOW() |

### Metrics Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | Primary Key, Auto-generated |
| metric_type | TEXT | NOT NULL, UNIQUE, CHECK (visits/cv_downloads) |
| count | INTEGER | NOT NULL, Default 0 |
| last_updated | TIMESTAMP | Default NOW() |
