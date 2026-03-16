using FinanceManagementSystem.Models;

namespace FinanceManagementSystem.Data
{
    public static class SeedData
    {
        public static void Seed(ApplicationDbContext db)
        {
            // Seed Categories only
            if (!db.ExpenseCategories.Any())
            {
                db.ExpenseCategories.AddRange(
                    new ExpenseCategory { CategoryName = "Food" },
                    new ExpenseCategory { CategoryName = "Transport" },
                    new ExpenseCategory { CategoryName = "Utilities" },
                    new ExpenseCategory { CategoryName = "Shopping" }
                );
            }

            // ❌ DO NOT seed Users when using Identity
            // Users must come from Identity Register + linking

            db.SaveChanges();
        }
    }
}