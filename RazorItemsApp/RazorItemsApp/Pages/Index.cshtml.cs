using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Collections.Generic;
using RazorItemsApp;  

namespace RazorItemsApp.Pages
{
    public class IndexModel : PageModel
    {
        public static List<Item> Items { get; set; } = new();

        public void OnGet()
        {
        }
    }
}
