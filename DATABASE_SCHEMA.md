# Database Schema Documentation

## Overview

This document describes the comprehensive database schema for Skilltrack-365 Labs, a cloud-based learning platform with hands-on labs, courses, and interactive environments.

## Database Architecture

The database is built on PostgreSQL with Supabase, featuring:
- **Row Level Security (RLS)** for data protection
- **Real-time subscriptions** for live updates
- **Automatic triggers** for data consistency
- **Comprehensive indexing** for performance
- **Type-safe TypeScript integration**

## Core Tables

### 1. Profiles (`profiles`)
Extends Supabase auth.users with additional user information.

```sql
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  role user_role DEFAULT 'student',
  company text,
  experience_level difficulty_level DEFAULT 'Beginner',
  bio text,
  phone text,
  timezone text DEFAULT 'UTC',
  language text DEFAULT 'en',
  notification_preferences jsonb DEFAULT '{"email": true, "push": true, "sms": false}',
  preferences jsonb DEFAULT '{}',
  last_login timestamptz,
  login_count integer DEFAULT 0,
  is_verified boolean DEFAULT false,
  subscription_tier text DEFAULT 'free',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**Key Features:**
- User role management (student, instructor, admin)
- Experience level tracking
- Notification preferences
- Subscription tier tracking
- Multi-language support

### 2. Services (`services`)
Main service categories for organizing courses.

```sql
CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  image_url text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  color text,
  featured boolean DEFAULT false,
  course_count integer DEFAULT 0,
  student_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**Examples:**
- AI & Machine Learning
- Software Development
- Cloud Solutions
- Cybersecurity

### 3. Courses (`courses`)
Individual courses within services.

