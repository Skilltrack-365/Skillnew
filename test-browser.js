// Browser Environment Test
// Copy and paste this into your browser console to test the setup

console.log('🔍 Testing Browser Environment...\n');

// Check if environment variables are available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('📋 Environment Variables:');
console.log(`VITE_SUPABASE_URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`);
console.log(`VITE_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✅ Set' : '❌ Missing'}`);

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('\n❌ Missing environment variables!');
  console.log('Please create a .env file with your Supabase credentials.');
  console.log('See ENVIRONMENT_SETUP.md for instructions.');
} else {
  console.log('\n🔗 Testing Supabase Connection...');
  
  // Test Supabase client
  try {
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Test a simple query
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Database query failed:');
      console.log('Error:', error.message);
      
      if (error.message.includes('Invalid API key')) {
        console.log('\n💡 This usually means:');
        console.log('1. Your API key is incorrect');
        console.log('2. You\'re using the service role key instead of the anon key');
        console.log('3. Your project URL is incorrect');
      } else if (error.message.includes('relation "profiles" does not exist')) {
        console.log('\n💡 Database schema not applied:');
        console.log('1. Apply the migrations from supabase/migrations/');
        console.log('2. Run the quick fix SQL from quick-fix.sql');
      }
    } else {
      console.log('✅ Database connection successful!');
      console.log('✅ Schema appears to be working');
    }
    
    // Test authentication
    console.log('\n🔐 Testing Authentication...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.log('❌ Authentication test failed:');
      console.log('Error:', authError.message);
    } else {
      console.log('✅ Authentication system working');
      console.log('Current session:', authData.session ? 'Active' : 'None');
    }
    
  } catch (error) {
    console.log('❌ Failed to test Supabase:');
    console.log('Error:', error.message);
  }
}

console.log('\n🎉 Browser test complete!');
console.log('\nNext steps:');
console.log('1. If all tests passed, try signing up a new user');
console.log('2. Check for any console errors during signup/login');
console.log('3. Verify the user profile is created in the database'); 