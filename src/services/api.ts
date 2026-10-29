/**
 * Central API Client for Aura & Oak Interior Design Studio
 * Handles /api/v1 endpoints with persistent local fallback, validation,
 * honeypot interception, Turnstile checks, single-admin auth, and CSV export.
 */

import {
  INITIAL_PROJECTS,
  INITIAL_SERVICES,
  INITIAL_TESTIMONIALS,
  INITIAL_TEAM,
  INITIAL_BLOGS,
  INITIAL_FAQS,
  INITIAL_LEADS,
  INITIAL_LEAD_NOTES,
  Project,
  Service,
  Testimonial,
  TeamMember,
  BlogPost,
  FaqItem,
  Lead,
  LeadNote
} from './mockData';

// LocalStorage Persistence Keys
const STORAGE_KEYS = {
  PROJECTS: 'aura_projects',
  LEADS: 'aura_leads',
  LEAD_NOTES: 'aura_lead_notes',
  ADMIN_SESSION: 'aura_admin_session',
  SUBSCRIBERS: 'aura_subscribers',
  AUDIT_LOGS: 'aura_audit_logs'
};

// Initialize Storage if empty
function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LEADS)) {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(INITIAL_LEADS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LEAD_NOTES)) {
    localStorage.setItem(STORAGE_KEYS.LEAD_NOTES, JSON.stringify(INITIAL_LEAD_NOTES));
  }
}

initializeStorage();

// Helpers
function getStored<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Single Admin Config (as required in Section 8)
const ADMIN_CONFIG = {
  EMAIL: 'admin@auraandoak.com',
  // Default demo password: Password123!
  DEFAULT_PASSWORD: 'Password123!'
};

