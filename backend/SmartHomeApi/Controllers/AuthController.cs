using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BCrypt.Net;
using SmartHomeApi.Data;
using SmartHomeApi.Models;
using SmartHomeApi.Services;
using System.Linq;
using System.Threading.Tasks;

namespace SmartHomeApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly SmartHomeApi.Data.SmartHomeContext _context;
        private readonly AuthService _authService;

        public AuthController(SmartHomeApi.Data.SmartHomeContext context, AuthService authService)
        {
            _context = context;
            _authService = authService;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] AuthModel model)
        {
            if (_context.Users.Any(u => u.Username == model.Username))
            {
                return BadRequest("User already exists.");
            }

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(model.Password);

            var user = new User
            {
                Username = model.Username,
                PasswordHash = hashedPassword,
                Email = model.Email,
                Role = "User"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok("User registered successfully.");
        }


        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] AuthModel model)
        {
            var user = _context.Users.FirstOrDefault(u => u.Username == model.Username);

            if (user == null || !BCrypt.Net.BCrypt.Verify(model.Password, user.PasswordHash))
            {
                return Unauthorized();
            }

            var token = await _authService.GenerateJwtToken(user);
            return Ok(new AuthResponse { Token = token });
        }
    }
}