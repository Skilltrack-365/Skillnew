# Database Migration Guide

## Issue: Database Error Saving New User

The error you're encountering is because the database schema has been updated with new fields, but the user registration trigger hasn't been updated to handle these new fields.

## Solution: Apply Database Migrations

Since the Supabase CLI isn't installed, you'll need to apply the migrations manually through the Supabase Dashboard.

### Step 1: Access Supabase Dashboard

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your project

### Step 2: Apply the Comprehensive Schema Migration

1. Go to **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy and paste the contents of `supabase/migrations/20250115000000_comprehensive_schema.sql`
4. Click **Run** to execute the migration

### Step 3: Apply the Seed Data Migration

1. Create another new query
2. Copy and paste the contents of `supabase/migrations/20250115000001_seed_data.sql`
3. Click **Run** to execute the migration

### Step 4: Apply the User Registration Fix

1. Create another new query
2. Copy and paste the contents of `supabase/migrations/20250115000002_fix_user_registration.sql`
3. Click **Run** to execute the migration

### Step 5: Verify the Fix

1. Go to **Authentication** → **Users** in the left sidebar
2. Try to create a new user through your application
3. Check that the user is created successfully in the **Users** table
4. Check that a corresponding profile is created in the **profiles** table

## Alternative: Quick Fix (If you just want to get it working)

If you want a quick fix without applying all the migrations, you can run this SQL in the Supabase Dashboard:

```sql
-- Quick fix for user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (
    id,
    email,
    full_name,
    avatar_url,
    role,
    experience_level,
    timezone,
    language,
    notification_preferences,
    preferences,
    login_count,
    is_verified,
    subscription_tier,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    'student',
    'Beginner',
    'UTC',
    'en',
    '{"email": true, "push": true, "sms": false}'::jsonb,
    '{}'::jsonb,
    0,
    false,
    'free',
    now(),
    now()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Add missing columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS timezone text DEFAULT 'UTC';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS language text DEFAULT 'en';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notification_preferences jsonb DEFAULT '{"email": true, "push": true, "sms": false}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferences jsonb DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login timestamptz;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS login_count integer DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_tier text DEFAULT 'free';
```

## What This Fix Does

1. **Updates the user registration trigger** to handle all the new profile fields
2. **Adds missing columns** to the profiles table
3. **Sets default values** for new users
4. **Fixes RLS policies** for proper access control

## Testing the Fix

After applying the migrations:

1. **Try signing up a new user** through your application
2. **Check the browser console** for any errors
3. **Verify in Supabase Dashboard** that:
   - User is created in `auth.users`
   - Profile is created in `profiles` table
   - All required fields have default values

## Common Issues and Solutions

### Issue: "Column does not exist" error
**Solution**: Make sure you've run the migration that adds the missing columns.

### Issue: "Permission denied" error
**Solution**: Check that the RLS policies are properly set up in the migration.

### Issue: "Function does not exist" error
**Solution**: Make sure you've dropped and recreated the `handle_new_user` function.

## Next Steps

After fixing the user registration:

1. **Test the contact form** to ensure it works properly
2. **Verify all database tables** are created correctly
3. **Check that the cloud sandbox features** work as expected
4. **Test the complete user flow** from registration to using the platform

## Need Help?

If you're still experiencing issues:

1. Check the **Supabase Dashboard** → **Logs** for detailed error messages
2. Verify your **environment variables** are set correctly
3. Check the **browser console** for any JavaScript errors
4. Ensure your **Supabase project** is properly configured

The migrations should resolve the user registration issue and set up your complete database schema for the Skilltrack-365 Labs platform. 