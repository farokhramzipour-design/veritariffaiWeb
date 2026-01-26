import { Link, Outlet, useLocation } from 'react-router-dom';

const navLinks = [
  { label: 'Landing', to: '/' },
  { label: 'Login', to: '/login' },
  { label: 'Panel', to: '/panel' },
];

export default function AppShell() {
  const location = useLocation();

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
          <button className="button button--primary" type="button">
            Request demo
          </button>
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
