import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Project } from '../services/mockData';
import { BeforeAfterSlider } from '../components/common/BeforeAfterSlider';
import { ArrowLeft, Clock, MapPin, Maximize2, DollarSign, Palette, Sparkles, ChevronRight } from 'lucide-react';
import '../styles/pages/project-detail.css';

interface ProjectDetailPageProps {
  onOpenConsultation: () => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ onOpenConsultation }) => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (slug) {
      api.getProjectBySlug(slug).then((proj) => {
        if (proj) {
          setProject(proj);
          api.getProjects().then((all) => {
            setRelatedProjects(all.filter((p) => p.slug !== slug).slice(0, 2));
          });
        }
      });
    }
  }, [slug]);

  if (!project) {
    return (
      <div className="container" style={{ padding: '160px 0', textAlign: 'center' }}>
        <h2>Commission Not Found</h2>
        <p className="body-secondary" style={{ marginTop: '0.5rem' }}>
          The requested architectural case study could not be located in our archives.
        </p>
        <Link to="/portfolio" className="btn btn-primary btn-md" style={{ marginTop: '1.5rem' }}>
          Return to Portfolio
        </Link>
      </div>
    );
  }

  return (
    <div className="project-detail-page">
      {/* 1. Hero & Header */}
      <section className="project-hero">
        <div className="container">
          <Link to="/portfolio" className="btn-link flex-align gap-1" style={{ marginBottom: '1.5rem', fontSize: '0.8125rem' }}>
            <ArrowLeft size={16} />
            <span>Return to Portfolio</span>
          </Link>

          <span className="eyebrow">{project.style}</span>
          <h1 style={{ marginBottom: '0.5rem' }}>{project.title}</h1>
          <p className="body-text" style={{ maxWidth: '780px', fontSize: '1.125rem' }}>
            {project.description}
          </p>

          <div className="project-hero-media">
            <img
              src={project.coverImage}
              alt={project.title}
              referrerPolicy="no-referrer"
            />
          </div>

          {/* 2. Facts Strip */}
          <div className="project-meta-strip">
            <div className="meta-fact">
              <h5>
                <MapPin size={13} style={{ display: 'inline', marginRight: '4px' }} />
                Location
              </h5>
              <p>{project.location}</p>
            </div>
            <div className="meta-fact">
              <h5>
                <Maximize2 size={13} style={{ display: 'inline', marginRight: '4px' }} />
                Carpet Area
              </h5>
              <p className="tabular-nums">{project.areaSqFt.toLocaleString()} sq.ft</p>
            </div>
            <div className="meta-fact">
              <h5>
                <Clock size={13} style={{ display: 'inline', marginRight: '4px' }} />
                Execution Timeline
              </h5>
              <p className="tabular-nums">{project.durationWeeks} Weeks</p>
            </div>
            <div className="meta-fact">
              <h5>
                <DollarSign size={13} style={{ display: 'inline', marginRight: '4px' }} />
                Budget Bracket
              </h5>
              <p>{project.budget}</p>
            </div>
            <div className="meta-fact">
              <h5>
                <Palette size={13} style={{ display: 'inline', marginRight: '4px' }} />
                Design Lead
              </h5>
              <p>{project.designerCredit}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Before / After Comparison Section (if available) */}
      {project.beforeImage && project.afterImage && (
        <section className="section section-bg-subtle">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">Transformation Study</span>
              <h2>Interactive Before &amp; After Comparison</h2>
              <p className="body-text">
                Drag the divider horizontally to explore the shift from the original raw space to our finished architectural state.
              </p>
            </div>

            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <BeforeAfterSlider
                beforeImage={project.beforeImage}
                afterImage={project.afterImage}
                beforeLabel="Before: Original Raw Structure"
                afterLabel="After: Aura & Oak Execution"
              />
            </div>
          </div>
        </section>
      )}

      {/* 4. Image Gallery */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header text-left">
              <span className="eyebrow">Material Documentation</span>
              <h2>Architectural Details &amp; Perspectives</h2>
            </div>

            <div className="project-gallery-grid">
              {project.gallery.map((img) => (
                <div key={img.id} className="project-gallery-item">
                  <img
                    src={img.url}
                    alt={img.caption}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div style={{ padding: '0.75rem 1rem', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--color-border)' }}>
                    <p className="caption" style={{ color: 'var(--color-text-secondary)' }}>
                      {img.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="section section-bg-subtle">
          <div className="container">
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
              <div>
                <span className="eyebrow">Further Explorations</span>
                <h3 style={{ margin: 0 }}>Related Architectural Commissions</h3>
              </div>
              <Link to="/portfolio" className="btn-link flex-align gap-1">
                <span>All Works</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid-2">
              {relatedProjects.map((rp) => (
                <article key={rp.id} className="card">
                  <div className="card-media card-media-wide">
                    <img
                      src={rp.coverImage}
                      alt={rp.title}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  </div>
                  <div className="card-body">
                    <div className="card-meta">
                      <span>{rp.roomType}</span>
                      <span className="card-meta-separator">·</span>
                      <span>{rp.location}</span>
                    </div>
                    <h4 className="card-heading" style={{ marginTop: '0.5rem' }}>
                      <Link to={`/portfolio/${rp.slug}`} style={{ color: 'inherit' }}>
                        {rp.title}
                      </Link>
                    </h4>
                    <p className="card-description">{rp.description}</p>
                    <Link to={`/portfolio/${rp.slug}`} className="btn-link flex-align gap-1" style={{ marginTop: 'auto', fontSize: '0.8125rem' }}>
                      <span>View Study</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. CTA Band */}
      <section className="cta-band">
        <div className="container">
          <div className="cta-band-content">
            <span className="eyebrow" style={{ color: 'var(--color-accent)' }}>Inquire on this Style</span>
            <h2>Envision a Similar Architecture for Your Residence?</h2>
            <p>
              Connect directly with {project.designerCredit.split(',')[0]} and our technical leads to schedule your blueprint discovery review.
            </p>
            <button
              onClick={onOpenConsultation}
              className="btn btn-secondary btn-lg"
              style={{ marginTop: '0.5rem' }}
            >
              <Sparkles size={16} />
              <span>Book Project Consultation</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
