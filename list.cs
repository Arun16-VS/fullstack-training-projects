using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Training1
{
    internal class Program
    {
        static void Main(string[] args)
        {
            string a = Console.ReadLine();

            int b = a.Length;
            Console.WriteLine(b);
            ////////////////////////////////////////
            string c = a.ToUpper();
            Console.WriteLine(c);
            /////////////////////////////////////////
            string d = a.ToLower();
            Console.WriteLine(d);
            ///////////////////////////////////////
            String e = Console.ReadLine();
            Console.WriteLine(a + " " + e);
            ////////////////////////////////////////
            bool result = string.IsNullOrEmpty(a);
            char first = a[0];
            Console.WriteLine(first);
            ////////////////////////////////////////
            char last = a[a.Length - 1];
            Console.WriteLine(last);
            //////////////////////////////////////////
            bool result2 = string.Equals(a, e);
            Console.WriteLine(result2);
            ///////////////////////////////////////
            bool result3 = a.Contains(e);
            Console.WriteLine(result3);
            ////////////////////////////////////
            string f = a.Trim();
            Console.WriteLine(f);
            /////////////////////////////////
            char[] chars = a.ToCharArray();
            Array.Reverse(chars);
            string reversed = new string(chars);
            Console.WriteLine(reversed);
            ////////////////////////////////////////////
            int count = 0;

            foreach (char v in a)
            {
                if (v == 'a' || v == 'e' || v == 'i' || v == 'o' || v == 'u' ||
                    v == 'A' || v == 'E' || v == 'I' || v == 'O' || v == 'U')
                {
                    count++;
                }
            }
            Console.WriteLine(count);

            ///////////////////////////////////////////
            char[] n = a.ToCharArray();
            int left = 0;
            int right = chars.Length - 1;

            while (left < right)
            {
                char temp = n[left];
                n[left] = n[right];
                n[right] = temp;

                left++;
                right--;
            }
            string nn = new string(n);
            if (a.ToUpper() == nn.ToUpper())
            {
                Console.WriteLine("The string is a palindrome.");
            }
            else
            {
                Console.WriteLine("The string is not a palindrome.");
            }

            /////////////////////////////////////////////
            string ss = "  We are students  ";

            int count1 = 0;
            bool inWord = false;

            foreach (char cc in ss)
            {
                if (char.IsWhiteSpace(cc))
                {
                    inWord = false;
                }
                else
                {
                    if (!inWord)
                    {
                        count1++;
                        inWord = true;
                    }
                }
            }
            Console.WriteLine(count1);
            //////////////////////////////////////////////
            string input2 = " Full Stack Developer ";
            string output = input2.Replace(" ", "_");

            Console.WriteLine(output);
            ////////////////////////////////////////////////
            string input = "programming";
            char ch3 = 'g';
            int index = input.IndexOf(ch3);
            Console.WriteLine(index);
            //////////////////////////////////////////////
            string input3 = "C Sharp Language";
            string output1 = input3.Replace(" ", "");

            Console.WriteLine(output1);
            ///////////////////////////////////////////////
            string input4 = "www.google.com";
            string front = "www";

            bool result1 = input4.StartsWith(front);
            Console.WriteLine(result1);
            ///////////////////////////////////////////////
            string input5 = "file.txt";
            string back = ".txt";

            bool result4 = input5.EndsWith(back);
            Console.WriteLine(result4);
            ////////////////////////////////////////////////

            string input6 = "BananA";
            Dictionary<char, int> charCount = new Dictionary<char, int>();

            foreach(char c3 in input6)
            {
                if (charCount.ContainsKey(c3))
                {
                    charCount[c3]++;
                }
                else
                {
                    charCount[c3] = 1;
                }
            }
            foreach(var c4 in charCount)
            {
                Console.WriteLine($"Character: {c4.Key}, Count: {c4.Value}");

            }
            //////////////////////////////////////////////////////

        }
    }
}

