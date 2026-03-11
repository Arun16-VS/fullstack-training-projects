using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        // Sample array for practice
        int[] arr = { 5, 2, 8, 2, 0, 9, 1, 0, 5 };

        Console.WriteLine("Original Array:");
        PrintArray(arr);

        // 🟢 SIMPLE

        // 1. Create array of 5 integers and print
        int[] arr5 = { 10, 20, 30, 40, 50 };
        Console.WriteLine("\nArray of 5 elements:");
        PrintArray(arr5);

        // 2. Sum of elements
        int sum = 0;
        foreach (int x in arr)
        {
            sum += x;
        }
        Console.WriteLine("\nSum: " + sum);

        // 3. Average
        double avg = (double)sum / arr.Length;
        Console.WriteLine("Average: " + avg);

        // 4. Largest element
        int max = arr[0];
        foreach (int x in arr)
        {
            if (x > max)
                max = x;
        }
        Console.WriteLine("Largest: " + max);

        // 5. Smallest element
        int min = arr[0];
        foreach (int x in arr)
        {
            if (x < min)
                min = x;
        }
        Console.WriteLine("Smallest: " + min);

        // 6. Count even and odd
        int even = 0, odd = 0;
        foreach (int x in arr)
        {
            if (x % 2 == 0)
                even++;
            else
                odd++;
        }
        Console.WriteLine("Even Count: " + even);
        Console.WriteLine("Odd Count: " + odd);

        // 7. Search element and print index
        int search = 8;
        int index = -1;
        for (int i = 0; i < arr.Length; i++)
        {
            if (arr[i] == search)
            {
                index = i;
                break;
            }
        }
        Console.WriteLine("Index of " + search + ": " + index);

        // 8. Copy array
        int[] copyArr = new int[arr.Length];
        for (int i = 0; i < arr.Length; i++)
        {
            copyArr[i] = arr[i];
        }
        Console.WriteLine("\nCopied Array:");
        PrintArray(copyArr);

        // 9. Reverse array (new array)
        int[] reversed = new int[arr.Length];
        for (int i = 0; i < arr.Length; i++)
        {
            reversed[i] = arr[arr.Length - 1 - i];
        }
        Console.WriteLine("\nReversed Array:");
        PrintArray(reversed);

        // 10. Print elements at even indexes
        Console.WriteLine("\nElements at even indexes:");
        for (int i = 0; i < arr.Length; i += 2)
        {
            Console.Write(arr[i] + " ");
        }
        Console.WriteLine();

        // 🟡 MEDIUM

        // 11. Sort ascending (Bubble sort)
        int[] asc = (int[])arr.Clone();
        for (int i = 0; i < asc.Length; i++)
        {
            for (int j = 0; j < asc.Length - 1; j++)
            {
                if (asc[j] > asc[j + 1])
                {
                    int temp = asc[j];
                    asc[j] = asc[j + 1];
                    asc[j + 1] = temp;
                }
            }
        }
        Console.WriteLine("\nSorted Ascending:");
        PrintArray(asc);

        // 12. Sort descending
        int[] desc = (int[])arr.Clone();
        for (int i = 0; i < desc.Length; i++)
        {
            for (int j = 0; j < desc.Length - 1; j++)
            {
                if (desc[j] < desc[j + 1])
                {
                    int temp = desc[j];
                    desc[j] = desc[j + 1];
                    desc[j + 1] = temp;
                }
            }
        }
        Console.WriteLine("\nSorted Descending:");
        PrintArray(desc);

        // 13. Remove duplicates
        List<int> uniqueList = new List<int>();
        foreach (int x in arr)
        {
            if (!uniqueList.Contains(x))
                uniqueList.Add(x);
        }
        Console.WriteLine("\nArray without duplicates:");
        PrintArray(uniqueList.ToArray());

        // 14. Count occurrences
        int count = 0;
        int element = 5;
        foreach (int x in arr)
        {
            if (x == element)
                count++;
        }
        Console.WriteLine("\nFrequency of " + element + ": " + count);

        // 15. Second largest
        Array.Sort(asc);
        Console.WriteLine("Second Largest: " + asc[asc.Length - 2]);

        // 16. Second smallest
        Console.WriteLine("Second Smallest: " + asc[1]);

        // 17. Rotate left by 1
        int first = arr[0];
        for (int i = 0; i < arr.Length - 1; i++)
        {
            arr[i] = arr[i + 1];
        }
        arr[arr.Length - 1] = first;
        Console.WriteLine("\nLeft Rotated:");
        PrintArray(arr);

        // 18. Rotate right by 1
        int last = arr[arr.Length - 1];
        for (int i = arr.Length - 1; i > 0; i--)
        {
            arr[i] = arr[i - 1];
        }
        arr[0] = last;
        Console.WriteLine("\nRight Rotated:");
        PrintArray(arr);

        // 🟠 MEDIUM-HARD

        // 19. Find duplicates
        Console.WriteLine("\nDuplicate Elements:");
        HashSet<int> seen = new HashSet<int>();
        HashSet<int> duplicates = new HashSet<int>();

        foreach (int x in arr)
        {
            if (!seen.Add(x))
                duplicates.Add(x);
        }
        foreach (int d in duplicates)
            Console.Write(d + " ");
        Console.WriteLine();

        // 20. Unique elements
        Console.WriteLine("\nUnique Elements:");
        foreach (int x in uniqueList)
            Console.Write(x + " ");
        Console.WriteLine();

        // 21. Move zeros to end
        int[] moveZero = (int[])arr.Clone();
        int pos = 0;
        for (int i = 0; i < moveZero.Length; i++)
        {
            if (moveZero[i] != 0)
                moveZero[pos++] = moveZero[i];
        }
        while (pos < moveZero.Length)
            moveZero[pos++] = 0;

        Console.WriteLine("\nZero moved to end:");
        PrintArray(moveZero);

        // 22. Split even and odd arrays
        List<int> evenArr = new List<int>();
        List<int> oddArr = new List<int>();

        foreach (int x in arr)
        {
            if (x % 2 == 0)
                evenArr.Add(x);
            else
                oddArr.Add(x);
        }

        Console.WriteLine("\nEven Array:");
        PrintArray(evenArr.ToArray());
        Console.WriteLine("Odd Array:");
        PrintArray(oddArr.ToArray());

        // 23. Maximum subarray sum (Kadane's Algorithm)
        int maxSum = arr[0];
        int currentSum = arr[0];

        for (int i = 1; i < arr.Length; i++)
        {
            currentSum = Math.Max(arr[i], currentSum + arr[i]);
            maxSum = Math.Max(maxSum, currentSum);
        }
        Console.WriteLine("\nMaximum Subarray Sum: " + maxSum);

        // 24. Missing number from 1 to N
        int[] seq = { 1, 2, 3, 5 };
        int n = 5;
        int total = n * (n + 1) / 2;
        int actualSum = 0;
        foreach (int x in seq)
            actualSum += x;

        Console.WriteLine("Missing Number: " + (total - actualSum));

        // 25. Pair with given sum
        int target = 10;
        Console.WriteLine("\nPair with sum " + target + ":");
        for (int i = 0; i < arr.Length; i++)
        {
            for (int j = i + 1; j < arr.Length; j++)
            {
                if (arr[i] + arr[j] == target)
                    Console.WriteLine(arr[i] + ", " + arr[j]);
            }
        }

        // 26. Reverse in place
        for (int i = 0; i < arr.Length / 2; i++)
        {
            int temp = arr[i];
            arr[i] = arr[arr.Length - 1 - i];
            arr[arr.Length - 1 - i] = temp;
        }
        Console.WriteLine("\nReverse In-Place:");
        PrintArray(arr);

        // 27. Check if two arrays equal
        int[] a1 = { 1, 2, 3 };
        int[] a2 = { 1, 2, 3 };
        bool equal = true;

        for (int i = 0; i < a1.Length; i++)
        {
            if (a1[i] != a2[i])
            {
                equal = false;
                break;
            }
        }
        Console.WriteLine("\nArrays Equal: " + equal);

        // 28. Frequency of each element
        Console.WriteLine("\nFrequency of each element:");
        Dictionary<int, int> freq = new Dictionary<int, int>();

        foreach (int x in arr)
        {
            if (freq.ContainsKey(x))
                freq[x]++;
            else
                freq[x] = 1;
        }

        foreach (var item in freq)
        {
            Console.WriteLine(item.Key + " -> " + item.Value);
        }
    }

    // Method to print any array
    static void PrintArray(int[] arr)
    {
        foreach (int x in arr)
        {
            Console.Write(x + " ");
        }
        Console.WriteLine();
    }
}
