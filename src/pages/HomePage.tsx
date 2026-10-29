import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Project, Service, Testimonial, BlogPost } from '../services/mockData';
import { ArrowRight, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import '../styles/pages/home.css';

interface HomePageProps {
  onOpenConsultation: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenConsultation }) => {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    api.getProjects().then((data) => setFeaturedProjects(data.slice(0, 3)));
    api.getServices().then((data) => setServices(data.slice(0, 3)));
    api.getTestimonials().then(setTestimonials);
    api.getBlogs().then((data) => setBlogs(data.slice(0, 3)));
  }, []);

  const designStyles = [
    {
      title: 'Scandinavian Minimalist',
      desc: 'Natural white oak, honed travertine, tactile linen, airy daylight.',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Japandi Quietude',
      desc: 'Tatami woven textures, low platform joinery, limewash plaster.',
      image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Contemporary Monolith',
      desc: 'Calacatta marble waterfalls, smoked oak, burnished brass accents.',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div className="home-page">
      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <span className="eyebrow">Tribeca &amp; West Coast Studios</span>
              <h1>Spaces of Quiet Distinction &amp; Honest Materiality</h1>
              <p>
                We design and build bespoke residential sanctuaries and boutique commercial interiors. Rigorous space planning, museum-grade joinery, and seamless turnkey execution.
              </p>
              <div className="hero-actions">
                <button
                  onClick={onOpenConsultation}
                  className="btn btn-primary btn-lg"
                  aria-label="Book Free Consultation"
                >
                  Book Free Consultation
                </button>
                <Link to="/portfolio" className="btn btn-outline btn-lg">
                  Explore Selected Works
                </Link>
              </div>
            </div>

            <div className="hero-visual">
              <img
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80"
                alt="Architectural living room with natural oak and travertine fireplace"
                referrerPolicy="no-referrer"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Stats Strip */}
      <section className="stats-strip" aria-label="Studio Track Record">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-num tabular-nums">180+</div>
              <div className="stat-label">Turnkey Residences Completed</div>
            </div>
            <div className="stat-item">
              <div className="stat-num tabular-nums">16</div>
              <div className="stat-label">Years of Architectural Practice</div>
            </div>
            <div className="stat-item">
              <div className="stat-num tabular-nums">98.4%</div>
              <div className="stat-label">On-Time Handover Guarantee</div>
            </div>
            <div className="stat-item">
              <div className="stat-num tabular-nums">12</div>
              <div className="stat-label">Design &amp; Craft Citations</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Projects Showcase */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Portfolio</span>
            <h2>Selected Architectural Works</h2>
            <p className="body-text">
              Each commission is approached as a singular architectural study in proportion, acoustic quietude, and tactile authenticity.
            </p>
          </div>

          <div className="grid-3">
            {featuredProjects.map((project) => (
              <article key={project.id} className="card">
                <div className="card-media">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>
                <div className="card-body">
                  <div className="card-meta">
                    <span>{project.roomType}</span>
                    <span className="card-meta-separator">·</span>
                    <span>{project.location}</span>
                  </div>
                  <h3 className="card-heading" style={{ marginTop: '0.5rem' }}>
                    <Link to={`/portfolio/${project.slug}`} style={{ color: 'inherit' }}>
                      {project.title}
                    </Link>
                  </h3>
                  <p className="card-description">
                    {project.description}
                  </p>
                  <div className="flex-between" style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-border-subtle)' }}>
                    <span className="caption" style={{ fontWeight: 600, color: 'var(--color-accent)' }}>
                      {project.style}
                    </span>
                    <Link to={`/portfolio/${project.slug}`} className="btn-link flex-align gap-1" style={{ fontSize: '0.8125rem' }}>
                      <span>View Study</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="flex-center" style={{ marginTop: '3rem' }}>
            <Link to="/portfolio" className="btn btn-outline btn-md">
              <span>View All 24+ Portfolio Commissions</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Services Overview */}
      <section className="section section-bg-subtle">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Capabilities</span>
            <h2>Disciplines &amp; Craftsmanship</h2>
            <p className="body-text">
              From individual custom kitchen joinery to 6,000 sq.ft turnkey architectural overhauls.
            </p>
          </div>

          <div className="grid-3">
            {services.map((srv) => (
              <div key={srv.id} className="card" style={{ backgroundColor: 'var(--color-surface)' }}>
                <div className="card-media" style={{ aspectRatio: '16 / 10' }}>
                  <img
                    src={srv.imageUrl}
                    alt={srv.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>
                <div className="card-body">
                  <h3 className="card-heading">{srv.title}</h3>
                  <p className="card-description">{srv.tagline}</p>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.25rem' }}>
                    {srv.features.slice(0, 3).map((f, i) => (
                      <li key={i} className="flex-align gap-2" style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                        <CheckCircle2 size={14} color="var(--color-accent)" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div style={{ marginTop: 'auto' }}>
                    <Link to="/services" className="btn-link flex-align gap-1" style={{ fontSize: '0.8125rem' }}>
                      <span>Explore Practice Details</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. How It Works (4 Steps) */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Turnkey Delivery</span>
            <h2>Our Architectural Process</h2>
            <p className="body-text">
              A structured, stress-free methodology guaranteeing fixed budgets and on-time handover.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <span className="step-number">01</span>
              <h3>Discovery &amp; Space Audit</h3>
              <p>We review your structural blueprints, lifestyle habits, acoustic needs, and establish your realistic investment bracket.</p>
            </div>
            <div className="step-card">
              <span className="step-number">02</span>
              <h3>3D Conception &amp; Materiality</h3>
              <p>Experience photorealistic lighting renders and tactile material boards with zero ambiguity before construction begins.</p>
            </div>
            <div className="step-card">
              <span className="step-number">03</span>
              <h3>Turnkey Fabrication</h3>
              <p>In-house German-precision joinery, plumbing, civil work, and electrical MEP coordinated by our single site director.</p>
            </div>
            <div className="step-card">
              <span className="step-number">04</span>
              <h3>White-Glove Handover</h3>
              <p>Deep acoustic cleaning, air balancing, custom art hanging, and a 10-year structural warranty documentation packet.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Design Styles Gallery */}
      <section className="section section-bg-subtle">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Inspiration Gallery</span>
            <h2>Design Typologies &amp; Aesthetic Ideals</h2>
            <p className="body-text">
              Curated material palettes tailored to your sensory preferences.
            </p>
          </div>

          <div className="styles-gallery-grid">
            {designStyles.map((style, idx) => (
              <div key={idx} className="style-card" onClick={onOpenConsultation}>
                <img
                  src={style.image}
                  alt={style.title}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="style-card-overlay">
                  <h4>{style.title}</h4>
                  <p>{style.desc}</p>
                  <span className="btn-link" style={{ color: '#FFFFFF', marginTop: '0.5rem', fontSize: '0.75rem' }}>
                    Consult on this style &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Client Testimonials */}
      {testimonials.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">Client Perspectives</span>
              <h2>Testimonials from Discerning Homeowners</h2>
            </div>

            <div style={{ maxWidth: '820px', margin: '0 auto' }}>
              <div className="testimonial-card">
                <p className="testimonial-quote">
                  "{testimonials[activeTestimonial].quote}"
                </p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">
                    {testimonials[activeTestimonial].avatarText}
                  </div>
                  <div className="testimonial-info">
                    <h4>{testimonials[activeTestimonial].author}</h4>
                    <p>
                      {testimonials[activeTestimonial].property} · <span style={{ color: 'var(--color-accent)' }}>{testimonials[activeTestimonial].outcome}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Indicator buttons */}
              <div className="flex-center" style={{ gap: '0.5rem', marginTop: '1.5rem' }}>
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    aria-label={`View testimonial ${i + 1}`}
                    style={{
                      width: i === activeTestimonial ? '28px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      backgroundColor: i === activeTestimonial ? 'var(--color-text-primary)' : 'var(--color-border)',
                      transition: 'all 0.2s ease',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 8. Gazette / Blog Highlights */}
      <section className="section section-bg-subtle">
        <div className="container">
          <div className="flex-between" style={{ marginBottom: '2.5rem' }}>
            <div>
              <span className="eyebrow">Architectural Journal</span>
              <h2 style={{ margin: 0 }}>Design Perspectives &amp; Material Insights</h2>
            </div>
            <Link to="/journal" className="btn btn-outline btn-sm">
              View Journal
            </Link>
          </div>

          <div className="grid-3">
            {blogs.map((b) => (
              <article key={b.id} className="blog-post-card">
                <div className="blog-media">
                  <img
                    src={b.imageUrl}
                    alt={b.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>
                <div className="blog-content">
                  <div className="blog-meta">
                    <span>{b.category}</span>
                    <span>·</span>
                    <span>{b.readTime}</span>
                  </div>
                  <h3>
                    <Link to={`/journal/${b.slug}`} style={{ color: 'inherit' }}>
                      {b.title}
                    </Link>
                  </h3>
                  <p>{b.excerpt}</p>
                  <div className="blog-author">By {b.author}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Final CTA Band */}
      <section className="cta-band">
        <div className="container">
          <div className="cta-band-content">
            <span className="eyebrow" style={{ color: 'var(--color-accent)' }}>Commence Your Project</span>
            <h2>Ready to Transform Your Residence Into a Sanctuary?</h2>
            <p>
              Schedule a comprehensive discovery consultation with our principal architect. We assess blueprints, site orientation, and discuss preliminary cost brackets.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button
                onClick={onOpenConsultation}
                className="btn btn-secondary btn-lg"
              >
                <Sparkles size={16} />
                <span>Book Free Consultation</span>
              </button>
              <Link to="/contact" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255, 255, 255, 0.3)', color: '#FFFFFF' }}>
                Visit Our Studio
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
