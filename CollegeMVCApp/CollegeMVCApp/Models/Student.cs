using System.ComponentModel.DataAnnotations;

namespace CollegeMVCApp.Models
{
    public class Student
    {
        public int Id { get; set; }

        [Required]
        public string? Name { get; set; }

        // Foreign Key - CourseStream
        public int CourseStreamId { get; set; }
        public CourseStream? CourseStream { get; set; }

        // Foreign Key - Parent
        public int ParentId { get; set; }
        public Parent? Parent { get; set; }
    }
}
