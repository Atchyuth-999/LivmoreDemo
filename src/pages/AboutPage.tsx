import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { TeamMember } from '../services/mockData';
import { Award, Compass, Eye, ShieldCheck, Sparkles } from 'lucide-react';
import '../styles/pages/about.css';

interface AboutPageProps {
  onOpenConsultation: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenConsultation }) => {
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    api.getTeam().then(setTeam);
  }, []);

  const values = [
    {
      title: 'Proportion & Negative Space',
      desc: 'True luxury lies not in ornamentation, but in generous negative space, intentional axis alignment, and unhurried natural lighting.'
    },
    {
      title: 'Material Provenance',
      desc: 'We select stones and timbers that age with poetic patina—untreated European linens, honed travertines, and smoke-patinated French oak.'
    },
    {
      title: 'Accountable Engineering',
      desc: 'A beautiful rendering is worthless if on-site execution fails. We take single-point turnkey responsibility for every joint, pipe, and cable.'
    }
  ];

  const awards = [
    { year: '2025', name: 'Architectural Digest Top 50 Studios', category: 'Residential Interior Design' },
    { year: '2024', name: 'Frame Awards Winner', category: 'Best Material Craft & Innovation' },
    { year: '2023', name: 'Dezeen Awards Longlist', category: 'Urban Apartment Transformation' },
    { year: '2022', name: 'AIA Merit Citation', category: 'Interior Architecture Excellence' }
  ];

  return (
    <div className="about-page">
      {/* 1. Hero */}
      <section className="about-hero">
        <div className="container">
          <div className="story-split">
            <div>
              <span className="eyebrow">Studio Pedigree</span>
              <h1>Founded on Architectural Rigor &amp; Quiet Beauty</h1>
              <p className="body-text" style={{ fontSize: '1.0625rem', marginTop: '1rem' }}>
                Aura &amp; Oak was founded in 2010 by Elena Vance with a singular thesis: homes should be tranquil sanctuaries immune to ephemeral trend cycles.
              </p>
              <p className="body-secondary" style={{ marginTop: '0.75rem' }}>
                Today, our multidisciplinary team of licensed architects, interior designers, and master carpentry project managers operate between our Tribeca studio and West Coast commissions, overseeing high-craft residential and boutique commercial spaces.
              </p>
              <div style={{ marginTop: '1.5rem' }}>
                <button onClick={onOpenConsultation} className="btn btn-primary btn-md">
                  Book A Studio Consultation
                </button>
              </div>
            </div>

            <div className="story-media">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                alt="Aura and Oak studio design workshop"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Values */}
      <section className="section section-bg-subtle">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Guiding Tenets</span>
            <h2>Our Architectural Values</h2>
            <p className="body-text">
              The fundamental principles that guide every sketch, joint, and material selection in our studio.
            </p>
          </div>

          <div className="values-grid">
            {values.map((val, i) => (
              <div key={i} className="value-card">
                <span className="eyebrow" style={{ color: 'var(--color-accent)' }}>Tenet 0{i + 1}</span>
                <h3>{val.title}</h3>
                <p className="body-secondary">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Team Profiles (3-in-a-row per section 2.C) */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Studio Leadership</span>
            <h2>The Architectural Principals</h2>
            <p className="body-text">
              Licensed architects and construction veterans leading your project from first concept to final key handover.
            </p>
          </div>

          <div className="team-grid">
            {team.map((member) => (
              <div key={member.id} className="team-card">
                <div className="team-avatar">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>
                <div className="team-info">
                  <h4>{member.name}</h4>
                  <div className="role">{member.role}</div>
                  <p>{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Awards & Citations */}
      <section className="section section-bg-subtle">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Recognition</span>
            <h2>Honors &amp; Citations</h2>
          </div>

          <div className="awards-strip">
            {awards.map((award, idx) => (
              <div key={idx} className="award-item">
                <div className="award-year">{award.year}</div>
                <h4 style={{ fontSize: '0.9375rem', marginBottom: '4px' }}>{award.name}</h4>
                <p className="caption">{award.category}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA */}
      <section className="cta-band">
        <div className="container">
          <div className="cta-band-content">
            <span className="eyebrow" style={{ color: 'var(--color-accent)' }}>Meet With Us</span>
            <h2>Begin Your Residential Journey</h2>
            <p>
              Our design principals accept a limited number of turnkey commissions annually to guarantee uncompromising quality control.
            </p>
            <button
              onClick={onOpenConsultation}
              className="btn btn-secondary btn-lg"
              style={{ marginTop: '0.5rem' }}
            >
              <Sparkles size={16} />
              <span>Inquire for Upcoming Calendar</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
