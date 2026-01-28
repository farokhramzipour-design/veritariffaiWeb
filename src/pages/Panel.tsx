export default function Panel() {
  return (
    <section className="page panel">
      <div className="panel__header">
        <div>
          <p className="eyebrow">WELCOME</p>
          <h2>Choose your next step</h2>
          <p className="muted">Start with your dashboard, create a new shipment, or upgrade.</p>
        </div>
      </div>

      <div className="panel__grid">
        <div className="panel__card">
          <h3>Dashboard</h3>
          <p className="muted">
            View your compliance overview, alerts, and recent activity.
          </p>
          <button className="button button--primary" type="button">
            Open dashboard
          </button>
        </div>
        <div className="panel__card">
          <h3>New shipment</h3>
          <p className="muted">
            Create a shipment entry and run tariff checks in minutes.
          </p>
          <button className="button button--ghost" type="button">
            Start shipment
          </button>
        </div>
        <div className="panel__card">
          <h3>Become a pro user</h3>
          <p className="muted">
            Unlock advanced analytics, collaboration, and audit-ready exports.
          </p>
          <button className="button button--ghost" type="button">
            Upgrade now
          </button>
        </div>
      </div>
    </section>
  );
}
