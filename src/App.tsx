/**
 * Aura & Oak | Interior Architecture Studio
 * Root Application Component with Routes & Layout
 */

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ConsultationModal } from './components/layout/ConsultationModal';
import { FloatingActions } from './components/common/FloatingActions';

// Public Pages
import { HomePage } from './pages/HomePage';
import { PortfolioPage } from './pages/PortfolioPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { ServicesPage } from './pages/ServicesPage';
import { EstimatorPage } from './pages/EstimatorPage';
import { AboutPage } from './pages/AboutPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';
import { LegalPage } from './pages/LegalPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

function AppLayout({ children, onOpenConsultation }: { children: React.ReactNode; onOpenConsultation: () => void }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="app-root">
      {!isAdmin && <Header onOpenConsultation={onOpenConsultation} />}
      <main className="app-main">{children}</main>
      {!isAdmin && <Footer />}
      {!isAdmin && <FloatingActions />}
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="container" style={{ padding: '160px 0', textAlign: 'center' }}>
      <span className="eyebrow">404 Exception</span>
      <h1>Page Not Located</h1>
      <p className="body-secondary" style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>
        The architectural page you were searching for does not exist or has been archived.
      </p>
      <Link to="/" className="btn btn-primary btn-md">
        Return to Studio Home
      </Link>
    </div>
  );
}

export default function App() {
  const [consultationOpen, setConsultationOpen] = useState(false);

  return (
    <BrowserRouter>
      <AppLayout onOpenConsultation={() => setConsultationOpen(true)}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage onOpenConsultation={() => setConsultationOpen(true)} />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/portfolio/:slug" element={<ProjectDetailPage onOpenConsultation={() => setConsultationOpen(true)} />} />
          <Route path="/services" element={<ServicesPage onOpenConsultation={() => setConsultationOpen(true)} />} />
          <Route path="/estimator" element={<EstimatorPage onOpenConsultation={() => setConsultationOpen(true)} />} />
          <Route path="/about" element={<AboutPage onOpenConsultation={() => setConsultationOpen(true)} />} />
          <Route path="/journal" element={<BlogPage />} />
          <Route path="/journal/:slug" element={<BlogPostPage onOpenConsultation={() => setConsultationOpen(true)} />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FaqPage onOpenConsultation={() => setConsultationOpen(true)} />} />
          <Route path="/privacy" element={<LegalPage />} />
          <Route path="/terms" element={<LegalPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AppLayout>

      {/* Global Consultation Modal */}
      <ConsultationModal
        isOpen={consultationOpen}
        onClose={() => setConsultationOpen(false)}
      />
    </BrowserRouter>
  );
}
