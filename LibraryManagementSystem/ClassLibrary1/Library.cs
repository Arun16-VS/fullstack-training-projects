using System;
using System.Collections.Generic;
using System.Linq;

namespace LibraryManagementSystem
{
    public class Library
    {
        public List<Book> Books { get; private set; }

        public Library()
        {
            Books = new List<Book>();
        }

        public void AddBook(Book book)
        {
            if (book == null)
                throw new ArgumentNullException(nameof(book));

            Books.Add(book);
        }

        public void BorrowBook(Book book, Borrower borrower)
        {
            if (book == null)
                throw new ArgumentNullException(nameof(book));

            if (borrower == null)
                throw new ArgumentNullException(nameof(borrower));

            if (!Books.Contains(book))
                throw new InvalidOperationException("Book does not exist in library.");

            book.MarkAsBorrowed();
            borrower.BorrowBook(book);
        }

        public void ReturnBook(Book book, Borrower borrower)
        {
            if (book == null)
                throw new ArgumentNullException(nameof(book));

            if (borrower == null)
                throw new ArgumentNullException(nameof(borrower));

            book.MarkAsReturned();
            borrower.ReturnBook(book);
        }

        public Book FindBook(string title)
        {
            return Books.FirstOrDefault(b => b.Title == title);
        }
    }
}
