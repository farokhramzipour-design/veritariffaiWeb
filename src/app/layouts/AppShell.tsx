import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { API_BASE_URL } from '@app/api';

const navLinks = [
  { label: 'Landing', to: '/' },
  { label: 'Panel', to: '/panel' },
];

type User = {
  id?: number | null;
  email?: string | null;
  full_name?: string | null;
};

export default function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useMemo<User | null>(() => {
    try {
      const raw = localStorage.getItem('vtai_user');
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/v1/logout`, {
        method: 'POST',
        headers: { accept: 'application/json' },
      });
    } finally {
      localStorage.removeItem('vtai_user');
      navigate('/login');
    }
  };

  const initials =
    user?.full_name
      ?.split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || (user?.email?.[0]?.toUpperCase() ?? 'U');

  return (
    <div className="app">
      <header className="app__header">
        <Link className="brand" to="/">
          <span className="brand__mark">VT</span>
          <span className="brand__name">VeriTariffAI</span>
        </Link>
        <nav className="nav">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              className={
                location.pathname === link.to ? 'nav__link nav__link--active' : 'nav__link'
              }
              to={link.to}
            >
              {link.label}
            </Link>
          ))}
          {!user ? (
            <Link className="nav__link nav__link--pill" to="/login">
              Login
            </Link>
          ) : (
            <div className="nav__profile">
              <div className="nav__avatar" aria-hidden="true">
                {initials}
              </div>
              <div className="nav__meta">
                <span>{user.full_name ?? 'User'}</span>
                <span className="muted">{user.email ?? 'Signed in'}</span>
              </div>
              <button className="button button--ghost" type="button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </nav>
      </header>
      <main className="app__main">
        <Outlet />
      </main>
      <footer className="app__footer">
        <div>
          <span className="pill">API-ready</span>
          <span className="pill">FastAPI backend</span>
          <span className="pill">React UI</span>
        </div>
        <p className="muted">Built for compliance teams shipping at speed.</p>
      </footer>
    </div>
  );
}
