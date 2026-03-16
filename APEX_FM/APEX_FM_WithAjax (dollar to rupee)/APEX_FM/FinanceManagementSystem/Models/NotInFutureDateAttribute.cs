using System;
using System.ComponentModel.DataAnnotations;

namespace FinanceManagementSystem.Models
{
    // Validates that a DateTime is not a future date (compares date part only).
    public class NotInFutureDateAttribute : ValidationAttribute
    {
        public override bool IsValid(object? value)
        {
            if (value == null) return true; // required validation handled by [Required] if used

            if (value is DateTime dt)
            {
                // Compare only the Date component so timezones are irrelevant
                return dt.Date <= DateTime.Now.Date;
            }

            return false;
        }

        public override string FormatErrorMessage(string name)
        {
            return $"{name} cannot be a future date.";
        }
    }
}