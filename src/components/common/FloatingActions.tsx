import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';

export const FloatingActions: React.FC = () => {
  return (
    <aside className="floating-actions" aria-label="Quick contact channels">
      <a
        href="https://wa.me/15552345678?text=Hello%20Aura%20%26%20Oak%20Studio%2C%20I%20would%20like%20to%20discuss%20an%20interior%20architecture%20project."
        target="_blank"
        rel="noopener noreferrer"
        className="floating-btn"
        aria-label="Direct WhatsApp Concierge"
        title="Chat on WhatsApp"
      >
        <MessageCircle size={24} />
      </a>
      <a
        href="tel:+15552345678"
        className="floating-btn call-btn"
        aria-label="Call studio reception"
        title="Call Studio"
      >
        <Phone size={20} />
      </a>
    </aside>
  );
};
