import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext.jsx';
import { Navigation } from './routes/Navigation.jsx';

export default function App() {
  return (
    <AuthProvider>
      <Navigation />
      <ToastContainer position="bottom-center" autoClose={4500} />
    </AuthProvider>
  );
}
