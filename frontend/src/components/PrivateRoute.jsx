import React from 'react';
import { Navigate } from 'react-router-dom';

// Dummy authentication hook. Replace with your actual auth context/hook.
const useAuth = () => {
  // Example: read user info from localStorage or context.
  // For a real project, you might have something like:
  // const { user } = useContext(AuthContext);
  const user = JSON.parse(localStorage.getItem('user'));
  return { user };
};

function PrivateRoute({ children, rolesAllowed }) {
  const { user } = useAuth();

  if (!user) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }
  if (!rolesAllowed.includes(user.role)) {
    // Logged in but not authorized
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
}

export default PrivateRoute;
