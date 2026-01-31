import { NavLink, Outlet } from 'react-router-dom';

type SidebarItem = {
  label: string;
  icon: string;
  to?: string;
};

type SidebarSection = {
  title: string;
  items: SidebarItem[];
  note?: string;
};

const sections: SidebarSection[] = [
  {
    title: 'Metal Importers',
    items: [
      { label: 'New Shipments', icon: '🚢', to: '/invoices/upload' },
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

export default function TradeFlowLayout() {
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

        <NavLink
          className={({ isActive }) =>
            `sidebar__item sidebar__dashboard ${isActive ? 'sidebar__item--active' : ''}`
          }
          to="/panel"
        >
          <span className="sidebar__icon">🏠</span>
          Dashboard
        </NavLink>

        {sections.map((section) => (
          <div key={section.title} className="sidebar__section">
            <p className="sidebar__label">{section.title}</p>
            <div className="sidebar__items">
              {section.items.map((item) =>
                item.to ? (
                  <NavLink
                    key={item.label}
                    className={({ isActive }) =>
                      `sidebar__item ${isActive ? 'sidebar__item--active' : ''}`
                    }
                    to={item.to}
                  >
                    <span className="sidebar__icon">{item.icon}</span>
                    {item.label}
                  </NavLink>
                ) : (
                  <button key={item.label} className="sidebar__item" type="button">
                    <span className="sidebar__icon">{item.icon}</span>
                    {item.label}
                  </button>
                )
              )}
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

        <Outlet />
      </div>
    </section>
  );
}