```sql
CREATE TABLE courses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  duration text NOT NULL,
  level difficulty_level NOT NULL,
  price decimal(10,2) NOT NULL DEFAULT 0,
  instructor_id uuid REFERENCES profiles(id),
  rating decimal(3,2) DEFAULT 0,
  student_count integer DEFAULT 0,
  image_url text,
  features text[] DEFAULT '{}',
  objectives text[] DEFAULT '{}',
  prerequisites text[] DEFAULT '{}',
  video_url text,
  preview_video_url text,
  certificate_template_id uuid,
  max_students integer,
  start_date timestamptz,
  end_date timestamptz,
  enrollment_deadline timestamptz,
  tags text[] DEFAULT '{}',
  language text DEFAULT 'en',
  subtitles text[] DEFAULT '{}',
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**Key Features:**
- Structured content with modules and lessons
- Multi-language support with subtitles
- Certificate generation
- Enrollment limits and deadlines
- Tag-based categorization

### 4. Course Modules (`course_modules`)
Organized content structure within courses.

```sql
CREATE TABLE course_modules (
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
```

### 5. Course Lessons (`course_lessons`)
Individual lessons within modules.

```sql
CREATE TABLE course_lessons (
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
```

### 6. Lab Categories (`lab_categories`)
Categories for organizing hands-on labs.

```sql
CREATE TABLE lab_categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  lab_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**Examples:**
- Cloud Computing
- DevOps
- Cybersecurity
- Data Science
- Web Development

### 7. Labs (`labs`)
Hands-on lab exercises with cloud environments.

```sql
CREATE TABLE labs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id uuid REFERENCES lab_categories(id) ON DELETE SET NULL,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  difficulty difficulty_level NOT NULL,
  duration text NOT NULL,
  technology text[] DEFAULT '{}',
  provider text NOT NULL,
  rating decimal(3,2) DEFAULT 0,
  student_count integer DEFAULT 0,
  image_url text,
  features text[] DEFAULT '{}',
  objectives text[] DEFAULT '{}',
  prerequisites text[] DEFAULT '{}',
  instructions text,
  environment_template text,
  docker_image text,
  resource_requirements jsonb DEFAULT '{"cpu": 1, "memory": 2, "storage": 10}',
  max_concurrent_users integer DEFAULT 100,
  estimated_cost decimal(10,4) DEFAULT 0,
  setup_instructions text,
  cleanup_instructions text,
  related_courses uuid[] DEFAULT '{}',
  is_popular boolean DEFAULT false,
  is_free boolean DEFAULT false,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**Key Features:**
- Cloud environment templates
- Resource requirements tracking
- Cost estimation
- Concurrent user limits
- Integration with courses

## User Interaction Tables

### 8. Enrollments (`enrollments`)
User course enrollments and progress tracking.

```sql
CREATE TABLE enrollments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  status enrollment_status DEFAULT 'active',
  enrolled_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  progress_percentage integer DEFAULT 0,
  UNIQUE(user_id, course_id)
);
```

### 9. User Progress (`user_progress`)
Detailed progress tracking for lessons and modules.

```sql
CREATE TABLE user_progress (
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
```

### 10. Lab Sessions (`lab_sessions`)
Active lab sessions with environment data.

```sql
CREATE TABLE lab_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  lab_id uuid REFERENCES labs(id) ON DELETE CASCADE,
  session_id text UNIQUE NOT NULL,
  status lab_session_status DEFAULT 'starting',
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  duration_minutes integer,
  environment_data jsonb DEFAULT '{}',
  progress_data jsonb DEFAULT '{}',
  environment_id text,
  resource_usage jsonb DEFAULT '{}',
  cost_estimate decimal(10,4) DEFAULT 0,
  auto_save_enabled boolean DEFAULT true,
  last_activity timestamptz DEFAULT now()
);
```

### 11. Cloud Environments (`cloud_environments`)
Cloud sandbox environment management.

```sql
CREATE TABLE cloud_environments (
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
```

## Assessment System

### 12. Assessments (`assessments`)
Course assessments and quizzes.

```sql
CREATE TABLE assessments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  type assessment_type NOT NULL,
  time_limit_minutes integer,
  max_attempts integer DEFAULT 1,
  passing_score integer DEFAULT 70,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### 13. Assessment Questions (`assessment_questions`)
Individual questions for assessments.

```sql
CREATE TABLE assessment_questions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id uuid REFERENCES assessments(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  question_type question_type NOT NULL,
  options jsonb DEFAULT '{}', -- For multiple choice options
  correct_answer text,
  points integer DEFAULT 1,
  explanation text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### 14. User Assessment Attempts (`user_assessment_attempts`)
User attempts at assessments.

```sql
CREATE TABLE user_assessment_attempts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  assessment_id uuid REFERENCES assessments(id) ON DELETE CASCADE,
  attempt_number integer NOT NULL,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  score integer,
  passed boolean DEFAULT false,
  time_taken_minutes integer,
  UNIQUE(user_id, assessment_id, attempt_number)
);
```

### 15. User Assessment Answers (`user_assessment_answers`)
Individual answers from users.

```sql
CREATE TABLE user_assessment_answers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id uuid REFERENCES user_assessment_attempts(id) ON DELETE CASCADE,
  question_id uuid REFERENCES assessment_questions(id) ON DELETE CASCADE,
  answer_text text,
  is_correct boolean,
  points_earned integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
```

## Review and Rating System

### 16. Course Reviews (`course_reviews`)
User reviews and ratings for courses.

```sql
CREATE TABLE course_reviews (
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
```

### 17. Lab Reviews (`lab_reviews`)
User reviews and ratings for labs.

```sql
CREATE TABLE lab_reviews (
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
```

## Payment and Subscription System

### 18. Payments (`payments`)
Payment tracking for courses and subscriptions.

```sql
CREATE TABLE payments (
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
```

### 19. Subscriptions (`subscriptions`)
User subscription management.

```sql
CREATE TABLE subscriptions (
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
```

## File Management System

### 20. User Files (`user_files`)
File management for cloud environments.

```sql
CREATE TABLE user_files (
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
```

### 21. Content Uploads (`content_uploads`)
General file uploads for courses and labs.

```sql
CREATE TABLE content_uploads (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  uploader_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  filename text NOT NULL,
  original_filename text NOT NULL,
  file_size bigint NOT NULL,
  mime_type text NOT NULL,
  file_url text NOT NULL,
  entity_type text, -- 'course', 'lab', 'assessment', etc.
  entity_id uuid,
  created_at timestamptz DEFAULT now()
);
```

## Notification System

### 22. Notifications (`notifications`)
User notification management.

```sql
CREATE TABLE notifications (
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
```

## Analytics and Activity Tracking

### 23. User Activities (`user_activities`)
User activity logging for analytics.

```sql
CREATE TABLE user_activities (
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
```

### 24. Analytics Events (`analytics_events`)
Detailed analytics event tracking.

```sql
CREATE TABLE analytics_events (
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
```

## Supporting Tables

### 25. User Bookmarks (`user_bookmarks`)
User favorites and bookmarks.

```sql
CREATE TABLE user_bookmarks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  entity_type text NOT NULL, -- 'course', 'lab', 'service'
  entity_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, entity_type, entity_id)
);
```

### 26. Course Tags (`course_tags`)
Tag system for course categorization.

```sql
CREATE TABLE course_tags (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text UNIQUE NOT NULL,
  description text,
  color text,
  created_at timestamptz DEFAULT now()
);
```

### 27. Course Tag Relationships (`course_tag_relationships`)
Many-to-many relationship between courses and tags.

```sql
CREATE TABLE course_tag_relationships (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES course_tags(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(course_id, tag_id)
);
```

### 28. Prerequisites (`course_prerequisites`, `lab_prerequisites`)
Prerequisite relationships between courses and labs.

```sql
CREATE TABLE course_prerequisites (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  prerequisite_course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(course_id, prerequisite_course_id)
);

CREATE TABLE lab_prerequisites (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  lab_id uuid REFERENCES labs(id) ON DELETE CASCADE,
  prerequisite_lab_id uuid REFERENCES labs(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(lab_id, prerequisite_lab_id)
);
```

### 29. System Settings (`system_settings`)
Platform configuration and settings.

```sql
CREATE TABLE system_settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb NOT NULL,
  description text,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### 30. Certificates (`certificates`)
Generated certificates for course completion.

```sql
CREATE TABLE certificates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  certificate_number text UNIQUE NOT NULL,
  issued_at timestamptz DEFAULT now(),
  certificate_url text,
  is_valid boolean DEFAULT true
);
```

## Enum Types

```sql
-- User roles
CREATE TYPE user_role AS ENUM ('student', 'instructor', 'admin');

-- Enrollment status
CREATE TYPE enrollment_status AS ENUM ('active', 'completed', 'cancelled');

-- Lab session status
CREATE TYPE lab_session_status AS ENUM ('starting', 'active', 'paused', 'completed', 'expired');

-- Assessment types
CREATE TYPE assessment_type AS ENUM ('quiz', 'assignment', 'final_exam');

-- Question types
CREATE TYPE question_type AS ENUM ('multiple_choice', 'true_false', 'short_answer', 'essay', 'code');

-- Difficulty levels
CREATE TYPE difficulty_level AS ENUM ('Beginner', 'Intermediate', 'Advanced');

-- Payment status
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Payment methods
CREATE TYPE payment_method AS ENUM ('credit_card', 'paypal', 'stripe', 'bank_transfer');

-- Notification types
CREATE TYPE notification_type AS ENUM ('email', 'push', 'in_app', 'sms');

-- Notification status
CREATE TYPE notification_status AS ENUM ('sent', 'delivered', 'read', 'failed');

-- Activity types
CREATE TYPE activity_type AS ENUM ('login', 'course_start', 'course_complete', 'lab_start', 'lab_complete', 'assessment_start', 'assessment_complete', 'payment', 'enrollment');

-- File types
CREATE TYPE file_type AS ENUM ('image', 'document', 'video', 'audio', 'archive', 'code');

-- Environment status
CREATE TYPE environment_status AS ENUM ('creating', 'running', 'paused', 'stopped', 'error', 'deleted');
```

## Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:

- **User data**: Users can only access their own data
- **Public content**: Anyone can read published courses and labs
- **Instructor access**: Instructors can manage their own courses
- **Admin access**: Admins have full access to all data
- **Analytics**: Only admins can view analytics data

## Triggers and Functions

### Auto-update timestamps
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Auto-create profile on signup
```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Update course/lab ratings
```sql
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
```

### Update student counts
```sql
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
```

## Indexes

Performance indexes for common queries:

```sql
-- User progress tracking
CREATE INDEX idx_user_progress_user_course ON user_progress(user_id, course_id);

-- Lab sessions
CREATE INDEX idx_lab_sessions_user_lab ON lab_sessions(user_id, lab_id);

-- Cloud environments
CREATE INDEX idx_cloud_environments_user_status ON cloud_environments(user_id, status);

-- User activities
CREATE INDEX idx_user_activities_user_type ON user_activities(user_id, activity_type);

-- Payments
CREATE INDEX idx_payments_user_status ON payments(user_id, payment_status);

-- Notifications
CREATE INDEX idx_notifications_user_status ON notifications(user_id, notification_status);

-- Reviews
CREATE INDEX idx_course_reviews_course_rating ON course_reviews(course_id, rating);
CREATE INDEX idx_lab_reviews_lab_rating ON lab_reviews(lab_id, rating);

-- Analytics
CREATE INDEX idx_analytics_events_user_time ON analytics_events(user_id, created_at);

-- File management
CREATE INDEX idx_user_files_user_path ON user_files(user_id, file_path);
```

## Usage Examples

### Creating a new course
```typescript
const newCourse = await supabase
  .from('courses')
  .insert({
    service_id: 'ai-ml-service-id',
    slug: 'machine-learning-basics',
    title: 'Machine Learning Basics',
    description: 'Learn the fundamentals of ML',
    duration: '8 weeks',
    level: 'Beginner',
    price: 299,
    features: ['Linear Regression', 'Classification', 'Model Evaluation'],
    objectives: ['Understand ML concepts', 'Build basic models'],
    prerequisites: ['Python basics', 'Statistics fundamentals'],
    is_published: true
  })
  .select()
  .single();
```

### Starting a lab session
```typescript
const labSession = await supabase
  .from('lab_sessions')
  .insert({
    user_id: userId,
    lab_id: labId,
    session_id: `session_${Date.now()}`,
    status: 'starting'
  })
  .select()
  .single();
```

### Tracking user progress
```typescript
const progress = await supabase
  .from('user_progress')
  .upsert({
    user_id: userId,
    course_id: courseId,
    lesson_id: lessonId,
    progress_percentage: 100,
    time_spent_minutes: 45,
    completed_at: new Date().toISOString()
  })
  .select()
  .single();
```

### Adding a course review
```typescript
const review = await supabase
  .from('course_reviews')
  .insert({
    user_id: userId,
    course_id: courseId,
    rating: 5,
    review_text: 'Excellent course with hands-on labs!',
    is_verified_purchase: true
  })
  .select()
  .single();
```

## Data Relationships

### Course Structure
```
Service → Courses → Course Modules → Course Lessons
```

### Lab Structure
```
Lab Category → Labs → Lab Sessions → Cloud Environments
```

### User Journey
```
User → Enrollments → User Progress → Certificates
User → Lab Sessions → Cloud Environments → User Files
```

### Assessment Flow
```
Assessment → Assessment Questions → User Attempts → User Answers
```

## Security Considerations

1. **Row Level Security**: All tables have RLS policies
2. **User Isolation**: Users can only access their own data
3. **Content Protection**: Unpublished content is protected
4. **Payment Security**: Payment data is handled securely
5. **File Access**: File access is restricted to owners
6. **Analytics Privacy**: Analytics data is anonymized where possible

## Performance Optimization

1. **Indexing**: Strategic indexes on frequently queried columns
2. **Pagination**: Large result sets are paginated
3. **Caching**: Frequently accessed data is cached
4. **Connection Pooling**: Database connections are pooled
5. **Query Optimization**: Complex queries are optimized
6. **Real-time**: Real-time subscriptions for live updates

## Migration Strategy

1. **Backward Compatibility**: Schema changes maintain compatibility
2. **Data Migration**: Automated data migration scripts
3. **Rollback Plan**: Ability to rollback schema changes
4. **Testing**: Comprehensive testing of schema changes
5. **Documentation**: Updated documentation for all changes

This comprehensive database schema provides a solid foundation for the Skilltrack-365 Labs platform, supporting all features from basic course management to advanced cloud sandbox environments. 