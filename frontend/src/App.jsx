import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Unauthorized from './pages/Unauthorized';
import LoginPage from './pages/LoginPage';

// Admin Pages & Layout
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateUserPage from './pages/admin/CreateUserPage';

// Lecturer Pages & Layout
import LecturerLayout from './layouts/LecturerLayout';
import LecturerDashboard from './pages/lecturer/LecturerDashboard';
// (Import additional lecturer pages as needed)

// Student Pages & Layout
import StudentLayout from './layouts/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard';
// (Import additional student pages as needed)

import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      <Route path="/admin" element={
        <PrivateRoute rolesAllowed={['admin']}>
          <AdminLayout />
        </PrivateRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="create-user" element={<CreateUserPage />} />
        {/* Add more admin routes */}
      </Route>

      <Route path="/lecturer" element={
        <PrivateRoute rolesAllowed={['lecturer']}>
          <LecturerLayout />
        </PrivateRoute>
      }>
        <Route index element={<LecturerDashboard />} />
        {/* Add more lecturer routes */}
      </Route>

      <Route path="/student" element={
        <PrivateRoute rolesAllowed={['student']}>
          <StudentLayout />
        </PrivateRoute>
      }>
        <Route index element={<StudentDashboard />} />
        {/* Add more student routes */}
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
