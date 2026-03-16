using System;

namespace ConsoleMain
{
    internal class Area
    {
        // Fields (private)
        private int length;
        private int width;

        // Constructor overloading
        public Area(int l, int b)
        {
            length = l;
            width = b;
        }

        public Area(int l)
        {
            length = l;
            width = l;   // square
        }

        // Method
        public int Calculate()
        {
            return length * width;
        }

        // Method Overloading (next concept)
        public int Calculate(int l, int w)
        {
            return l * w;
        }

        // Properties (next concept)
        public int Length
        {
            get { return length; }
            set { length = value; }
        }

        public int Width
        {
            get { return width; }
            set { width = value; }
        }
    }
}
