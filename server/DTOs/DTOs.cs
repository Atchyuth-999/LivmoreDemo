namespace AuraAndOak.Api.DTOs;

public record CreateLeadDto(
    string Name,
    string Phone,
    string Email,
    string? City,
    string? PropertyType,
    string? Budget,
    string? Message,
    string? Source,
    string? Honeypot,
    string? TurnstileToken
);

public record UpdateLeadStatusDto(
    string Status
);

public record CreateLeadNoteDto(
    string Note
);

public record LeadResponseDto(
    Guid Id,
    string Name,
    string Phone,
    string Email,
    string City,
    string PropertyType,
    string Budget,
    string Message,
    string Source,
    string Status,
    DateTime CreatedAt,
    List<LeadNoteResponseDto> Notes
);

public record LeadNoteResponseDto(
    Guid Id,
    string Note,
    string CreatedBy,
    DateTime CreatedAt
);

public record AdminLoginRequest(
    string Email,
    string Password
);

public record AdminLoginResponse(
    string AccessToken,
    string Email,
    int ExpiresInMinutes
);

public record EstimateRequest(
    int AreaSqFt,
    string Bhk,
    string PackageTier
);

public record EstimateResponse(
    int AreaSqFt,
    string Bhk,
    string PackageTier,
    int EstimatedTotal,
    string EstimatedRange,
    Dictionary<string, int> TradeBreakdown
);

public record NewsletterRequest(
    string Email,
    string? Honeypot
);
