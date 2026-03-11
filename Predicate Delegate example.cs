using System;
using System.Linq;

internal class Program
{
    static void Main(string[] args)
    {
        DelegateExample de = new DelegateExample();
        Predicate<int> p = de.Eligible;
        bool check =p.Invoke(90);
        string msg = check ? "Eligible" : "Not Eligible";
        Console.WriteLine(msg);

    }

    public class DelegateExample
    {
        public bool Eligible(int marks)
        {
            if (marks > 80)
                return true;
            else return false;


        }
    }
}
