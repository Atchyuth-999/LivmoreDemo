import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Lead, LeadNote, Project } from '../../services/mockData';
import {
  Users,
  Briefcase,
  FileText,
  Settings,
  LogOut,
  Search,
  Download,
  Trash2,
  Eye,
  Plus,
  Compass,
  CheckCircle2,
  Clock,
  MessageSquare,
  X,
  ExternalLink
} from 'lucide-react';
import '../../styles/pages/admin.css';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'leads' | 'projects' | 'settings'>('leads');

  // Leads State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadCounts, setLeadCounts] = useState({ total: 0, new: 0, contacted: 0, qualified: 0, closed: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadNotes, setLeadNotes] = useState<LeadNote[]>([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  // Projects State
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);

  // Settings State
  const [siteSettings, setSiteSettings] = useState({
    studioName: 'Aura & Oak Interior Architecture',
    contactEmail: 'concierge@auraandoak.com',
    adminNotificationEmail: 'elena.vance@auraandoak.com',
    phone: '+1 (555) 234-5678',
    address: '184 Franklin Street, 4th Floor, Tribeca, New York, NY 10013',
    turnstileMode: 'Enabled (Enforced)',
    rateLimitRequests: '5 per minute / IP'
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Load Data
  const loadLeads = async () => {
    try {
      const res = await api.getAdminLeads({
        search: searchQuery,
        status: statusFilter
      });
      setLeads(res.leads);
      setLeadCounts(res.counts);
    } catch {
      navigate('/admin/login');
    }
  };

  const loadProjects = async () => {
    const list = await api.getProjects();
    setProjects(list);
  };

  useEffect(() => {
    loadLeads();
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    loadProjects();
  }, []);

  // Status Change Handler
  const handleStatusChange = async (leadId: string, newStatus: Lead['status']) => {
    await api.updateLeadStatus(leadId, newStatus);
    loadLeads();
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  // Open Lead Details & Load Notes
  const handleViewLead = async (lead: Lead) => {
    setSelectedLead(lead);
    const notes = await api.getLeadNotes(lead.id);
    setLeadNotes(notes);
  };

  // Add Note Handler
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNoteText.trim()) return;
    setAddingNote(true);
    try {
      const note = await api.addLeadNote(selectedLead.id, newNoteText);
      setLeadNotes(prev => [note, ...prev]);
      setNewNoteText('');
    } catch (err) {
      console.error(err);
    } finally {
      setAddingNote(false);
    }
  };

  // Delete Lead Handler (Soft Delete)
  const handleDeleteLead = async (leadId: string) => {
    if (window.confirm('Are you sure you want to remove this lead inquiry? (Soft deleted)')) {
      await api.deleteLead(leadId);
      if (selectedLead?.id === leadId) setSelectedLead(null);
      loadLeads();
    }
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    const csvContent = api.exportLeadsCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `aura_oak_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Logout Handler
  const handleLogout = () => {
    api.adminLogout();
    navigate('/admin/login');
  };

  // Project Save Handler
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title) return;
    await api.saveProject(editingProject);
    setShowProjectModal(false);
    setEditingProject(null);
    loadProjects();
  };

  const handleDeleteProject = async (projId: string) => {
    if (window.confirm('Delete this project commission from the portfolio?')) {
      await api.deleteProject(projId);
      loadProjects();
    }
  };

  return (
    <div className="admin-layout">
      {/* 1. Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="flex-align gap-2">
            <span className="header-brand-mark">
              <Compass size={14} />
            </span>
            <span>Aura &amp; Oak</span>
          </div>
          <span className="badge badge-accent" style={{ fontSize: '0.6875rem' }}>Admin</span>
        </div>

        <nav className="admin-nav">
          <button
            type="button"
            onClick={() => setActiveTab('leads')}
            className={`admin-nav-item ${activeTab === 'leads' ? 'active' : ''}`}
          >
            <Users size={16} />
            <span>Consultation Leads</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className={`admin-nav-item ${activeTab === 'projects' ? 'active' : ''}`}
          >
            <Briefcase size={16} />
            <span>Portfolio Projects</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          >
            <Settings size={16} />
            <span>Studio Settings</span>
          </button>
        </nav>

        <div className="admin-user-bar">
          <div>
            <div style={{ color: '#FFFFFF', fontWeight: 600 }}>Elena Vance</div>
            <div style={{ color: '#78716C', fontSize: '0.75rem' }}>Principal Architect</div>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-ghost"
            style={{ color: '#EF4444', padding: '0.25rem' }}
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* 2. Main Area */}
      <main className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="flex-align gap-3">
            <h3 style={{ margin: 0, fontSize: '1.1875rem' }}>
              {activeTab === 'leads' && 'Consultation Enquiries & Pipeline'}
              {activeTab === 'projects' && 'Architectural Portfolio Management'}
              {activeTab === 'settings' && 'Studio Configuration & Security'}
            </h3>
          </div>
          <div className="flex-align gap-3">
            <Link to="/" target="_blank" className="btn btn-outline btn-sm flex-align gap-1">
              <span>View Public Site</span>
              <ExternalLink size={13} />
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <div className="admin-content">
          {/* TAB 1: LEADS MANAGEMENT */}
          {activeTab === 'leads' && (
            <>
              {/* KPI Strip */}
              <div className="kpi-grid">
                <div className="kpi-card">
                  <h5>Total Inquiries</h5>
                  <div className="kpi-num tabular-nums">{leadCounts.total}</div>
                  <span className="caption">All captured consultations</span>
                </div>
                <div className="kpi-card" style={{ borderLeft: '3px solid #1D4ED8' }}>
                  <h5>New Pending</h5>
                  <div className="kpi-num tabular-nums" style={{ color: '#1D4ED8' }}>{leadCounts.new}</div>
                  <span className="caption">Awaiting initial review</span>
                </div>
                <div className="kpi-card" style={{ borderLeft: '3px solid #B45309' }}>
                  <h5>Contacted</h5>
                  <div className="kpi-num tabular-nums" style={{ color: '#B45309' }}>{leadCounts.contacted}</div>
                  <span className="caption">Discovery call held</span>
                </div>
                <div className="kpi-card" style={{ borderLeft: '3px solid #15803D' }}>
                  <h5>Qualified &amp; Active</h5>
                  <div className="kpi-num tabular-nums" style={{ color: '#15803D' }}>{leadCounts.qualified}</div>
                  <span className="caption">Blueprint stage / BOQ sent</span>
                </div>
              </div>

              {/* Toolbar */}
              <div className="table-toolbar">
                <div className="flex-align gap-3">
                  <div className="search-input-wrap">
                    <Search size={15} className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search by client name, email, phone, city..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  {/* Status Filter */}
                  <div className="flex-align gap-1">
                    {['All', 'New', 'Contacted', 'Qualified', 'Closed'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-outline'}`}
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={handleExportCSV} className="btn btn-outline btn-sm flex-align gap-1">
                  <Download size={14} />
                  <span>Export CSV</span>
                </button>
              </div>

              {/* Table */}
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Client Name</th>
                      <th>Contact Info</th>
                      <th>Typology &amp; City</th>
                      <th>Budget Bracket</th>
                      <th>Status Pipeline</th>
                      <th>Date Received</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                          <p className="body-secondary">No leads found matching your criteria.</p>
                        </td>
                      </tr>
                    ) : (
                      leads.map((lead) => (
                        <tr key={lead.id}>
                          <td>
                            <div style={{ fontWeight: 600 }}>{lead.name}</div>
                            <span className="caption" style={{ color: 'var(--color-accent)' }}>
                              Source: {lead.source}
                            </span>
                          </td>
                          <td>
                            <div>{lead.email}</div>
                            <div className="caption">{lead.phone}</div>
                          </td>
                          <td>
                            <div>{lead.propertyType}</div>
                            <span className="caption">{lead.city}</span>
                          </td>
                          <td className="tabular-nums" style={{ fontWeight: 500 }}>
                            {lead.budget}
                          </td>
                          <td>
                            <select
                              value={lead.status}
                              onChange={(e) => handleStatusChange(lead.id, e.target.value as any)}
                              className={`lead-status-select badge-status-${lead.status.toLowerCase()}`}
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Qualified">Qualified</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </td>
                          <td className="caption tabular-nums">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="flex-align" style={{ justifyContent: 'flex-end', gap: '0.5rem' }}>
                              <button
                                onClick={() => handleViewLead(lead)}
                                className="btn btn-outline btn-sm"
                                style={{ padding: '0.3rem 0.5rem' }}
                                title="View Enquiry Details & Notes"
                              >
                                <Eye size={13} />
                              </button>
                              <button
                                onClick={() => handleDeleteLead(lead.id)}
                                className="btn btn-ghost btn-sm"
                                style={{ padding: '0.3rem 0.5rem', color: '#DC2626' }}
                                title="Soft Delete"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* TAB 2: PROJECTS MANAGEMENT */}
          {activeTab === 'projects' && (
            <div>
              <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                <div>
                  <h4 style={{ margin: 0 }}>Portfolio Case Studies ({projects.length})</h4>
                  <p className="caption">Manage published architectural commissions and imagery.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingProject({
                      title: '',
                      roomType: 'Living Room',
                      style: 'Scandinavian Minimalist',
                      budget: '$80,000 - $140,000',
                      location: 'New York, NY',
                      areaSqFt: 2200,
                      durationWeeks: 10,
                      description: '',
                      published: true
                    });
                    setShowProjectModal(true);
                  }}
                  className="btn btn-primary btn-sm flex-align gap-1"
                >
                  <Plus size={14} />
                  <span>Add New Commission</span>
                </button>
              </div>

              <div className="grid-3">
                {projects.map((proj) => (
                  <div key={proj.id} className="card">
                    <div className="card-media">
                      <img src={proj.coverImage} alt={proj.title} referrerPolicy="no-referrer" />
                      <span
                        className="badge"
                        style={{
                          position: 'absolute',
                          top: 10,
                          left: 10,
                          backgroundColor: proj.published ? '#15803D' : '#6B7280',
                          color: '#FFFFFF'
                        }}
                      >
                        {proj.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <div className="card-body">
                      <div className="card-meta">
                        <span>{proj.roomType}</span>
                        <span>·</span>
                        <span>{proj.location}</span>
                      </div>
                      <h4 className="card-heading" style={{ marginTop: '0.25rem' }}>{proj.title}</h4>
                      <p className="caption">{proj.areaSqFt.toLocaleString()} sq.ft · {proj.durationWeeks} Weeks</p>
                      <div className="flex-between" style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
                        <button
                          onClick={() => {
                            setEditingProject(proj);
                            setShowProjectModal(true);
                          }}
                          className="btn btn-outline btn-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProject(proj.id)}
                          className="btn btn-ghost btn-sm"
                          style={{ color: '#DC2626' }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: STUDIO SETTINGS & AUDIT LOG */}
          {activeTab === 'settings' && (
            <div style={{ maxWidth: '720px' }}>
              <div className="card" style={{ padding: '2rem', backgroundColor: '#FFFFFF' }}>
                <h4 style={{ marginBottom: '1.5rem' }}>Studio Profile &amp; Notification Configuration</h4>

                {settingsSaved && (
                  <div style={{ padding: '0.75rem', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '4px', color: '#15803D', fontSize: '0.8125rem', marginBottom: '1rem' }}>
                    Settings updated successfully.
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Studio Brand Name</label>
                  <input
                    type="text"
                    value={siteSettings.studioName}
                    onChange={(e) => setSiteSettings({ ...siteSettings, studioName: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Owner Notification Email (IEmailService Target)</label>
                  <input
                    type="email"
                    value={siteSettings.adminNotificationEmail}
                    onChange={(e) => setSiteSettings({ ...siteSettings, adminNotificationEmail: e.target.value })}
                    className="form-input"
                  />
                  <span className="form-helper">Consultation form leads are dispatched here immediately.</span>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Public Telephone</label>
                    <input
                      type="text"
                      value={siteSettings.phone}
                      onChange={(e) => setSiteSettings({ ...siteSettings, phone: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Studio Address</label>
                    <input
                      type="text"
                      value={siteSettings.address}
                      onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                  <div className="form-group">
                    <label className="form-label">Cloudflare Turnstile Verification</label>
                    <input
                      type="text"
                      disabled
                      value={siteSettings.turnstileMode}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Rate Limiter (ASP.NET Core)</label>
                    <input
                      type="text"
                      disabled
                      value={siteSettings.rateLimitRequests}
                      className="form-input"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSettingsSaved(true);
                    setTimeout(() => setSettingsSaved(false), 3000);
                  }}
                  className="btn btn-primary btn-md"
                  style={{ marginTop: '1rem' }}
                >
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* LEAD DETAILS & INTERNAL NOTES MODAL */}
      {selectedLead && (
        <div className="admin-modal-overlay" onClick={() => setSelectedLead(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
            <div className="admin-modal-header">
              <div>
                <span className="caption" style={{ color: 'var(--color-accent)' }}>
                  Enquiry ID: {selectedLead.id}
                </span>
                <h3 style={{ margin: 0 }}>{selectedLead.name}</h3>
              </div>
              <button onClick={() => setSelectedLead(null)} className="btn btn-ghost" style={{ padding: '0.25rem' }}>
                <X size={20} />
              </button>
            </div>

            {/* Quick status row */}
            <div className="flex-between" style={{ padding: '0.75rem 1rem', backgroundColor: '#F8F7F4', borderRadius: '4px', marginBottom: '1.5rem' }}>
              <div>
                <span className="caption">Pipeline Status: </span>
                <select
                  value={selectedLead.status}
                  onChange={(e) => handleStatusChange(selectedLead.id, e.target.value as any)}
                  className={`lead-status-select badge-status-${selectedLead.status.toLowerCase()}`}
                  style={{ marginLeft: '6px' }}
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <span className="caption tabular-nums">
                Received: {new Date(selectedLead.createdAt).toLocaleString()}
              </span>
            </div>

            {/* Client Facts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              <div>
                <span className="caption">Email Address:</span>
                <div>{selectedLead.email}</div>
              </div>
              <div>
                <span className="caption">Contact Telephone:</span>
                <div>{selectedLead.phone}</div>
              </div>
              <div>
                <span className="caption">Property Typology &amp; City:</span>
                <div>{selectedLead.propertyType} ({selectedLead.city})</div>
              </div>
              <div>
                <span className="caption">Target Budget:</span>
                <div style={{ fontWeight: 600 }}>{selectedLead.budget}</div>
              </div>
            </div>

            {/* Client Message */}
            <div style={{ marginBottom: '1.5rem' }}>
              <span className="caption">Client Project Notes / Blueprint Vision:</span>
              <div style={{ marginTop: '4px', padding: '1rem', backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '4px', fontSize: '0.875rem', lineHeight: 1.6 }}>
                {selectedLead.message || 'No additional project vision supplied.'}
              </div>
            </div>

            {/* Internal Notes (LeadNotes entity) */}
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
              <div className="flex-align gap-2" style={{ marginBottom: '0.75rem' }}>
                <MessageSquare size={16} color="var(--color-accent)" />
                <h4 style={{ margin: 0, fontSize: '0.9375rem' }}>Studio Internal Notes ({leadNotes.length})</h4>
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} style={{ marginBottom: '1rem' }}>
                <textarea
                  rows={2}
                  required
                  placeholder="Add private studio note (e.g. 'Spoke on phone, client interested in smoked oak finish, scheduled blueprint walk-through')..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  className="form-textarea"
                  style={{ fontSize: '0.8125rem' }}
                />
                <div className="flex-between" style={{ marginTop: '0.5rem' }}>
                  <span className="caption">Visible strictly to studio admin</span>
                  <button type="submit" disabled={addingNote} className="btn btn-secondary btn-sm">
                    {addingNote ? 'Adding...' : 'Save Note'}
                  </button>
                </div>
              </form>

              {/* Existing Notes list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
                {leadNotes.length === 0 ? (
                  <p className="caption" style={{ fontStyle: 'italic' }}>No internal notes recorded yet.</p>
                ) : (
                  leadNotes.map((note) => (
                    <div key={note.id} style={{ padding: '0.75rem', backgroundColor: '#F8F7F4', borderRadius: '4px', fontSize: '0.8125rem' }}>
                      <p style={{ margin: 0 }}>{note.note}</p>
                      <div className="flex-between caption" style={{ marginTop: '4px', color: '#78716C' }}>
                        <span>{note.createdBy}</span>
                        <span>{new Date(note.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PROJECT CREATE / EDIT MODAL */}
      {showProjectModal && editingProject && (
        <div className="admin-modal-overlay" onClick={() => setShowProjectModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className="admin-modal-header">
              <h3 style={{ margin: 0 }}>{editingProject.id ? 'Edit Commission' : 'Create New Portfolio Project'}</h3>
              <button onClick={() => setShowProjectModal(false)} className="btn btn-ghost" style={{ padding: '0.25rem' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProject}>
              <div className="form-group">
                <label className="form-label">Project Title</label>
                <input
                  type="text"
                  required
                  value={editingProject.title || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Room Typology</label>
                  <select
                    value={editingProject.roomType || 'Living Room'}
                    onChange={(e) => setEditingProject({ ...editingProject, roomType: e.target.value })}
                    className="form-select"
                  >
                    <option value="Full-Home">Full-Home</option>
                    <option value="Living Room">Living Room</option>
                    <option value="Master Bedroom">Master Bedroom</option>
                    <option value="Kitchen & Dining">Kitchen & Dining</option>
                    <option value="Wardrobes">Wardrobes</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Aesthetic Style</label>
                  <select
                    value={editingProject.style || 'Scandinavian Minimalist'}
                    onChange={(e) => setEditingProject({ ...editingProject, style: e.target.value })}
                    className="form-select"
                  >
                    <option value="Scandinavian Minimalist">Scandinavian Minimalist</option>
                    <option value="Japandi">Japandi</option>
                    <option value="Contemporary Classic">Contemporary Classic</option>
                    <option value="Industrial Luxury">Industrial Luxury</option>
                    <option value="Modern Minimalist">Modern Minimalist</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    value={editingProject.location || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Carpet Area (sq.ft)</label>
                  <input
                    type="number"
                    value={editingProject.areaSqFt || 2000}
                    onChange={(e) => setEditingProject({ ...editingProject, areaSqFt: Number(e.target.value) })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Cover Image URL</label>
                <input
                  type="url"
                  required
                  value={editingProject.coverImage || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, coverImage: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Editorial Description</label>
                <textarea
                  rows={3}
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div className="flex-between" style={{ marginTop: '1.5rem' }}>
                <label className="flex-align gap-2" style={{ cursor: 'pointer', fontSize: '0.875rem' }}>
                  <input
                    type="checkbox"
                    checked={editingProject.published ?? true}
                    onChange={(e) => setEditingProject({ ...editingProject, published: e.target.checked })}
                  />
                  <span>Publish immediately to public website</span>
                </label>
                <button type="submit" className="btn btn-primary btn-md">
                  Save Commission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
