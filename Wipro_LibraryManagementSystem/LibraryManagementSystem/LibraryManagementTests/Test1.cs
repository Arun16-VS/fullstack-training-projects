using Microsoft.VisualStudio.TestTools.UnitTesting;
using LibraryManagementSystem;
using System;

namespace LibraryManagementTests
{
    [TestClass]
    public class LibraryTests
    {
        private Library _library = null!;

        [TestInitialize]
        public void Setup()
        {
            _library = new Library();
        }

        [TestMethod]
        public void AddBook_Should_Add_Book_To_Library()
        {
            var book = new Book("C# Basics");

            _library.AddBook(book);

            Assert.HasCount(1, _library.Books);
        }

        
        [TestMethod]
        public void BorrowBook_Should_Add_To_Borrower_And_Mark_Unavailable()
        {
            var book = new Book("ASP.NET Core");
            var borrower = new Borrower("Arun");

            _library.AddBook(book);
            _library.BorrowBook(book, borrower);

            Assert.HasCount(1, borrower.BorrowedBooks);
            Assert.IsFalse(book.IsAvailable);
        }

        
        [TestMethod]
        public void BorrowBook_Should_Throw_Exception_When_Not_Available()
        {
            var book = new Book("Clean Code");
            var borrower1 = new Borrower("Arun");
            var borrower2 = new Borrower("Kumar");

            _library.AddBook(book);
            _library.BorrowBook(book, borrower1);

            Assert.Throws<InvalidOperationException>(() =>
            {
                _library.BorrowBook(book, borrower2);
            });
        }

       
        [TestMethod]
        public void ReturnBook_Should_Mark_Available_And_Remove_From_Borrower()
        {
            var book = new Book("Design Patterns");
            var borrower = new Borrower("Arun");

            _library.AddBook(book);
            _library.BorrowBook(book, borrower);

            _library.ReturnBook(book, borrower);

            Assert.IsEmpty(borrower.BorrowedBooks);
            Assert.IsTrue(book.IsAvailable);
        }
    }
}
