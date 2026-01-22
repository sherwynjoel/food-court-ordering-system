import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import { AuthProvider, useAuth } from './auth/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/DashboardLayout';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

import BranchesPage from './pages/BranchesPage';

import KitchensPage from './pages/KitchensPage';
import UsersPage from './pages/UsersPage';
import MenuManagementPage from './pages/MenuManagementPage';
import KitchenDisplayPage from './pages/KitchenDisplayPage';
import TablesPage from './pages/TablesPage';

import DashboardPage from './pages/DashboardPage';

// Placeholder Pages
// const Dashboard = () => <Typography variant="h4">Admin Dashboard</Typography>;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route path="/" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardPage />} />
              <Route path="branches" element={<BranchesPage />} />
              <Route path="kitchens" element={<KitchensPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="menu" element={<MenuManagementPage />} />
              <Route path="tables" element={<TablesPage />} />
              <Route path="kds" element={<KitchenDisplayPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
