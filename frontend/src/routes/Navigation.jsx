import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout, ClientLayout, CommonLayout } from '../layouts/Layouts.jsx';
import { Dashboard } from '../pages/Dashboard.jsx';
import { Login } from '../pages/Login.jsx';
import { Register } from '../pages/Register.jsx';

function NotFound() {
  return <section className="auth-card"><p className="eyebrow">404</p><h1>Página no encontrada</h1><a href="/login">Volver al inicio</a></section>;
}

export function Navigation() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<CommonLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<AdminLayout />}>
          <Route element={<ClientLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
