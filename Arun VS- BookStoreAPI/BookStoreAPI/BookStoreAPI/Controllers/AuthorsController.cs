using Microsoft.AspNetCore.Mvc;
using BookStoreAPI.Data;

namespace BookStoreAPI.Controllers
{
    [ApiController]
    [Route("api/authors")]
    public class AuthorsController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAuthors()
        {
            return Ok(DataStore.Authors);
        }

        [HttpGet("{authorId}/books")]
        public IActionResult GetBooksByAuthor(int authorId)
        {
            var books = DataStore.Books
                .Where(b => b.AuthorId == authorId)
                .ToList();

            return Ok(books);
        }
    }
}