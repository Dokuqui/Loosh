using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SmartHomeApi.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartHomeApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DeviceController : ControllerBase
    {
        private readonly SmartHomeApi.Data.SmartHomeContext _context;

        public DeviceController(SmartHomeApi.Data.SmartHomeContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<IEnumerable<SmartHomeApi.Data.Device>> GetDevices()
        {
            return _context.Devices.ToList();
        }

        [HttpGet("{id}")]
        public ActionResult<SmartHomeApi.Data.Device> GetDevice(int id)
        {
            var device = _context.Devices.Find(id);
            if (device == null)
            {
                return NotFound();
            }
            return device;
        }

        [HttpPost]
        public ActionResult<SmartHomeApi.Data.Device> PostDevice(SmartHomeApi.Data.Device device)
        {
            _context.Devices.Add(device);
            _context.SaveChanges();

            return CreatedAtAction("GetDevice", new { id = device.Id }, device);
        }

        [HttpPut("{id}")]
        public IActionResult PutDevice(int id, SmartHomeApi.Data.Device device)
        {
            if (id != device.Id)
            {
                return BadRequest();
            }

            _context.Entry(device).State = Microsoft.EntityFrameworkCore.EntityState.Modified;

            try
            {
                _context.SaveChanges();
            }
            catch (Microsoft.EntityFrameworkCore.DbUpdateConcurrencyException)
            {
                if (!_context.Devices.Any(e => e.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteDevice(int id)
        {
            var device = _context.Devices.Find(id);
            if (device == null)
            {
                return NotFound();
            }

            _context.Devices.Remove(device);
            _context.SaveChanges();

            return NoContent();
        }
    }
}