// Test Environment Configuration
// Run this script to verify your .env file is set up correctly

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
config();

console.log('🔍 Testing Environment Configuration...\n');

// Check if environment variables exist
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('📋 Environment Variables:');
console.log(`VITE_SUPABASE_URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`);
console.log(`VITE_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✅ Set' : '❌ Missing'}`);

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('\n❌ Missing required environment variables!');
  console.log('Please create a .env file with your Supabase credentials.');
  console.log('See ENVIRONMENT_SETUP.md for instructions.');
  process.exit(1);
}

// Test Supabase connection
console.log('\n🔗 Testing Supabase Connection...');

try {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  // Test a simple query
  const { data, error } = await supabase
    .from('profiles')
    .select('count')
    .limit(1);
  
  if (error) {
    console.log('❌ Supabase connection failed:');
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
    console.log('✅ Supabase connection successful!');
    console.log('✅ Database schema appears to be working');
  }
  
} catch (error) {
  console.log('❌ Failed to connect to Supabase:');
  console.log('Error:', error.message);
}

console.log('\n🎉 Environment test complete!');
console.log('\nNext steps:');
console.log('1. If all tests passed, restart your dev server: npm run dev');
console.log('2. Try signing up a new user');
console.log('3. Check the browser console for any errors'); 