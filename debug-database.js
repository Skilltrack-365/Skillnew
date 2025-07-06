/*
  Database Debug Script
  
  This script helps identify the specific database error when creating new users.
  Run this with: node debug-database.js
*/

const { createClient } = require('@supabase/supabase-js');

// You'll need to install the supabase-js package first:
// npm install @supabase/supabase-js

async function debugDatabase() {
  console.log('🔍 Database Debug Script Starting...\n');

  // Check environment variables
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

  console.log('📋 Environment Variables Check:');
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing');
  console.log('');

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('❌ Missing environment variables. Please set:');
    console.log('VITE_SUPABASE_URL=your-supabase-project-url');
    console.log('VITE_SUPABASE_ANON_KEY=your-supabase-anon-key');
    return;
  }

  try {
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ Supabase client created successfully');

    // Test database connection
    console.log('\n🔗 Testing database connection...');
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (testError) {
      console.log('❌ Database connection failed:', testError.message);
      console.log('Error details:', testError);
      return;
    }

    console.log('✅ Database connection successful');

    // Check if profiles table exists and has the right structure
    console.log('\n📊 Checking profiles table structure...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (profilesError) {
      console.log('❌ Error accessing profiles table:', profilesError.message);
      console.log('This suggests the table might not exist or has permission issues');
      return;
    }

    console.log('✅ Profiles table accessible');
    console.log('📋 Current profiles count:', profiles.length);

    // Check if the handle_new_user function exists
    console.log('\n🔧 Checking user registration trigger...');
    const { data: functions, error: functionsError } = await supabase
      .rpc('get_function_info', { function_name: 'handle_new_user' })
      .catch(() => ({ data: null, error: { message: 'Function check failed' } }));

    if (functionsError) {
      console.log('⚠️  Could not verify handle_new_user function');
      console.log('This is normal if the function doesn\'t exist yet');
    } else {
      console.log('✅ handle_new_user function exists');
    }

    // Test creating a profile manually to see what fields are required
    console.log('\n🧪 Testing profile creation...');
    const testProfile = {
      id: 'test-user-' + Date.now(),
      email: 'test@example.com',
      full_name: 'Test User',
      role: 'student',
      experience_level: 'Beginner',
      timezone: 'UTC',
      language: 'en',
      notification_preferences: { email: true, push: true, sms: false },
      preferences: {},
      login_count: 0,
      is_verified: false,
      subscription_tier: 'free'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('profiles')
      .insert(testProfile)
      .select();

    if (insertError) {
      console.log('❌ Profile creation failed:', insertError.message);
      console.log('Error details:', insertError);
      console.log('\n🔧 This suggests the profiles table is missing required columns');
      console.log('You need to run the database migrations to fix this');
    } else {
      console.log('✅ Profile creation successful');
      
      // Clean up test data
      await supabase
        .from('profiles')
        .delete()
        .eq('id', testProfile.id);
      console.log('🧹 Test profile cleaned up');
    }

  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
    console.log('Error details:', error);
  }

  console.log('\n📋 Next Steps:');
  console.log('1. If you see missing columns error, run the database migrations');
  console.log('2. If you see permission errors, check your RLS policies');
  console.log('3. If you see connection errors, verify your environment variables');
  console.log('\n📖 See apply-migrations.md for detailed instructions');
}

// Run the debug script
debugDatabase().catch(console.error); 