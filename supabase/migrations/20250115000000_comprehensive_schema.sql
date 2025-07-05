/*
  # Comprehensive Database Schema for Skilltrack-365 Labs
  
  This migration enhances the existing schema with additional tables and fields
  to support the complete cloud sandbox platform functionality.
  
  New Features Added:
  - Cloud environment management
  - User activity tracking
  - Payment and billing
  - Enhanced content management
  - Analytics and reporting
  - Notification system
  - User preferences and settings
*/

-- Additional enum types for enhanced functionality
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE payment_method AS ENUM ('credit_card', 'paypal', 'stripe', 'bank_transfer');
CREATE TYPE notification_type AS ENUM ('email', 'push', 'in_app', 'sms');
CREATE TYPE notification_status AS ENUM ('sent', 'delivered', 'read', 'failed');
CREATE TYPE activity_type AS ENUM ('login', 'course_start', 'course_complete', 'lab_start', 'lab_complete', 'assessment_start', 'assessment_complete', 'payment', 'enrollment');
CREATE TYPE file_type AS ENUM ('image', 'document', 'video', 'audio', 'archive', 'code');
CREATE TYPE environment_status AS ENUM ('creating', 'running', 'paused', 'stopped', 'error', 'deleted');

-- Enhanced profiles table with additional fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS timezone text DEFAULT 'UTC';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS language text DEFAULT 'en';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notification_preferences jsonb DEFAULT '{"email": true, "push": true, "sms": false}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferences jsonb DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login timestamptz;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS login_count integer DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_tier text DEFAULT 'free';

-- Enhanced services table
ALTER TABLE services ADD COLUMN IF NOT EXISTS color text;
ALTER TABLE services ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;
ALTER TABLE services ADD COLUMN IF NOT EXISTS course_count integer DEFAULT 0;
ALTER TABLE services ADD COLUMN IF NOT EXISTS student_count integer DEFAULT 0;

-- Enhanced courses table
ALTER TABLE courses ADD COLUMN IF NOT EXISTS video_url text;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS preview_video_url text;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS certificate_template_id uuid;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS max_students integer;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS start_date timestamptz;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS end_date timestamptz;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS enrollment_deadline timestamptz;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS language text DEFAULT 'en';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS subtitles text[] DEFAULT '{}';

-- Enhanced labs table
ALTER TABLE labs ADD COLUMN IF NOT EXISTS environment_template text;
ALTER TABLE labs ADD COLUMN IF NOT EXISTS docker_image text;
ALTER TABLE labs ADD COLUMN IF NOT EXISTS resource_requirements jsonb DEFAULT '{"cpu": 1, "memory": 2, "storage": 10}';
ALTER TABLE labs ADD COLUMN IF NOT EXISTS max_concurrent_users integer DEFAULT 100;
ALTER TABLE labs ADD COLUMN IF NOT EXISTS estimated_cost decimal(10,4) DEFAULT 0;
ALTER TABLE labs ADD COLUMN IF NOT EXISTS setup_instructions text;
ALTER TABLE labs ADD COLUMN IF NOT EXISTS cleanup_instructions text;
ALTER TABLE labs ADD COLUMN IF NOT EXISTS related_courses uuid[] DEFAULT '{}';

