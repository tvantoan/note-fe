import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthProvider';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Notes from './pages/Notes';

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const { token } = useAuth();
  if (!token && !localStorage.getItem('token'))
    return <Navigate to="/login" replace />;
  return children;
};

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      }
    />
    <Route
      path="/notes"
      element={
        <ProtectedRoute>
          <Notes />
        </ProtectedRoute>
      }
    />
    <Route path="/" element={<Navigate to="/notes" replace />} />
  </Routes>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
