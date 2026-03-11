using Microsoft.AspNetCore.Mvc;
using BookStoreAPI.Data;
using BookStoreAPI.Models;

namespace BookStoreAPI.Controllers
{
    [ApiController]
    [Route("api/books")]
    public class BooksController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetBooks()
        {
            return Ok(DataStore.Books);
        }

        [HttpGet("{id}")]
        public IActionResult GetBook(int id)
        {
            var book = DataStore.Books.FirstOrDefault(b => b.Id == id);

            if (book == null)
                return NotFound();

            return Ok(book);
        }

        [HttpPost]
        public IActionResult CreateBook(Book book)
        {
            book.Id = DataStore.Books.Max(b => b.Id) + 1;

            DataStore.Books.Add(book);

            return CreatedAtAction(nameof(GetBook), new { id = book.Id }, book);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateBook(int id, Book updatedBook)
        {
            var book = DataStore.Books.FirstOrDefault(b => b.Id == id);

            if (book == null)
                return NotFound();

            book.Title = updatedBook.Title;
            book.PublicationYear = updatedBook.PublicationYear;
            book.AuthorId = updatedBook.AuthorId;

            return Ok(book);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteBook(int id)
        {
            var book = DataStore.Books.FirstOrDefault(b => b.Id == id);

            if (book == null)
                return NotFound();

            DataStore.Books.Remove(book);

            return NoContent();
        }
    }
}