using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace SmartHomeApi.Hubs
{
    public class DeviceHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }
}