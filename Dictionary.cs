using System;

// T is a placeholder for the actual type
public class Program
{
    public static void Main()
    {
        // Box for integers
        Dictionary<int,string> dict = new Dictionary<int, string>();
        dict.Add(1,"INDIA");
        dict.Add(2,"USA");
        dict.Add(3,"JAPAN");
        dict.Add(4,"CHINA");
       
       

        foreach(var a in dict)
        {
            Console.WriteLine(a.Key + " "+ a.Value);
        }
    }
}
