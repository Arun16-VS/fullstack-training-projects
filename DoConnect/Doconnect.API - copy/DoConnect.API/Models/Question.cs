using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DoConnect.API.Models
{
    public class Question
    {
        [Key]
        public int QuestionId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required, MaxLength(200)]
        public string QuestionTitle { get; set; } = string.Empty;

        [Required]
        public string QuestionText { get; set; } = string.Empty;

        [Required, MaxLength(50)]
        public string Topic { get; set; } = string.Empty;

        [Required]
        public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected

        public string? ImageUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        [ForeignKey("UserId")]
        public User User { get; set; } = null!;

        public ICollection<Answer> Answers { get; set; } = new List<Answer>();
    }
}
