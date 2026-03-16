using System.ComponentModel.DataAnnotations;

namespace FinanceManagementSystem.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }

        // Link to ASP.NET Identity user
        public string IdentityUserId { get; set; } = null!;

        public string Username { get; set; } = null!;
        public string Password { get; set; } = "pass";
        public string Email { get; set; } = null!;
    }
}