import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Lock, Mail, ShieldAlert, KeyRound, Loader2, Compass } from 'lucide-react';
import '../../styles/pages/admin.css';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@auraandoak.com');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.adminLogin(email, password);
      navigate('/admin/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F7F4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div className="admin-login-card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="flex-center" style={{ gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span className="header-brand-mark">
              <Compass size={14} />
            </span>
            <span style={{ fontWeight: 700, fontSize: '1.125rem' }}>Aura &amp; Oak</span>
          </div>
          <span className="eyebrow" style={{ margin: 0 }}>Restricted Portal</span>
          <h2 style={{ fontSize: '1.5rem', marginTop: '0.25rem' }}>Owner Administration</h2>
          <p className="caption" style={{ marginTop: '0.25rem' }}>
            Single-Admin cryptographic authentication (JWT + HttpOnly cookies)
          </p>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '4px', color: '#DC2626', fontSize: '0.8125rem', marginBottom: '1.25rem' }}>
            <ShieldAlert size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-email">Admin Email</label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.25rem' }}
              />
              <Mail size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#78716C' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="admin-password">Master Key / Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.25rem' }}
              />
              <Lock size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#78716C' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '1rem' }}
          >
            {loading ? (
              <span className="flex-align gap-2">
                <Loader2 size={16} className="animate-spin" />
                <span>Verifying Signature...</span>
              </span>
            ) : (
              <span className="flex-align gap-2">
                <KeyRound size={16} />
                <span>Authenticate Session</span>
              </span>
            )}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', padding: '0.75rem', backgroundColor: '#FAF5EF', border: '1px solid #EADBCC', borderRadius: '4px', fontSize: '0.75rem', color: '#78350F' }}>
          <strong>Default Admin Demo Credentials:</strong><br />
          Email: <code>admin@auraandoak.com</code><br />
          Password: <code>Password123!</code>
        </div>
      </div>
    </div>
  );
};
