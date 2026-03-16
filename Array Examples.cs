using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Training2
{
    internal class Program
    {
        static void Main(string[] args)
        {
            int[] n = { 1, 4, 6, 8, 9 };
            foreach (int i in n)
            {
                Console.WriteLine(i);

            }
            //////find sum//////////////
            Console.WriteLine(n.Sum());
            ///////find average of array/////////////
            double n1 = n.Sum();
            double n2 = n1 / 5;
            Console.WriteLine(n2);
            ///////Find max/////////////
            Console.WriteLine(n.Max());
            ////////Find min ////////////
            Console.WriteLine(n.Min());
            ////////Count Even and odd in array///////////
            int even = 0;
            int odd = 0;
            foreach (int i in n)
            {
                if (i % 2 == 0)
                {
                    even++;
                }
                else
                {
                    odd++;
                }
            }
            Console.WriteLine($"Even numbers: {even}");
            Console.WriteLine($"Odd numbers: {odd}");
            ////////////Finding index///////////////////
            int target = 10;
            int index = Array.IndexOf(n, target);
            Console.WriteLine(index);
            //////////Copy array to another////////////////
            int[] a = new int[n.Length];
            for (int i = 0; i < n.Length; i++)
            {
                a[i] = n[i];
            }
            foreach (int x in a)
            {
                Console.WriteLine(x);
            }

            //////////Reverse array method 1//////////////////

            int[] rev = new int[n.Length];

            for (int i = 0; i < n.Length; i++)
            {
                rev[i] = n[n.Length - 1 - i];
            }

            Console.WriteLine(string.Join(", ", rev));

            ///////////Reverse array method 2/////////////////
            int left = 0;
            int right = n.Length - 1;
            while (left < right)
            {
                int temp = n[left];
                n[left] = n[right];
                n[right] = temp;

                left++;
                right--;
            }
            foreach (int x in n)
            {
                Console.WriteLine(x);
            }

            ///////////Print elements in even index/////////////////
            for (int i = 0; i < n.Length; i++)
            {
                if (i % 2 == 0)
                {
                    Console.WriteLine(a[i]);
                }
            }
            ////////////Sort the array(ascending)///////////////////
            int[] n3 = { 12, 8, 33, 4, 25, 50 };
            for (int i = 0; i < n3.Length - 1; i++)
            {
                for (int j = i + 1; j < n3.Length; j++)
                {
                    if (n3[i] > n3[j])
                    {
                        int temp1 = n3[i];
                        n3[i] = n3[j];
                        n3[j] = temp1;
                    }
                }

            }
            foreach (int x1 in n3)
            {
                Console.WriteLine(x1);
            }
            /////////////Sort an array in descending///////////////
            int[] n4 = { 12, 8, 33, 4, 25, 50 };
            for (int i = 0; i < n4.Length - 1; i++)
            {
                for (int j = i + 1; j < n4.Length; j++)
                {
                    if (n4[i] < n4[j])
                    {
                        int temp2 = n4[i];
                        n4[i] = n4[j];
                        n4[j] = temp2;
                    }
                }

            }
            foreach (int x2 in n4)
            {
                Console.WriteLine(x2);
            }
            ///////////////Remove duplicate elements in array/////////////////
            int[] n5 = { 10, 20, 10, 30, 20, 40 };


            Array.Sort(n5);

            int[] temp3 = new int[n5.Length];
            int uniqueCount = 0;

            for (int i = 0; i < n5.Length; i++)
            {
                if (i == 0 || n5[i] != n5[i - 1])
                {
                    temp3[uniqueCount] = n5[i];
                    uniqueCount++;
                }
            }

            int[] result = new int[uniqueCount];
            for (int i = 0; i < uniqueCount; i++)
            {
                result[i] = temp3[i];
            }

            Console.WriteLine(string.Join(", ", result));
            /////////////count the specific element in array///////////////
            int[] n6 = { 10, 20, 10, 30, 10, 40 };
            int tar = 10;

            int count1 = 0;

            for (int i = 0; i < n6.Length; i++)
            {
                if (n6[i] == target)
                {
                    count1++;
                }
            }

            Console.WriteLine(count1);
            ////////////////Find second largest element in array////////////////


            int largest = int.MinValue;
            int secondLargest = int.MinValue;

            for (int i = 0; i < n6.Length; i++)
            {
                if (n6[i] > largest)
                {
                    secondLargest = largest;
                    largest = n6[i];
                }
                else if (n6[i] > secondLargest && n6[i] != largest)
                {
                    secondLargest = n6[i];
                }
            }

            if (secondLargest == int.MinValue)
            {
                Console.WriteLine("Second largest does not exist");
            }
            else
            {
                Console.WriteLine("Second largest: " + secondLargest);
            }
            /////////////Find second smallest element in array////////////////
            int smallest = int.MaxValue;
            int secondsmallest = int.MaxValue;
            for (int i = 0; i < n6.Length; i++)
            {
                if (n6[i] < smallest)
                {
                    secondsmallest = smallest;
                    smallest = n6[i];
                }
                else if (n6[i] < secondsmallest && n6[i] != smallest)
                {
                    secondsmallest = n6[i];
                }
            }
            if (secondsmallest == int.MaxValue)
            {
                Console.WriteLine("Second smallest does not exist");
            }
            else
            {
                Console.WriteLine("Second smallest: " + secondsmallest);
            }
            ////////////////left rotation by 1////////////////////

            int first = n6[0];

            for (int i = 0; i < n6.Length - 1; i++)
            {
                n6[i] = n6[i + 1];
            }
            n6[n6.Length - 1] = first;

            Console.WriteLine(string.Join(", ", n6));

            ////////////////right rotation by 1////////////////////
            int last = n6[n6.Length - 1];
            for (int i = n6.Length - 1; i > 0; i--)
            {
                n6[i] = n6[i - 1];
            }
            n6[0] = last;
            Console.WriteLine(string.Join(", ", n6));
            //////////////check the array is sorted or not/////////////////////
            bool isSorted = true;

            for (int i = 0; i < n6.Length - 1; i++)
            {
                if (n6[i] > n6[i + 1])
                {
                    isSorted = false;
                    break;
                }
            }

            if (isSorted)
                Console.WriteLine("Array is sorted");
            else
                Console.WriteLine("Array is NOT sorted");
            /////////Merge two arrays into third array///////////////////
            int[] a2 = { 10, 20, 30 };
            int[] b2 = { 40, 50, 60 };

            int[] c2 = new int[a2.Length + b2.Length];

            // copy a into c
            for (int i = 0; i < a2.Length; i++)
            {
                c2[i] = a2[i];
            }

            // copy b into c
            for (int i = 0; i < b2.Length; i++)
            {
                c2[a2.Length + i] = b2[i];
            }

            Console.WriteLine(string.Join(", ", c2));


        }
    }
}
