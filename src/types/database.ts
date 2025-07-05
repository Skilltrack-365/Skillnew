/*
  # Database Types for Skilltrack-365 Labs
  
  This file contains TypeScript types that match the database schema
  for type safety across the application.
*/

// Enum types matching database enums
export type UserRole = 'student' | 'instructor' | 'admin';
export type EnrollmentStatus = 'active' | 'completed' | 'cancelled';
export type LabSessionStatus = 'starting' | 'active' | 'paused' | 'completed' | 'expired';
export type AssessmentType = 'quiz' | 'assignment' | 'final_exam';
export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'code';
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'credit_card' | 'paypal' | 'stripe' | 'bank_transfer';
export type NotificationType = 'email' | 'push' | 'in_app' | 'sms';
export type NotificationStatus = 'sent' | 'delivered' | 'read' | 'failed';
export type ActivityType = 'login' | 'course_start' | 'course_complete' | 'lab_start' | 'lab_complete' | 'assessment_start' | 'assessment_complete' | 'payment' | 'enrollment';
export type FileType = 'image' | 'document' | 'video' | 'audio' | 'archive' | 'code';
export type EnvironmentStatus = 'creating' | 'running' | 'paused' | 'stopped' | 'error' | 'deleted';

// Base table types
export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: UserRole;
  company?: string;
  experience_level: DifficultyLevel;
  bio?: string;
  phone?: string;
  timezone: string;
  language: string;
  notification_preferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  preferences: Record<string, any>;
  last_login?: string;
  login_count: number;
  is_verified: boolean;
  subscription_tier: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  image_url?: string;
  is_active: boolean;
  sort_order: number;
  color?: string;
  featured: boolean;
  course_count: number;
  student_count: number;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  service_id: string;
  slug: string;
  title: string;
  description: string;
  duration: string;
  level: DifficultyLevel;
  price: number;
  instructor_id?: string;
  rating: number;
  student_count: number;
  image_url?: string;
  features: string[];
  objectives: string[];
  prerequisites: string[];
  video_url?: string;
  preview_video_url?: string;
  certificate_template_id?: string;
  max_students?: number;
  start_date?: string;
  end_date?: string;
  enrollment_deadline?: string;
  tags: string[];
  language: string;
  subtitles: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface LabCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  lab_count: number;
  created_at: string;
  updated_at: string;
}

export interface Lab {
  id: string;
  category_id?: string;
  slug: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  duration: string;
  technology: string[];
  provider: string;
  rating: number;
  student_count: number;
  image_url?: string;
  features: string[];
  objectives: string[];
  prerequisites: string[];
  instructions?: string;
  environment_template?: string;
  docker_image?: string;
  resource_requirements: {
    cpu: number;
    memory: number;
    storage: number;
  };
  max_concurrent_users: number;
  estimated_cost: number;
  setup_instructions?: string;
  cleanup_instructions?: string;
  related_courses: string[];
  is_popular: boolean;
  is_free: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  status: EnrollmentStatus;
  enrolled_at: string;
  completed_at?: string;
  progress_percentage: number;
}

export interface LabSession {
  id: string;
  user_id: string;
  lab_id: string;
  session_id: string;
  status: LabSessionStatus;
  started_at: string;
  ended_at?: string;
  duration_minutes?: number;
  environment_data: Record<string, any>;
  progress_data: Record<string, any>;
  environment_id?: string;
  resource_usage: Record<string, any>;
  cost_estimate: number;
  auto_save_enabled: boolean;
  last_activity: string;
}

