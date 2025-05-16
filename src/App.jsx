import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserProvider } from '@/contexts/UserContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Login from '@/pages/auth/Login';
import AdminDashboard from '@/pages/admin/Dashboard';
import MentorDashboard from '@/pages/mentor/Dashboard';
import Sessions from '@/pages/admin/Sessions';
import Mentors from '@/pages/admin/Mentors';
import Payouts from '@/pages/admin/Payouts';
import Settings from '@/pages/admin/Settings';
import MentorPayouts from '@/pages/mentor/Payouts';
import MentorSessions from '@/pages/mentor/Sessions';
import MentorProfile from '@/pages/mentor/Profile';
import Chat from '@/pages/chat/Chat';
import Receipt from '@/pages/common/Receipt';
import NotFound from '@/pages/common/NotFound';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserProvider>
          <Router>
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
          </Router>
          <Toaster position="top-center" />
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;