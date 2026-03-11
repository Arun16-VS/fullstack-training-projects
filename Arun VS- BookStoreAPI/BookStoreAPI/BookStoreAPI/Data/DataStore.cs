using BookStoreAPI.Models;

namespace BookStoreAPI.Data
{
    public static class DataStore
    {
        public static List<Author> Authors = new List<Author>()
        {
            new Author { Id = 1, Name = "J.K. Rowling" },
            new Author { Id = 2, Name = "George Orwell" }
        };

        public static List<Book> Books = new List<Book>()
        {
            new Book { Id = 1, Title = "Harry Potter", PublicationYear = 1997, AuthorId = 1 },
            new Book { Id = 2, Title = "1984", PublicationYear = 1949, AuthorId = 2 }
        };
    }
}