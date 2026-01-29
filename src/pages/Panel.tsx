import { Link } from 'react-router-dom';

const kpis = [
  { title: 'Shipments Status', value: '45 Active', meta: '3 Critical At-Risk' },
  { title: 'Compliance Alerts', value: '12 Open', meta: '4 Due in 48h' },
  { title: 'Market Summary', value: 'Steel +2.8%', meta: 'Aluminum -1.1%' },
];

const sections = [
  {
    title: 'Metal Importers',
    items: [
      { label: 'New Shipments', icon: '🚢' },
      { label: 'Compliance Tasks', icon: '✅' },
      { label: 'Passport Library', icon: '🧾' },
      { label: 'Collaboration', icon: '🤝' },
      { label: 'License Manager', icon: '📄' },
    ],
    note: 'Space reserved for future collaboration tools.',
  },
  {
    title: 'Intelligence',
    items: [{ label: 'Market Insights', icon: '📈' }],
  },
];

const queue = [
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
];

export default function Panel() {
  return (
    <section className="page tradeflow">
      <aside className="tradeflow__sidebar">
        <div className="sidebar__brand">
          <span className="sidebar__logo">TF</span>
          <div>
            <p className="sidebar__name">TradeFlow</p>
            <span className="muted">Metal Importers Suite</span>
          </div>
        </div>

        <button className="sidebar__dashboard sidebar__item sidebar__item--active" type="button">
          <span className="sidebar__icon">🏠</span>
          Dashboard
        </button>

        {sections.map((section) => (
          <div key={section.title} className="sidebar__section">
            <p className="sidebar__label">{section.title}</p>
            <div className="sidebar__items">
              {section.items.map((item) => (
                <button key={item.label} className="sidebar__item" type="button">
                  <span className="sidebar__icon">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
            {section.note && <p className="sidebar__note">{section.note}</p>}
          </div>
        ))}

        <button className="sidebar__cta button button--pro" type="button">
          Become a Pro User
        </button>
      </aside>

      <div className="tradeflow__main">
        <div className="tradeflow__topbar">
          <div>
            <p className="eyebrow">Control Tower</p>
            <h2>Executive Dashboard</h2>
            <p className="muted">Global trade compliance system of record.</p>
          </div>
          <div className="tradeflow__actions">
            <label className="tradeflow__search">
              <span>Search</span>
              <input type="search" placeholder="PO number, supplier, or vessel" />
            </label>
            <button className="icon-button" type="button" aria-label="View notifications">
              <span className="icon-button__dot" />
              🔔
            </button>
            <div className="profile-chip">
              <span className="profile-chip__avatar">OC</span>
              <div>
                <p>Olivia Chen</p>
                <span className="muted">Compliance Lead</span>
              </div>
            </div>
          </div>
        </div>

        <div className="tradeflow__kpis">
          {kpis.map((kpi) => (
            <div key={kpi.title} className="kpi-card">
              <p className="kpi-card__title">{kpi.title}</p>
              <p className="kpi-card__value">{kpi.value}</p>
              <div className="kpi-card__meta">
                <span>{kpi.meta}</span>
                <div className="kpi-card__bar">
                  <span style={{ width: '70%' }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="queue">
          <div className="queue__header">
            <div>
              <h3>The Operational Queue</h3>
              <p className="muted">Shipments awaiting clearance and triple-check verification.</p>
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
            {queue.map((shipment) => (
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
    </section>
  );
}