export interface Assessment {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  type: AssessmentType;
  time_limit_minutes?: number;
  max_attempts: number;
  passing_score: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface AssessmentQuestion {
  id: string;
  assessment_id: string;
  question_text: string;
  question_type: QuestionType;
  options: Record<string, any>;
  correct_answer?: string;
  points: number;
  explanation?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface UserAssessmentAttempt {
  id: string;
  user_id: string;
  assessment_id: string;
  attempt_number: number;
  started_at: string;
  completed_at?: string;
  score?: number;
  passed: boolean;
  time_taken_minutes?: number;
}

export interface UserAssessmentAnswer {
  id: string;
  attempt_id: string;
  question_id: string;
  answer_text?: string;
  is_correct?: boolean;
  points_earned: number;
  created_at: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  course_id: string;
  certificate_number: string;
  issued_at: string;
  certificate_url?: string;
  is_valid: boolean;
}

export interface ContentUpload {
  id: string;
  uploader_id: string;
  filename: string;
  original_filename: string;
  file_size: number;
  mime_type: string;
  file_url: string;
  entity_type?: string;
  entity_id?: string;
  created_at: string;
}

// New tables from comprehensive schema
export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  duration_minutes?: number;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourseLesson {
  id: string;
  module_id: string;
  title: string;
  description?: string;
  content_type: string;
  content_url?: string;
  duration_minutes?: number;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  course_id: string;
  module_id?: string;
  lesson_id?: string;
  progress_percentage: number;
  time_spent_minutes: number;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CloudEnvironment {
  id: string;
  user_id: string;
  lab_id: string;
  session_id: string;
  environment_id?: string;
  status: EnvironmentStatus;
  template_name: string;
  resource_config: {
    cpu: number;
    memory: number;
    storage: number;
  };
  created_at: string;
  started_at?: string;
  stopped_at?: string;
  last_activity: string;
  auto_stop_minutes: number;
}

export interface UserFile {
  id: string;
  user_id: string;
  environment_id: string;
  filename: string;
  original_filename: string;
  file_path: string;
  file_type: FileType;
  file_size: number;
  mime_type: string;
  is_directory: boolean;
  parent_directory_id?: string;
  created_at: string;
  updated_at: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: ActivityType;
  entity_type?: string;
  entity_id?: string;
  metadata: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  course_id?: string;
  amount: number;
  currency: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  stripe_payment_intent_id?: string;
  paypal_payment_id?: string;
  billing_address?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_name: string;
  plan_price: number;
  billing_cycle: string;
  status: string;
  stripe_subscription_id?: string;
  current_period_start?: string;
  current_period_end?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  notification_type: NotificationType;
  notification_status: NotificationStatus;
  entity_type?: string;
  entity_id?: string;
  read_at?: string;
  created_at: string;
}

export interface CourseReview {
  id: string;
  user_id: string;
  course_id: string;
  rating: number;
  review_text?: string;
  is_verified_purchase: boolean;
  helpful_votes: number;
  created_at: string;
  updated_at: string;
}

export interface LabReview {
  id: string;
  user_id: string;
  lab_id: string;
  rating: number;
  review_text?: string;
  difficulty_rating?: number;
  time_accuracy_rating?: number;
  helpful_votes: number;
  created_at: string;
  updated_at: string;
}

export interface UserBookmark {
  id: string;
  user_id: string;
  entity_type: string;
  entity_id: string;
  created_at: string;
}

export interface CoursePrerequisite {
  id: string;
  course_id: string;
  prerequisite_course_id: string;
  created_at: string;
}

export interface LabPrerequisite {
  id: string;
  lab_id: string;
  prerequisite_lab_id: string;
  created_at: string;
}

export interface CourseTag {
  id: string;
  name: string;
  description?: string;
  color?: string;
  created_at: string;
}

export interface CourseTagRelationship {
  id: string;
  course_id: string;
  tag_id: string;
  created_at: string;
}

export interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  description?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsEvent {
  id: string;
  user_id: string;
  event_name: string;
  event_data: Record<string, any>;
  session_id?: string;
  page_url?: string;
  referrer?: string;
  user_agent?: string;
  ip_address?: string;
  created_at: string;
}

// Database schema type
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      services: {
        Row: Service;
        Insert: Omit<Service, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Service, 'id' | 'created_at' | 'updated_at'>>;
      };
      courses: {
        Row: Course;
        Insert: Omit<Course, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Course, 'id' | 'created_at' | 'updated_at'>>;
      };
      lab_categories: {
        Row: LabCategory;
        Insert: Omit<LabCategory, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<LabCategory, 'id' | 'created_at' | 'updated_at'>>;
      };
      labs: {
        Row: Lab;
        Insert: Omit<Lab, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Lab, 'id' | 'created_at' | 'updated_at'>>;
      };
      enrollments: {
        Row: Enrollment;
        Insert: Omit<Enrollment, 'id'>;
        Update: Partial<Omit<Enrollment, 'id'>>;
      };
      lab_sessions: {
        Row: LabSession;
        Insert: Omit<LabSession, 'id'>;
        Update: Partial<Omit<LabSession, 'id'>>;
      };
      assessments: {
        Row: Assessment;
        Insert: Omit<Assessment, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Assessment, 'id' | 'created_at' | 'updated_at'>>;
      };
      assessment_questions: {
        Row: AssessmentQuestion;
        Insert: Omit<AssessmentQuestion, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<AssessmentQuestion, 'id' | 'created_at' | 'updated_at'>>;
      };
      user_assessment_attempts: {
        Row: UserAssessmentAttempt;
        Insert: Omit<UserAssessmentAttempt, 'id'>;
        Update: Partial<Omit<UserAssessmentAttempt, 'id'>>;
      };
      user_assessment_answers: {
        Row: UserAssessmentAnswer;
        Insert: Omit<UserAssessmentAnswer, 'id' | 'created_at'>;
        Update: Partial<Omit<UserAssessmentAnswer, 'id' | 'created_at'>>;
      };
      certificates: {
        Row: Certificate;
        Insert: Omit<Certificate, 'id'>;
        Update: Partial<Omit<Certificate, 'id'>>;
      };
      content_uploads: {
        Row: ContentUpload;
        Insert: Omit<ContentUpload, 'id' | 'created_at'>;
        Update: Partial<Omit<ContentUpload, 'id' | 'created_at'>>;
      };
      course_modules: {
        Row: CourseModule;
        Insert: Omit<CourseModule, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<CourseModule, 'id' | 'created_at' | 'updated_at'>>;
      };
      course_lessons: {
        Row: CourseLesson;
        Insert: Omit<CourseLesson, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<CourseLesson, 'id' | 'created_at' | 'updated_at'>>;
      };
      user_progress: {
        Row: UserProgress;
        Insert: Omit<UserProgress, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserProgress, 'id' | 'created_at' | 'updated_at'>>;
      };
      cloud_environments: {
        Row: CloudEnvironment;
        Insert: Omit<CloudEnvironment, 'id' | 'created_at'>;
        Update: Partial<Omit<CloudEnvironment, 'id' | 'created_at'>>;
      };
      user_files: {
        Row: UserFile;
        Insert: Omit<UserFile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserFile, 'id' | 'created_at' | 'updated_at'>>;
      };
      user_activities: {
        Row: UserActivity;
        Insert: Omit<UserActivity, 'id' | 'created_at'>;
        Update: Partial<Omit<UserActivity, 'id' | 'created_at'>>;
      };
      payments: {
        Row: Payment;
        Insert: Omit<Payment, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Payment, 'id' | 'created_at' | 'updated_at'>>;
      };
      subscriptions: {
        Row: Subscription;
        Insert: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Subscription, 'id' | 'created_at' | 'updated_at'>>;
      };
      notifications: {
        Row: Notification;
        Insert: Omit<Notification, 'id' | 'created_at'>;
        Update: Partial<Omit<Notification, 'id' | 'created_at'>>;
      };
      course_reviews: {
        Row: CourseReview;
        Insert: Omit<CourseReview, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<CourseReview, 'id' | 'created_at' | 'updated_at'>>;
      };
      lab_reviews: {
        Row: LabReview;
        Insert: Omit<LabReview, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<LabReview, 'id' | 'created_at' | 'updated_at'>>;
      };
      user_bookmarks: {
        Row: UserBookmark;
        Insert: Omit<UserBookmark, 'id' | 'created_at'>;
        Update: Partial<Omit<UserBookmark, 'id' | 'created_at'>>;
      };
      course_prerequisites: {
        Row: CoursePrerequisite;
        Insert: Omit<CoursePrerequisite, 'id' | 'created_at'>;
        Update: Partial<Omit<CoursePrerequisite, 'id' | 'created_at'>>;
      };
      lab_prerequisites: {
        Row: LabPrerequisite;
        Insert: Omit<LabPrerequisite, 'id' | 'created_at'>;
        Update: Partial<Omit<LabPrerequisite, 'id' | 'created_at'>>;
      };
      course_tags: {
        Row: CourseTag;
        Insert: Omit<CourseTag, 'id' | 'created_at'>;
        Update: Partial<Omit<CourseTag, 'id' | 'created_at'>>;
      };
      course_tag_relationships: {
        Row: CourseTagRelationship;
        Insert: Omit<CourseTagRelationship, 'id' | 'created_at'>;
        Update: Partial<Omit<CourseTagRelationship, 'id' | 'created_at'>>;
      };
      system_settings: {
        Row: SystemSetting;
        Insert: Omit<SystemSetting, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SystemSetting, 'id' | 'created_at' | 'updated_at'>>;
      };
      analytics_events: {
        Row: AnalyticsEvent;
        Insert: Omit<AnalyticsEvent, 'id' | 'created_at'>;
        Update: Partial<Omit<AnalyticsEvent, 'id' | 'created_at'>>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
      enrollment_status: EnrollmentStatus;
      lab_session_status: LabSessionStatus;
      assessment_type: AssessmentType;
      question_type: QuestionType;
      difficulty_level: DifficultyLevel;
      payment_status: PaymentStatus;
      payment_method: PaymentMethod;
      notification_type: NotificationType;
      notification_status: NotificationStatus;
      activity_type: ActivityType;
      file_type: FileType;
      environment_status: EnvironmentStatus;
    };
  };
} 