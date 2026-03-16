using System.ComponentModel.DataAnnotations;

namespace DoConnect.API.DTOs
{
    public class CreateQuestionDTO
    {
        [Required, MaxLength(200)]
        public string QuestionTitle { get; set; } = string.Empty;

        [Required]
        public string QuestionText { get; set; } = string.Empty;

        [Required]
        public string Topic { get; set; } = string.Empty;

        public IFormFile? Image { get; set; }
    }

    public class UpdateQuestionDTO
    {
        [Required, MaxLength(200)]
        public string QuestionTitle { get; set; } = string.Empty;

        [Required]
        public string QuestionText { get; set; } = string.Empty;

        [Required]
        public string Topic { get; set; } = string.Empty;

        public IFormFile? Image { get; set; }
    }

    public class QuestionResponseDTO
    {
        public int QuestionId { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string QuestionTitle { get; set; } = string.Empty;
        public string QuestionText { get; set; } = string.Empty;
        public string Topic { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public int AnswerCount { get; set; }
    }
}
