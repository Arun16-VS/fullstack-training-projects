using FinanceManagementSystem.Data;
using FinanceManagementSystem.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinanceManagementSystem.Controllers
{
    public class ExpenseCategoriesController : Controller
    {
        private readonly ApplicationDbContext _context;
        public ExpenseCategoriesController(ApplicationDbContext context) => _context = context;

        // Only show active categories in the list (front-end)
        public async Task<IActionResult> Index()
        {
            var cats = await _context.ExpenseCategories
                                     .Where(c => c.IsActive)
                                     .ToListAsync();
            return View(cats);
        }

        public IActionResult Create() => View();

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(ExpenseCategory category)
        {
            if (!ModelState.IsValid) return View(category);
            _context.ExpenseCategories.Add(category);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        public async Task<IActionResult> Edit(int id)
        {
            var cat = await _context.ExpenseCategories.FindAsync(id);
            if (cat == null) return NotFound();
            return View(cat);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, ExpenseCategory category)
        {
            if (id != category.CategoryId) return NotFound();
            if (!ModelState.IsValid) return View(category);
            _context.Update(category);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        public async Task<IActionResult> Delete(int id)
        {
            var cat = await _context.ExpenseCategories.FindAsync(id);
            if (cat == null) return NotFound();
            return View(cat);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var cat = await _context.ExpenseCategories.FindAsync(id);
            if (cat != null)
            {
                // Soft delete: mark inactive rather than removing.
                cat.IsActive = false;
                _context.Update(cat);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }

        // ── AJAX DELETE ──────────────────────────────────────────
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteAjax(int id)
        {
            var cat = await _context.ExpenseCategories.FindAsync(id);
            if (cat == null)
                return Json(new { success = false, message = "Category not found." });

            // Soft-delete: mark inactive rather than removing.
            cat.IsActive = false;
            _context.Update(cat);
            await _context.SaveChangesAsync();

            return Json(new { success = true });
        }
    }
}
