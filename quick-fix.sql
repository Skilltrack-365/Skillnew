-- Quick Fix for User Registration Database Error
-- Run this in your Supabase Dashboard SQL Editor

-- Step 1: Drop the existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Step 2: Create a simple function that works with the current schema
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles with only the basic fields that definitely exist
  INSERT INTO profiles (
    id,
    email,
    full_name,
    avatar_url,
    role,
    experience_level,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    'student',
    'Beginner',
    now(),
    now()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Step 4: Add any missing columns that might be needed
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS timezone text DEFAULT 'UTC';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS language text DEFAULT 'en';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notification_preferences jsonb DEFAULT '{"email": true, "push": true, "sms": false}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferences jsonb DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login timestamptz;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS login_count integer DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_tier text DEFAULT 'free';

-- Step 5: Update any existing profiles to have default values
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

-- Step 6: Ensure RLS policies are set up correctly
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Step 7: Enable RLS on profiles table if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Success message
SELECT 'User registration fix applied successfully!' as status; 