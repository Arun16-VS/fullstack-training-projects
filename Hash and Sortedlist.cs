using System;
using Training;
using System.IO;
using System.Net.Security;
using System.Collections;

class Program
{
    static void Main()
    {
        Hashtable h=new Hashtable();
        h.Add("1","joker");
        h.Add("2","two");
        h.Add("3","hello");

        foreach (DictionaryEntry item in h)
        {
            Console.WriteLine(item.Key + " " + item.Value);
        }
        Console.WriteLine("------------------------");
        SortedList<int,string> s=new SortedList<int,string>();
        s.Add(2,"Rock");
        s.Add(1,"Paper");
        s.Add(3, "Scissors");
        foreach (var a in s)
        {
            Console.WriteLine(a.Key + " " + a.Value);
        }







    }
}

