import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserProvider } from '@/contexts/UserContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Suspense, lazy } from 'react';
import { SessionContextProvider } from './contexts/SessionContext';
import { PayoutContextProvider } from './contexts/PayoutContext';

// Lazy imports
const Login = lazy(() => import('@/pages/auth/Login'));
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const MentorDashboard = lazy(() => import('@/pages/mentor/Dashboard'));
const Sessions = lazy(() => import('@/pages/admin/Sessions'));
const Mentors = lazy(() => import('@/pages/admin/Mentors'));
const Payouts = lazy(() => import('@/pages/admin/Payouts'));
const Settings = lazy(() => import('@/pages/admin/Settings'));
const MentorPayouts = lazy(() => import('@/pages/mentor/Payouts'));
const MentorSessions = lazy(() => import('@/pages/mentor/Sessions'));
const MentorProfile = lazy(() => import('@/pages/mentor/Profile'));
const Chat = lazy(() => import('@/pages/chat/Chat'));
const Receipt = lazy(() => import('@/pages/common/Receipt'));
const NotFound = lazy(() => import('@/pages/common/NotFound'));

function App() {
  return (
    <PayoutContextProvider>
    <SessionContextProvider>
    <ThemeProvider>
      <AuthProvider>
        <UserProvider>
          <Router>
            <Suspense fallback={<div className="h-96 flex items-center justify-center">
                                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-500"></div>
                                </div>}>
              <Routes>
                <Route path="/login" element={<Login />} />
                
                {/* Admin Routes */}
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/sessions" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Sessions />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/mentors" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Mentors />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/payouts" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Payouts />
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
                
                {/* Mentor Routes */}
                <Route 
                  path="/mentor" 
                  element={
                    <ProtectedRoute requiredRole="mentor">
                      <MentorDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/mentor/payouts" 
                  element={
                    <ProtectedRoute requiredRole="mentor">
                      <MentorPayouts />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/mentor/sessions" 
                  element={
                    <ProtectedRoute requiredRole="mentor">
                      <MentorSessions />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/mentor/profile" 
                  element={
                    <ProtectedRoute requiredRole="mentor">
                      <MentorProfile />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Shared Routes */}
                <Route 
                  path="/chat/:userId?" 
                  element={
                    <ProtectedRoute>
                      <Chat />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/receipt/:id" 
                  element={
                    <ProtectedRoute>
                      <Receipt />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Redirects */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Router>
          <Toaster position="top-center" />
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
    </SessionContextProvider>
    </PayoutContextProvider>
  );
}

export default App;
