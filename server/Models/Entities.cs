using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AuraAndOak.Api.Models;

public abstract class BaseEntity
{
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public bool IsDeleted { get; set; } = false;
}

public class Project : BaseEntity
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(220)]
    public string Slug { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string RoomType { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Style { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Budget { get; set; } = string.Empty;

    [MaxLength(200)]
    public string Location { get; set; } = string.Empty;

    public int AreaSqFt { get; set; }
    public int DurationWeeks { get; set; }

    public string Description { get; set; } = string.Empty;
    public string DesignerCredit { get; set; } = string.Empty;

    public bool IsFeatured { get; set; } = false;
    public bool Published { get; set; } = true;

    [MaxLength(500)]
    public string CoverImage { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? BeforeImage { get; set; }

    [MaxLength(500)]
    public string? AfterImage { get; set; }

    public List<ProjectImage> Images { get; set; } = new();
}

public class ProjectImage : BaseEntity
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid ProjectId { get; set; }
    [ForeignKey(nameof(ProjectId))]
    public Project Project { get; set; } = null!;

    [Required]
    [MaxLength(500)]
    public string ImageUrl { get; set; } = string.Empty;

    [MaxLength(250)]
    public string Caption { get; set; } = string.Empty;

    public int DisplayOrder { get; set; } = 0;
}

public class Category : BaseEntity
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Slug { get; set; } = string.Empty;
}

public class Style : BaseEntity
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Slug { get; set; } = string.Empty;
}

public class Service : BaseEntity
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(160)]
    public string Slug { get; set; } = string.Empty;

    public string Tagline { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    [MaxLength(500)]
    public string ImageUrl { get; set; } = string.Empty;

    [MaxLength(50)]
    public string DeliveryTime { get; set; } = string.Empty;

    public string FeaturesJson { get; set; } = "[]";
}

public class Testimonial : BaseEntity
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(150)]
    public string Author { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Role { get; set; } = string.Empty;

    [MaxLength(150)]
    public string Property { get; set; } = string.Empty;

    [Required]
    public string Quote { get; set; } = string.Empty;

    [MaxLength(200)]
    public string Outcome { get; set; } = string.Empty;

    [MaxLength(10)]
    public string AvatarText { get; set; } = string.Empty;
}

public class TeamMember : BaseEntity
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(120)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Role { get; set; } = string.Empty;

    public string Bio { get; set; } = string.Empty;

    [MaxLength(500)]
    public string ImageUrl { get; set; } = string.Empty;

    public int DisplayOrder { get; set; } = 0;
}

public class BlogPost : BaseEntity
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(250)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(260)]
    public string Slug { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Category { get; set; } = string.Empty;

    public string Excerpt { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Author { get; set; } = string.Empty;

    [MaxLength(50)]
    public string ReadTime { get; set; } = string.Empty;

    [MaxLength(500)]
    public string ImageUrl { get; set; } = string.Empty;
}

public class Lead : BaseEntity
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Phone { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(100)]
    public string City { get; set; } = string.Empty;

    [MaxLength(100)]
    public string PropertyType { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Budget { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Source { get; set; } = "contact"; // contact, estimator, cta_modal

    [Required]
    [MaxLength(30)]
    public string Status { get; set; } = "New"; // New, Contacted, Qualified, Closed

    [MaxLength(50)]
    public string IpAddress { get; set; } = string.Empty;

    public List<LeadNote> Notes { get; set; } = new();
}

public class LeadNote : BaseEntity
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid LeadId { get; set; }
    [ForeignKey(nameof(LeadId))]
    public Lead Lead { get; set; } = null!;

    [Required]
    public string Note { get; set; } = string.Empty;

    [MaxLength(100)]
    public string CreatedBy { get; set; } = "Admin";
}

public class Faq : BaseEntity
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(250)]
    public string Question { get; set; } = string.Empty;

    [Required]
    public string Answer { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Category { get; set; } = string.Empty;
}

public class NewsletterSubscriber : BaseEntity
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;
}

public class SiteSetting : BaseEntity
{
    [Key]
    public int Id { get; set; }

    [MaxLength(150)]
    public string StudioName { get; set; } = "Aura & Oak";

    [MaxLength(150)]
    public string ContactEmail { get; set; } = "concierge@auraandoak.com";

    [MaxLength(150)]
    public string NotificationEmail { get; set; } = "elena.vance@auraandoak.com";

    [MaxLength(50)]
    public string Phone { get; set; } = "+1 (555) 234-5678";

    public string Address { get; set; } = "184 Franklin St, Tribeca, NY";
}

public class RefreshToken
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(256)]
    public string TokenHash { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    public string AdminEmail { get; set; } = string.Empty;

    public DateTime ExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? RevokedAt { get; set; }

    public bool IsExpired => DateTime.UtcNow >= ExpiresAt;
    public bool IsActive => RevokedAt == null && !IsExpired;
}

public class AuditLog
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(100)]
    public string Action { get; set; } = string.Empty;

    public string Details { get; set; } = string.Empty;
    public string AdminEmail { get; set; } = string.Empty;
    public string IpAddress { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
