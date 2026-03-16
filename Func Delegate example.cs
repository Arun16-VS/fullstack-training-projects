using System;
using System.Collections.Generic;
using System.Linq;

internal class Program
{
    static void Main(string[] args)
    {
        // Create object of class which contains methods
        DelegateDemo d = new DelegateDemo();

        // List to store individual results of each function
        List<int> results = new List<int>();

        // Func<int, int> means: method takes int and returns int
        Func<int, int> f1 = d.Double;   // Assign Double method

        // Add another method to the same delegate (multicast delegate)
        f1 += d.Square;

        // Calling multicast delegate directly
        // Both Double(5) and Square(5) will run
        // But only the LAST method's result (Square) is returned
        Console.WriteLine(f1(5));  // Output: 25

        // Get all methods attached to the delegate
        var invoclist = f1.GetInvocationList().Cast<Func<int, int>>();

        // Call each function separately
        foreach (var item in invoclist)
        {
            int result = item.Invoke(5);  // Call each method with 5
            results.Add(result);          // Store result
        }

        // Print individual results
        foreach (var i in results)
        {
            Console.WriteLine(i);   // Output: 10 and 25
        }
    }
}

// Class that contains methods
public class DelegateDemo
{
    public int Double(int x)
    {
        return x * 2;  // Double the number
    }

    public int Square(int x)
    {
        return x * x;  // Square of the number
    }
}
