using FluentValidation;
using AuraAndOak.Api.DTOs;

namespace AuraAndOak.Api.Validators;

public class CreateLeadValidator : AbstractValidator<CreateLeadDto>
{
    public CreateLeadValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Full Name is required.")
            .MaximumLength(150).WithMessage("Name cannot exceed 150 characters.");

        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("Contact phone number is required.")
            .Matches(@"^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$")
            .WithMessage("Please provide a valid phone number.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email address is required.")
            .EmailAddress().WithMessage("Please provide a valid email address.");

        RuleFor(x => x.PropertyType)
            .MaximumLength(100);

        RuleFor(x => x.Budget)
            .MaximumLength(100);

        RuleFor(x => x.Message)
            .MaximumLength(2500).WithMessage("Message cannot exceed 2500 characters.");
    }
}

public class UpdateLeadStatusValidator : AbstractValidator<UpdateLeadStatusDto>
{
    private static readonly string[] ValidStatuses = { "New", "Contacted", "Qualified", "Closed" };

    public UpdateLeadStatusValidator()
    {
        RuleFor(x => x.Status)
            .NotEmpty().WithMessage("Status is required.")
            .Must(s => ValidStatuses.Contains(s))
            .WithMessage("Status must be one of: New, Contacted, Qualified, Closed.");
    }
}
