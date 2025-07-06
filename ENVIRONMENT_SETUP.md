# Environment Setup Guide

## Quick Setup

Your project needs Supabase credentials to work properly. Follow these steps:

### 1. Create Environment File

Create a `.env` file in your project root with the following content:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 2. Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** → Paste as `VITE_SUPABASE_URL`
   - **anon public** key → Paste as `VITE_SUPABASE_ANON_KEY`

### 3. Example Configuration

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdC1pZCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjM5NzQ5NjAwLCJleHAiOjE5NTUzMjU2MDB9.your-key-here
```

### 4. Restart Development Server

After creating the `.env` file, restart your development server:

```bash
npm run dev
```

## Troubleshooting

### Error: "Missing Supabase environment variables"

This means your `.env` file is missing or the variables are not set correctly.

**Solution:**
1. Check that `.env` file exists in project root
2. Verify variable names start with `VITE_`
3. Make sure there are no spaces around the `=` sign
4. Restart the development server

### Error: "Invalid API key" or "Project not found"

This means your Supabase credentials are incorrect.

**Solution:**
1. Double-check your Project URL and API key from Supabase dashboard
2. Make sure you're using the **anon public** key, not the service role key
3. Verify your project is active in Supabase dashboard

### Database Connection Issues

If you can sign up but get database errors:

1. Apply the database migrations from `supabase/migrations/`
2. Run the quick fix SQL from `quick-fix.sql` in your Supabase SQL editor
3. Check the browser console for specific error messages

## Security Notes

- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore`
- Only use the **anon public** key for frontend applications
- Keep your service role key secure and only use it for backend operations

## Next Steps

After setting up the environment:

1. Test user registration and login
2. Check if the database schema is properly applied
3. Verify that the admin panel works (if you have admin access)
4. Test the contact form functionality

If you encounter any issues, check the browser console for error messages and refer to the troubleshooting section above. 