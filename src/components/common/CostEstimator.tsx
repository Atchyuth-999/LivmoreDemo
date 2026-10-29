import React, { useState } from 'react';
import { api } from '../../services/api';
import { Calculator, ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface CostEstimatorProps {
  onOpenConsultationWithLead?: (estimateData: {
    areaSqFt: number;
    bhk: string;
    packageTier: string;
    range: string;
  }) => void;
}

export const CostEstimator: React.FC<CostEstimatorProps> = ({ onOpenConsultationWithLead }) => {
  const [areaSqFt, setAreaSqFt] = useState(2400);
  const [bhk, setBhk] = useState('3 BHK');
  const [packageTier, setPackageTier] = useState<'essential' | 'premium' | 'bespoke'>('premium');

  // Quick saved-lead inline form state
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  const estimate = api.calculateEstimate(areaSqFt, bhk, packageTier);

  const handleSaveLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email) return;
    setSaving(true);
    try {
      await api.submitLead({
        name,
        phone,
        email,
        city: 'Saved via Estimator',
        propertyType: `${bhk} (${areaSqFt} sq.ft)`,
        budget: estimate.estimatedRange,
        message: `Client generated cost estimate: ${estimate.estimatedRange} for ${areaSqFt} sq.ft ${bhk} with ${packageTier.toUpperCase()} tier specifications.`,
        source: 'estimator',
        honeypot,
        turnstileToken: 'turnstile_verified'
      });
      setSavedSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="estimator-wrapper">
      <div className="estimator-grid">
        {/* Controls Column */}
        <div className="estimator-controls">
          <div>
            <div className="flex-align gap-2" style={{ marginBottom: '0.5rem' }}>
              <Calculator size={18} color="var(--color-accent)" />
              <span className="eyebrow" style={{ margin: 0 }}>Interactive Studio Estimator</span>
            </div>
            <h3 style={{ margin: 0 }}>Tailor Your Specifications</h3>
            <p className="body-secondary" style={{ marginTop: '0.25rem' }}>
              Adjust square footage, configuration, and material craftsmanship level to calculate an instant cost bracket.
            </p>
          </div>

          {/* Area Slider */}
          <div className="form-group" style={{ margin: 0 }}>
            <div className="flex-between">
              <label className="form-label">Total Carpet Area</label>
              <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{areaSqFt.toLocaleString()} sq.ft</span>
            </div>
            <input
              type="range"
              min={600}
              max={6500}
              step={50}
              value={areaSqFt}
              onChange={(e) => setAreaSqFt(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--color-text-primary)', cursor: 'pointer' }}
            />
            <div className="flex-between caption" style={{ marginTop: '4px' }}>
              <span>600 sq.ft (Studio)</span>
              <span>6,500+ sq.ft (Estate)</span>
            </div>
          </div>

          {/* Configuration / BHK selector */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Layout Configuration</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
              {['1 BHK', '2 BHK', '3 BHK', '4+ BHK / Villa'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setBhk(opt)}
                  className={`btn btn-sm ${bhk === opt ? 'btn-primary' : 'btn-outline'}`}
                  style={{ padding: '0.5rem 0.25rem', fontSize: '0.75rem' }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Package Tier Selection */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Craftsmanship &amp; Finish Tier</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {[
                { id: 'essential', label: 'Essential', sub: 'MDF & Polish ($45/ft)' },
                { id: 'premium', label: 'Premium Oak', sub: 'Smoked Veneers ($75/ft)' },
                { id: 'bespoke', label: 'Bespoke Stone', sub: 'Marble & Brass ($115/ft)' }
              ].map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setPackageTier(tier.id as any)}
                  className={`btn ${packageTier === tier.id ? 'btn-primary' : 'btn-outline'}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '0.625rem 0.75rem',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{tier.label}</span>
                  <span style={{ fontSize: '0.6875rem', opacity: 0.8 }}>{tier.sub}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calculation Result & Save Card */}
        <div className="estimator-result-card">
          <div>
            <span className="caption" style={{ color: '#A8A29E', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Projected Investment Bracket
            </span>
            <div className="estimator-price-display tabular-nums">
              {estimate.estimatedRange}
            </div>
            <p style={{ color: '#D6D3D1', fontSize: '0.8125rem', lineHeight: 1.5 }}>
              Includes architectural space planning, custom joinery, electrical schematics, civil preparation, and turnkey site supervision.
            </p>

            {/* Estimated Line Item Breakdown */}
            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <span style={{ fontSize: '0.75rem', color: '#A8A29E', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Estimated Trade Allocation
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.5rem', fontSize: '0.8125rem' }}>
                <div className="flex-between">
                  <span style={{ color: '#A8A29E' }}>Custom Joinery &amp; Millwork (38%)</span>
                  <span className="tabular-nums" style={{ color: '#FFFFFF' }}>${estimate.breakdown.modularJoinery.toLocaleString()}</span>
                </div>
                <div className="flex-between">
                  <span style={{ color: '#A8A29E' }}>Civil, Flooring &amp; Stone (28%)</span>
                  <span className="tabular-nums" style={{ color: '#FFFFFF' }}>${estimate.breakdown.civilAndFlooring.toLocaleString()}</span>
                </div>
                <div className="flex-between">
                  <span style={{ color: '#A8A29E' }}>Circadian Lighting &amp; MEP (18%)</span>
                  <span className="tabular-nums" style={{ color: '#FFFFFF' }}>${estimate.breakdown.electricalAndLighting.toLocaleString()}</span>
                </div>
                <div className="flex-between">
                  <span style={{ color: '#A8A29E' }}>Finishing, Paint &amp; Styling (16%)</span>
                  <span className="tabular-nums" style={{ color: '#FFFFFF' }}>${estimate.breakdown.finishingAndStyling.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Save / Book actions */}
          <div>
            {savedSuccess ? (
              <div style={{ padding: '0.75rem', backgroundColor: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22C55E', borderRadius: '4px', color: '#86EFAC', fontSize: '0.8125rem' }}>
                <div className="flex-align gap-2">
                  <CheckCircle2 size={16} />
                  <span>Estimate archived! A partner architect will reach out shortly.</span>
                </div>
              </div>
            ) : showSaveForm ? (
              <form onSubmit={handleSaveLead} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input
                  type="text"
                  name="bot_field"
                  className="hidden-honeypot"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                />
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  style={{ backgroundColor: '#292524', borderColor: '#44403C', color: '#FFFFFF', fontSize: '0.8125rem', height: '36px' }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <input
                    type="tel"
                    required
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-input"
                    style={{ backgroundColor: '#292524', borderColor: '#44403C', color: '#FFFFFF', fontSize: '0.8125rem', height: '36px' }}
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    style={{ backgroundColor: '#292524', borderColor: '#44403C', color: '#FFFFFF', fontSize: '0.8125rem', height: '36px' }}
                  />
                </div>
                <div className="flex-between" style={{ marginTop: '0.25rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowSaveForm(false)}
                    className="btn btn-ghost btn-sm"
                    style={{ color: '#A8A29E', padding: 0 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn btn-secondary btn-sm"
                  >
                    {saving ? 'Saving...' : 'Lock In Estimate'}
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowSaveForm(true)}
                  className="btn btn-secondary btn-md"
                  style={{ flexGrow: 1 }}
                >
                  <span className="flex-align gap-2">
                    <Sparkles size={16} />
                    <span>Save As Lead</span>
                  </span>
                </button>
                {onOpenConsultationWithLead && (
                  <button
                    type="button"
                    onClick={() =>
                      onOpenConsultationWithLead({
                        areaSqFt,
                        bhk,
                        packageTier,
                        range: estimate.estimatedRange
                      })
                    }
                    className="btn btn-outline btn-md"
                    style={{ borderColor: 'rgba(255, 255, 255, 0.3)', color: '#FFFFFF' }}
                  >
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
