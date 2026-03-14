namespace DoConnect.API.DTOs
{
    public class AdminDashboardDTO
    {
        public int PendingQuestionCount { get; set; }
        public int PendingAnswerCount { get; set; }
        public int UnreadNotificationCount { get; set; }
        public List<NotificationDTO> RecentNotifications { get; set; } = [];
    }
}
