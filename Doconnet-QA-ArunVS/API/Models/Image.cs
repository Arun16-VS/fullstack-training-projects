using System.ComponentModel.DataAnnotations;

namespace DoConnect.API.Models
{
    public class Image
    {
        [Key]
        public int ImageId { get; set; }

        [Required, MaxLength(255)]
        public string FileName { get; set; } = string.Empty;

        [Required]
        public string FilePath { get; set; } = string.Empty;

        [MaxLength(100)]
        public string ContentType { get; set; } = "image/png";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int? QuestionId { get; set; }
        public Question? Question { get; set; }

        public int? AnswerId { get; set; }
        public Answer? Answer { get; set; }
    }
}
