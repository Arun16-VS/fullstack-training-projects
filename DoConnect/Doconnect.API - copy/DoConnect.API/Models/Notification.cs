using System.ComponentModel.DataAnnotations;

namespace DoConnect.API.Models
{
    public class Notification
    {
        [Key]
        public int NotificationId { get; set; }

        [Required]
        public string Message { get; set; } = string.Empty;

        public bool IsRead { get; set; } = false;

        [Required]
        public string Type { get; set; } = "NewQuestion"; // NewQuestion, NewAnswer

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
