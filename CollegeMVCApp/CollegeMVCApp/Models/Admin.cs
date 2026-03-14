using System.ComponentModel.DataAnnotations;

namespace CollegeMVCApp.Models
{
    public class Admin
    {
        public int Id { get; set; }

        [Required]
        public string? Name { get; set; }
    }
}
