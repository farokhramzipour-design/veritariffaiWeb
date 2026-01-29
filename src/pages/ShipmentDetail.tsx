import { useParams } from 'react-router-dom';

export default function ShipmentDetail() {
  const { po } = useParams();

  return (
    <section className="page passport">
      <div className="passport__header">
        <div>
          <p className="eyebrow">Digital Product Passport</p>
          <h2>{po ? `Shipment ${po}` : 'Shipment PO-1234'}</h2>
          <p className="passport__status">
            <span className="status-pill status-pill--warn">Pending Verification</span>
          </p>
        </div>
        <div className="passport__meta">
          <div>
            <span className="muted">Net Mass</span>
            <strong>1,200 tons</strong>
          </div>
          <div>
            <span className="muted">HS Code</span>
            <strong>7208.39</strong>
          </div>
          <div>
            <span className="muted">Incoterms</span>
            <strong>FOB</strong>
          </div>
        </div>
      </div>

      <div className="passport__layout">
        <div className="passport__left">
          <div className="passport__card">
            <h3>Route map</h3>
            <div className="route-map">
              <div className="route-map__node">
                <span>CN</span>
                <p>Shanghai Mill</p>
              </div>
              <div className="route-map__line" />
              <div className="route-map__node">
                <span>DE</span>
                <p>Hamburg Port</p>
              </div>
            </div>
            <div className="route-map__timeline">
              <div>
                <span className="muted">Departed</span>
                <strong>Sep 28</strong>
              </div>
              <div>
                <span className="muted">ETA</span>
                <strong>Oct 12</strong>
              </div>
              <div>
                <span className="muted">Vessel</span>
                <strong>Pacific Horizon</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="passport__right">
          <div className="passport__card passport__card--stacked">
            <details className="passport__accordion" open>
              <summary>
                <span>Sanctions & Embargoes</span>
                <span className="status-pill status-pill--good">Cleared</span>
              </summary>
              <div className="passport__details">
                <p>Supplier Entity: Screened (Clear)</p>
                <p>Vessel: Screened (Clear)</p>
                <p>Origin Region: No UFLPA Hits</p>
              </div>
            </details>

            <details className="passport__accordion">
              <summary>
                <span>Tax & Tariff</span>
                <span className="status-pill status-pill--good">Calculated</span>
              </summary>
              <div className="passport__details">
                <p>Estimated Duty: $12,000</p>
                <p>VAT: $4,500</p>
                <p>Preferential Rate: 2.1%</p>
              </div>
            </details>

            <details className="passport__accordion" open>
              <summary>
                <span>ESG & CBAM</span>
                <span className="status-pill status-pill--warn">Action Required</span>
              </summary>
              <div className="passport__details">
                <p>
                  Missing actual emission data from Tier 2 supplier. Currently applying EU
                  Default Penalty Value (€85/ton).
                </p>
                <p>Request sent to supplier.</p>
              </div>
            </details>
          </div>
        </div>
      </div>

      <div className="passport__footer">
        <div>
          <p className="muted">Next action required before customs filing.</p>
        </div>
        <button className="button button--primary" type="button">
          Nudge Supplier for Data
        </button>
      </div>
    </section>
  );
}
