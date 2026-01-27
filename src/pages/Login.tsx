import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, apiGet } from '@app/api';

type User = {
  id?: number | null;
  email?: string | null;
  full_name?: string | null;
  is_active?: boolean | null;
  is_superuser?: boolean;
};

export default function Login() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (!code) return;

    const controller = new AbortController();
    setStatus('loading');
    setMessage('Completing Google sign-in...');

    apiGet<User>(`/api/v1/login/google/callback?code=${encodeURIComponent(code)}`, controller.signal)
      .then((user) => {
        localStorage.setItem('vtai_user', JSON.stringify(user));
        setStatus('success');
        setMessage(`Welcome back${user.full_name ? `, ${user.full_name}` : ''}.`);
        navigate('/panel', { replace: true });
      })
      .catch((error: Error) => {
        setStatus('error');
        setMessage(error.message || 'Google sign-in failed. Please try again.');
      });

    return () => controller.abort();
  }, [navigate]);

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/api/v1/login/google/authorize`;
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
        <form className="form">
          <label className="form__field">
            <span>Email</span>
            <input type="email" placeholder="you@company.com" />
          </label>
          <label className="form__field">
            <span>Password</span>
            <input type="password" placeholder="••••••••" />
          </label>
          <button className="button button--primary" type="submit">
            Sign in
          </button>
          <button className="button button--ghost" type="button" onClick={handleGoogleLogin}>
            Continue with Google
          </button>
          <button className="button button--ghost" type="button">
            Request access
          </button>
        </form>
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
