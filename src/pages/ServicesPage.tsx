import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Service } from '../services/mockData';
import { CostEstimator } from '../components/common/CostEstimator';
import { CheckCircle2, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import '../styles/pages/services.css';

interface ServicesPageProps {
  onOpenConsultation: () => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onOpenConsultation }) => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    api.getServices().then(setServices);
  }, []);

  const timelineSteps = [
    {
      idx: '01',
      title: 'Architectural Discovery & Blueprint Audit',
      summary: 'Site inspection, laser measurement, zoning analysis, and preliminary investment brackets.',
      detail: 'Our principal architect meets with you on-site or via structured video conference to audit your architectural CAD drawings, sunlight pathing, and lifestyle rituals. We establish non-negotiable budget bounds upfront.'
    },
    {
      idx: '02',
      title: 'Concept Ideation & Circadian Lighting Choreography',
      summary: 'Mood boards, tactile physical material samples, and 2D spatial layouts.',
      detail: 'We prepare 2-3 distinct spatial layout schematics optimizing circulation, natural ventilation, and daylight. You receive a curated material box featuring actual stone, timber veneer, and fabric swatches.'
    },
    {
      idx: '03',
      title: 'Unreal Engine 5 Photorealistic 3D Visualization',
      summary: 'Full-room VR previews and 360-degree panoramas.',
      detail: 'Step inside your redesigned residence before a single timber slat is cut. Experience accurate morning and twilight illumination, verify finishes, and finalize line-item BOQs without ambiguities.'
    },
    {
      idx: '04',
      title: 'Precision Factory Fabrication & Site Civil Works',
      summary: 'German CNC millwork, MEP coordination, and weekly milestone logs.',
      detail: 'Civil demolition, acoustic subflooring, concealed AC ducting, and plumbing rough-ins proceed concurrently with CNC furniture fabrication. You receive weekly photo/video logs from our dedicated site director.'
    },
    {
      idx: '05',
      title: 'White-Glove Styling, Air Purge & Turnkey Handover',
      summary: 'Final art installation, deep cleaning, and 10-year warranty certification.',
      detail: 'Our styling team dresses every corner with curated ceramics, linen bedding, and architectural greenery. Air quality is purged, mechanical systems tested, and keys handed over with a comprehensive warranty packet.'
    }
  ];

  return (
    <div className="services-page">
      {/* 1. Services Hero */}
      <section className="services-hero">
        <div className="container">
          <div className="section-header text-left" style={{ marginBottom: 0 }}>
            <span className="eyebrow">Studio Capabilities</span>
            <h1>Comprehensive Architecture &amp; Turnkey Execution</h1>
            <p className="body-text" style={{ maxWidth: '720px' }}>
              We bridge the traditional divide between visionary design architects and master craft builders. From boutique modular kitchens to complete multi-level estate transformations.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Detailed Service Features (Alternating Layout) */}
      <section className="section">
        <div className="container">
          {services.map((srv) => (
            <div key={srv.id} id={srv.slug} className="service-feature-card">
              <div className="service-media">
                <img
                  src={srv.imageUrl}
                  alt={srv.title}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>

              <div className="service-content">
                <span className="eyebrow" style={{ margin: 0 }}>Practice Discipline</span>
                <h2 style={{ fontSize: '1.75rem' }}>{srv.title}</h2>
                <p className="body-text" style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>
                  {srv.tagline}
                </p>
                <p className="body-secondary">
                  {srv.description}
                </p>

                <div className="service-features-list">
                  {srv.features.map((feat, i) => (
                    <div key={i} className="service-feature-item">
                      <CheckCircle2 size={16} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="flex-align" style={{ gap: '1.5rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                  <div className="flex-align gap-2">
                    <Clock size={16} color="var(--color-accent)" />
                    <span className="caption" style={{ fontWeight: 600 }}>Delivery: {srv.deliveryTime}</span>
                  </div>
                  <div className="flex-align gap-2">
                    <ShieldCheck size={16} color="var(--color-accent)" />
                    <span className="caption" style={{ fontWeight: 600 }}>10-Year Warranty</span>
                  </div>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <button onClick={onOpenConsultation} className="btn btn-primary btn-md">
                    Inquire for {srv.title}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Timeline / Process */}
      <section className="section section-bg-subtle">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Structured Delivery</span>
            <h2>Our 5-Stage Turnkey Methodology</h2>
            <p className="body-text">
              Eliminating homeowner anxiety through complete design clarity, fixed milestone contracts, and dedicated single-point leadership.
            </p>
          </div>

          <div className="process-timeline">
            {timelineSteps.map((step) => (
              <div key={step.idx} className="timeline-step">
                <div className="timeline-step-index">{step.idx}</div>
                <div className="timeline-step-info">
                  <h3>{step.title}</h3>
                  <p>{step.summary}</p>
                </div>
                <div className="timeline-step-detail">
                  {step.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Embedded Cost Estimator */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Budget Transparency</span>
            <h2>Project Cost Calculator</h2>
            <p className="body-text">
              Estimate realistic investment ranges for your apartment, villa, or commercial space before scheduling your consultation.
            </p>
          </div>

          <CostEstimator
            onOpenConsultationWithLead={(_est) => {
              onOpenConsultation();
            }}
          />
        </div>
      </section>

      {/* 5. CTA */}
      <section className="cta-band">
        <div className="container">
          <div className="cta-band-content">
            <span className="eyebrow" style={{ color: 'var(--color-accent)' }}>Get Started</span>
            <h2>Discuss Your Scope With An Architect</h2>
            <p>
              Whether you are acquiring a new property or renovating your current residence, our discovery review sets the foundation for flawless execution.
            </p>
            <button
              onClick={onOpenConsultation}
              className="btn btn-secondary btn-lg"
              style={{ marginTop: '0.5rem' }}
            >
              <Sparkles size={16} />
              <span>Book Discovery Consultation</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
