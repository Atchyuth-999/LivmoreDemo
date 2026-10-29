using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using AuraAndOak.Api.Data;
using AuraAndOak.Api.DTOs;
using AuraAndOak.Api.Models;
using AuraAndOak.Api.Services;

namespace AuraAndOak.Api.Controllers;

[ApiController]
[Route("api/v1/admin")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IAuthService _authService;
    private readonly ILogger<AdminController> _logger;

    public AdminController(AppDbContext context, IAuthService authService, ILogger<AdminController> logger)
    {
        _context = context;
        _authService = authService;
        _logger = logger;
    }

    [HttpPost("login")]
    [EnableRateLimiting("AdminLoginPolicy")] // 5 per min rate limiting
    public async Task<IActionResult> Login([FromBody] AdminLoginRequest request)
    {
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
        var result = await _authService.LoginAsync(request.Email, request.Password, ip);

        if (result == null)
        {
            // Generic error message per Section 8
            return Unauthorized(new { error = "Invalid credentials." });
        }

        // Deliver refresh token in HttpOnly, Secure, SameSite=Strict cookie
        SetRefreshTokenCookie(result.Value.RefreshToken);

        return Ok(new AdminLoginResponse(result.Value.AccessToken, request.Email, 30));
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        if (string.IsNullOrEmpty(refreshToken))
        {
            return Unauthorized(new { error = "Refresh token missing." });
        }

        var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
        var result = await _authService.RefreshTokenAsync(refreshToken, ip);

        if (result == null)
        {
            return Unauthorized(new { error = "Invalid or expired session." });
        }

        SetRefreshTokenCookie(result.Value.RefreshToken);
        return Ok(new AdminLoginResponse(result.Value.AccessToken, "admin@auraandoak.com", 30));
    }

    [HttpPost("logout")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Logout()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        if (!string.IsNullOrEmpty(refreshToken))
        {
            await _authService.RevokeRefreshTokenAsync(refreshToken);
        }

        Response.Cookies.Delete("refreshToken", new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict
        });

        return Ok(new { success = true, message = "Successfully logged out." });
    }

    // -------------------------------------------------------------
    // LEAD MANAGEMENT (Core Feature)
    // -------------------------------------------------------------

    [HttpGet("leads")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetLeads(
        [FromQuery] string? search,
        [FromQuery] string? status,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var query = _context.Leads
            .Include(l => l.Notes)
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(status) && status != "All")
        {
            query = query.Where(l => l.Status == status);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            query = query.Where(l =>
                l.Name.ToLower().Contains(s) ||
                l.Email.ToLower().Contains(s) ||
                l.Phone.Contains(s) ||
                l.City.ToLower().Contains(s));
        }

        var total = await query.CountAsync();
        var leads = await query
            .OrderByDescending(l => l.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var counts = new
        {
            Total = await _context.Leads.CountAsync(),
            New = await _context.Leads.CountAsync(l => l.Status == "New"),
            Contacted = await _context.Leads.CountAsync(l => l.Status == "Contacted"),
            Qualified = await _context.Leads.CountAsync(l => l.Status == "Qualified"),
            Closed = await _context.Leads.CountAsync(l => l.Status == "Closed")
        };

        return Ok(new
        {
            data = leads,
            total,
            page,
            pageSize,
            counts
        });
    }

    [HttpGet("leads/{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetLeadById(Guid id)
    {
        var lead = await _context.Leads
            .Include(l => l.Notes)
            .FirstOrDefaultAsync(l => l.Id == id);

        if (lead == null) return NotFound(new { error = "Lead not found." });
        return Ok(lead);
    }

    [HttpPatch("leads/{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateLeadStatus(Guid id, [FromBody] UpdateLeadStatusDto dto)
    {
        var lead = await _context.Leads.FindAsync(id);
        if (lead == null) return NotFound(new { error = "Lead not found." });

        lead.Status = dto.Status;
        lead.UpdatedAt = DateTime.UtcNow;

        _context.AuditLogs.Add(new AuditLog
        {
            Action = "UpdateLeadStatus",
            AdminEmail = "admin@auraandoak.com",
            Details = $"Updated lead {id} status to {dto.Status}",
            IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown"
        });

        await _context.SaveChangesAsync();
        return Ok(lead);
    }

    [HttpPost("leads/{id:guid}/notes")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AddLeadNote(Guid id, [FromBody] CreateLeadNoteDto dto)
    {
        var lead = await _context.Leads.FindAsync(id);
        if (lead == null) return NotFound(new { error = "Lead not found." });

        var note = new LeadNote
        {
            LeadId = id,
            Note = dto.Note.Trim(),
            CreatedBy = "Elena Vance (Admin)",
            CreatedAt = DateTime.UtcNow
        };

        _context.LeadNotes.Add(note);
        await _context.SaveChangesAsync();

        return Created($"/api/v1/admin/leads/{id}/notes/{note.Id}", note);
    }

    [HttpDelete("leads/{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteLead(Guid id)
    {
        var lead = await _context.Leads.FindAsync(id);
        if (lead == null) return NotFound(new { error = "Lead not found." });

        // Soft delete per Section 10
        lead.IsDeleted = true;
        lead.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(new { success = true, message = "Lead successfully soft deleted." });
    }

    [HttpGet("leads/export")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ExportLeadsCsv()
    {
        var leads = await _context.Leads
            .OrderByDescending(l => l.CreatedAt)
            .ToListAsync();

        var csv = new StringBuilder();
        csv.AppendLine("ID,Name,Phone,Email,City,PropertyType,Budget,Status,Source,CreatedAt,Message");

        foreach (var l in leads)
        {
            csv.AppendLine($"\"{l.Id}\",\"{EscapeCsv(l.Name)}\",\"{EscapeCsv(l.Phone)}\",\"{EscapeCsv(l.Email)}\",\"{EscapeCsv(l.City)}\",\"{EscapeCsv(l.PropertyType)}\",\"{EscapeCsv(l.Budget)}\",\"{l.Status}\",\"{l.Source}\",\"{l.CreatedAt:u}\",\"{EscapeCsv(l.Message)}\"");
        }

        var bytes = Encoding.UTF8.GetBytes(csv.ToString());
        return File(bytes, "text/csv", $"leads_export_{DateTime.UtcNow:yyyyMMdd_HHmm}.csv");
    }

    private void SetRefreshTokenCookie(string token)
    {
        Response.Cookies.Append("refreshToken", token, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddDays(7)
        });
    }

    private static string EscapeCsv(string? val) => (val ?? string.Empty).Replace("\"", "\"\"");
}
