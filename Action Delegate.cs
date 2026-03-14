using System;
using System.Linq;

internal class Program
{
    static void Main(string[] args)
    {
        DelegateExample de = new DelegateExample();

        Action<int> a1 = de.Cube;   
        a1 += de.Quad;

        var invList = a1.GetInvocationList().Cast<Action<int>>();

        foreach (var a in invList)
        {
            a.Invoke(10);  
        }
    }
}

public class DelegateExample
{
    public void Cube(int x)
    {
        Console.WriteLine(x * x * x);
    }

    public void Quad(int x)
    {
        Console.WriteLine(x * x * x * x);
    }
}
