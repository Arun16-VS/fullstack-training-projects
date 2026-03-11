using System;

namespace LibraryManagementSystem
{
    public class Book
    {
        public string Title { get; private set; }
        public bool IsAvailable { get; private set; }

        public Book(string title)
        {
            if (string.IsNullOrWhiteSpace(title))
                throw new ArgumentException("Title cannot be empty.");

            Title = title;
            IsAvailable = true;
        }

        public void MarkAsBorrowed()
        {
            if (!IsAvailable)
                throw new InvalidOperationException("Book is already borrowed.");

            IsAvailable = false;
        }

        public void MarkAsReturned()
        {
            IsAvailable = true;
        }
    }
}
