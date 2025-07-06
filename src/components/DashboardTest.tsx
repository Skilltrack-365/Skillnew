import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const DashboardTest: React.FC = () => {
  const { user, profile, loading } = useAuth();

  console.log('DashboardTest - User:', user);
  console.log('DashboardTest - Profile:', profile);
  console.log('DashboardTest - Loading:', loading);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You must be logged in to access the dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Test</h1>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">User Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">User ID</p>
              <p className="text-sm font-medium text-gray-900">{user.id}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-sm font-medium text-gray-900">{user.email}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="text-sm font-medium text-gray-900">{profile?.full_name || 'Not set'}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="text-sm font-medium text-gray-900">{profile?.role || 'Not set'}</p>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Debug Information</h3>
            <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-auto">
              {JSON.stringify({ user, profile }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTest; 