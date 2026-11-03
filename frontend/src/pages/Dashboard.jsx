import { useEffect, useState } from 'react';
import { Button } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import { getCapitalApi } from '../api/user.js';
import { useAuth } from '../hooks/useAuth.js';

const QUOTE_API = 'https://dummyjson.com/quotes/random';

export function Dashboard() {
  const { auth, logout } = useAuth();
  const [quote, setQuote] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [capital, setCapital] = useState(null);
  const [capitalLoading, setCapitalLoading] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(QUOTE_API)
      .then((response) => {
        if (!response.ok) throw new Error('No se pudo cargar la frase.');
        return response.json();
      })
      .then((data) => { if (active) setQuote(data); })
      .catch(() => { if (active) setQuote(null); })
      .finally(() => { if (active) setQuoteLoading(false); });
    return () => { active = false; };
  }, []);

  async function loadCapital() {
    setCapitalLoading(true);
    try {
      const data = await getCapitalApi(auth.token, 'MX');
      setCapital(data.capital);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setCapitalLoading(false);
    }
  }

  return (
    <main className="dashboard">
      <section className="welcome-panel">
        <div>
          <p className="eyebrow">TU ESPACIO</p>
          <h1>Hola, {auth?.me?.first_name || auth?.me?.username} <span aria-hidden="true">✳</span></h1>
          <p className="muted">Nos alegra tenerte de vuelta. Aquí tienes un pequeño resumen de tu sesión.</p>
        </div>
        <div className="avatar">{(auth?.me?.first_name || auth?.me?.username || 'U').slice(0, 1).toUpperCase()}</div>
      </section>

      <section className="dashboard-grid">
        <article className="info-card profile-card">
          <div className="card-icon profile-icon">✦</div>
          <p className="eyebrow">CUENTA</p>
          <h2>Tu perfil</h2>
          <p className="muted">Sesión protegida con autenticación JWT.</p>
          <div className="profile-detail"><span>Correo</span><strong>{auth?.me?.email}</strong></div>
          <div className="profile-detail"><span>Usuario</span><strong>{auth?.me?.username}</strong></div>
          <Button className="secondary-action" onClick={logout}>Cerrar sesión</Button>
        </article>

        <article className="info-card quote-card">
          <div className="card-icon quote-icon">“</div>
          <p className="eyebrow">UNA IDEA PARA HOY</p>
          <h2>Un poco de inspiración</h2>
          {quoteLoading ? <p className="muted">Buscando una frase…</p> : quote ? (
            <blockquote>“{quote.quote}”<cite>{quote.author}</cite></blockquote>
          ) : <p className="muted">La frase no está disponible por ahora. Inténtalo de nuevo más tarde.</p>}
          <span className="source-label">Contenido de DummyJSON</span>
        </article>

        <article className="info-card soap-card">
          <div className="card-icon soap-icon">◎</div>
          <p className="eyebrow">SERVICIO SOAP</p>
          <h2>Capital de México</h2>
          <p className="muted">Consulta un servicio SOAP público a través de nuestro backend.</p>
          {capital && <p className="capital-result">{capital}</p>}
          <Button className="secondary-action" onClick={loadCapital} loading={capitalLoading} disabled={capitalLoading}>Consultar servicio</Button>
        </article>
      </section>
    </main>
  );
}
