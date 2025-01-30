using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
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

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] AuthModel model)
        {
            var user = _context.Users.FirstOrDefault(u => u.Username == model.Username && u.PasswordHash == model.Password);

            if (user == null)
            {
                return Unauthorized();
            }

            var token = await _authService.GenerateJwtToken(user);
            return Ok(new AuthResponse { Token = token });
        }
    }
}