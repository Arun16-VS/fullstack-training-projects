using DoConnect.API.DTOs;

namespace DoConnect.API.Services
{
    public interface INotificationService
    {
        Task CreateNotification(string message, string type);
        Task<List<NotificationDTO>> GetNotifications();
        Task MarkAsRead(int id);
    }
}