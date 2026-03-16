using System;
using Training;
using System.IO;

class Program
{
    static void Main()
    {
        string filePath = "example.txt";
        string[] lines = {
            "This is the first line.",
            "This is the second line.",
            "This is the third line."
        };

        try
        {
            File.WriteAllLines(filePath, lines);
            Console.WriteLine("Lines written to file.");
        }
        catch (IOException ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
        }
    }
}
