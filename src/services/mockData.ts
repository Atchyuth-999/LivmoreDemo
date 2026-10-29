/**
 * Seed data & initial entities for Aura & Oak Interior Design Studio
 */

export interface Project {
  id: string;
  title: string;
  slug: string;
  roomType: string;
  style: string;
  budget: string;
  location: string;
  areaSqFt: number;
  durationWeeks: number;
  description: string;
  designerCredit: string;
  isFeatured: boolean;
  published: boolean;
  coverImage: string;
  beforeImage?: string;
  afterImage?: string;
  gallery: { id: string; url: string; caption: string }[];
  createdAt: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  features: string[];
  imageUrl: string;
  deliveryTime: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  property: string;
  quote: string;
  outcome: string;
  avatarText: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  readTime: string;
  date: string;
  imageUrl: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  propertyType: string;
  budget: string;
  message: string;
  source: 'contact' | 'estimator' | 'cta_modal';
  status: 'New' | 'Contacted' | 'Qualified' | 'Closed';
  ipAddress: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface LeadNote {
  id: string;
  leadId: string;
  note: string;
  createdAt: string;
  createdBy: string;
}

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-01',
    title: 'The Solarium Penthouse',
    slug: 'solarium-penthouse',
    roomType: 'Full-Home',
    style: 'Scandinavian Minimalist',
    budget: '$180,000 - $220,000',
    location: 'Tribeca, New York',
    areaSqFt: 3400,
    durationWeeks: 14,
    description: 'A light-bathed penthouse sanctuary balancing natural white oak cabinetry, honed limestone monoliths, and tactile bouclé textiles with expansive terrace views.',
    designerCredit: 'Elena Vance, Principal Architect',
    isFeatured: true,
    published: true,
    coverImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80',
    beforeImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    afterImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      { id: 'g1', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', caption: 'Custom smoked oak kitchen island and fluted brass pendants' },
      { id: 'g2', url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80', caption: 'Serene master suite with concealed linen wardrobe joinery' },
      { id: 'g3', url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80', caption: 'Honed travertine guest powder room with bronze fixtures' }
    ],
    createdAt: '2026-01-15T10:00:00Z'
  },
  {
    id: 'proj-02',
    title: 'Kyoto Sanctuary Residence',
    slug: 'kyoto-sanctuary',
    roomType: 'Master Bedroom',
    style: 'Japandi',
    budget: '$65,000 - $85,000',
    location: 'Pacific Heights, San Francisco',
    areaSqFt: 1850,
    durationWeeks: 8,
    description: 'An organic Japandi bedroom retreat emphasizing warm limewashed walls, bespoke low platform bed, hand-loomed wool tatami, and paper lantern accents.',
    designerCredit: 'Kenji Mori, Design Partner',
    isFeatured: true,
    published: true,
    coverImage: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1400&q=80',
    beforeImage: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef7?auto=format&fit=crop&w=1200&q=80',
    afterImage: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      { id: 'g4', url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80', caption: 'Low platform bed frame in natural hinoki cypress' },
      { id: 'g5', url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80', caption: 'Integrated bedside reading alcove with warm cove illumination' }
    ],
    createdAt: '2026-02-10T14:30:00Z'
  },
  {
    id: 'proj-03',
    title: 'Belgravia Georgian Villa',
    slug: 'belgravia-georgian-villa',
    roomType: 'Kitchen & Dining',
    style: 'Contemporary Classic',
    budget: '$140,000 - $175,000',
    location: 'Belgravia, London',
    areaSqFt: 2900,
    durationWeeks: 12,
    description: 'Restoration of classical Georgian crown mouldings paired with an ultra-minimalist monolithic dark quartz island, bespoke brass pantry, and concealed wine cellar.',
    designerCredit: 'Elena Vance & Marcus Sterling',
    isFeatured: true,
    published: true,
    coverImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      { id: 'g6', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80', caption: 'Concealed handleless cabinetry with hand-patinated bronze' },
      { id: 'g7', url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80', caption: '12-seat solid walnut dining table beneath sculptural pendant' }
    ],
    createdAt: '2026-02-28T09:15:00Z'
  },
  {
    id: 'proj-04',
    title: 'Monolith Architectural Loft',
    slug: 'monolith-architectural-loft',
    roomType: 'Living Room',
    style: 'Industrial Luxury',
    budget: '$95,000 - $130,000',
    location: 'West Loop, Chicago',
    areaSqFt: 2200,
    durationWeeks: 9,
    description: 'Raw microcement flooring, exposed brick washed in warm cream lime paint, floor-to-ceiling blackened steel crittall glazing, and tailored caramel aniline leather.',
    designerCredit: 'Marcus Sterling, Technical Lead',
    isFeatured: false,
    published: true,
    coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80',
    gallery: [],
    createdAt: '2026-03-05T16:00:00Z'
  },
  {
    id: 'proj-05',
    title: 'The Glass Pavilion Wardrobe Suite',
    slug: 'glass-pavilion-wardrobe',
    roomType: 'Wardrobes',
    style: 'Modern Minimalist',
    budget: '$50,000 - $70,000',
    location: 'Beverly Hills, California',
    areaSqFt: 1100,
    durationWeeks: 6,
    description: 'Walk-in master closet crafted with bronze-framed fluted glass vitrines, integrated micro-LED shelving, suede-lined accessory drawers, and central marble valet.',
    designerCredit: 'Elena Vance, Principal Architect',
    isFeatured: false,
    published: true,
    coverImage: 'https://images.unsplash.com/photo-1558997519-83ea9252def8?auto=format&fit=crop&w=1400&q=80',
    gallery: [],
    createdAt: '2026-03-12T11:20:00Z'
  },
  {
    id: 'proj-06',
    title: 'Atelier Commercial Studio',
    slug: 'atelier-commercial-studio',
    roomType: 'Commercial',
    style: 'Contemporary',
    budget: '$160,000 - $210,000',
    location: 'SoHo, New York',
    areaSqFt: 4200,
    durationWeeks: 16,
    description: 'An inspirational workspace for a creative agency featuring sound-absorbent acoustic felt panels, curved Venetian plaster partition walls, and custom modular desks.',
    designerCredit: 'Kenji Mori & Elena Vance',
    isFeatured: false,
    published: true,
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80',
    gallery: [],
    createdAt: '2026-03-20T15:45:00Z'
  }
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv-01',
    title: 'Residential Architecture',
    slug: 'residential-architecture',
    tagline: 'End-to-end bespoke home transformations crafted for longevity and daily calm.',
    description: 'Comprehensive architectural space planning, luxury material curation, lighting choreography, and bespoke furniture design for villas, penthouses, and heritage residences.',
    features: ['Detailed spatial layout & structural flow', 'Custom joinery and millwork drawings', 'Lighting schematics & circadian design', 'White-glove styling & art curation'],
    imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80',
    deliveryTime: '8 - 16 Weeks'
  },
  {
    id: 'srv-02',
    title: 'Modular Kitchens & Pantries',
    slug: 'modular-kitchens',
    tagline: 'Precision culinary engineering paired with timeless monolithic craftsmanship.',
    description: 'German-engineered Blum hardware, laser-sealed anti-scratch soft-matte finishes, honed natural stone waterfall counters, and bespoke spice and cutlery integration.',
    features: ['Quartz, porcelain & granite countertops', 'Concealed appliance integration', 'Soft-closing tandem drawer systems', '10-Year hardware replacement warranty'],
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80',
    deliveryTime: '4 - 6 Weeks'
  },
  {
    id: 'srv-03',
    title: 'Luxury Wardrobes & Dressing Rooms',
    slug: 'luxury-wardrobes',
    tagline: 'Boutique-grade walk-in suites with aluminum profiles and touch-illuminated joinery.',
    description: 'Custom glass vitrines, textured wood veneers, humidity-controlled jewelry inserts, and pull-out wardrobe organizers designed around your personal collection.',
    features: ['Floor-to-ceiling seamless sliding systems', 'Suede & velvet tray inserts', 'Integrated warm 2700K sensor lighting', 'Acoustic soft-close dampers'],
    imageUrl: 'https://images.unsplash.com/photo-1558997519-83ea9252def8?auto=format&fit=crop&w=1000&q=80',
    deliveryTime: '3 - 5 Weeks'
  },
  {
    id: 'srv-04',
    title: 'Full-Home Turnkey Execution',
    slug: 'turnkey-execution',
    tagline: 'Complete peace of mind from demolition to final champagne handover.',
    description: 'One single point of contact for civil work, MEP (mechanical, electrical, plumbing), HVAC, false ceilings, flooring, custom carpentry, and final deep cleaning.',
    features: ['Single accountable project manager', 'Weekly photographic milestone logs', 'Strict milestone payment schedules', 'Guaranteed handover deadline with penalty clauses'],
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    deliveryTime: '12 - 20 Weeks'
  },
  {
    id: 'srv-05',
    title: 'Complete Home Renovation',
    slug: 'home-renovation',
    tagline: 'Breathe contemporary luxury into aging structures while respecting character.',
    description: 'Structural wall removals, plumbing modernization, bathroom gutting, and layout re-zoning for older apartments and historic villas.',
    features: ['Civil approvals & structural surveys', 'Sound-dampening acoustic floor underlayments', 'Concealed air-conditioning retrofits', 'Preservation of vintage architectural mouldings'],
    imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80',
    deliveryTime: '8 - 14 Weeks'
  },
  {
    id: 'srv-06',
    title: 'Photorealistic 3D Visualization',
    slug: '3d-visualization',
    tagline: 'Walk through your future residence with cinematic lighting before placing a single brick.',
    description: 'Unreal Engine 5 architectural renders, VR headset walkthroughs, and material swatch simulations showing natural sunlight progression throughout the day.',
    features: ['360-degree interactive room panoramas', 'Material & fabric texture swapping', 'Accurate morning, afternoon & night illumination', 'High-res 4K printable presentation boards'],
    imageUrl: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1000&q=80',
    deliveryTime: '2 - 3 Weeks'
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 't-01',
    author: 'Julian & Claire Montgomery',
    role: 'Homeowners',
    property: '3,800 sq.ft Tribeca Penthouse',
    quote: 'Aura & Oak delivered beyond what we thought possible. Their restraint with natural materials and obsessive attention to acoustic quietude made our home our favorite place on earth.',
    outcome: 'Turnkey renovation completed on budget in 14 weeks',
    avatarText: 'JM'
  },
  {
    id: 't-02',
    author: 'Sophia Chen',
    role: 'Managing Partner, Chen & Associates',
    property: '4,200 sq.ft SoHo Headquarters',
    quote: 'The team transformed a dark industrial floor into a light-filled, serene creative sanctuary that our clients compliment the second they walk through the door.',
    outcome: 'Commercial renovation completed 10 days ahead of schedule',
    avatarText: 'SC'
  },
  {
    id: 't-03',
    author: 'Arthur Vance',
    role: 'Art Collector & Private Investor',
    property: '2,600 sq.ft Pacific Heights Apartment',
    quote: 'Their knowledge of museum-grade recessed lighting and custom casework for my sculpture collection was flawless. True architectural rigor, not decorative fluff.',
    outcome: 'Custom interior fit-out with museum-grade gallery illumination',
    avatarText: 'AV'
  }
];

export const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'tm-01',
    name: 'Elena Vance, AIA',
    role: 'Founder & Principal Architect',
    bio: 'Educated at the Architectural Association in London. Elena has spent 16 years leading high-end residential projects characterized by timeless proportion and honest materials.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'tm-02',
    name: 'Kenji Mori',
    role: 'Design Partner & Material Lead',
    bio: 'Specializing in Japanese joinery techniques and natural plaster formulations. Kenji curates our global network of stone quarries and bespoke timber craftsmen.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'tm-03',
    name: 'Marcus Sterling',
    role: 'Director of Turnkey Execution',
    bio: 'With a background in civil engineering and commercial construction management, Marcus ensures that every millimeter on the architectural plan is executed on-site without compromise.',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80'
  }
];

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: 'b-01',
    title: 'The Art of Tactile Restraint: Why Warm Neutrals Outlast Trends',
    slug: 'art-of-tactile-restraint',
    category: 'Philosophy & Materials',
    excerpt: 'How honed travertine, untreated linen, and smoked oak create emotional calm in high-density urban environments.',
    content: 'Color trends arrive and dissipate every season, but raw natural materials anchored in proportion retain their beauty for generations. In our studio practice, we prioritize surface texture over loud pigments. When light strikes a limewash wall or a hand-chiseled limestone hearth, the shifting shadow creates depth that paint alone can never emulate...',
    author: 'Elena Vance',
    readTime: '5 min read',
    date: 'March 14, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'b-02',
    title: 'Circadian Architecture: Illuminating Homes for Rest and Focus',
    slug: 'circadian-lighting-architecture',
    category: 'Design Intelligence',
    excerpt: 'Layering indirect 2700K cove luminaires with architectural spot optics to respect human biological rhythms.',
    content: 'Lighting is the invisible architecture of your home. Bright overhead downlights in dining and sleeping zones induce physiological stress. By lowering the optical axis—using concealed kickboard wash, low picture lights, and diffuse paper globes—we align interior atmospheres with evening relaxation...',
    author: 'Kenji Mori',
    readTime: '4 min read',
    date: 'February 22, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'b-03',
    title: 'The 2026 Turnkey Guide: What to Expect During a Full-Home Renovation',
    slug: 'turnkey-renovation-guide',
    category: 'Guides & Budgets',
    excerpt: 'Navigating permits, MEP structural routing, lead times, and how our weekly milestone logs eliminate homeowner anxiety.',
    content: 'Embarking on a full-home renovation should not be an endurance test. The secret to frictionless execution lies in freezing architectural drawings and 100% material specifications before the first hammer strikes...',
    author: 'Marcus Sterling',
    readTime: '7 min read',
    date: 'January 30, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
  }
];

