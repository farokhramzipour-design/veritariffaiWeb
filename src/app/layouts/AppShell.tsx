import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { API_BASE_URL, apiGet, clearAccessToken, setAccessToken } from '@app/api';

const navLinks = [{ label: 'Landing', to: '/' }];

type User = {
  id?: number | null;
  email?: string | null;
  full_name?: string | null;
};

export default function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem('vtai_user');
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const hashParams = new URLSearchParams(location.hash.replace(/^#/, ''));
    const token =
      params.get('token') ||
      params.get('access_token') ||
      hashParams.get('token') ||
      hashParams.get('access_token');

    if (token) {
      setAccessToken(token);
      params.delete('token');
      params.delete('access_token');
      hashParams.delete('token');
      hashParams.delete('access_token');

      const nextSearch = params.toString();
      const nextHash = hashParams.toString();
      navigate(
        {
          pathname: location.pathname,
          search: nextSearch ? `?${nextSearch}` : '',
          hash: nextHash ? `#${nextHash}` : '',
        },
        { replace: true }
      );
    }

    const hasToken = token || localStorage.getItem('token') || localStorage.getItem('vtai_access_token');
    if (!hasToken || user) return;

    apiGet<User>('/api/v1/users/me')
      .then((freshUser) => {
        localStorage.setItem('vtai_user', JSON.stringify(freshUser));
        setUser(freshUser);
        if (location.pathname === '/' || location.pathname === '/login') {
          navigate('/panel', { replace: true });
        }
      })
      .catch(() => {
        clearAccessToken();
        localStorage.removeItem('vtai_user');
        setUser(null);
      });
  }, [location.pathname, location.search, location.hash, navigate, user]);

  useEffect(() => {
    const syncUser = () => {
      try {
        const raw = localStorage.getItem('vtai_user');
        setUser(raw ? (JSON.parse(raw) as User) : null);
      } catch {
        setUser(null);
      }
    };
    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/v1/logout`, {
        method: 'POST',
        headers: { accept: 'application/json' },
      });
    } finally {
      clearAccessToken();
      localStorage.removeItem('vtai_user');
      setUser(null);
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
