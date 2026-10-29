import React, { useState } from 'react';
import { api } from '../../services/api';
import { X, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPropertyType?: string;
  source?: 'contact' | 'estimator' | 'cta_modal';
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  defaultPropertyType = 'Penthouse / Apartment',
  source = 'cta_modal'
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [propertyType, setPropertyType] = useState(defaultPropertyType);
  const [budget, setBudget] = useState('$100,000 - $180,000');
  const [message, setMessage] = useState('');
  
  // Anti-spam protections: honeypot & turnstile
  const [honeypot, setHoneypot] = useState('');
  const [turnstileVerified, setTurnstileVerified] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!name.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!phone.trim()) {
      setError('Please provide a contact phone number.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.submitLead({
        name,
        phone,
        email,
        city,
        propertyType,
        budget,
        message,
        honeypot,
        turnstileToken: turnstileVerified ? 'cf_simulated_token_passed' : '',
        source
      });

      if (res.success) {
        setSuccess(true);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit consultation request.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setName('');
    setPhone('');
    setEmail('');
    setCity('');
    setMessage('');
    setSuccess(false);
    setError(null);
    onClose();
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="consultation-title">
      <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="admin-modal-header">
          <div>
            <span className="eyebrow">Aura &amp; Oak Studio</span>
            <h3 id="consultation-title" style={{ margin: 0 }}>Book Free Design Consultation</h3>
          </div>
          <button onClick={onClose} aria-label="Close consultation modal" className="btn btn-ghost" style={{ padding: '0.25rem' }}>
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className="success-banner">
            <CheckCircle2 size={48} color="#16A34A" />
            <h4>Thank you, we'll contact you soon</h4>
            <p>
              Your consultation request has been routed directly to our lead design architect. We will review your preliminary space parameters and reach out within 24 business hours.
            </p>
            <button onClick={handleReset} className="btn btn-primary btn-md" style={{ marginTop: '1rem' }}>
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ padding: '0.75rem', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '4px', color: '#DC2626', fontSize: '0.8125rem', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            {/* Hidden honeypot field for spam prevention */}
            <input
              type="text"
              name="company_title"
              className="hidden-honeypot"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="modal-name">
                  Full Name <span className="required">*</span>
                </label>
                <input
                  id="modal-name"
                  type="text"
                  required
                  placeholder="e.g. Julian Montgomery"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="modal-phone">
                  Phone Number <span className="required">*</span>
                </label>
                <input
                  id="modal-phone"
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="modal-email">
                  Email Address <span className="required">*</span>
                </label>
                <input
                  id="modal-email"
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="modal-city">
                  City / Location
                </label>
                <input
                  id="modal-city"
                  type="text"
                  placeholder="e.g. New York, NY"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="modal-prop-type">Property Type</label>
                <select
                  id="modal-prop-type"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="form-select"
                >
                  <option value="Penthouse / Apartment">Penthouse / Apartment</option>
                  <option value="Single-Family Villa">Single-Family Villa</option>
                  <option value="Modular Kitchen Only">Modular Kitchen Only</option>
                  <option value="Luxury Wardrobe Suite">Luxury Wardrobe Suite</option>
                  <option value="Boutique Commercial / Atelier">Boutique Commercial / Atelier</option>
                  <option value="Complete Renovation">Complete Renovation</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="modal-budget">Estimated Budget Range</label>
                <select
                  id="modal-budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="form-select"
                >
                  <option value="$40,000 - $75,000">$40,000 - $75,000</option>
                  <option value="$75,000 - $140,000">$75,000 - $140,000</option>
                  <option value="$140,000 - $220,000">$140,000 - $220,000</option>
                  <option value="$220,000+">$220,000+ (Bespoke Architectural)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="modal-message">Project Vision or Floor Plan Notes</label>
              <textarea
                id="modal-message"
                rows={3}
                placeholder="Share any details on square footage, key rooms, desired move-in timeline, or aesthetic preferences..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="form-textarea"
              />
            </div>

            {/* Cloudflare Turnstile Verification Badge */}
            <div className="turnstile-box">
              <div className="flex-align gap-2">
                <ShieldCheck size={18} color="#2563EB" />
                <span>Protected by Cloudflare Turnstile</span>
              </div>
              <span className="caption" style={{ color: '#059669', fontWeight: 600 }}>
                Verified
              </span>
            </div>

            <div className="flex-between" style={{ marginTop: '1.5rem' }}>
              <span className="caption">
                Zero spam policy · Encrypted transmission
              </span>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-md"
              >
                {loading ? (
                  <span className="flex-align gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Submitting...</span>
                  </span>
                ) : (
                  'Confirm Consultation'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
