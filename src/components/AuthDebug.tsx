import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthDebug: React.FC = () => {
  const { user, profile, session, loading } = useAuth();

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <div className="space-y-1">
        <div>Loading: {loading ? 'Yes' : 'No'}</div>
        <div>User: {user ? 'Yes' : 'No'}</div>
        <div>Profile: {profile ? 'Yes' : 'No'}</div>
        <div>Session: {session ? 'Yes' : 'No'}</div>
        {user && (
          <div>Email: {user.email}</div>
        )}
        {profile && (
          <div>Name: {profile.full_name}</div>
        )}
      </div>
    </div>
  );
};

export default AuthDebug; 