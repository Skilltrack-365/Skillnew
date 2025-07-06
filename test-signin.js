// Test Signin Process
// Copy and paste this into your browser console to test signin functionality

console.log('🔍 Testing Signin Process...\n');

// Get Supabase client
const { createClient } = await import('https://esm.sh/@supabase/supabase-js');
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test data - replace with your actual credentials
const testEmail = 'your-email@example.com'; // Replace with your email
const testPassword = 'your-password'; // Replace with your password

console.log('📧 Test Email:', testEmail);
console.log('🔑 Test Password:', testPassword);

// Step 1: Check current session
console.log('\n1️⃣ Checking Current Session...');
try {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    console.log('❌ Session check error:', sessionError);
  } else {
    console.log('✅ Session check successful');
    console.log('Current session:', sessionData.session ? 'Active' : 'None');
    if (sessionData.session) {
      console.log('User email:', sessionData.session.user.email);
    }
  }
} catch (error) {
  console.log('❌ Session check exception:', error);
}

// Step 2: Test signin
console.log('\n2️⃣ Testing Signin...');
try {
  const { data: signinData, error: signinError } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });

  if (signinError) {
    console.log('❌ Signin error:', signinError);
    console.log('Error message:', signinError.message);
    console.log('Error status:', signinError.status);
  } else {
    console.log('✅ Signin successful!');
    console.log('User ID:', signinData.user?.id);
    console.log('User email:', signinData.user?.email);
    console.log('Session:', signinData.session ? 'Created' : 'None');
  }
} catch (error) {
  console.log('❌ Signin exception:', error);
}

// Step 3: Check session after signin
console.log('\n3️⃣ Checking Session After Signin...');
try {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    console.log('❌ Post-signin session check error:', sessionError);
  } else {
    console.log('✅ Post-signin session check successful');
    console.log('Session:', sessionData.session ? 'Active' : 'None');
    if (sessionData.session) {
      console.log('User email:', sessionData.session.user.email);
    }
  }
} catch (error) {
  console.log('❌ Post-signin session check exception:', error);
}

// Step 4: Test profile fetch
console.log('\n4️⃣ Testing Profile Fetch...');
try {
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', testEmail)
    .single();

  if (profileError) {
    console.log('❌ Profile fetch error:', profileError);
    console.log('Error message:', profileError.message);
    console.log('Error code:', profileError.code);
  } else {
    console.log('✅ Profile fetch successful!');
    console.log('Profile data:', profileData);
  }
} catch (error) {
  console.log('❌ Profile fetch exception:', error);
}

// Step 5: Test signout
console.log('\n5️⃣ Testing Signout...');
try {
  const { error: signoutError } = await supabase.auth.signOut();
  
  if (signoutError) {
    console.log('❌ Signout error:', signoutError);
  } else {
    console.log('✅ Signout successful!');
  }
} catch (error) {
  console.log('❌ Signout exception:', error);
}

console.log('\n🎉 Signin test complete!');
console.log('\nNext steps:');
console.log('1. Check the console output above for any errors');
console.log('2. If signin fails, check your email and password');
console.log('3. If profile fetch fails, check the database schema');
console.log('4. Try signing in through the UI and check for errors'); 