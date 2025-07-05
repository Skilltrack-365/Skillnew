/*
  # Database Service Layer for Skilltrack-365 Labs
  
  This file provides type-safe methods for interacting with the database
  using Supabase client with proper error handling and type safety.
*/

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Profile service
export const profileService = {
  // Get current user profile
  async getCurrentProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  },

  // Update profile
  async updateProfile(updates: Partial<Database['public']['Tables']['profiles']['Update']>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get profile by ID
  async getProfileById(id: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }
};

// Service service
export const serviceService = {
  // Get all services
  async getAllServices() {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (error) throw error;
    return data;
  },

  // Get service by slug
  async getServiceBySlug(slug: string) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  },

  // Get featured services
  async getFeaturedServices() {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('featured', true)
      .eq('is_active', true)
      .order('sort_order');

    if (error) throw error;
    return data;
  }
};

// Course service
export const courseService = {
  // Get all courses
  async getAllCourses() {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        services (*),
        profiles!courses_instructor_id_fkey (*)
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get course by slug
  async getCourseBySlug(slug: string) {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        services (*),
        profiles!courses_instructor_id_fkey (*),
        course_modules (
          *,
          course_lessons (*)
        ),
        course_reviews (
          *,
          profiles (*)
        )
      `)
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error) throw error;
    return data;
  },

  // Get courses by service
  async getCoursesByService(serviceId: string) {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        services (*),
        profiles!courses_instructor_id_fkey (*)
      `)
      .eq('service_id', serviceId)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get popular courses
  async getPopularCourses(limit = 6) {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        services (*),
        profiles!courses_instructor_id_fkey (*)
      `)
      .eq('is_published', true)
      .order('student_count', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Search courses
  async searchCourses(query: string) {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        services (*),
        profiles!courses_instructor_id_fkey (*)
      `)
      .eq('is_published', true)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('student_count', { ascending: false });

    if (error) throw error;
    return data;
  }
};

