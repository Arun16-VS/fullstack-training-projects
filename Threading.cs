using System;

// T is a placeholder for the actual type
public class Program
{
    public static void Main()
    {
        // Box for integers
        List<string> country = new List<string>();
        country.Add("INDIA");
        country.Add("USA");
        country.Add("JAPAN");
        foreach(string s in country)
        {
            Console.WriteLine(s);
        }
    }
}
