using System;

// T is a placeholder for the actual type
public class Box<T>
{
    private T content;

    public void Add(T item)
    {
        content = item;
    }

    public T Get()
    {
        return content;
    }
}

public class Program
{
    public static void Main()
    {
        // Box for integers
        Box<int> intBox = new Box<int>();
        intBox.Add(123);
        Console.WriteLine(intBox.Get());

        // Same class used for strings
        Box<string> strBox = new Box<string>();
        strBox.Add("Hello Generics");
        Console.WriteLine(strBox.Get());
    }
}
