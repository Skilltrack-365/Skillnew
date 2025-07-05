/*
  # Fix User Registration Trigger
  
  This migration updates the handle_new_user function to properly handle
  all the new profile fields we added to the comprehensive schema.
*/

-- Drop the existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create updated function with all new profile fields
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

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Add RLS policy for profiles to allow users to read their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Add RLS policy for profiles to allow users to update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Add RLS policy for profiles to allow users to insert their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Ensure the profiles table has all the required columns
DO $$ 
BEGIN
  -- Add phone column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'phone') THEN
    ALTER TABLE profiles ADD COLUMN phone text;
  END IF;

  -- Add timezone column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'timezone') THEN
    ALTER TABLE profiles ADD COLUMN timezone text DEFAULT 'UTC';
  END IF;

  -- Add language column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'language') THEN
    ALTER TABLE profiles ADD COLUMN language text DEFAULT 'en';
  END IF;

  -- Add notification_preferences column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'notification_preferences') THEN
    ALTER TABLE profiles ADD COLUMN notification_preferences jsonb DEFAULT '{"email": true, "push": true, "sms": false}';
  END IF;

  -- Add preferences column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'preferences') THEN
    ALTER TABLE profiles ADD COLUMN preferences jsonb DEFAULT '{}';
  END IF;

  -- Add last_login column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'last_login') THEN
    ALTER TABLE profiles ADD COLUMN last_login timestamptz;
  END IF;

  -- Add login_count column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'login_count') THEN
    ALTER TABLE profiles ADD COLUMN login_count integer DEFAULT 0;
  END IF;

  -- Add is_verified column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'is_verified') THEN
    ALTER TABLE profiles ADD COLUMN is_verified boolean DEFAULT false;
  END IF;

  -- Add subscription_tier column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'subscription_tier') THEN
    ALTER TABLE profiles ADD COLUMN subscription_tier text DEFAULT 'free';
  END IF;
END $$;

-- Update existing profiles to have default values for new columns
UPDATE profiles 
SET 
  timezone = COALESCE(timezone, 'UTC'),
  language = COALESCE(language, 'en'),
  notification_preferences = COALESCE(notification_preferences, '{"email": true, "push": true, "sms": false}'::jsonb),
  preferences = COALESCE(preferences, '{}'::jsonb),
  login_count = COALESCE(login_count, 0),
  is_verified = COALESCE(is_verified, false),
  subscription_tier = COALESCE(subscription_tier, 'free')
WHERE 
  timezone IS NULL 
  OR language IS NULL 
  OR notification_preferences IS NULL 
  OR preferences IS NULL 
  OR login_count IS NULL 
  OR is_verified IS NULL 
  OR subscription_tier IS NULL;

-- Create a function to update last_login and login_count
CREATE OR REPLACE FUNCTION update_user_login_info()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles 
  SET 
    last_login = now(),
    login_count = login_count + 1
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update login info on auth state change
DROP TRIGGER IF EXISTS update_login_info ON auth.users;
CREATE TRIGGER update_login_info
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at)
  EXECUTE FUNCTION update_user_login_info(); 