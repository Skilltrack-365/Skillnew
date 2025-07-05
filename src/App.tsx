import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import ServicePage from './pages/ServicePage';
import CoursePage from './pages/CoursePage';
import EnrollmentPage from './pages/EnrollmentPage';
import LabsPage from './pages/LabsPage';
import LabDetailPage from './pages/LabDetailPage';
import AuthPage from './pages/AuthPage';
import AdminPage from './pages/admin/AdminPage';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/services/:serviceId" element={<ServicePage />} />
          <Route path="/course/:serviceId/:courseId" element={<CoursePage />} />
          <Route path="/enroll/:serviceId/:courseId" element={<EnrollmentPage />} />
          <Route path="/labs" element={<LabsPage />} />
          <Route path="/labs/:labId" element={<LabDetailPage />} />
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute requireAdmin>
                <AdminPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;