import React from 'react';
import { CostEstimator } from '../components/common/CostEstimator';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

interface EstimatorPageProps {
  onOpenConsultation: () => void;
}

export const EstimatorPage: React.FC<EstimatorPageProps> = ({ onOpenConsultation }) => {
  return (
    <div className="estimator-page" style={{ paddingTop: '110px', paddingBottom: '5rem' }}>
      <div className="container">
        <div className="section-header text-left" style={{ marginBottom: '2rem' }}>
          <span className="eyebrow">Financial Rigor</span>
          <h1>Turnkey Project Cost Estimator</h1>
          <p className="body-text" style={{ maxWidth: '720px' }}>
            We believe in upfront budget transparency. Calculate realistic investment ranges for full-home renovations, penthouses, or new apartments based on verified material and labor rates.
          </p>
        </div>

        <CostEstimator
          onOpenConsultationWithLead={() => {
            onOpenConsultation();
          }}
        />

        <div className="grid-3" style={{ marginTop: '4rem' }}>
          <div className="card" style={{ padding: '1.5rem', backgroundColor: '#FFFFFF' }}>
            <div className="flex-align gap-2" style={{ marginBottom: '0.5rem', color: 'var(--color-accent)' }}>
              <ShieldCheck size={20} />
              <h4 style={{ margin: 0, fontSize: '1rem' }}>No Mid-Project Price Escalation</h4>
            </div>
            <p className="body-secondary">
              Once materials, joinery drawings, and fixtures are frozen, our contracts guarantee zero unexpected surcharges.
            </p>
          </div>

          <div className="card" style={{ padding: '1.5rem', backgroundColor: '#FFFFFF' }}>
            <div className="flex-align gap-2" style={{ marginBottom: '0.5rem', color: 'var(--color-accent)' }}>
              <CheckCircle2 size={20} />
              <h4 style={{ margin: 0, fontSize: '1rem' }}>Itemized BOQ Transparency</h4>
            </div>
            <p className="body-secondary">
              You receive full Bill of Quantities documentation detailing every board of timber, square foot of stone, and hinge mechanism.
            </p>
          </div>

          <div className="card" style={{ padding: '1.5rem', backgroundColor: '#FFFFFF' }}>
            <div className="flex-align gap-2" style={{ marginBottom: '0.5rem', color: 'var(--color-accent)' }}>
              <CheckCircle2 size={20} />
              <h4 style={{ margin: 0, fontSize: '1rem' }}>Milestone-Linked Payments</h4>
            </div>
            <p className="body-secondary">
              Payments are tied strictly to physical verification of completed site milestones (Demolition, MEP, Joinery, Handover).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
