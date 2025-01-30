using Microsoft.EntityFrameworkCore;

namespace SmartHomeApi.Data
{
    public class SmartHomeContext : DbContext
    {
        public SmartHomeContext(DbContextOptions<SmartHomeContext> options) : base(options) { }

        public DbSet<Device> Devices { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<DeviceLog> DeviceLogs { get; set; }
    }

    public class Device
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Type { get; set; }
        public bool Status { get; set; }
    }

    public class User
    {
        public int Id { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? PasswordHash { get; set; }
        public string? Role { get; set; }
    }

    public class DeviceLog
    {
        public int Id { get; set; }
        public int DeviceId { get; set; }
        public DateTime Timestamp { get; set; }
        public bool Status { get; set; }
    }
}