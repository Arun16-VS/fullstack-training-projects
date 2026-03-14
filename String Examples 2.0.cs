using System;
using Training;
using System.IO;
using System.Net.Security;
using System.Collections;
using System.ComponentModel.DataAnnotations;
using System.Threading;

internal class Program
{
    static void Main(String[] args)
    {
        Threading t = new Threading();
        Thread t1 = new Thread(t.even);
        Thread t2 = new Thread(t.odd);

        t1.Start();
        t1.Join();
        Thread.Sleep(1000);
        t2.Start();

    }
    }
    public class Threading
    {
        public void even()
        {
            for (int i = 0; i <= 20; i += 2)
            {
                Console.WriteLine(i);
            }
        }
        public void odd()
        {
            for (int i = 1; i <= 20; i += 2)
            {
                Console.WriteLine(i);
            }
        }
    }



