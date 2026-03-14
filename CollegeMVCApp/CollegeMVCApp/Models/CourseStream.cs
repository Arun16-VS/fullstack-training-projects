using System.ComponentModel.DataAnnotations;

namespace CollegeMVCApp.Models
{
    public class CourseStream
    {
        public int Id { get; set; }

        [Required]
        public string? Name { get; set; }

        public string? Description { get; set; }

        // Navigation Properties
        public ICollection<Student>? Students { get; set; }
        public ICollection<Professor>? Professors { get; set; }
    }
}
