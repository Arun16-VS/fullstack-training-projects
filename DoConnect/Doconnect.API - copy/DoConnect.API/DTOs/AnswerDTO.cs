using System.ComponentModel.DataAnnotations;

namespace DoConnect.API.DTOs
{
    public class CreateAnswerDTO
    {
        [Required]
        public string AnswerText { get; set; } = string.Empty;

        public IFormFile? Image { get; set; }
    }

    public class AnswerResponseDTO
    {
        public int AnswerId { get; set; }
        public int QuestionId { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string AnswerText { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
