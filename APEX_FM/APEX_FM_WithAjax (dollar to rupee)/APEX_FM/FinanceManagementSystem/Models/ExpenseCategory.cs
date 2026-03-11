using System.ComponentModel.DataAnnotations;

namespace FinanceManagementSystem.Models
{
    public class ExpenseCategory
    {
        [Key]
        public int CategoryId { get; set; }

        [Required]
        public string CategoryName { get; set; } = null!;

        // Soft-delete: hide from lists but keep for historical data
        public bool IsActive { get; set; } = true;
    }
}