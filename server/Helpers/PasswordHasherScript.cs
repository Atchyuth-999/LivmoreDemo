// Snippet to generate a BCrypt password hash for the single admin account.
// Run via: dotnet run (or execute within C# interactive / LINQPad)

using System;

namespace AuraAndOak.Api.Helpers;

public static class PasswordHasherSnippet
{
    public static void Main(string[] args)
    {
        Console.WriteLine("=== Aura & Oak Admin Password Hash Generator ===");
        Console.Write("Enter desired admin master password: ");
        var password = Console.ReadLine();

        if (string.IsNullOrWhiteSpace(password))
        {
            password = "Password123!";
        }

        // Generate BCrypt hash with work factor 12 (recommended for production)
        string hash = BCrypt.Net.BCrypt.HashPassword(password, workFactor: 12);

        Console.WriteLine("\nGenerated BCrypt Hash:");
        Console.WriteLine(hash);
        Console.WriteLine("\nPaste this into appsettings.json or environment variable:");
        Console.WriteLine($"ADMINAUTH__PASSWORDHASH=\"{hash}\"");
    }
}
