import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, apiGet, apiGetOptionalJson, setTokens } from '@app/api';

type User = {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  plan?: string | null;
};

type MeResponse = {
  user: User;
  upgrade_available: boolean;
  needs_companies_house_link: boolean;
  needs_vat: boolean;
  requires_manual_eori: boolean;
};

type TokenPair = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

export default function Login() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    if (!code || !state) return;

    const provider = sessionStorage.getItem('oauth_provider') ?? 'google';
    sessionStorage.removeItem('oauth_provider');

    const controller = new AbortController();
    setStatus('loading');
    setMessage('Completing Google sign-in...');

    apiGetOptionalJson<TokenPair>(
      `/api/v1/auth/${provider}/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(
        state
      )}`,
      controller.signal
    )
      .then((tokens) => {
        if (tokens?.access_token) {
          setTokens(tokens.access_token, tokens.refresh_token);
        }
        return apiGet<MeResponse>('/api/v1/me', controller.signal);
      })
      .then((me) => {
        localStorage.setItem('vtai_user', JSON.stringify(me.user));
        setStatus('success');
        const name = [me.user.first_name, me.user.last_name].filter(Boolean).join(' ');
        setMessage(`Welcome back${name ? `, ${name}` : ''}.`);
        navigate('/panel', { replace: true });
      })
      .catch((error: Error) => {
        setStatus('error');
        setMessage(error.message || 'Google sign-in failed. Please try again.');
      });

    return () => controller.abort();
  }, [navigate]);

  const handleGoogleLogin = () => {
    sessionStorage.setItem('oauth_provider', 'google');
    window.location.href = `${API_BASE_URL}/api/v1/auth/google/login`;
  };

  const handleMicrosoftLogin = () => {
    sessionStorage.setItem('oauth_provider', 'microsoft');
    window.location.href = `${API_BASE_URL}/api/v1/auth/microsoft/login`;
  };

  return (
    <section className="page login">
      <div className="login__panel">
        <div>
          <p className="eyebrow">WELCOME BACK</p>
          <h2>Sign in to your command panel</h2>
          <p className="muted">
            Use your organization email or continue with Google to keep compliance activity tracked by role.
          </p>
          {status !== 'idle' && <p className={`status status--${status}`}>{message}</p>}
        </div>
        <div className="form">
          <button className="button button--primary" type="button" onClick={handleGoogleLogin}>
            Login with Google
          </button>
          <button className="button button--ghost" type="button" onClick={handleMicrosoftLogin}>
            Login with Microsoft
          </button>
        </div>
      </div>
      <aside className="login__aside">
        <div className="aside__card">
          <h3>Security posture</h3>
          <p className="muted">
            SOC 2 ready workflows, MFA support, and role-based access controls.
          </p>
        </div>
        <div className="aside__card aside__card--accent">
          <h3>Need a workspace?</h3>
          <p className="muted">
            Spin up a sandbox and connect to your FastAPI environment in minutes.
          </p>
        </div>
      </aside>
    </section>
  );
}
