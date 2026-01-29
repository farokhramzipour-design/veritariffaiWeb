import { Link } from 'react-router-dom';

const kpis = [
  {
    title: 'Active Shipments',
    value: '45 Total',
    meta: '3 Critical At-Risk',
    tone: 'risk',
  },
  {
    title: 'Projected CBAM Liability',
    value: '€145,200',
    meta: '↑ 6.2% vs last month',
    tone: 'warn',
  },
  {
    title: 'Data Integrity Score',
    value: '92%',
    meta: 'Verified vs default data',
    tone: 'good',
  },
];

const filters = [
  { label: 'Critical Actions Needed', count: 6, tone: 'risk' },
  { label: 'Pending Supplier Input', count: 12, tone: 'warn' },
  { label: 'Fully Cleared', count: 27, tone: 'good' },
];

const shipments = [
  {
    po: 'PO-1234',
    supplier: 'BaoSteel',
    origin: 'China',
    eta: 'Oct 12',
    status: [
      { label: 'Sanctions', tone: 'risk' },
      { label: 'Tax/Tariff', tone: 'good' },
      { label: 'ESG/CBAM', tone: 'warn' },
    ],
  },
  {
    po: 'PO-1288',
    supplier: 'ArcelorMittal',
    origin: 'Belgium',
    eta: 'Oct 18',
    status: [
      { label: 'Sanctions', tone: 'good' },
      { label: 'Tax/Tariff', tone: 'good' },
      { label: 'ESG/CBAM', tone: 'good' },
    ],
  },
  {
    po: 'PO-1296',
    supplier: 'US Steel',
    origin: 'USA',
    eta: 'Oct 22',
    status: [
      { label: 'Sanctions', tone: 'good' },
      { label: 'Tax/Tariff', tone: 'warn' },
      { label: 'ESG/CBAM', tone: 'warn' },
    ],
  },
  {
    po: 'PO-1301',
    supplier: 'Tata Steel',
    origin: 'India',
    eta: 'Nov 02',
    status: [
      { label: 'Sanctions', tone: 'good' },
      { label: 'Tax/Tariff', tone: 'good' },
      { label: 'ESG/CBAM', tone: 'warn' },
    ],
  },
];

export default function Panel() {
  return (
    <section className="page control">
      <div className="control__topbar">
        <div>
          <p className="eyebrow">Control Tower</p>
          <h2>TradeFlow Executive Dashboard</h2>
          <p className="muted">A real-time system of record for global trade compliance.</p>
        </div>
        <div className="control__actions">
          <label className="control__search">
            <span>Search</span>
            <input type="search" placeholder="Search PO, supplier, or vessel" />
          </label>
          <button className="icon-button" type="button" aria-label="View notifications">
            <span className="icon-button__dot" />
            🔔
          </button>
          <div className="profile-chip">
            <span className="profile-chip__avatar">TF</span>
            <div>
              <p>Olivia Chen</p>
              <span className="muted">Compliance Lead</span>
            </div>
          </div>
        </div>
      </div>

      <div className="control__layout">
        <aside className="control__sidebar">
          <div className="sidebar-card">
            <h3>Quick Filters</h3>
            <ul className="filter-list">
              {filters.map((filter) => (
                <li key={filter.label} className={`filter-item filter-item--${filter.tone}`}>
                  <span>{filter.label}</span>
                  <strong>{filter.count}</strong>
                </li>
              ))}
            </ul>
          </div>
          <div className="sidebar-card sidebar-card--accent">
            <p className="eyebrow">Automation</p>
            <h4>Risk intelligence</h4>
            <p className="muted">AI rules flag anomalies before shipments reach port.</p>
            <button className="button button--primary" type="button">
              Configure alerts
            </button>
          </div>
        </aside>

        <div className="control__content">
          <div className="control__kpis">
            {kpis.map((kpi) => (
              <div key={kpi.title} className={`kpi-card kpi-card--${kpi.tone}`}>
                <p className="kpi-card__title">{kpi.title}</p>
                <p className="kpi-card__value">{kpi.value}</p>
                <div className="kpi-card__meta">
                  <span>{kpi.meta}</span>
                  {kpi.title === 'Data Integrity Score' && (
                    <div className="kpi-card__bar">
                      <span style={{ width: '92%' }} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="queue">
            <div className="queue__header">
              <div>
                <h3>The Operational Queue</h3>
                <p className="muted">Current shipments awaiting clearance.</p>
              </div>
              <button className="button button--ghost" type="button">
                Export queue
              </button>
            </div>
            <div className="queue__table">
              <div className="queue__row queue__row--head">
                <span>PO Number</span>
                <span>Supplier Name</span>
                <span>Origin Country</span>
                <span>Estimated Arrival</span>
                <span>Triple-Check Status</span>
              </div>
              {shipments.map((shipment) => (
                <div key={shipment.po} className="queue__row">
                  <Link className="queue__link" to={`/shipments/${shipment.po}`}>
                    {shipment.po}
                  </Link>
                  <span>{shipment.supplier}</span>
                  <span>{shipment.origin}</span>
                  <span>{shipment.eta}</span>
                  <div className="status-group">
                    {shipment.status.map((status) => (
                      <span
                        key={`${shipment.po}-${status.label}`}
                        className={`status-pill status-pill--${status.tone}`}
                      >
                        {status.label}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
