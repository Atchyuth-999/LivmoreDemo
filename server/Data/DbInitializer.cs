using AuraAndOak.Api.Models;

namespace AuraAndOak.Api.Data;

public static class DbInitializer
{
    public static async Task SeedAsync(AppDbContext context)
    {
        if (context.Projects.Any())
        {
            return; // DB already seeded
        }

        // Projects
        var p1 = new Project
        {
            Title = "The Solarium Penthouse",
            Slug = "solarium-penthouse",
            RoomType = "Full-Home",
            Style = "Scandinavian Minimalist",
            Budget = "$180,000 - $220,000",
            Location = "Tribeca, New York",
            AreaSqFt = 3400,
            DurationWeeks = 14,
            Description = "A light-bathed penthouse sanctuary balancing natural white oak cabinetry, honed limestone monoliths, and tactile bouclé textiles with expansive terrace views.",
            DesignerCredit = "Elena Vance, Principal Architect",
            IsFeatured = true,
            Published = true,
            CoverImage = "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80",
            BeforeImage = "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
            AfterImage = "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80"
        };

        var p2 = new Project
        {
            Title = "Kyoto Sanctuary Residence",
            Slug = "kyoto-sanctuary",
            RoomType = "Master Bedroom",
            Style = "Japandi",
            Budget = "$65,000 - $85,000",
            Location = "Pacific Heights, San Francisco",
            AreaSqFt = 1850,
            DurationWeeks = 8,
            Description = "An organic Japandi bedroom retreat emphasizing warm limewashed walls, bespoke low platform bed, hand-loomed wool tatami, and paper lantern accents.",
            DesignerCredit = "Kenji Mori, Design Partner",
            IsFeatured = true,
            Published = true,
            CoverImage = "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1400&q=80",
            BeforeImage = "https://images.unsplash.com/photo-1540518614846-7ede433c4ef7?auto=format&fit=crop&w=1200&q=80",
            AfterImage = "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80"
        };

        context.Projects.AddRange(p1, p2);

        // Services
        context.Services.AddRange(
            new Service
            {
                Title = "Residential Architecture",
                Slug = "residential-architecture",
                Tagline = "End-to-end bespoke home transformations crafted for longevity and daily calm.",
                Description = "Comprehensive architectural space planning, luxury material curation, lighting choreography, and bespoke furniture design.",
                ImageUrl = "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80",
                DeliveryTime = "8 - 16 Weeks",
                FeaturesJson = "[\"Detailed spatial layout & structural flow\", \"Custom joinery drawings\", \"Circadian lighting schematics\"]"
            },
            new Service
            {
                Title = "Modular Kitchens & Pantries",
                Slug = "modular-kitchens",
                Tagline = "Precision culinary engineering paired with timeless monolithic craftsmanship.",
                Description = "German-engineered Blum hardware, laser-sealed anti-scratch soft-matte finishes, and honed natural stone waterfall counters.",
                ImageUrl = "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80",
                DeliveryTime = "4 - 6 Weeks",
                FeaturesJson = "[\"Quartz, porcelain & granite countertops\", \"Concealed appliance integration\", \"10-Year hardware replacement warranty\"]"
            }
        );

        // Initial Leads
        var l1 = new Lead
        {
            Name = "Victoria Hawthorne",
            Phone = "+1 (555) 234-5678",
            Email = "victoria.h@gmail.com",
            City = "New York, NY",
            PropertyType = "Penthouse Apartment",
            Budget = "$150,000 - $250,000",
            Message = "Purchased a 3,200 sq.ft duplex in Tribeca. Looking for full turnkey interior architecture and custom millwork.",
            Source = "contact",
            Status = "New",
            IpAddress = "198.51.100.42",
            CreatedAt = DateTime.UtcNow.AddDays(-1)
        };

        context.Leads.Add(l1);

        // Site Settings
        context.SiteSettings.Add(new SiteSetting
        {
            StudioName = "Aura & Oak",
            ContactEmail = "concierge@auraandoak.com",
            NotificationEmail = "elena.vance@auraandoak.com",
            Phone = "+1 (555) 234-5678",
            Address = "184 Franklin St, 4th Floor, Tribeca, NY 10013"
        });

        await context.SaveChangesAsync();
    }
}
