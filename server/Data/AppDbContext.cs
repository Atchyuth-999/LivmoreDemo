using Microsoft.EntityFrameworkCore;
using AuraAndOak.Api.Models;

namespace AuraAndOak.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Project> Projects => Set<Project>();
    public DbSet<ProjectImage> ProjectImages => Set<ProjectImage>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Style> Styles => Set<Style>();
    public DbSet<Service> Services => Set<Service>();
    public DbSet<Testimonial> Testimonials => Set<Testimonial>();
    public DbSet<TeamMember> TeamMembers => Set<TeamMember>();
    public DbSet<BlogPost> BlogPosts => Set<BlogPost>();
    public DbSet<Lead> Leads => Set<Lead>();
    public DbSet<LeadNote> LeadNotes => Set<LeadNote>();
    public DbSet<Faq> Faqs => Set<Faq>();
    public DbSet<NewsletterSubscriber> NewsletterSubscribers => Set<NewsletterSubscriber>();
    public DbSet<SiteSetting> SiteSettings => Set<SiteSetting>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Global Query Filters (Soft Delete)
        modelBuilder.Entity<Project>().HasQueryFilter(p => !p.IsDeleted);
        modelBuilder.Entity<Lead>().HasQueryFilter(l => !l.IsDeleted);
        modelBuilder.Entity<LeadNote>().HasQueryFilter(n => !n.IsDeleted);
        modelBuilder.Entity<BlogPost>().HasQueryFilter(b => !b.IsDeleted);

        // Project Indexes
        modelBuilder.Entity<Project>(entity =>
        {
            entity.HasIndex(p => p.Slug).IsUnique();
            entity.HasIndex(p => p.RoomType);
            entity.HasIndex(p => p.Style);
            entity.HasIndex(p => p.Published);
            entity.HasIndex(p => p.CreatedAt);
        });

        // Leads Indexes
        modelBuilder.Entity<Lead>(entity =>
        {
            entity.HasIndex(l => l.Status);
            entity.HasIndex(l => l.CreatedAt);
            entity.HasIndex(l => l.Email);
        });

        // Blog Indexes
        modelBuilder.Entity<BlogPost>(entity =>
        {
            entity.HasIndex(b => b.Slug).IsUnique();
            entity.HasIndex(b => b.Category);
        });

        // RefreshToken Indexes
        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.HasIndex(r => r.TokenHash);
            entity.HasIndex(r => r.AdminEmail);
        });
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = DateTime.UtcNow;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = DateTime.UtcNow;
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}
