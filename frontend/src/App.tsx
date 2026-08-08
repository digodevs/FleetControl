import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { VehiclesPage } from './pages/VehiclesPage';
import { useAuth } from './contexts/AuthContext';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/vehicles" element={<VehiclesPage />} />
        <Route path="/users" element={<PlaceholderPage title="Usuários" />} />
        <Route path="/profile" element={<PlaceholderPage title="Perfil" />} />
        <Route path="/settings" element={<PlaceholderPage title="Configurações" />} />
      </Route>
    </Routes>
  );
}

function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const hasToken = Boolean(window.localStorage.getItem('fleetcontrol.accessToken'));

  if (hasToken && isLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-surface-950 text-sm text-slate-400">Carregando sessão...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout />;
}
