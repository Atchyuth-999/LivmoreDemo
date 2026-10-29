using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using AuraAndOak.Api.Data;
using AuraAndOak.Api.DTOs;
using AuraAndOak.Api.Models;
using AuraAndOak.Api.Services;

namespace AuraAndOak.Api.Controllers;

[ApiController]
[Route("api/v1/leads")]
[EnableRateLimiting("PublicFormsPolicy")]
public class LeadsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IEmailService _emailService;
    private readonly ITurnstileService _turnstileService;
    private readonly ILogger<LeadsController> _logger;

    public LeadsController(
        AppDbContext context,
        IEmailService emailService,
        ITurnstileService turnstileService,
        ILogger<LeadsController> logger)
    {
        _context = context;
        _emailService = emailService;
        _turnstileService = turnstileService;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> CreateLead([FromBody] CreateLeadDto dto)
    {
        // 1. Honeypot check (Section 7.2: Silently return 200 if honeypot is filled)
        if (!string.IsNullOrWhiteSpace(dto.Honeypot))
        {
            _logger.LogWarning("Spam honeypot triggered by client IP {Ip}. Silently dropping.", HttpContext.Connection.RemoteIpAddress);
            return Ok(new { success = true, message = "Thank you, we'll contact you soon" });
        }

        // 2. Cloudflare Turnstile token validation (Section 7.3)
        var remoteIp = HttpContext.Connection.RemoteIpAddress?.ToString();
        var turnstileValid = await _turnstileService.VerifyTokenAsync(dto.TurnstileToken, remoteIp);
        if (!turnstileValid)
        {
            return BadRequest(new { error = "Bot verification challenge failed. Please refresh and try again." });
        }

        // 3. Save Lead to SQL Server (Section 7.4)
        var lead = new Lead
        {
            Name = dto.Name.Trim(),
            Phone = dto.Phone.Trim(),
            Email = dto.Email.Trim().ToLowerInvariant(),
            City = dto.City?.Trim() ?? string.Empty,
            PropertyType = dto.PropertyType?.Trim() ?? "Residential",
            Budget = dto.Budget?.Trim() ?? "Flexible",
            Message = dto.Message?.Trim() ?? string.Empty,
            Source = dto.Source ?? "contact",
            Status = "New",
            IpAddress = remoteIp ?? "Unknown",
            CreatedAt = DateTime.UtcNow
        };

        _context.Leads.Add(lead);
        await _context.SaveChangesAsync();

        _logger.LogInformation("New consultation lead saved with ID {LeadId} from {City}", lead.Id, lead.City);

        // 4. Send Email Notification via IEmailService (Section 7.5)
        // Failure must NOT lose the saved lead
        _ = _emailService.SendLeadNotificationAsync(lead);

        // 5. Return 200 OK (Section 7.6)
        return Ok(new { success = true, message = "Thank you, we'll contact you soon", id = lead.Id });
    }
}
