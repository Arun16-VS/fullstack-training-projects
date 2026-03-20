using System.ComponentModel.DataAnnotations;

namespace DoConnect.API.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required, MaxLength(100)]
        public string Username { get; set; } = string.Empty;

        [Required, EmailAddress, MaxLength(200)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        public string Role { get; set; } = "User"; // "Admin" or "User"

        public string? ProfilePicture { get; set; }

        public string? Bio { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsActive { get; set; } = true;

        // Navigation
        public ICollection<Question> Questions { get; set; } = new List<Question>();
        public ICollection<Answer> Answers { get; set; } = new List<Answer>();
        public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
        public ICollection<UserConnection> Followers { get; set; } = new List<UserConnection>();
        public ICollection<UserConnection> Following { get; set; } = new List<UserConnection>();
        public ICollection<QuestionVote> QuestionVotes { get; set; } = new List<QuestionVote>();
        public ICollection<AnswerVote> AnswerVotes { get; set; } = new List<AnswerVote>();
    }
}
