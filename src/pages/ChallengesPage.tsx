import { useEffect, useState } from 'react';

type ChallengeEvidence = {
  source_name: string;
  url: string;
  published_at: string;
  quote: string;
  credibility: string;
};

type ChallengeItem = {
  title: string;
  summary: string;
  challenge_type: string;
  impact_area: string[];
  severity: string;
  time_horizon: string;
  uk_relevance: string;
  eu_relevance: string;
  affected_sectors: string[];
  evidence: ChallengeEvidence[];
  confidence: number;
  dedupe_key: string;
};

type ChallengesResponse = {
  run_id: string;
  scope: Record<string, unknown>;
  items: ChallengeItem[];
  stats: Record<string, unknown>;
};

const CHALLENGES_URL =
  'https://challenge.veritariffai.co/runs/2026-02-01T15%3A34%3A38.226980/challenges';

function formatConfidence(value: number) {
  const normalized = Math.max(0, Math.min(1, value));
  return `${Math.round(normalized * 100)}%`;
}

export default function ChallengesPage() {
  const [data, setData] = useState<ChallengesResponse | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    setStatus('loading');
    fetch(CHALLENGES_URL)
      .then(async (response) => {
        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || `Request failed: ${response.status}`);
        }
        return response.json() as Promise<ChallengesResponse>;
      })
      .then((payload) => {
        if (!active) return;
        setData(payload);
        setStatus('success');
      })
      .catch((error: Error) => {
        if (!active) return;
        setStatus('error');
        setMessage(error.message);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="page challenges">
      <div className="challenges__header">
        <div>
          <p className="eyebrow">Challenges</p>
          <h2>Regulatory & compliance alerts</h2>
          <p className="muted">
            Live intelligence from TradeFlow signals. Run ID: {data?.run_id ?? '—'}
          </p>
        </div>
        <div className="challenges__stats">
          <div>
            <span className="muted">Total items</span>
            <strong>{data?.items?.length ?? 0}</strong>
          </div>
          <div>
            <span className="muted">Last refresh</span>
            <strong>Today</strong>
          </div>
        </div>
      </div>

      {status === 'loading' && <p className="status status--loading">Loading challenges…</p>}
      {status === 'error' && <p className="status status--error">{message}</p>}

      {status === 'success' && data && (
        <div className="challenges__grid">
          {data.items.map((item) => (
            <article key={item.dedupe_key} className="challenge-card">
              <div className="challenge-card__head">
                <div>
                  <p className="challenge-card__type">{item.challenge_type}</p>
                  <h3>{item.title}</h3>
                  <p className="muted">{item.summary}</p>
                </div>
                <div className="challenge-card__meta">
                  <span className={`severity severity--${item.severity}`}>{item.severity}</span>
                  <span className="pill">{item.time_horizon}</span>
                  <span className="pill">{item.uk_relevance} · UK</span>
                  <span className="pill">{item.eu_relevance} · EU</span>
                </div>
              </div>

              <div className="challenge-card__tags">
                {item.impact_area.map((area) => (
                  <span key={area} className="tag">
                    {area}
                  </span>
                ))}
                {item.affected_sectors.map((sector) => (
                  <span key={sector} className="tag tag--muted">
                    {sector}
                  </span>
                ))}
              </div>

              <div className="challenge-card__confidence">
                <span className="muted">Confidence</span>
                <strong>{formatConfidence(item.confidence)}</strong>
              </div>

              {item.evidence.length > 0 && (
                <div className="challenge-card__evidence">
                  <h4>Evidence</h4>
                  <ul>
                    {item.evidence.map((evidence) => (
                      <li key={`${item.dedupe_key}-${evidence.url}`}>
                        <div>
                          <strong>{evidence.source_name}</strong>
                          <span className="muted">{evidence.published_at}</span>
                        </div>
                        <p>{evidence.quote}</p>
                        <a href={evidence.url} target="_blank" rel="noreferrer">
                          {evidence.url}
                        </a>
                        <span className={`credibility credibility--${evidence.credibility}`}>
                          {evidence.credibility}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
