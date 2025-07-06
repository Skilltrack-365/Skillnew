-- Complete Fix for Profiles Table Infinite Recursion
-- Run this in your Supabase SQL Editor

-- Step 1: Temporarily disable RLS to clear all policies
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop all existing policies for profiles
DROP POLICY IF EXISTS "Users can access their own profile" ON profiles;
DROP POLICY IF EXISTS "Allow all" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON profiles;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON profiles;
DROP POLICY IF EXISTS "Allow insert for user registration" ON profiles;

-- Step 3: Drop the problematic trigger function and recreate it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Step 4: Create a simplified trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    experience_level,
    timezone,
    language,
    notification_preferences,
    preferences,
    login_count,
    is_verified,
    subscription_tier
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'student',
    'Beginner',
    'UTC',
    'en',
    '{"email": true, "push": true, "sms": false}'::jsonb,
    '{}'::jsonb,
    0,
    false,
    'free'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 6: Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 7: Create safe, non-recursive policies
-- Allow users to read their own profile
CREATE POLICY "Users can read own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Allow the trigger function to insert new profiles (SECURITY DEFINER bypasses RLS)
-- This policy is not strictly necessary since the function has SECURITY DEFINER
-- but it's good practice to have it explicit
CREATE POLICY "Allow insert for registration"
ON profiles FOR INSERT
WITH CHECK (true);

-- Step 8: Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT ALL ON public.profiles_id_seq TO anon, authenticated;

-- Step 9: Test the setup
-- This should work without recursion
SELECT COUNT(*) FROM profiles LIMIT 1; 