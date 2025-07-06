import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Globe, Shield, Bell, Settings, Save, X, Camera, Edit3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  const { profile, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    company: '',
    bio: '',
    experience_level: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    timezone: '',
    language: '',
    notification_preferences: {
      email: true,
      push: true,
      sms: false
    }
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        company: profile.company || '',
        bio: profile.bio || '',
        experience_level: profile.experience_level,
        timezone: profile.timezone,
        language: profile.language,
        notification_preferences: profile.notification_preferences
      });
    }
  }, [profile]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (type: 'email' | 'push' | 'sms') => {
    setFormData(prev => ({
      ...prev,
      notification_preferences: {
        ...prev.notification_preferences,
        [type]: !prev.notification_preferences[type]
      }
    }));
  };

  const handleSave = async () => {
    if (!profile) {
      console.error('No profile available for update');
      setMessage({ type: 'error', text: 'No profile available for update' });
      return;
    }
    
    console.log('Starting profile update for user:', profile.id);
    console.log('Update data:', formData);
    
    setLoading(true);
    setMessage(null);

    try {
      const updateData = {
        full_name: formData.full_name,
        phone: formData.phone,
        company: formData.company,
        bio: formData.bio,
        experience_level: formData.experience_level,
        timezone: formData.timezone,
        language: formData.language,
        notification_preferences: formData.notification_preferences,
        updated_at: new Date().toISOString()
      };

      console.log('Sending update to Supabase:', updateData);

      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', profile.id)
        .select();

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      console.log('Update successful:', data);

      await refreshProfile();
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      console.error('Profile update error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'instructor': return 'bg-purple-100 text-purple-800';
      case 'student': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getExperienceBadgeColor = (level: string) => {
    switch (level) {
      case 'Advanced': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Beginner': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">User Profile</h2>
              <p className="text-sm text-gray-500">Manage your account settings</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Saving...' : 'Save'}</span>
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mx-6 mt-4 p-3 rounded-lg text-sm ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Personal Information</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="profile_full_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      id="profile_full_name"
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="text-gray-900">{profile?.full_name || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <p className="text-gray-900 flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{profile?.email}</span>
                  </p>
                </div>

                <div>
                  <label htmlFor="profile_phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      id="profile_phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <p className="text-gray-900 flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{profile?.phone || 'Not provided'}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="profile_company" className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  {isEditing ? (
                    <input
                      id="profile_company"
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your company name"
                    />
                  ) : (
                    <p className="text-gray-900">{profile?.company || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="profile_bio" className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      id="profile_bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us about yourself"
                    />
                  ) : (
                    <p className="text-gray-900">{profile?.bio || 'No bio provided'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Account Settings</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(profile?.role || '')}`}>
                    {profile?.role || 'Unknown'}
                  </span>
                </div>

                <div>
                  <label htmlFor="profile_experience_level" className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  {isEditing ? (
                    <select
                      id="profile_experience_level"
                      name="experience_level"
                      value={formData.experience_level}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  ) : (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getExperienceBadgeColor(profile?.experience_level || '')}`}>
                      {profile?.experience_level || 'Unknown'}
                    </span>
                  )}
                </div>

                <div>
                  <label htmlFor="profile_timezone" className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  {isEditing ? (
                    <select
                      id="profile_timezone"
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="Europe/London">London</option>
                      <option value="Europe/Paris">Paris</option>
                      <option value="Asia/Tokyo">Tokyo</option>
                      <option value="Asia/Shanghai">Shanghai</option>
                      <option value="Australia/Sydney">Sydney</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <span>{profile?.timezone || 'UTC'}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="profile_language" className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  {isEditing ? (
                    <select
                      id="profile_language"
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="it">Italian</option>
                      <option value="pt">Portuguese</option>
                      <option value="ru">Russian</option>
                      <option value="ja">Japanese</option>
                      <option value="ko">Korean</option>
                      <option value="zh">Chinese</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{profile?.language || 'en'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subscription Tier
                  </label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {profile?.subscription_tier || 'free'}
                  </span>
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-md font-semibold text-gray-900 flex items-center space-x-2 mb-3">
                  <Bell className="w-4 h-4" />
                  <span>Notification Preferences</span>
                </h4>
                
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.notification_preferences.email}
                      onChange={() => handleNotificationChange('email')}
                      disabled={!isEditing}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Email notifications</span>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.notification_preferences.push}
                      onChange={() => handleNotificationChange('push')}
                      disabled={!isEditing}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Push notifications</span>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.notification_preferences.sms}
                      onChange={() => handleNotificationChange('sms')}
                      disabled={!isEditing}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">SMS notifications</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Account Stats */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Login Count</p>
                <p className="text-2xl font-bold text-gray-900">{profile?.login_count || 0}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="text-lg font-semibold text-gray-900">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-lg font-semibold text-gray-900">
                  {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Verification</p>
                <p className="text-lg font-semibold text-gray-900">
                  {profile?.is_verified ? 'Verified' : 'Not Verified'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 