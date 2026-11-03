import { Link, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

export function CommonLayout() {
  return <main className="auth-shell"><Outlet /></main>;
}

export function ClientLayout() {
  const { auth, logout } = useAuth();
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/dashboard"><span className="brand-mark">M</span> Mesa & Mercado</Link>
        <div className="topbar-user"><span>{auth?.me?.email}</span><button className="text-button" onClick={logout}>Cerrar sesión</button></div>
      </header>
      <Outlet />
    </div>
  );
}

export function AdminLayout() {
  const { auth, loading } = useAuth();
  if (loading) return <div className="loading-screen">Cargando tu sesión…</div>;
  return auth ? <Outlet /> : <Navigate to="/login" replace />;
}
