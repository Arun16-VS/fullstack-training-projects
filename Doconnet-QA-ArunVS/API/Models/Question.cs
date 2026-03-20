using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DoConnect.API.Models
{
    public class Question
    {
        [Key]
        public int QuestionId { get; set; }

        [Required, MaxLength(300)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Body { get; set; } = string.Empty;

        public string? ImageUrl { get; set; }

        [Required, MaxLength(20)]
        public string ApprovalStatus { get; set; } = "Approved";

        public string? Tags { get; set; } // Comma-separated

        public int ViewCount { get; set; } = 0;

        public int VoteCount { get; set; } = 0;

        public bool IsResolved { get; set; } = false;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // FK
        [ForeignKey("User")]
        public int UserId { get; set; }
        public User? User { get; set; }

        public int? AcceptedAnswerId { get; set; }

        // Navigation
        public ICollection<Answer> Answers { get; set; } = new List<Answer>();
        public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
        public ICollection<Image> Images { get; set; } = new List<Image>();
        public ICollection<QuestionVote> Votes { get; set; } = new List<QuestionVote>();
    }
}
