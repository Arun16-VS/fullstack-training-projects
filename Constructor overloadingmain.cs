using System;
using ConsoleMain;

namespace App1
{
    internal class Program
    {
        static void Main(string[] args)
        {
            Area square = new Area(4);
            Area rectangle = new Area(2, 5);

            Console.WriteLine("Square Area: " + square.Calculate());
            Console.WriteLine("Rectangle Area: " + rectangle.Calculate());

            // Using overloaded method
            Console.WriteLine("Area (method overloading): " + rectangle.Calculate(3, 6));
        }
    }
}
