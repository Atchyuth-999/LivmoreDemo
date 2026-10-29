using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AuraAndOak.Api.Data;
using AuraAndOak.Api.DTOs;
using AuraAndOak.Api.Models;

namespace AuraAndOak.Api.Controllers;

[ApiController]
[Route("api/v1")]
public class PublicContentController : ControllerBase
{
    private readonly AppDbContext _context;

    public PublicContentController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("projects")]
    public async Task<IActionResult> GetProjects([FromQuery] string? roomType, [FromQuery] string? style)
    {
        var query = _context.Projects
            .Include(p => p.Images)
            .Where(p => p.Published)
            .AsNoTracking();

        if (!string.IsNullOrWhiteSpace(roomType) && roomType != "All")
            query = query.Where(p => p.RoomType == roomType);

        if (!string.IsNullOrWhiteSpace(style) && style != "All")
            query = query.Where(p => p.Style == style);

        var list = await query.OrderByDescending(p => p.CreatedAt).ToListAsync();
        return Ok(list);
    }

    [HttpGet("projects/{slug}")]
    public async Task<IActionResult> GetProjectBySlug(string slug)
    {
        var project = await _context.Projects
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Slug == slug && p.Published);

        if (project == null) return NotFound(new { error = "Project not found." });
        return Ok(project);
    }

    [HttpGet("services")]
    public async Task<IActionResult> GetServices()
    {
        var list = await _context.Services.AsNoTracking().ToListAsync();
        return Ok(list);
    }

    [HttpGet("blog")]
    public async Task<IActionResult> GetBlogPosts([FromQuery] string? category)
    {
        var query = _context.BlogPosts.AsNoTracking();
        if (!string.IsNullOrWhiteSpace(category) && category != "All")
            query = query.Where(b => b.Category == category);

        var list = await query.OrderByDescending(b => b.CreatedAt).ToListAsync();
        return Ok(list);
    }

    [HttpGet("blog/{slug}")]
    public async Task<IActionResult> GetBlogPostBySlug(string slug)
    {
        var post = await _context.BlogPosts.FirstOrDefaultAsync(b => b.Slug == slug);
        if (post == null) return NotFound(new { error = "Blog post not found." });
        return Ok(post);
    }

    [HttpPost("estimator/estimate")]
    public IActionResult CalculateEstimate([FromBody] EstimateRequest req)
    {
        int ratePerSqFt = req.PackageTier.ToLowerInvariant() switch
        {
            "essential" => 45,
            "premium" => 75,
            "bespoke" => 115,
            _ => 75
        };

        double bhkMultiplier = req.Bhk switch
        {
            "1 BHK" => 0.9,
            "2 BHK" => 1.0,
            "3 BHK" => 1.15,
            "4+ BHK / Villa" => 1.3,
            _ => 1.0
        };

        int baseTotal = (int)Math.Round(req.AreaSqFt * ratePerSqFt * bhkMultiplier);
        int low = (int)Math.Round(baseTotal * 0.92);
        int high = (int)Math.Round(baseTotal * 1.12);

        var breakdown = new Dictionary<string, int>
        {
            ["CustomJoineryMillwork"] = (int)Math.Round(baseTotal * 0.38),
            ["CivilFlooringStone"] = (int)Math.Round(baseTotal * 0.28),
            ["CircadianLightingMEP"] = (int)Math.Round(baseTotal * 0.18),
            ["FinishingStyling"] = (int)Math.Round(baseTotal * 0.16)
        };

        var response = new EstimateResponse(
            req.AreaSqFt,
            req.Bhk,
            req.PackageTier,
            baseTotal,
            $"${low:N0} - ${high:N0}",
            breakdown
        );

        return Ok(response);
    }

    [HttpPost("newsletter")]
    public async Task<IActionResult> SubscribeNewsletter([FromBody] NewsletterRequest req)
    {
        if (!string.IsNullOrWhiteSpace(req.Honeypot))
        {
            return Ok(new { success = true, message = "Subscribed." });
        }

        if (string.IsNullOrWhiteSpace(req.Email) || !req.Email.Contains('@'))
        {
            return BadRequest(new { error = "Invalid email address." });
        }

        var exists = await _context.NewsletterSubscribers.AnyAsync(s => s.Email == req.Email.ToLowerInvariant());
        if (!exists)
        {
            _context.NewsletterSubscribers.Add(new NewsletterSubscriber
            {
                Email = req.Email.ToLowerInvariant(),
                CreatedAt = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();
        }

        return Ok(new { success = true, message = "Thank you for subscribing to our architectural gazette." });
    }
}
