/*
  Browser Debug Script for Database Error
  
  Copy and paste this into your browser console (F12) to debug the database error
*/

async function debugDatabaseError() {
  console.log('🔍 Browser Database Debug Starting...\n');

  try {
    // Check if Supabase is available
    if (typeof window.supabase === 'undefined') {
      console.log('❌ Supabase client not found in window object');
      console.log('Make sure you have imported and initialized Supabase in your app');
      return;
    }

    const supabase = window.supabase;
    console.log('✅ Supabase client found');

    // Test basic connection
    console.log('\n🔗 Testing basic connection...');
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (testError) {
      console.log('❌ Connection test failed:', testError.message);
      console.log('Error details:', testError);
      
      if (testError.message.includes('relation "profiles" does not exist')) {
        console.log('\n🔧 SOLUTION: The profiles table does not exist');
        console.log('You need to run the database migrations first');
        console.log('See apply-migrations.md for instructions');
      } else if (testError.message.includes('permission denied')) {
        console.log('\n🔧 SOLUTION: Permission denied - check RLS policies');
        console.log('Run the quick-fix.sql in your Supabase dashboard');
      }
      return;
    }

    console.log('✅ Basic connection successful');

    // Check profiles table structure
    console.log('\n📊 Checking profiles table...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (profilesError) {
      console.log('❌ Profiles table error:', profilesError.message);
      console.log('Error details:', profilesError);
      return;
    }

    console.log('✅ Profiles table accessible');
    console.log('📋 Sample profile structure:', profiles[0] || 'No profiles found');

    // Test user registration simulation
    console.log('\n🧪 Testing user registration simulation...');
    
    // Create a test user object (this simulates what happens during signup)
    const testUser = {
      id: 'test-user-' + Date.now(),
      email: 'test@example.com',
      raw_user_meta_data: {
        full_name: 'Test User'
      }
    };

    // Try to insert a profile manually (this is what the trigger should do)
    const testProfile = {
      id: testUser.id,
      email: testUser.email,
      full_name: testUser.raw_user_meta_data.full_name || '',
      avatar_url: '',
      role: 'student',
      experience_level: 'Beginner',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: insertData, error: insertError } = await supabase
      .from('profiles')
      .insert(testProfile)
      .select();

    if (insertError) {
      console.log('❌ Manual profile creation failed:', insertError.message);
      console.log('Error details:', insertError);
      
      if (insertError.message.includes('column') && insertError.message.includes('does not exist')) {
        console.log('\n🔧 SOLUTION: Missing columns in profiles table');
        console.log('Run the quick-fix.sql in your Supabase dashboard');
      } else if (insertError.message.includes('violates')) {
        console.log('\n🔧 SOLUTION: Constraint violation - check table structure');
        console.log('Run the database migrations to fix table structure');
      }
    } else {
      console.log('✅ Manual profile creation successful');
      
      // Clean up
      await supabase
        .from('profiles')
        .delete()
        .eq('id', testUser.id);
      console.log('🧹 Test profile cleaned up');
    }

    // Check auth configuration
    console.log('\n🔐 Checking auth configuration...');
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.log('❌ Auth configuration error:', authError.message);
    } else {
      console.log('✅ Auth configuration looks good');
      console.log('📋 Current session:', session ? 'Active' : 'No session');
    }

  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
    console.log('Error details:', error);
  }

  console.log('\n📋 Summary:');
  console.log('1. If you see "relation does not exist" - run database migrations');
  console.log('2. If you see "column does not exist" - run quick-fix.sql');
  console.log('3. If you see "permission denied" - check RLS policies');
  console.log('4. If you see "constraint violation" - check table structure');
  console.log('\n📖 See apply-migrations.md for detailed instructions');
}

// Run the debug function
debugDatabaseError();