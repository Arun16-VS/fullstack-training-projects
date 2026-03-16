using System;
using System.Collections.Generic;
using System.Text;

namespace Training
{
    public class Condition
    {
        private string message;
        public Condition(string gender)
        {
            message = gender;
        }
        public string greeting()
        {
            if (message == "Male")
            {
                return "Hello Sir!";
            }
            else
            {
                return "Hello Ma'am!";
            }
        }
    }
}

