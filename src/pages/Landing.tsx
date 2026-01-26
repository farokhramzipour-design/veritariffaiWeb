import type { FormEvent } from 'react';

export default function Landing() {
  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.location.href = '/login';
  };

  return (
    <section className="page landing">
      <div className="hero">
        <div className="hero__copy">
          <p className="eyebrow">AI TARIFF FORECASTING</p>
          <h1>Instant tariff estimates for global trade decisions.</h1>
          <p className="lead">
            Enter source, destination, and commodity to see expected duty exposure.
            Sign in to unlock full tariff results, documentation, and audit history.
          </p>
          <form className="search-card" onSubmit={handleSearchSubmit}>
            <div className="search-card__fields">
              <label className="search-card__field">
                <span>Source country</span>
                <input type="text" placeholder="United States" />
              </label>
              <label className="search-card__field">
                <span>Destination country</span>
                <input type="text" placeholder="Germany" />
              </label>
              <label className="search-card__field">
                <span>Commodity</span>
                <input type="text" placeholder="Lithium battery pack" />
              </label>
            </div>
            <div className="search-card__actions">
              <button className="button button--primary" type="submit">
                Calculate tariff
              </button>
              <p className="muted">
                You’ll be asked to sign in to view the full calculation.
              </p>
            </div>
          </form>
          <div className="hero__metrics">
            <div>
              <p className="metric">120+</p>
              <p className="muted">trade corridors modeled</p>
            </div>
            <div>
              <p className="metric">4 min</p>
              <p className="muted">avg decision turnaround</p>
            </div>
            <div>
              <p className="metric">SOC 2</p>
              <p className="muted">compliance-ready workflow</p>
            </div>
          </div>
        </div>
        <div className="hero__visual">
          <div className="glass-card">
            <p className="card__title">Tariff overview</p>
            <div className="card__grid">
              <div>
                <p className="card__label">Destination</p>
                <p className="card__value">EU</p>
              </div>
              <div>
                <p className="card__label">Expected duty</p>
                <p className="card__value">6.8%</p>
              </div>
              <div>
                <p className="card__label">Confidence</p>
                <p className="card__value">High</p>
              </div>
            </div>
            <div className="card__bar">
              <span className="bar bar--good" />
              <span className="bar bar--warn" />
              <span className="bar bar--risk" />
            </div>
          </div>
          <div className="floating-panel">
            <p className="card__title">Auto checks</p>
            <ul>
              <li>HS 8507 mapped to battery packs</li>
              <li>EU preference rules verified</li>
              <li>Licensing exceptions flagged</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="feature-grid">
        {[
          {
            title: 'Tariff search built for operators',
            body: 'Search by source, destination, and commodity with AI-led HS code hints.',
          },
          {
            title: 'Secure, audit-ready results',
            body: 'Every estimate is traceable with sources, rulings, and reviewer history.',
          },
          {
            title: 'Collaborative workflows',
            body: 'Share findings across compliance, finance, and logistics teams in minutes.',
          },
        ].map((item) => (
          <article key={item.title} className="feature-card">
            <h3>{item.title}</h3>
            <p className="muted">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
