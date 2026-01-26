const alerts = [
  { label: 'Pending reviews', value: '18', status: 'warn' },
  { label: 'High risk', value: '3', status: 'risk' },
  { label: 'Cleared today', value: '147', status: 'good' },
];

const tasks = [
  'Review HS 9403 classification for furniture line',
  'Approve NAFTA documentation for CA warehouse',
  'Audit supplier valuation anomalies - Q1',
  'Publish new tariff model for EU electronics',
];

export default function Panel() {
  return (
    <section className="page panel">
      <div className="panel__header">
        <div>
          <p className="eyebrow">COMPLIANCE CONTROL</p>
          <h2>Operations panel</h2>
          <p className="muted">
            A single view of duty exposure, routing, and review workflows.
          </p>
        </div>
        <div className="panel__actions">
          <button className="button button--ghost" type="button">
            Export report
          </button>
          <button className="button button--primary" type="button">
            New review
          </button>
        </div>
      </div>

      <div className="panel__stats">
        {alerts.map((alert) => (
          <div key={alert.label} className={`stat stat--${alert.status}`}>
            <p className="stat__value">{alert.value}</p>
            <p className="stat__label">{alert.label}</p>
          </div>
        ))}
      </div>

      <div className="panel__grid">
        <div className="panel__card">
          <h3>Exposure timeline</h3>
          <div className="timeline">
            {[68, 42, 88, 55, 74, 61].map((level, index) => (
              <span key={`${level}-${index}`} style={{ height: `${level}%` }} />
            ))}
          </div>
        </div>
        <div className="panel__card">
          <h3>Next actions</h3>
          <ul className="checklist">
            {tasks.map((task) => (
              <li key={task}>{task}</li>
            ))}
          </ul>
        </div>
        <div className="panel__card panel__card--wide">
          <h3>Routing heatmap</h3>
          <div className="heatmap">
            {['US', 'MX', 'EU', 'CN', 'JP', 'UK', 'BR', 'IN'].map((region, index) => (
              <div key={region} className={`heatmap__cell heatmap__cell--${index % 4}`}>
                <span>{region}</span>
                <strong>{Math.round(12 + index * 7)}%</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
