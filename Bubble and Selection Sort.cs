using System;

namespace Training2
{
    internal class BubbleSortExample
    {
        public void BubbleSort(int[] arr)
        {
            int n = arr.Length;
            for (int i = 0; i < n - 1; i++)
            {
                for (int j = 0; j < n - 1 - i; j++)
                {
                    if (arr[j] > arr[j + 1])
                    {
                        int temp = arr[j];
                        arr[j] = arr[j + 1];
                        arr[j + 1] = temp;
                    }
                }
            }
            foreach (int a in arr)
            {
                Console.WriteLine(a);
            }
        }
        public void SelectionSort(int[] myarry)
        {
            int n = myarry.Length;
            for (int i = 0; i < n - 1; i++)
            {
                int minIndex = i;
                for (int j = i + 1; j < n; j++)
                {
                    if (myarry[j] < myarry[minIndex])
                    {
                        minIndex = j;
                    }
                }
                if (minIndex != i)
                {
                    int temp = myarry[i];
                    myarry[i] = myarry[minIndex];
                    myarry[minIndex] = temp;
                }
            }
            foreach (int b in myarry)
            {
                Console.WriteLine(b);
            }
        }

        static void Main(string[] args)
        {
            int[] f1 = { 3, 5, 1, 8, 9 };
            int[] f2 = { 10, 2, 7, 4, 1 };

            
            BubbleSortExample sorter = new BubbleSortExample();

            Console.WriteLine("Selection Sort Result:");
            sorter.SelectionSort(f1);

            
            Console.WriteLine("Bubble Sort Result:");
            sorter.BubbleSort(f2);
        }
    }
}
