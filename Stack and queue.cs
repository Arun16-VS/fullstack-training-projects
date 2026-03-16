using System;
using System.Collections.Generic;
using System.Text;

class Program
{
    static void Main()
    {
        // -------------------- EASY (1–10) --------------------

        string s1 = "Hello";
        Console.WriteLine("1. Length: " + s1.Length);  // Finds length of string

        string s2 = "welcome";
        Console.WriteLine("2. Uppercase: " + s2.ToUpper());  // Convert to uppercase

        string s3 = "DOTNET";
        Console.WriteLine("3. Lowercase: " + s3.ToLower());  // Convert to lowercase

        string s4 = "Hello";
        string s5 = "C#";
        Console.WriteLine("4. Concatenation: " + s4 + " " + s5);  // Join two strings

        string s6 = "";
        Console.WriteLine("5. Is Null or Empty: " + string.IsNullOrEmpty(s6)); // Check empty or null

        string s7 = "India";
        Console.WriteLine("6. First char: " + s7[0]);  // First character

        Console.WriteLine("7. Last char: " + s7[s7.Length - 1]); // Last character

        string s8 = "abc";
        string s9 = "ABC";
        Console.WriteLine("8. Case-sensitive compare: " + (s8 == s9)); // Compare strings

        string s10 = "Welcome to C#";
        Console.WriteLine("9. Contains 'C#': " + s10.Contains("C#")); // Check contains

        string s11 = " Hello World ";
        Console.WriteLine("10. Trimmed: '" + s11.Trim() + "'"); // Trim spaces


        // -------------------- MEDIUM (11–20) --------------------

        // 11. Reverse a string
        string s12 = "CSharp";
        char[] chars = s12.ToCharArray();   // Convert string to char array
        Array.Reverse(chars);               // Reverse array
        Console.WriteLine("11. Reversed: " + new string(chars));

        // 12. Count vowels
        string s13 = "Education";
        int vowelCount = 0;
        foreach (char c in s13.ToLower())
        {
            if ("aeiou".Contains(c))
                vowelCount++;
        }
        Console.WriteLine("12. Vowels count: " + vowelCount);

        // 13. Count consonants
        string s14 = "Hello";
        int consonantCount = 0;
        foreach (char c in s14.ToLower())
        {
            if (char.IsLetter(c) && !"aeiou".Contains(c))
                consonantCount++;
        }
        Console.WriteLine("13. Consonants count: " + consonantCount);

        // 14. Palindrome check
        string s15 = "madam";
        string rev = new string(s15.ToCharArray().Reverse().ToArray());
        Console.WriteLine("14. Is Palindrome: " + (s15 == rev));

        // 15. Count words
        string s16 = "I love C Sharp";
        string[] words = s16.Split(' ');
        Console.WriteLine("15. Word count: " + words.Length);

        // 16. Replace spaces with underscore
        string s17 = "Full Stack Developer";
        Console.WriteLine("16. Replace spaces: " + s17.Replace(" ", "_"));

        // 17. Index of first occurrence of character
        string s18 = "programming";
        Console.WriteLine("17. Index of 'g': " + s18.IndexOf('g'));

        // 18. Remove all spaces
        string s19 = "C Sharp Language";
        Console.WriteLine("18. Remove spaces: " + s19.Replace(" ", ""));

        // 19. StartsWith
        Console.WriteLine("19. Starts with www: " + "www.google.com".StartsWith("www"));

        // 20. EndsWith
        Console.WriteLine("20. Ends with .txt: " + "file.txt".EndsWith(".txt"));


        // -------------------- HARD (21–30) --------------------

        // 21. Frequency of each character
        string s20 = "banana";
        Dictionary<char, int> freq = new Dictionary<char, int>();

        foreach (char c in s20)
        {
            if (freq.ContainsKey(c))
                freq[c]++;
            else
                freq[c] = 1;
        }

        Console.WriteLine("21. Character frequency:");
        foreach (var item in freq)
            Console.WriteLine(item.Key + ": " + item.Value);

        // 22. Remove duplicate characters
        string s21 = "programming";
        StringBuilder sb = new StringBuilder();
        HashSet<char> seen = new HashSet<char>();

        foreach (char c in s21)
        {
            if (!seen.Contains(c))
            {
                sb.Append(c);
                seen.Add(c);
            }
        }
        Console.WriteLine("22. Remove duplicates: " + sb.ToString());

        // 23. First non-repeating character
        string s22 = "swiss";
        char result = '\0';

        foreach (char c in s22)
        {
            if (s22.IndexOf(c) == s22.LastIndexOf(c))
            {
                result = c;
                break;
            }
        }
        Console.WriteLine("23. First non-repeating: " + result);

        // 24. Anagram check
        string a = "listen";
        string b = "silent";

        char[] a1 = a.ToCharArray();
        char[] b1 = b.ToCharArray();
        Array.Sort(a1);
        Array.Sort(b1);

        Console.WriteLine("24. Are anagrams: " + (new string(a1) == new string(b1)));

        // 25. Capitalize first letter of each word
        string s23 = "welcome to c sharp";
        string[] parts = s23.Split(' ');

        for (int i = 0; i < parts.Length; i++)
        {
            parts[i] = char.ToUpper(parts[i][0]) + parts[i].Substring(1);
        }
        Console.WriteLine("25. Capitalized: " + string.Join(" ", parts));

        // 26. Longest word
        string s24 = "C sharp string manipulation";
        string[] parts2 = s24.Split(' ');
        string longest = parts2[0];

        foreach (string w in parts2)
        {
            if (w.Length > longest.Length)
                longest = w;
        }
        Console.WriteLine("26. Longest word: " + longest);

        // 27. Count substring occurrences
        string s25 = "abababab";
        string sub = "ab";
        int count = 0;
        int index = 0;

        while ((index = s25.IndexOf(sub, index)) != -1)
        {
            count++;
            index += sub.Length;
        }
        Console.WriteLine("27. Substring count: " + count);

        // 28. Extract domain from email
        string email = "user@gmail.com";
        Console.WriteLine("28. Domain: " + email.Split('@')[1]);

        // 29. Mask all but last 4 characters
        string card = "1234567890";
        string masked = new string('*', card.Length - 4) + card.Substring(card.Length - 4);
        Console.WriteLine("29. Masked: " + masked);

        // 30. Password strength validation
        string password = "Test@1234";

        bool hasUpper = false, hasLower = false, hasDigit = false, hasSpecial = false;

        foreach (char c in password)
        {
            if (char.IsUpper(c)) hasUpper = true;
            else if (char.IsLower(c)) hasLower = true;
            else if (char.IsDigit(c)) hasDigit = true;
            else hasSpecial = true;
        }

        bool isStrong = password.Length >= 8 && hasUpper && hasLower && hasDigit && hasSpecial;
        Console.WriteLine("30. Password Strong: " + isStrong);
    }
}
