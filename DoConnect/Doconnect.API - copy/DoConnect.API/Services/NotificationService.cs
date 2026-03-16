using DoConnect.API.Data;
using DoConnect.API.DTOs;
using DoConnect.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DoConnect.API.Services
{
    public class NotificationService : INotificationService
    {
        private readonly AppDbContext _db;

        public NotificationService(AppDbContext db)
        {
            _db = db;
        }

        public async Task CreateNotification(string message, string type)
        {
            _db.Notifications.Add(new Notification
            {
                Message = message,
                Type = type
            });
            await _db.SaveChangesAsync();
        }

        public async Task<List<NotificationDTO>> GetNotifications()
        {
            return await _db.Notifications
                .OrderByDescending(n => n.CreatedAt)
                .Select(n => new NotificationDTO
                {
                    NotificationId = n.NotificationId,
                    Message = n.Message,
                    IsRead = n.IsRead,
                    Type = n.Type,
                    CreatedAt = n.CreatedAt
                })
                .ToListAsync();
        }

        public async Task MarkAsRead(int id)
        {
            var n = await _db.Notifications.FindAsync(id)
                ?? throw new Exception("Notification not found");
            n.IsRead = true;
            await _db.SaveChangesAsync();
        }
    }
}
