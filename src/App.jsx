/**
 * Main Application Component
 * 
 * Serves as the root component for the TaskFlow application, handling routing,
 * authentication protection, and layout structure. Implements a comprehensive
 * routing system with protected routes and role-based access control.
 * 
 * @author Senior Full-Stack Engineer
 * @version 1.0.0
 */

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

// Layout Components
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

// Public Pages
import Landing from "./pages/Landing";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";

// Admin Pages
import Dashboard from "./pages/AdminPages/Dashboard";
import Users from "./pages/AdminPages/Users";
import ManageUsers from "./pages/AdminPages/ManageUsers";
import ManageTasks from "./pages/AdminPages/ManageTasks";
import Settings from "./pages/AdminPages/Settings";
import UserLogPage from "./pages/AdminPages/UserLogPage";

// User Pages
import UserDashboard from "./pages/UserPages/Dashboard";
import UserPage from "./pages/UserPages/UserPage";
import NotificationsPage from "./pages/UserPages/NotificationsPage";
import CalendarPage from "./pages/UserPages/CalendarPage";
import ProfilePage from "./pages/UserPages/ProfilePage";

// Feature Components
import TaskFilter from "./components/tasks/TaskFilter";

// Context Providers
import AuthProvider from "./contexts/AuthContext";
import NotificationProvider from "./contexts/NotificationContext";

/**
 * Protected Route Component
 * 
 * Higher-order component that protects routes requiring authentication.
 * Redirects unauthenticated users to the login page with return path.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render when authenticated
 * @param {string} [props.requiredRole] - Optional role required to access the route
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, hasRole } = useAuth();
  const location = useLocation();
  
  // Check if user is authenticated
  const isAuthenticated = !!user || !!localStorage.getItem("token");
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // If role is required, check if user has the role
  if (requiredRole) {
    const hasRequiredRole = hasRole(requiredRole);
    
    if (!hasRequiredRole) {
      // Redirect to appropriate dashboard based on user's role
      const userRole = localStorage.getItem("userRole");
      const redirectPath = userRole === "admin" ? "/admin/dashboard" : "/user/dashboard";
      
      return <Navigate to={redirectPath} replace />;
    }
  }
  
  // User is authenticated and has required role (if specified)
  return children;
};

/**
 * Dashboard Only Route Component
 * 
 * Component that shows only the dashboard when user is not authenticated
 * and redirects to appropriate dashboard when authenticated
 */
const DashboardOnlyRoute = () => {
  const { user, hasRole } = useAuth();
  const location = useLocation();
  
  // Check if user is authenticated
  const isAuthenticated = !!user || !!localStorage.getItem("token");
  
  if (isAuthenticated) {
    // If authenticated, redirect to appropriate dashboard
    const userRole = localStorage.getItem("userRole");
    const redirectPath = userRole === "admin" ? "/admin/dashboard" : "/user/dashboard";
    
    return <Navigate to={redirectPath} replace />;
  }
  
  // If not authenticated, show a limited dashboard view
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome to TaskFlow</h1>
          <p className="text-gray-600 mb-6">
            Please log in to access the full features of TaskFlow.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => window.location.href = "/login"}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Login
            </button>
            <button
              onClick={() => window.location.href = "/signup"}
              className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Main App Component
 * 
 * Defines the application's routing structure and wraps the app with necessary providers.
 */
function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            
            <main className="flex-grow">
              <Routes>
                {/* Default route - shows dashboard only when logged out */}
                <Route path="/" element={<DashboardOnlyRoute />} />
                
                {/* Public Routes */}
                <Route path="/landing" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                
                {/* Protected Admin Routes */}
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/users" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Users />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/manage-users" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <ManageUsers />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/manage-tasks" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <ManageTasks />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/settings" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Settings />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/user-logs" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <UserLogPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/task-filter" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <TaskFilter />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Protected User Routes */}
                <Route 
                  path="/user/dashboard" 
                  element={
                    <ProtectedRoute>
                      <UserDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/user/userpage" 
                  element={
                    <ProtectedRoute>
                      <UserPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/user/notifications" 
                  element={
                    <ProtectedRoute>
                      <NotificationsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/user/calendar" 
                  element={
                    <ProtectedRoute>
                      <CalendarPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/user/profile" 
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/user/task-filter" 
                  element={
                    <ProtectedRoute>
                      <TaskFilter />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Fallback Route - Redirect to dashboard only view */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            
            <Footer />
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