-- Course modules table for structured content
CREATE TABLE IF NOT EXISTS course_modules (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  duration_minutes integer,
  sort_order integer DEFAULT 0,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Course lessons table
CREATE TABLE IF NOT EXISTS course_lessons (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id uuid REFERENCES course_modules(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  content_type text NOT NULL, -- 'video', 'text', 'quiz', 'lab', 'assignment'
  content_url text,
  duration_minutes integer,
  sort_order integer DEFAULT 0,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User progress tracking
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  module_id uuid REFERENCES course_modules(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES course_lessons(id) ON DELETE CASCADE,
  progress_percentage integer DEFAULT 0,
  time_spent_minutes integer DEFAULT 0,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Enhanced lab sessions with cloud environment data
ALTER TABLE lab_sessions ADD COLUMN IF NOT EXISTS environment_id text;
ALTER TABLE lab_sessions ADD COLUMN IF NOT EXISTS resource_usage jsonb DEFAULT '{}';
ALTER TABLE lab_sessions ADD COLUMN IF NOT EXISTS cost_estimate decimal(10,4) DEFAULT 0;
ALTER TABLE lab_sessions ADD COLUMN IF NOT EXISTS auto_save_enabled boolean DEFAULT true;
ALTER TABLE lab_sessions ADD COLUMN IF NOT EXISTS last_activity timestamptz DEFAULT now();

-- Cloud environments table for managing sandbox instances
CREATE TABLE IF NOT EXISTS cloud_environments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  lab_id uuid REFERENCES labs(id) ON DELETE CASCADE,
  session_id text UNIQUE NOT NULL,
  environment_id text UNIQUE,
  status environment_status DEFAULT 'creating',
  template_name text NOT NULL,
  resource_config jsonb NOT NULL DEFAULT '{"cpu": 1, "memory": 2, "storage": 10}',
  created_at timestamptz DEFAULT now(),
  started_at timestamptz,
  stopped_at timestamptz,
  last_activity timestamptz DEFAULT now(),
  auto_stop_minutes integer DEFAULT 120
);

-- User files table for cloud file manager
CREATE TABLE IF NOT EXISTS user_files (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  environment_id uuid REFERENCES cloud_environments(id) ON DELETE CASCADE,
  filename text NOT NULL,
  original_filename text NOT NULL,
  file_path text NOT NULL,
  file_type file_type NOT NULL,
  file_size bigint NOT NULL,
  mime_type text NOT NULL,
  is_directory boolean DEFAULT false,
  parent_directory_id uuid REFERENCES user_files(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User activity log
CREATE TABLE IF NOT EXISTS user_activities (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  activity_type activity_type NOT NULL,
  entity_type text, -- 'course', 'lab', 'assessment', etc.
  entity_id uuid,
  metadata jsonb DEFAULT '{}',
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id),
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  payment_method payment_method NOT NULL,
  payment_status payment_status DEFAULT 'pending',
  stripe_payment_intent_id text,
  paypal_payment_id text,
  billing_address jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  plan_name text NOT NULL,
  plan_price decimal(10,2) NOT NULL,
  billing_cycle text NOT NULL, -- 'monthly', 'yearly'
  status text DEFAULT 'active', -- 'active', 'cancelled', 'expired'
  stripe_subscription_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  notification_type notification_type DEFAULT 'in_app',
  notification_status notification_status DEFAULT 'sent',
  entity_type text,
  entity_id uuid,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Course reviews and ratings
CREATE TABLE IF NOT EXISTS course_reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  is_verified_purchase boolean DEFAULT false,
  helpful_votes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Lab reviews and ratings
CREATE TABLE IF NOT EXISTS lab_reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  lab_id uuid REFERENCES labs(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  difficulty_rating integer CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
  time_accuracy_rating integer CHECK (time_accuracy_rating >= 1 AND time_accuracy_rating <= 5),
  helpful_votes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lab_id)
);

-- User bookmarks/favorites
CREATE TABLE IF NOT EXISTS user_bookmarks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  entity_type text NOT NULL, -- 'course', 'lab', 'service'
  entity_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, entity_type, entity_id)
);

-- Course prerequisites mapping
CREATE TABLE IF NOT EXISTS course_prerequisites (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  prerequisite_course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(course_id, prerequisite_course_id)
);

-- Lab prerequisites mapping
CREATE TABLE IF NOT EXISTS lab_prerequisites (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  lab_id uuid REFERENCES labs(id) ON DELETE CASCADE,
  prerequisite_lab_id uuid REFERENCES labs(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(lab_id, prerequisite_lab_id)
);

-- Course tags
CREATE TABLE IF NOT EXISTS course_tags (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text UNIQUE NOT NULL,
  description text,
  color text,
  created_at timestamptz DEFAULT now()
);

-- Course-tag relationships
CREATE TABLE IF NOT EXISTS course_tag_relationships (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES course_tags(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(course_id, tag_id)
);

-- System settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb NOT NULL,
  description text,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  event_name text NOT NULL,
  event_data jsonb DEFAULT '{}',
  session_id text,
  page_url text,
  referrer text,
  user_agent text,
  ip_address inet,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE cloud_environments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_prerequisites ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_prerequisites ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_tag_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for new tables

-- Course modules policies
CREATE POLICY "Users can view published modules" ON course_modules
  FOR SELECT USING (is_published = true);

CREATE POLICY "Instructors can manage their course modules" ON course_modules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM courses c 
      WHERE c.id = course_modules.course_id 
      AND c.instructor_id = auth.uid()
    )
  );

-- Course lessons policies
CREATE POLICY "Users can view published lessons" ON course_lessons
  FOR SELECT USING (is_published = true);

CREATE POLICY "Instructors can manage their course lessons" ON course_lessons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM course_modules cm
      JOIN courses c ON c.id = cm.course_id
      WHERE cm.id = course_lessons.module_id 
      AND c.instructor_id = auth.uid()
    )
  );

-- User progress policies
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Cloud environments policies
CREATE POLICY "Users can view own environments" ON cloud_environments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own environments" ON cloud_environments
  FOR ALL USING (auth.uid() = user_id);

-- User files policies
CREATE POLICY "Users can view own files" ON user_files
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own files" ON user_files
  FOR ALL USING (auth.uid() = user_id);

-- User activities policies
CREATE POLICY "Users can view own activities" ON user_activities
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activities" ON user_activities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Payments policies
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payments" ON payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Course reviews policies
CREATE POLICY "Anyone can view published reviews" ON course_reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create own reviews" ON course_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON course_reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Lab reviews policies
CREATE POLICY "Anyone can view published lab reviews" ON lab_reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create own lab reviews" ON lab_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lab reviews" ON lab_reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- User bookmarks policies
CREATE POLICY "Users can view own bookmarks" ON user_bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own bookmarks" ON user_bookmarks
  FOR ALL USING (auth.uid() = user_id);

-- Public read policies for reference data
CREATE POLICY "Anyone can view course tags" ON course_tags
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view course tag relationships" ON course_tag_relationships
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view course prerequisites" ON course_prerequisites
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view lab prerequisites" ON lab_prerequisites
  FOR SELECT USING (true);

