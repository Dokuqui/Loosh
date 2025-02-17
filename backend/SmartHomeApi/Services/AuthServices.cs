using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using DotNetEnv;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace SmartHomeApi.Services
{
    public class AuthService
    {
        private readonly IConfiguration _configuration;

        public AuthService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<string> GenerateJwtToken(SmartHomeApi.Data.User user)
        {
            try
            {
                Env.Load();

                var jwtKey =
                    Environment.GetEnvironmentVariable("Jwt__Key")
                    ?? throw new InvalidOperationException("JWT Key is missing.");
                var issuer =
                    _configuration["Jwt:Issuer"]
                    ?? throw new InvalidOperationException("JWT Issuer is missing.");
                var audience =
                    _configuration["Jwt:Audience"]
                    ?? throw new InvalidOperationException("JWT Audience is missing.");

                if (
                    user == null
                    || string.IsNullOrEmpty(user.Username)
                    || string.IsNullOrEmpty(user.Email)
                )
                {
                    throw new ArgumentException(
                        "User object is invalid or missing required properties."
                    );
                }

                var claims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                    new Claim(JwtRegisteredClaimNames.Name, user.Username ?? "Unknown"),
                    new Claim(JwtRegisteredClaimNames.Email, user.Email ?? "Unknown"),
                    new Claim("role", user.Role ?? "User"),
                };

                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
                var signingCredentials = new SigningCredentials(
                    securityKey,
                    SecurityAlgorithms.HmacSha256
                );

                var token = new JwtSecurityToken(
                    issuer: issuer,
                    audience: audience,
                    claims: claims,
                    expires: DateTime.UtcNow.AddMinutes(60),
                    signingCredentials: signingCredentials
                );

                var tokenHandler = new JwtSecurityTokenHandler();
                var tokenString = tokenHandler.WriteToken(token);

                return await Task.FromResult(tokenString);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error generating JWT token: {ex.Message}");
                throw;
            }
        }
    }
}
