using System.ComponentModel.DataAnnotations;

namespace CollegeMVCApp.Models
{
    public class Parent
    {
        public int Id { get; set; }

        [Required]
        public string? Name { get; set; }

        // Navigation Property
        public ICollection<Student>? Students { get; set; }
    }
}
