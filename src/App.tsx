import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Admin } from './pages/Admin';
import { Login } from './pages/Login';
import { Layout } from './components/Layout';
import { OneDriveViewer } from './components/OneDriveViewer';
import { useUserStore } from './store/userStore';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentUser = useUserStore((state) => state.currentUser);
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentUser = useUserStore((state) => state.currentUser);
  
  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

function App() {
  const { addUser } = useUserStore();

  useEffect(() => {
    // Create admin user on app initialization
    const createAdminUser = async () => {
      try {
        await addUser({
          name: 'Administrator',
          email: 'bolt@asfa64.fr',
          password: '01012024',
          role: 'admin'
        });
      } catch (error) {
        console.log('Admin user might already exist');
      }
    };

    createAdminUser();
  }, [addUser]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route index element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="admin" element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        } />
        <Route path="viewer" element={
          <ProtectedRoute>
            <OneDriveViewer url={new URLSearchParams(window.location.search).get('url') || ''} />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
}

export default App;