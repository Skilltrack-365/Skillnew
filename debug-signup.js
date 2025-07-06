// Debug User Signup
// Copy and paste this into your browser console to test signup and see exact errors

console.log('🔍 Testing User Signup Process...\n');

// Get Supabase client
const { createClient } = await import('https://esm.sh/@supabase/supabase-js');
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test data
const testEmail = `test-${Date.now()}@example.com`;
const testPassword = 'TestPassword123!';

console.log('📧 Test Email:', testEmail);
console.log('🔑 Test Password:', testPassword);

// Step 1: Test signup
console.log('\n1️⃣ Testing User Signup...');
try {
  const { data: signupData, error: signupError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      data: {
        full_name: 'Test User',
      },
    },
  });

  if (signupError) {
    console.log('❌ Signup Error:', signupError);
    console.log('Error Code:', signupError.status);
    console.log('Error Message:', signupError.message);
  } else {
    console.log('✅ Signup successful!');
    console.log('User ID:', signupData.user?.id);
    console.log('Email:', signupData.user?.email);
  }
} catch (error) {
  console.log('❌ Signup Exception:', error);
}

// Step 2: Test profile creation
console.log('\n2️⃣ Testing Profile Creation...');
try {
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', testEmail)
    .single();

  if (profileError) {
    console.log('❌ Profile Query Error:', profileError);
    console.log('Error Code:', profileError.code);
    console.log('Error Message:', profileError.message);
  } else {
    console.log('✅ Profile found!');
    console.log('Profile Data:', profileData);
  }
} catch (error) {
  console.log('❌ Profile Query Exception:', error);
}

// Step 3: Test authentication
console.log('\n3️⃣ Testing Authentication...');
try {
  const { data: authData, error: authError } = await supabase.auth.getSession();
  
  if (authError) {
    console.log('❌ Auth Error:', authError);
  } else {
    console.log('✅ Auth working');
    console.log('Session:', authData.session ? 'Active' : 'None');
  }
} catch (error) {
  console.log('❌ Auth Exception:', error);
}

// Step 4: Test manual profile insert (if signup failed)
console.log('\n4️⃣ Testing Manual Profile Insert...');
try {
  const { data: insertData, error: insertError } = await supabase
    .from('profiles')
    .insert({
      id: 'test-user-' + Date.now(),
      email: 'manual-test@example.com',
      full_name: 'Manual Test User',
      role: 'student',
      experience_level: 'Beginner',
      timezone: 'UTC',
      language: 'en',
      notification_preferences: { email: true, push: true, sms: false },
      preferences: {},
      login_count: 0,
      is_verified: false,
      subscription_tier: 'free'
    })
    .select();

  if (insertError) {
    console.log('❌ Manual Insert Error:', insertError);
    console.log('Error Code:', insertError.code);
    console.log('Error Message:', insertError.message);
  } else {
    console.log('✅ Manual insert successful!');
    console.log('Inserted Data:', insertData);
  }
} catch (error) {
  console.log('❌ Manual Insert Exception:', error);
}

console.log('\n🎉 Debug complete!');
console.log('\nNext steps:');
console.log('1. Apply the SQL fix from fix-profiles-complete.sql');
console.log('2. Run this debug script again');
console.log('3. Check for any specific error messages above'); 