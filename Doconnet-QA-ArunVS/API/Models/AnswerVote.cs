using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DoConnect.API.Models
{
    public class AnswerVote
    {
        [Key]
        public int AnswerVoteId { get; set; }

        [Required]
        public int Value { get; set; }

        [ForeignKey("Answer")]
        public int AnswerId { get; set; }
        public Answer? Answer { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }
        public User? User { get; set; }
    }
}
