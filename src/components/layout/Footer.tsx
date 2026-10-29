import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Compass, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.subscribeNewsletter(email, honeypot);
      setSubscribed(true);
      setEmail('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          {/* Brand Column */}
          <div className="footer-brand">
            <div className="flex-align" style={{ gap: '0.5rem', marginBottom: '1rem' }}>
              <span className="header-brand-mark">
                <Compass size={14} />
              </span>
              <h4 style={{ margin: 0, color: '#FFFFFF' }}>Aura &amp; Oak</h4>
            </div>
            <p>
              Interior architecture and turnkey design studio crafting spaces of intentional proportion, calm materiality, and enduring craft.
            </p>
            <div style={{ marginTop: '1.25rem' }}>
              <p style={{ fontSize: '0.8125rem', color: '#78716C' }}>
                Tribeca Studio: 184 Franklin St, New York, NY<br />
                Direct Enquiries: concierge@auraandoak.com
              </p>
            </div>
          </div>

          {/* Column 1: Studio */}
          <div className="footer-col">
            <h5>Studio</h5>
            <div className="footer-links">
              <Link to="/portfolio" className="footer-link">Selected Works</Link>
              <Link to="/about" className="footer-link">Our Philosophy &amp; Team</Link>
              <Link to="/estimator" className="footer-link">Cost Estimator</Link>
              <Link to="/journal" className="footer-link">Architectural Gazette</Link>
              <Link to="/faq" className="footer-link">Client FAQs</Link>
            </div>
          </div>

          {/* Column 2: Practices */}
          <div className="footer-col">
            <h5>Practices</h5>
            <div className="footer-links">
              <Link to="/services" className="footer-link">Full-Home Turnkey</Link>
              <Link to="/services" className="footer-link">Residential Architecture</Link>
              <Link to="/services" className="footer-link">Modular Kitchens</Link>
              <Link to="/services" className="footer-link">Luxury Dressing Suites</Link>
              <Link to="/services" className="footer-link">3D Photoreal Renders</Link>
            </div>
          </div>

          {/* Column 3: Newsletter Gazette */}
          <div className="footer-col">
            <h5>Architectural Gazette</h5>
            <p style={{ fontSize: '0.8125rem', color: '#A8A29E', marginBottom: '1rem' }}>
              A monthly private dispatch on material provenance, spatial acoustics, and lighting choreography.
            </p>

            {subscribed ? (
              <div className="flex-align gap-2" style={{ color: '#86EFAC', fontSize: '0.8125rem' }}>
                <CheckCircle2 size={16} />
                <span>You are subscribed to the private dispatch.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {/* Honeypot field for bot protection */}
                <input
                  type="text"
                  name="website_source"
                  className="hidden-honeypot"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
                
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  style={{ backgroundColor: '#292524', borderColor: '#44403C', color: '#FFFFFF', fontSize: '0.8125rem' }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-secondary btn-sm"
                  style={{ alignSelf: 'flex-start' }}
                >
                  {loading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} Aura &amp; Oak Interior Architecture Ltd. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/privacy" className="footer-link">Privacy Policy</Link>
            <Link to="/terms" className="footer-link">Terms of Service</Link>
            <Link to="/contact" className="footer-link">Studio Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
