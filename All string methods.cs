using System;

class Program
{
    static void Main()
    {
        string str = "  Hello,World  ";
        string str2 = "hello";
        string str3 = "Hello";

        // 1. Length
        Console.WriteLine("Length: " + str.Length);

        // 2. ToUpper
        Console.WriteLine("Upper: " + str.ToUpper());

        // 3. ToLower
        Console.WriteLine("Lower: " + str.ToLower());

        // 4. Substring
        Console.WriteLine("Substring: " + str.Substring(2, 5));

        // 5. Contains
        Console.WriteLine("Contains 'World': " + str.Contains("World"));

        // 6. IndexOf
        Console.WriteLine("IndexOf 'World': " + str.IndexOf("World"));

        // 7. Replace
        Console.WriteLine("Replace: " + str.Replace("World", "C#"));

        // 8. Trim
        string trimmed = str.Trim();
        Console.WriteLine("Trimmed: '" + trimmed + "'");

        // 9. Split
        string[] arr = trimmed.Split(',');
        Console.WriteLine("Split:");
        foreach (string s in arr)
        {
            Console.WriteLine(s);
        }

        // 10. StartsWith
        Console.WriteLine("StartsWith Hello: " + trimmed.StartsWith("Hello"));

        // 11. EndsWith
        Console.WriteLine("EndsWith World: " + trimmed.EndsWith("World"));

        // 12. Join
        string joined = string.Join(" - ", arr);
        Console.WriteLine("Joined: " + joined);

        // 13. Format
        int age = 22;
        string name = "John";
        string sentence = string.Format("My name is {0} and I am {1} years old.", name, age);
        Console.WriteLine(sentence);

        // 14. PadLeft & PadRight
        string num = "123";
        Console.WriteLine("PadLeft: " + num.PadLeft(5, '0'));
        Console.WriteLine("PadRight: " + num.PadRight(5, '0'));

        // 15 & 21. Equals
        Console.WriteLine("Equals: " + str3.Equals(str2));

        // 16. Chars[] (indexing)
        Console.WriteLine("Character at index 1: " + str3[1]);

        // 17. IsNullOrEmpty
        string empty = "";
        Console.WriteLine("IsNullOrEmpty: " + string.IsNullOrEmpty(empty));

        // 18. IsNullOrWhiteSpace
        string white = "   ";
        Console.WriteLine("IsNullOrWhiteSpace: " + string.IsNullOrWhiteSpace(white));

        // 19. Compare
        Console.WriteLine("Compare apple & banana: " + string.Compare("apple", "banana"));

        // 20. CompareTo
        Console.WriteLine("CompareTo apple & banana: " + "apple".CompareTo("banana"));

        // 22. CompareOrdinal
        Console.WriteLine("CompareOrdinal apple & banana: " + string.CompareOrdinal("apple", "banana"));

        // 23. Remove
        Console.WriteLine("Remove: " + "Hello".Remove(1, 3));

        // 24. Insert
        Console.WriteLine("Insert: " + "Hello".Insert(5, " World"));

        // 25. Concat
        Console.WriteLine("Concat: " + string.Concat("Hello", " ", "World"));

        // 26. ToString
        object obj = "Hello";
        //string converted = obj.ToString();
        //Console.WriteLine("ToString: " + converted);

        // 27. LastIndexOf
        Console.WriteLine("LastIndexOf: " + "Hello Hello".LastIndexOf("Hello"));

        // 28. IndexOfAny
        Console.WriteLine("IndexOfAny: " + "Hello".IndexOfAny(new char[] { 'o', 'i' }));

        // 29. LastIndexOfAny
        Console.WriteLine("LastIndexOfAny: " + "Hello".LastIndexOfAny(new char[] { 'o', 'l' }));

        // 30. ToCharArray
        char[] chars = "Hello".ToCharArray();
        Console.WriteLine("ToCharArray:");
        foreach (char c in chars)
        {
            Console.Write(c + " ");
        }
        Console.WriteLine();

        // 31. Normalize
        string unicode = "e\u0301";
        Console.WriteLine("Normalized: " + unicode.Normalize());
    }
}