-- System settings policies
CREATE POLICY "Anyone can view public settings" ON system_settings
  FOR SELECT USING (is_public = true);

CREATE POLICY "Admins can manage all settings" ON system_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Analytics events policies (admin only for privacy)
CREATE POLICY "Admins can view analytics" ON analytics_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can insert own analytics events" ON analytics_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Functions and triggers

-- Function to update course student count
CREATE OR REPLACE FUNCTION update_course_student_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE courses 
    SET student_count = student_count + 1 
    WHERE id = NEW.course_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE courses 
    SET student_count = student_count - 1 
    WHERE id = OLD.course_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for enrollment changes
CREATE TRIGGER update_course_student_count_trigger
  AFTER INSERT OR DELETE ON enrollments
  FOR EACH ROW EXECUTE FUNCTION update_course_student_count();

-- Function to update lab student count
CREATE OR REPLACE FUNCTION update_lab_student_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE labs 
    SET student_count = student_count + 1 
    WHERE id = NEW.lab_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE labs 
    SET student_count = student_count - 1 
    WHERE id = OLD.lab_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for lab session changes
CREATE TRIGGER update_lab_student_count_trigger
  AFTER INSERT OR DELETE ON lab_sessions
  FOR EACH ROW EXECUTE FUNCTION update_lab_student_count();

-- Function to update course rating
CREATE OR REPLACE FUNCTION update_course_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE courses 
  SET rating = (
    SELECT AVG(rating)::decimal(3,2)
    FROM course_reviews 
    WHERE course_id = COALESCE(NEW.course_id, OLD.course_id)
  )
  WHERE id = COALESCE(NEW.course_id, OLD.course_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger for course review changes
CREATE TRIGGER update_course_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON course_reviews
  FOR EACH ROW EXECUTE FUNCTION update_course_rating();

-- Function to update lab rating
CREATE OR REPLACE FUNCTION update_lab_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE labs 
  SET rating = (
    SELECT AVG(rating)::decimal(3,2)
    FROM lab_reviews 
    WHERE lab_id = COALESCE(NEW.lab_id, OLD.lab_id)
  )
  WHERE id = COALESCE(NEW.lab_id, OLD.lab_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger for lab review changes
CREATE TRIGGER update_lab_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON lab_reviews
  FOR EACH ROW EXECUTE FUNCTION update_lab_rating();

-- Function to auto-cleanup expired cloud environments
CREATE OR REPLACE FUNCTION cleanup_expired_environments()
RETURNS void AS $$
BEGIN
  UPDATE cloud_environments 
  SET status = 'deleted'
  WHERE status = 'running' 
    AND last_activity < now() - interval '2 hours'
    AND auto_stop_minutes > 0;
END;
$$ LANGUAGE plpgsql;

-- Insert initial system settings
INSERT INTO system_settings (setting_key, setting_value, description, is_public) VALUES
('platform_name', '"Skilltrack-365 Labs"', 'Platform display name', true),
('max_lab_duration_hours', '4', 'Maximum lab session duration in hours', true),
('auto_save_interval_minutes', '5', 'Auto-save interval for cloud environments', true),
('max_concurrent_labs_per_user', '3', 'Maximum concurrent lab sessions per user', true),
('default_environment_template', '"ubuntu-22.04"', 'Default cloud environment template', true),
('maintenance_mode', 'false', 'Platform maintenance mode', true),
('registration_enabled', 'true', 'User registration enabled', true),
('email_verification_required', 'true', 'Email verification required for registration', true);

-- Insert sample course tags
INSERT INTO course_tags (name, description, color) VALUES
('JavaScript', 'JavaScript programming language', '#f7df1e'),
('Python', 'Python programming language', '#3776ab'),
('React', 'React.js framework', '#61dafb'),
('Node.js', 'Node.js runtime', '#339933'),
('AWS', 'Amazon Web Services', '#ff9900'),
('Docker', 'Containerization technology', '#2496ed'),
('Kubernetes', 'Container orchestration', '#326ce5'),
('Machine Learning', 'Machine learning and AI', '#ff6b6b'),
('Cybersecurity', 'Security and ethical hacking', '#2c3e50'),
('DevOps', 'Development operations', '#6c5ce7');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_course ON user_progress(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_lab_sessions_user_lab ON lab_sessions(user_id, lab_id);
CREATE INDEX IF NOT EXISTS idx_cloud_environments_user_status ON cloud_environments(user_id, status);
CREATE INDEX IF NOT EXISTS idx_user_activities_user_type ON user_activities(user_id, activity_type);
CREATE INDEX IF NOT EXISTS idx_payments_user_status ON payments(user_id, payment_status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_status ON notifications(user_id, notification_status);
CREATE INDEX IF NOT EXISTS idx_course_reviews_course_rating ON course_reviews(course_id, rating);
CREATE INDEX IF NOT EXISTS idx_lab_reviews_lab_rating ON lab_reviews(lab_id, rating);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_time ON analytics_events(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_user_files_user_path ON user_files(user_id, file_path); 