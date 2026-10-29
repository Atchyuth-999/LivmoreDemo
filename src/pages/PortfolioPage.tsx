import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Project } from '../services/mockData';
import { Search, Eye, X, ArrowRight } from 'lucide-react';
import '../styles/pages/portfolio.css';

export const PortfolioPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedRoom, setSelectedRoom] = useState('All');
  const [selectedStyle, setSelectedStyle] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [lightboxProject, setLightboxProject] = useState<Project | null>(null);

  const roomTypes = ['All', 'Full-Home', 'Living Room', 'Master Bedroom', 'Kitchen & Dining', 'Wardrobes', 'Commercial'];
  const styles = ['All', 'Scandinavian Minimalist', 'Japandi', 'Contemporary Classic', 'Industrial Luxury', 'Modern Minimalist'];

  useEffect(() => {
    api.getProjects({
      roomType: selectedRoom,
      style: selectedStyle,
      search: searchQuery
    }).then(setProjects);
  }, [selectedRoom, selectedStyle, searchQuery]);

  return (
    <div className="portfolio-page">
      {/* Header */}
      <section className="portfolio-header">
        <div className="container">
          <div className="section-header text-left" style={{ marginBottom: 0 }}>
            <span className="eyebrow">Architectural Archives</span>
            <h1>Selected Portfolio Commissions</h1>
            <p className="body-text">
              Filter through our residential, commercial, and modular architectural transformations by room typology, aesthetic style, or keywords.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="portfolio-filter-bar">
            {/* Search Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
              <div className="search-input-wrap" style={{ flexGrow: 1 }}>
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by project name, material, or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input"
                />
              </div>
              {(selectedRoom !== 'All' || selectedStyle !== 'All' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedRoom('All');
                    setSelectedStyle('All');
                    setSearchQuery('');
                  }}
                  className="btn btn-outline btn-sm"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Room Type Selector */}
            <div className="filter-group">
              <span className="filter-label">Room Type:</span>
              <div className="filter-buttons">
                {roomTypes.map((room) => (
                  <button
                    key={room}
                    type="button"
                    onClick={() => setSelectedRoom(room)}
                    className={`filter-btn ${selectedRoom === room ? 'active' : ''}`}
                  >
                    {room}
                  </button>
                ))}
              </div>
            </div>

            {/* Aesthetic Style Selector */}
            <div className="filter-group">
              <span className="filter-label">Style:</span>
              <div className="filter-buttons">
                {styles.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSelectedStyle(st)}
                    className={`filter-btn ${selectedStyle === st ? 'active' : ''}`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="section" style={{ paddingTop: '2rem' }}>
        <div className="container">
          {projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
              <h3>No matching projects found</h3>
              <p className="body-secondary" style={{ marginTop: '0.5rem' }}>
                Try adjusting your search criteria or resetting filters.
              </p>
            </div>
          ) : (
            <div className="portfolio-grid">
              {projects.map((proj) => (
                <article key={proj.id} className="card">
                  <div className="card-media">
                    <img
                      src={proj.coverImage}
                      alt={proj.title}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <button
                      onClick={() => setLightboxProject(proj)}
                      className="btn btn-sm"
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        color: 'var(--color-text-primary)',
                        padding: '0.35rem 0.6rem',
                        backdropFilter: 'blur(4px)',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                      title="Quick Lightbox Preview"
                    >
                      <Eye size={14} />
                      <span style={{ fontSize: '0.75rem', marginLeft: '4px' }}>Preview</span>
                    </button>
                  </div>
                  <div className="card-body">
                    <div className="card-meta">
                      <span>{proj.roomType}</span>
                      <span className="card-meta-separator">·</span>
                      <span>{proj.location}</span>
                    </div>
                    <h3 className="card-heading" style={{ marginTop: '0.5rem' }}>
                      <Link to={`/portfolio/${proj.slug}`} style={{ color: 'inherit' }}>
                        {proj.title}
                      </Link>
                    </h3>
                    <p className="card-description">
                      {proj.description}
                    </p>
                    <div className="flex-between" style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-border-subtle)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className="caption" style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                          {proj.areaSqFt.toLocaleString()} sq.ft
                        </span>
                        <span className="caption" style={{ color: 'var(--color-accent)' }}>
                          {proj.budget}
                        </span>
                      </div>
                      <Link to={`/portfolio/${proj.slug}`} className="btn btn-outline btn-sm">
                        <span>Details</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxProject && (
        <div className="lightbox-overlay" onClick={() => setLightboxProject(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightboxProject(null)}
              className="lightbox-close"
              aria-label="Close Lightbox"
            >
              <X size={28} />
            </button>
            <div className="lightbox-image-wrap">
              <img
                src={lightboxProject.coverImage}
                alt={lightboxProject.title}
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="lightbox-caption">
              <div>
                <h3 style={{ color: '#FFFFFF', margin: 0 }}>{lightboxProject.title}</h3>
                <p style={{ color: '#A8A29E', fontSize: '0.875rem', marginTop: '4px' }}>
                  {lightboxProject.roomType} · {lightboxProject.location} · {lightboxProject.style}
                </p>
              </div>
              <Link
                to={`/portfolio/${lightboxProject.slug}`}
                className="btn btn-secondary btn-sm"
                onClick={() => setLightboxProject(null)}
              >
                View Full Study
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
