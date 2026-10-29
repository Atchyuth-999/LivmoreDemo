import React, { useState } from 'react';
import { api } from '../services/api';
import { MapPin, Phone, Mail, MessageCircle, Clock, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';
import '../styles/pages/contact.css';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [propertyType, setPropertyType] = useState('Penthouse / Apartment');
  const [budget, setBudget] = useState('$100,000 - $180,000');
  const [message, setMessage] = useState('');

  // Anti-spam honeypot & turnstile
  const [honeypot, setHoneypot] = useState('');
  const [turnstilePassed, setTurnstilePassed] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!phone.trim()) {
      setError('Please provide a phone number for our studio concierge.');
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
        turnstileToken: turnstilePassed ? 'turnstile_token_valid' : '',
        source: 'contact'
      });

      if (res.success) {
        setSuccess(true);
        setName('');
        setPhone('');
        setEmail('');
        setCity('');
        setMessage('');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error submitting form.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="container">
          <div className="section-header text-left" style={{ marginBottom: 0 }}>
            <span className="eyebrow">Studio Concierge</span>
            <h1>Initiate Your Consultation</h1>
            <p className="body-text" style={{ maxWidth: '680px' }}>
              We welcome commissions across New York, California, and select international locations. Fill in your project parameters below to book a discovery session.
            </p>
          </div>

          <div className="contact-grid">
            {/* Form Column */}
            <div className="contact-form-wrap">
              {success ? (
                <div className="success-banner">
                  <CheckCircle2 size={44} color="#16A34A" />
                  <h4>Thank you, we'll contact you soon</h4>
                  <p>
                    Your consultation request has been archived in our secure queue. Our principal design architect will review your project parameters and respond within 24 business hours.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="btn btn-outline btn-sm"
                    style={{ marginTop: '1rem' }}
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 style={{ marginBottom: '1.25rem' }}>Project Discovery Form</h3>

                  {error && (
                    <div style={{ padding: '0.75rem', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '4px', color: '#DC2626', fontSize: '0.8125rem', marginBottom: '1rem' }}>
                      {error}
                    </div>
                  )}

                  {/* Honeypot field (hidden from humans) */}
                  <input
                    type="text"
                    name="secondary_site"
                    className="hidden-honeypot"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="contact-name">
                        Full Name <span className="required">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        placeholder="Elena or Julian Vance"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="contact-phone">
                        Contact Phone <span className="required">*</span>
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        required
                        placeholder="+1 (555) 234-5678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="contact-email">
                        Email Address <span className="required">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        placeholder="client@sanctuary.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="contact-city">
                        Property City / Neighborhood
                      </label>
                      <input
                        id="contact-city"
                        type="text"
                        placeholder="e.g. Tribeca, New York or Palo Alto, CA"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="contact-property">Property Typology</label>
                      <select
                        id="contact-property"
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="form-select"
                      >
                        <option value="Penthouse / Apartment">Penthouse / Apartment</option>
                        <option value="Single-Family Villa">Single-Family Villa</option>
                        <option value="Modular Kitchen Overhaul">Modular Kitchen Overhaul</option>
                        <option value="Bespoke Wardrobe Suite">Bespoke Wardrobe Suite</option>
                        <option value="Boutique Commercial / Atelier">Boutique Commercial / Atelier</option>
                        <option value="Full Structural Renovation">Full Structural Renovation</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="contact-budget">Anticipated Investment</label>
                      <select
                        id="contact-budget"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="form-select"
                      >
                        <option value="$50,000 - $80,000">$50,000 - $80,000</option>
                        <option value="$80,000 - $140,000">$80,000 - $140,000</option>
                        <option value="$140,000 - $220,000">$140,000 - $220,000</option>
                        <option value="$220,000+">$220,000+ (Architectural Turnkey)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-msg">Space Parameters &amp; Vision</label>
                    <textarea
                      id="contact-msg"
                      rows={4}
                      placeholder="Tell us about the property condition, square footage, target move-in dates, and any stylistic preferences..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="form-textarea"
                    />
                  </div>

                  {/* Cloudflare Turnstile simulation */}
                  <div className="turnstile-box">
                    <div className="flex-align gap-2">
                      <ShieldCheck size={18} color="#2563EB" />
                      <span>Protected by Cloudflare Turnstile</span>
                    </div>
                    <span className="caption" style={{ color: '#059669', fontWeight: 600 }}>
                      Verified Active
                    </span>
                  </div>

                  <div className="flex-between" style={{ marginTop: '1.5rem' }}>
                    <span className="caption">
                      Zero commercial spam · Confidential blueprint review
                    </span>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary btn-lg"
                    >
                      {loading ? (
                        <span className="flex-align gap-2">
                          <Loader2 size={16} className="animate-spin" />
                          <span>Submitting Request...</span>
                        </span>
                      ) : (
                        'Request Free Consultation'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Studio Info Panel */}
            <div className="contact-info-panel">
              <div className="contact-info-card">
                <div className="contact-info-icon">
                  <MapPin size={22} />
                </div>
                <div className="contact-info-text">
                  <h4>Tribeca Design Studio</h4>
                  <p>184 Franklin Street, 4th Floor</p>
                  <p>Tribeca, New York, NY 10013</p>
                  <p className="caption" style={{ marginTop: '0.25rem' }}>By appointment only</p>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="contact-info-icon">
                  <Phone size={22} />
                </div>
                <div className="contact-info-text">
                  <h4>Direct Telephony</h4>
                  <p>Studio Desk: +1 (555) 234-5678</p>
                  <p>Concierge: +1 (555) 890-1234</p>
                  <p className="caption" style={{ marginTop: '0.25rem' }}>Mon–Fri, 9am–6pm EST</p>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="contact-info-icon">
                  <Mail size={22} />
                </div>
                <div className="contact-info-text">
                  <h4>Electronic Enquiries</h4>
                  <p>concierge@auraandoak.com</p>
                  <p>press@auraandoak.com</p>
                </div>
              </div>

              <div className="contact-info-card" style={{ backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }}>
                <div className="contact-info-icon" style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}>
                  <MessageCircle size={22} />
                </div>
                <div className="contact-info-text">
                  <h4 style={{ color: '#166534' }}>Instant WhatsApp Concierge</h4>
                  <p style={{ color: '#15803D' }}>Connect with our site coordinators directly via WhatsApp for quick site measurements or blueprint questions.</p>
                  <a
                    href="https://wa.me/15552345678"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: '0.75rem', display: 'inline-flex' }}
                  >
                    Open WhatsApp Chat
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Map Embed Simulation */}
          <div className="map-container">
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EDEAE4', color: '#57534E' }}>
              <MapPin size={32} color="var(--color-accent)" style={{ marginBottom: '0.5rem' }} />
              <h4 style={{ margin: 0 }}>Aura &amp; Oak Studio — Franklin St, Tribeca</h4>
              <p className="caption" style={{ marginTop: '4px' }}>Latitude 40.7188° N, Longitude 74.0094° W · Studio viewings scheduled upon initial project review</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
