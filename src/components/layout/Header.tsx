import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Compass } from 'lucide-react';

interface HeaderProps {
  onOpenConsultation: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenConsultation }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'Services', path: '/services', hasDropdown: true },
    { label: 'Cost Estimator', path: '/estimator' },
    { label: 'About', path: '/about' },
    { label: 'Journal', path: '/journal' },
    { label: 'Contact', path: '/contact' }
  ];

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="container header-inner">
        {/* Zone 1: Single text element Brand Wordmark */}
        <Link to="/" className="header-brand" aria-label="Aura and Oak Home">
          <span className="header-brand-mark">
            <Compass size={14} />
          </span>
          <span>Aura &amp; Oak</span>
        </Link>

        {/* Zone 2: 4-5 Clean single-line text links */}
        <nav className="header-nav" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <div
              key={link.path}
              style={{ position: 'relative' }}
              onMouseEnter={() => link.hasDropdown && setServicesDropdownOpen(true)}
              onMouseLeave={() => link.hasDropdown && setServicesDropdownOpen(false)}
            >
              <Link
                to={link.path}
                className={`nav-link ${location.pathname.startsWith(link.path) ? 'active' : ''}`}
              >
                <span className="flex-align gap-1">
                  {link.label}
                  {link.hasDropdown && <ChevronDown size={14} />}
                </span>
              </Link>

              {link.hasDropdown && servicesDropdownOpen && (
                <div className="nav-dropdown-menu" role="menu">
                  <Link to="/services#residential" className="dropdown-item">Residential Architecture</Link>
                  <Link to="/services#kitchens" className="dropdown-item">Modular Kitchens &amp; Pantries</Link>
                  <Link to="/services#wardrobes" className="dropdown-item">Luxury Wardrobes &amp; Closets</Link>
                  <Link to="/services#turnkey" className="dropdown-item">Full-Home Turnkey Execution</Link>
                  <Link to="/services#renovation" className="dropdown-item">Home Renovation</Link>
                  <Link to="/services#3d-vis" className="dropdown-item">Photorealistic 3D Renders</Link>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Zone 3: 1 Primary CTA button */}
        <div className="header-actions">
          <button
            onClick={onOpenConsultation}
            className="btn btn-primary btn-md"
            aria-label="Book Free Consultation"
          >
            Book Free Consultation
          </button>
          
          <button
            className="mobile-nav-toggle"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open mobile navigation menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <>
          <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)} />
          <div className="mobile-drawer">
            <div className="mobile-drawer-header">
              <span className="h4">Aura &amp; Oak</span>
              <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                <X size={22} />
              </button>
            </div>
            <div className="mobile-nav-links">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="nav-link"
                  style={{ fontSize: '1.125rem', padding: '0.5rem 0' }}
                >
                  {link.label}
                </Link>
              ))}
              <div style={{ marginTop: '1.5rem' }}>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenConsultation();
                  }}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                >
                  Book Free Consultation
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};
