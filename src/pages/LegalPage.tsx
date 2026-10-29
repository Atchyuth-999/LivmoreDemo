import React from 'react';
import { useLocation, Link } from 'react-router-dom';

export const LegalPage: React.FC = () => {
  const location = useLocation();
  const isPrivacy = location.pathname.includes('privacy');

  return (
    <div className="legal-page" style={{ paddingTop: '110px', paddingBottom: '5rem' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <span className="eyebrow">Studio Governance</span>
        <h1>{isPrivacy ? 'Privacy & Data Protection Policy' : 'Terms of Architectural Engagement'}</h1>
        <p className="caption" style={{ marginBottom: '2rem' }}>
          Last updated: October 2026 · Aura &amp; Oak Interior Architecture Ltd.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', lineHeight: 1.7, color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
          {isPrivacy ? (
            <>
              <p>
                Aura &amp; Oak is committed to safeguarding the privacy and confidentiality of our clients, homeowners, and visitors. All project blueprints, architectural schematics, photographs, and contact records are handled with the highest standards of data security.
              </p>
              <h4>1. Anonymous Public Website Architecture</h4>
              <p>
                In accordance with our privacy-first access model, our public website operates with zero visitor user accounts, sign-ups, or invasive behavioral tracking. Visitors browse anonymously.
              </p>
              <h4>2. Consultation &amp; Lead Inquiries</h4>
              <p>
                When you voluntarily submit a consultation request or cost estimate inquiry, we collect your name, phone, email, location, and project parameters solely to assess your inquiry and arrange your discovery session. We never sell, monetize, or lease client data to third-party advertisers.
              </p>
              <h4>3. Spam Defense &amp; Security</h4>
              <p>
                Our lead submission forms incorporate cryptographic Cloudflare Turnstile token validation and honeypot field verification to prevent automated abuse without compromising your privacy.
              </p>
            </>
          ) : (
            <>
              <p>
                These Terms of Engagement govern the preliminary consultation, architectural concept design, and turnkey contractor agreements between Aura &amp; Oak and the commissioning property owner.
              </p>
              <h4>1. Fixed-Price Milestone Contracts</h4>
              <p>
                Upon mutual sign-off on detailed Bill of Quantities (BOQs) and 3D architectural renders, project pricing is frozen. Price modifications only occur if the client explicitly requests an alteration in writing.
              </p>
              <h4>2. On-Time Handover Guarantee</h4>
              <p>
                Each project schedule specifies an exact handover date with contractual milestone delivery checkpoints. Weekly photographic logs are provided to ensure complete transparency throughout fabrication and site assembly.
              </p>
              <h4>3. Warranty &amp; Materials</h4>
              <p>
                All modular kitchen hardware, concealed hinges, and drawer tandem systems carry a 10-year manufacturer replacement warranty. Civil, structural, and waterproofing works carry our comprehensive 5-year workmanship guarantee.
              </p>
            </>
          )}

          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
            <Link to="/" className="btn btn-outline btn-sm">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
