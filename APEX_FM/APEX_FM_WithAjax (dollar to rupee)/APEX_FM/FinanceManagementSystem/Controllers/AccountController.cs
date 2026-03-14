using FinanceManagementSystem.Data;
using FinanceManagementSystem.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace FinanceManagementSystem.Controllers
{
    public class AccountController : Controller
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly ApplicationDbContext _context;

        public AccountController(UserManager<IdentityUser> userManager, ApplicationDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        // Call after login to ensure App User exists
        public async Task<IActionResult> EnsureAppUser()
        {
            var identityUser = await _userManager.GetUserAsync(User);
            if (identityUser == null) return Unauthorized();

            var exists = _context.Users.Any(u => u.IdentityUserId == identityUser.Id);
            if (!exists)
            {
                _context.Users.Add(new User
                {
                    IdentityUserId = identityUser.Id,
                    Username = identityUser.UserName!,
                    Email = identityUser.Email!
                });
                await _context.SaveChangesAsync();
            }

            return RedirectToAction("Index", "Expenses");
        }
    }
}