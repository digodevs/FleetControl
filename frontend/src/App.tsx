import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { VehiclesPage } from './pages/VehiclesPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
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
