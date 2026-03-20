using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DoConnect.API.Models
{
    public class QuestionVote
    {
        [Key]
        public int QuestionVoteId { get; set; }

        [Required]
        public int Value { get; set; }

        [ForeignKey("Question")]
        public int QuestionId { get; set; }
        public Question? Question { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }
        public User? User { get; set; }
    }
}