export const INITIAL_FAQS: FaqItem[] = [
  {
    id: 'f-01',
    category: 'Process & Timeline',
    question: 'How long does a typical full-home interior project take?',
    answer: 'A standard 2,000–3,500 sq.ft full-home transformation typically takes 12 to 16 weeks from approved 3D design to final handover. Modular kitchens or specific room packages take 4 to 6 weeks.'
  },
  {
    id: 'f-02',
    category: 'Budgets & Pricing',
    question: 'How do you price your turnkey services?',
    answer: 'We provide transparent, line-item itemized BOQs (Bill of Quantities) based on exact material selections. Our cost estimator provides realistic square-footage estimates, and once a contract is signed, our prices are guaranteed against mid-project surcharges.'
  },
  {
    id: 'f-03',
    category: 'Execution & Quality',
    question: 'Do you manage contractors or do we need to hire third-party laborers?',
    answer: 'We operate as a single-point turnkey contractor. Our in-house site managers supervise civil trades, custom millwork, electrical, plumbing, and finishing crews daily with rigorous quality checklists.'
  },
  {
    id: 'f-04',
    category: 'Consultation & Next Steps',
    question: 'Is the initial consultation really free and what does it include?',
    answer: 'Yes. Our 45-minute discovery consultation includes a review of your floor plan, preliminary space-planning advice, realistic budget brackets, and our recommended stylistic direction with zero obligation.'
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-101',
    name: 'Victoria Hawthorne',
    phone: '+1 (555) 234-5678',
    email: 'victoria.h@gmail.com',
    city: 'New York, NY',
    propertyType: 'Penthouse Apartment',
    budget: '$150,000 - $250,000',
    message: 'Purchased a 3,200 sq.ft duplex in Tribeca. Looking for full turnkey interior architecture and custom millwork before summer.',
    source: 'contact',
    status: 'New',
    ipAddress: '198.51.100.42',
    createdAt: '2026-10-28T14:22:10Z',
    updatedAt: '2026-10-28T14:22:10Z',
    isDeleted: false
  },
  {
    id: 'lead-102',
    name: 'David & Rachel Ross',
    phone: '+1 (555) 876-5432',
    email: 'd.ross.architecture@yahoo.com',
    city: 'San Francisco, CA',
    propertyType: '3 BHK Villa',
    budget: '$80,000 - $120,000',
    message: 'Interested in Japandi bedroom makeover and modular kitchen renovation. We loved the Kyoto Sanctuary project.',
    source: 'estimator',
    status: 'Contacted',
    ipAddress: '198.51.100.89',
    createdAt: '2026-10-27T09:15:30Z',
    updatedAt: '2026-10-27T11:40:00Z',
    isDeleted: false
  },
  {
    id: 'lead-103',
    name: 'Alexander Wright',
    phone: '+1 (555) 432-1098',
    email: 'awright@venturecap.org',
    city: 'Chicago, IL',
    propertyType: 'Commercial Loft',
    budget: '$250,000+',
    message: 'Need a boutique office design for 24 team members. Need high acoustic separation and hospitality feel.',
    source: 'cta_modal',
    status: 'Qualified',
    ipAddress: '203.0.113.19',
    createdAt: '2026-10-26T16:05:00Z',
    updatedAt: '2026-10-27T08:30:00Z',
    isDeleted: false
  }
];

export const INITIAL_LEAD_NOTES: LeadNote[] = [
  {
    id: 'note-01',
    leadId: 'lead-102',
    note: 'Spoke with David. Scheduled on-site measurement session for Thursday morning. Key focus is fluted oak cabinetry.',
    createdAt: '2026-10-27T11:40:00Z',
    createdBy: 'Website Owner (Admin)'
  },
  {
    id: 'note-02',
    leadId: 'lead-103',
    note: 'Met over video call. Client shared blueprint CAD files. Preparing initial concept moodboard and budget bracket.',
    createdAt: '2026-10-27T08:30:00Z',
    createdBy: 'Website Owner (Admin)'
  }
];
