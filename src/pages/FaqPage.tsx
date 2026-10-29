import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FaqItem } from '../services/mockData';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FaqPageProps {
  onOpenConsultation: () => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ onOpenConsultation }) => {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({ 'f-01': true, 'f-02': true });

  useEffect(() => {
    api.getFaqs().then(setFaqs);
  }, []);

  const toggle = (id: string) => {
    setOpenIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="faq-page" style={{ paddingTop: '110px', paddingBottom: '5rem' }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        <div className="section-header text-left">
          <span className="eyebrow">Client Inquiries</span>
          <h1>Frequently Asked Questions</h1>
          <p className="body-text">
            Everything you need to know about our architectural contracts, material provenance, payment schedules, and on-site turnkey supervision.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
          {faqs.map((f) => (
            <div
              key={f.id}
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}
            >
              <button
                type="button"
                onClick={() => toggle(f.id)}
                className="flex-between"
                style={{
                  width: '100%',
                  padding: '1.25rem 1.5rem',
                  textAlign: 'left',
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: 'var(--color-text-primary)'
                }}
              >
                <span>{f.question}</span>
                {openIds[f.id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {openIds[f.id] && (
                <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', color: 'var(--color-text-secondary)', fontSize: '0.9375rem', lineHeight: 1.65, borderTop: '1px solid var(--color-border-subtle)', paddingTop: '1rem' }}>
                  {f.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: '3rem', padding: '2rem', backgroundColor: 'var(--color-canvas-subtle)', borderRadius: '4px', textAlign: 'center' }}>
          <h4>Have an unlisted question regarding your floor plan?</h4>
          <p className="body-secondary" style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
            Our principal architect Elena Vance personally reviews and responds to all floor plan inquiries.
          </p>
          <button onClick={onOpenConsultation} className="btn btn-primary btn-md">
            Schedule Discovery Review
          </button>
        </div>
      </div>
    </div>
  );
};