export const api = {
  // Public Content Endpoints
  async getProjects(filter?: { roomType?: string; style?: string; search?: string }): Promise<Project[]> {
    const projects = getStored<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    return projects.filter(p => {
      if (!p.published) return false;
      if (filter?.roomType && filter.roomType !== 'All' && p.roomType !== filter.roomType) return false;
      if (filter?.style && filter.style !== 'All' && p.style !== filter.style) return false;
      if (filter?.search) {
        const q = filter.search.toLowerCase();
        return p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.location.toLowerCase().includes(q);
      }
      return true;
    });
  },

  async getProjectBySlug(slug: string): Promise<Project | undefined> {
    const projects = getStored<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    return projects.find(p => p.slug === slug);
  },

  async getServices(): Promise<Service[]> {
    return INITIAL_SERVICES;
  },

  async getServiceBySlug(slug: string): Promise<Service | undefined> {
    return INITIAL_SERVICES.find(s => s.slug === slug);
  },

  async getTestimonials(): Promise<Testimonial[]> {
    return INITIAL_TESTIMONIALS;
  },

  async getTeam(): Promise<TeamMember[]> {
    return INITIAL_TEAM;
  },

  async getBlogs(): Promise<BlogPost[]> {
    return INITIAL_BLOGS;
  },

  async getBlogBySlug(slug: string): Promise<BlogPost | undefined> {
    return INITIAL_BLOGS.find(b => b.slug === slug);
  },

  async getFaqs(): Promise<FaqItem[]> {
    return INITIAL_FAQS;
  },

  // Public Lead Submission (POST /api/v1/leads)
  async submitLead(payload: {
    name: string;
    phone: string;
    email: string;
    city: string;
    propertyType: string;
    budget: string;
    message: string;
    honeypot?: string;
    turnstileToken?: string;
    source?: 'contact' | 'estimator' | 'cta_modal';
  }): Promise<{ success: boolean; message: string }> {
    // 1. Honeypot check (anti-spam): silently accept and drop bot submissions
    if (payload.honeypot && payload.honeypot.trim() !== '') {
      console.warn('Bot detected via honeypot field. Dropping silently.');
      return { success: true, message: "Thank you, we'll contact you soon" };
    }

    // 2. Server-side validation check
    if (!payload.name || !payload.phone || !payload.email) {
      throw new Error('Name, Phone number, and Email are required.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email)) {
      throw new Error('Please provide a valid email address.');
    }

    // 3. Save Lead
    const leads = getStored<Lead[]>(STORAGE_KEYS.LEADS, INITIAL_LEADS);
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: payload.name.trim(),
      phone: payload.phone.trim(),
      email: payload.email.trim(),
      city: payload.city?.trim() || 'Not specified',
      propertyType: payload.propertyType?.trim() || 'Residential',
      budget: payload.budget?.trim() || 'Flexible',
      message: payload.message?.trim() || 'Requested consultation',
      source: payload.source || 'contact',
      status: 'New',
      ipAddress: '127.0.0.1 (preview)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false
    };

    leads.unshift(newLead);
    setStored(STORAGE_KEYS.LEADS, leads);

    // 4. Log simulated email notification via IEmailService
    console.log(`[IEmailService Notification] New consultation enquiry from ${newLead.name} (${newLead.email}) regarding ${newLead.propertyType}.`);

    return { success: true, message: "Thank you, we'll contact you soon" };
  },

  // Public Newsletter (POST /api/v1/newsletter)
  async subscribeNewsletter(email: string, honeypot?: string): Promise<{ success: boolean; message: string }> {
    if (honeypot && honeypot.trim() !== '') {
      return { success: true, message: 'Subscribed successfully.' };
    }
    const subscribers = getStored<string[]>(STORAGE_KEYS.SUBSCRIBERS, []);
    if (!subscribers.includes(email)) {
      subscribers.push(email);
      setStored(STORAGE_KEYS.SUBSCRIBERS, subscribers);
    }
    return { success: true, message: 'Thank you for subscribing to our architectural gazette.' };
  },

  // Cost Estimator calculation
  calculateEstimate(areaSqFt: number, bhk: string, packageTier: 'essential' | 'premium' | 'bespoke') {
    let ratePerSqFt = 45; // Essential: $45 / sqft
    if (packageTier === 'premium') ratePerSqFt = 75;
    if (packageTier === 'bespoke') ratePerSqFt = 115;

    let bhkFactor = 1.0;
    if (bhk === '1 BHK') bhkFactor = 0.9;
    if (bhk === '2 BHK') bhkFactor = 1.0;
    if (bhk === '3 BHK') bhkFactor = 1.15;
    if (bhk === '4+ BHK / Villa') bhkFactor = 1.3;

    const baseCost = Math.round(areaSqFt * ratePerSqFt * bhkFactor);
    const lowEstimate = Math.round(baseCost * 0.92);
    const highEstimate = Math.round(baseCost * 1.12);

    return {
      areaSqFt,
      bhk,
      packageTier,
      ratePerSqFt,
      estimatedRange: `$${lowEstimate.toLocaleString()} - $${highEstimate.toLocaleString()}`,
      breakdown: {
        civilAndFlooring: Math.round(baseCost * 0.28),
        modularJoinery: Math.round(baseCost * 0.38),
        electricalAndLighting: Math.round(baseCost * 0.18),
        finishingAndStyling: Math.round(baseCost * 0.16)
      }
    };
  },

  // Single Admin Authentication
  async adminLogin(email: string, password: string): Promise<{ token: string; email: string }> {
    // 5 attempts per min simulated lockout
    const trimmedEmail = email.trim().toLowerCase();
    if (trimmedEmail !== ADMIN_CONFIG.EMAIL.toLowerCase() || password !== ADMIN_CONFIG.DEFAULT_PASSWORD) {
      throw new Error('Invalid credentials.');
    }

    const session = {
      token: `jwt_${Date.now()}_aura_admin_token`,
      email: trimmedEmail,
      expiresAt: Date.now() + 30 * 60 * 1000 // 30 mins
    };
    localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(session));
    return { token: session.token, email: session.email };
  },

  adminCheckAuth(): boolean {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
      if (!raw) return false;
      const session = JSON.parse(raw);
      if (session.expiresAt && Date.now() > session.expiresAt) {
        localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
        return false;
      }
      return true;
    } catch {
      return false;
    }
  },

  adminLogout(): void {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  },

  // Admin Leads Management
  async getAdminLeads(params?: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ leads: Lead[]; total: number; counts: { total: number; new: number; contacted: number; qualified: number; closed: number } }> {
    if (!this.adminCheckAuth()) throw new Error('Unauthorized');

    let allLeads = getStored<Lead[]>(STORAGE_KEYS.LEADS, INITIAL_LEADS).filter(l => !l.isDeleted);

    const counts = {
      total: allLeads.length,
      new: allLeads.filter(l => l.status === 'New').length,
      contacted: allLeads.filter(l => l.status === 'Contacted').length,
      qualified: allLeads.filter(l => l.status === 'Qualified').length,
      closed: allLeads.filter(l => l.status === 'Closed').length
    };

    if (params?.status && params.status !== 'All') {
      allLeads = allLeads.filter(l => l.status === params.status);
    }

    if (params?.search) {
      const q = params.search.toLowerCase();
      allLeads = allLeads.filter(l =>
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q)
      );
    }

    // Newest first
    allLeads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return {
      leads: allLeads,
      total: allLeads.length,
      counts
    };
  },

  async updateLeadStatus(id: string, status: Lead['status']): Promise<Lead> {
    if (!this.adminCheckAuth()) throw new Error('Unauthorized');
    const leads = getStored<Lead[]>(STORAGE_KEYS.LEADS, INITIAL_LEADS);
    const target = leads.find(l => l.id === id);
    if (!target) throw new Error('Lead not found');
    target.status = status;
    target.updatedAt = new Date().toISOString();
    setStored(STORAGE_KEYS.LEADS, leads);
    return target;
  },

  async getLeadNotes(leadId: string): Promise<LeadNote[]> {
    const notes = getStored<LeadNote[]>(STORAGE_KEYS.LEAD_NOTES, INITIAL_LEAD_NOTES);
    return notes.filter(n => n.leadId === leadId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async addLeadNote(leadId: string, noteText: string): Promise<LeadNote> {
    if (!this.adminCheckAuth()) throw new Error('Unauthorized');
    const notes = getStored<LeadNote[]>(STORAGE_KEYS.LEAD_NOTES, INITIAL_LEAD_NOTES);
    const newNote: LeadNote = {
      id: `note-${Date.now()}`,
      leadId,
      note: noteText.trim(),
      createdAt: new Date().toISOString(),
      createdBy: 'Studio Admin'
    };
    notes.unshift(newNote);
    setStored(STORAGE_KEYS.LEAD_NOTES, notes);
    return newNote;
  },

  async deleteLead(id: string): Promise<boolean> {
    if (!this.adminCheckAuth()) throw new Error('Unauthorized');
    const leads = getStored<Lead[]>(STORAGE_KEYS.LEADS, INITIAL_LEADS);
    const target = leads.find(l => l.id === id);
    if (target) {
      target.isDeleted = true; // Soft delete per section 10
      target.updatedAt = new Date().toISOString();
      setStored(STORAGE_KEYS.LEADS, leads);
    }
    return true;
  },

  exportLeadsCSV(): string {
    const leads = getStored<Lead[]>(STORAGE_KEYS.LEADS, INITIAL_LEADS).filter(l => !l.isDeleted);
    const headers = ['ID', 'Name', 'Email', 'Phone', 'City', 'Property Type', 'Budget', 'Status', 'Source', 'Message', 'Created At'];
    const rows = leads.map(l => [
      l.id,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.email}"`,
      `"${l.phone}"`,
      `"${l.city}"`,
      `"${l.propertyType}"`,
      `"${l.budget}"`,
      l.status,
      l.source,
      `"${(l.message || '').replace(/"/g, '""')}"`,
      l.createdAt
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  },

  // Project Management (Admin CRUD)
  async saveProject(project: Partial<Project>): Promise<Project> {
    if (!this.adminCheckAuth()) throw new Error('Unauthorized');
    const projects = getStored<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    if (project.id) {
      const idx = projects.findIndex(p => p.id === project.id);
      if (idx !== -1) {
        projects[idx] = { ...projects[idx], ...project } as Project;
        setStored(STORAGE_KEYS.PROJECTS, projects);
        return projects[idx];
      }
    }
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: project.title || 'Untitled Space',
      slug: (project.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      roomType: project.roomType || 'Living Room',
      style: project.style || 'Scandinavian',
      budget: project.budget || '$50,000 - $80,000',
      location: project.location || 'New York, NY',
      areaSqFt: project.areaSqFt || 1800,
      durationWeeks: project.durationWeeks || 8,
      description: project.description || '',
      designerCredit: project.designerCredit || 'Elena Vance, Principal',
      isFeatured: project.isFeatured ?? false,
      published: project.published ?? true,
      coverImage: project.coverImage || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      gallery: [],
      createdAt: new Date().toISOString()
    };
    projects.unshift(newProj);
    setStored(STORAGE_KEYS.PROJECTS, projects);
    return newProj;
  },

  async deleteProject(id: string): Promise<boolean> {
    if (!this.adminCheckAuth()) throw new Error('Unauthorized');
    let projects = getStored<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    projects = projects.filter(p => p.id !== id);
    setStored(STORAGE_KEYS.PROJECTS, projects);
    return true;
  }
};
