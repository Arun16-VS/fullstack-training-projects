using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using RazorItemsApp;

namespace RazorItemsApp.Pages
{
    public class AddItemModel : PageModel
    {
        [BindProperty]
        public RazorItemsApp.Item NewItem { get; set; } = new();

        public IActionResult OnPost()
        {
            IndexModel.Items.Add(NewItem);   
            return RedirectToPage("Index");
        }
    }
}
