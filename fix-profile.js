// Fix Profile Loading Issue
// Copy and paste this into your browser console to manually create/fix your profile

console.log('🔧 Fixing Profile Loading Issue...\n');

// Get Supabase client
const { createClient } = await import('https://esm.sh/@supabase/supabase-js');
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Step 1: Get current user
console.log('1️⃣ Getting current user...');
const { data: userData, error: userError } = await supabase.auth.getUser();

if (userError) {
  console.log('❌ Error getting user:', userError);
} else if (!userData.user) {
  console.log('❌ No user found. Please sign in first.');
} else {
  console.log('✅ User found:', userData.user.email);
  const userId = userData.user.id;
  
  // Step 2: Check if profile exists
  console.log('\n2️⃣ Checking if profile exists...');
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (profileError) {
    console.log('❌ Profile not found, creating one...');
    
    // Step 3: Create profile
    const newProfile = {
      id: userId,
      email: userData.user.email,
      full_name: userData.user.user_metadata?.full_name || '',
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
    
    const { data: createdProfile, error: createError } = await supabase
      .from('profiles')
      .insert(newProfile)
      .select()
      .single();
    
    if (createError) {
      console.log('❌ Error creating profile:', createError);
    } else {
      console.log('✅ Profile created successfully:', createdProfile);
    }
  } else {
    console.log('✅ Profile already exists:', profileData);
  }
}

console.log('\n🎉 Profile fix complete!');
console.log('Refresh the page to see the updated auth state.'); 