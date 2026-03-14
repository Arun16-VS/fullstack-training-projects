using FinanceManagementSystem.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace FinanceManagementSystem.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            // If the user is not authenticated, redirect to Identity login page with a returnUrl back to home
            if (!(User?.Identity?.IsAuthenticated ?? false))
            {
                var returnUrl = Url.Content("~/");
                return Redirect($"/Identity/Account/Login?returnUrl={System.Net.WebUtility.UrlEncode(returnUrl)}");
            }

            return View();
        }
    }
}