// Lab service
export const labService = {
  // Get all labs
  async getAllLabs() {
    const { data, error } = await supabase
      .from('labs')
      .select(`
        *,
        lab_categories (*)
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get lab by slug
  async getLabBySlug(slug: string) {
    const { data, error } = await supabase
      .from('labs')
      .select(`
        *,
        lab_categories (*),
        lab_reviews (
          *,
          profiles (*)
        )
      `)
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error) throw error;
    return data;
  },

  // Get labs by category
  async getLabsByCategory(categoryId: string) {
    const { data, error } = await supabase
      .from('labs')
      .select(`
        *,
        lab_categories (*)
      `)
      .eq('category_id', categoryId)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get popular labs
  async getPopularLabs(limit = 6) {
    const { data, error } = await supabase
      .from('labs')
      .select(`
        *,
        lab_categories (*)
      `)
      .eq('is_published', true)
      .eq('is_popular', true)
      .order('student_count', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Get free labs
  async getFreeLabs(limit = 6) {
    const { data, error } = await supabase
      .from('labs')
      .select(`
        *,
        lab_categories (*)
      `)
      .eq('is_published', true)
      .eq('is_free', true)
      .order('student_count', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }
};

// Lab category service
export const labCategoryService = {
  // Get all categories
  async getAllCategories() {
    const { data, error } = await supabase
      .from('lab_categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  },

  // Get category by slug
  async getCategoryBySlug(slug: string) {
    const { data, error } = await supabase
      .from('lab_categories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  }
};

// Enrollment service
export const enrollmentService = {
  // Enroll in course
  async enrollInCourse(courseId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('enrollments')
      .insert({
        user_id: user.id,
        course_id: courseId,
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get user enrollments
  async getUserEnrollments() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        courses (*)
      `)
      .eq('user_id', user.id)
      .order('enrolled_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Check if user is enrolled
  async isEnrolled(courseId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .single();

    if (error) return false;
    return !!data;
  }
};

// Lab session service
export const labSessionService = {
  // Start lab session
  async startLabSession(labId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const { data, error } = await supabase
      .from('lab_sessions')
      .insert({
        user_id: user.id,
        lab_id: labId,
        session_id: sessionId,
        status: 'starting'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get user lab sessions
  async getUserLabSessions() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('lab_sessions')
      .select(`
        *,
        labs (*)
      `)
      .eq('user_id', user.id)
      .order('started_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Update lab session
  async updateLabSession(sessionId: string, updates: Partial<Database['public']['Tables']['lab_sessions']['Update']>) {
    const { data, error } = await supabase
      .from('lab_sessions')
      .update(updates)
      .eq('session_id', sessionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Cloud environment service
export const cloudEnvironmentService = {
  // Create cloud environment
  async createEnvironment(labId: string, templateName: string, resourceConfig: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const sessionId = `env_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const { data, error } = await supabase
      .from('cloud_environments')
      .insert({
        user_id: user.id,
        lab_id: labId,
        session_id: sessionId,
        template_name: templateName,
        resource_config: resourceConfig,
        status: 'creating'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get user environments
  async getUserEnvironments() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('cloud_environments')
      .select(`
        *,
        labs (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Update environment status
  async updateEnvironmentStatus(environmentId: string, status: Database['public']['Enums']['environment_status']) {
    const { data, error } = await supabase
      .from('cloud_environments')
      .update({ status })
      .eq('id', environmentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Review service
export const reviewService = {
  // Add course review
  async addCourseReview(courseId: string, rating: number, reviewText?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('course_reviews')
      .insert({
        user_id: user.id,
        course_id: courseId,
        rating,
        review_text: reviewText,
        is_verified_purchase: true
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Add lab review
  async addLabReview(labId: string, rating: number, reviewText?: string, difficultyRating?: number, timeAccuracyRating?: number) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('lab_reviews')
      .insert({
        user_id: user.id,
        lab_id: labId,
        rating,
        review_text: reviewText,
        difficulty_rating: difficultyRating,
        time_accuracy_rating: timeAccuracyRating
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get course reviews
  async getCourseReviews(courseId: string) {
    const { data, error } = await supabase
      .from('course_reviews')
      .select(`
        *,
        profiles (*)
      `)
      .eq('course_id', courseId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get lab reviews
  async getLabReviews(labId: string) {
    const { data, error } = await supabase
      .from('lab_reviews')
      .select(`
        *,
        profiles (*)
      `)
      .eq('lab_id', labId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};

// Bookmark service
export const bookmarkService = {
  // Add bookmark
  async addBookmark(entityType: string, entityId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('user_bookmarks')
      .insert({
        user_id: user.id,
        entity_type: entityType,
        entity_id: entityId
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Remove bookmark
  async removeBookmark(entityType: string, entityId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('user_bookmarks')
      .delete()
      .eq('user_id', user.id)
      .eq('entity_type', entityType)
      .eq('entity_id', entityId);

    if (error) throw error;
  },

  // Get user bookmarks
  async getUserBookmarks() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('user_bookmarks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Check if bookmarked
  async isBookmarked(entityType: string, entityId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('user_bookmarks')
      .select('*')
      .eq('user_id', user.id)
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .single();

    if (error) return false;
    return !!data;
  }
};

// Notification service
export const notificationService = {
  // Get user notifications
  async getUserNotifications() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Mark notification as read
  async markAsRead(notificationId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', notificationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get unread count
  async getUnreadCount() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .is('read_at', null);

    if (error) throw error;
    return count || 0;
  }
};

// Analytics service
export const analyticsService = {
  // Track event
  async trackEvent(eventName: string, eventData: Record<string, any> = {}) {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from('analytics_events')
      .insert({
        user_id: user?.id,
        event_name: eventName,
        event_data: eventData,
        session_id: `session_${Date.now()}`,
        page_url: window.location.href,
        referrer: document.referrer,
        user_agent: navigator.userAgent
      });

    if (error) console.error('Analytics error:', error);
  },

  // Track page view
  async trackPageView(page: string) {
    await this.trackEvent('page_view', { page });
  },

  // Track course view
  async trackCourseView(courseId: string, courseTitle: string) {
    await this.trackEvent('course_view', { course_id: courseId, course_title: courseTitle });
  },

  // Track lab view
  async trackLabView(labId: string, labTitle: string) {
    await this.trackEvent('lab_view', { lab_id: labId, lab_title: labTitle });
  }
};

// System settings service
export const systemSettingsService = {
  // Get public settings
  async getPublicSettings() {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .eq('is_public', true);

    if (error) throw error;
    return data;
  },

  // Get setting by key
  async getSetting(key: string) {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .eq('setting_key', key)
      .single();

    if (error) throw error;
    return data;
  }
};

// Export all services
export const db = {
  profile: profileService,
  service: serviceService,
  course: courseService,
  lab: labService,
  labCategory: labCategoryService,
  enrollment: enrollmentService,
  labSession: labSessionService,
  cloudEnvironment: cloudEnvironmentService,
  review: reviewService,
  bookmark: bookmarkService,
  notification: notificationService,
  analytics: analyticsService,
  systemSettings: systemSettingsService
}; 