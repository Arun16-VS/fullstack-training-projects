using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DoConnect.API.Models
{
    public class UserConnection
    {
        [Key]
        public int UserConnectionId { get; set; }

        [ForeignKey(nameof(Follower))]
        public int FollowerId { get; set; }
        public User? Follower { get; set; }

        [ForeignKey(nameof(Following))]
        public int FollowingId { get; set; }
        public User? Following { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
