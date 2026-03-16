using Microsoft.VisualStudio.TestTools.UnitTesting;
using CalculatorLibrary;
using System;

namespace CalculatorTests
{
    [TestClass]
    public class CalculatorTests
    {
        private Calculator _calculator = null!;

        [TestInitialize]
        public void Setup()
        {
            _calculator = new Calculator();
        }

     

        [TestMethod]
        public void Add_ShouldReturnCorrectSum()
        {
            double result = _calculator.Add(5, 3);
            Assert.AreEqual(8, result);
        }

        [TestMethod]
        public void Add_WithZero_ShouldReturnSameNumber()
        {
            double result = _calculator.Add(7, 0);
            Assert.AreEqual(7, result);
        }

      

        [TestMethod]
        public void Subtract_ShouldReturnCorrectDifference()
        {
            double result = _calculator.Subtract(10, 4);
            Assert.AreEqual(6, result);
        }

        [TestMethod]
        public void Subtract_WithZero_ShouldReturnSameNumber()
        {
            double result = _calculator.Subtract(9, 0);
            Assert.AreEqual(9, result);
        }

    
        [TestMethod]
        public void Multiply_ShouldReturnCorrectProduct()
        {
            double result = _calculator.Multiply(6, 2);
            Assert.AreEqual(12, result);
        }

        [TestMethod]
        public void Multiply_WithNegativeNumbers_ShouldReturnCorrectResult()
        {
            double result = _calculator.Multiply(-3, 4);
            Assert.AreEqual(-12, result);
        }

      

        [TestMethod]
        public void Divide_ShouldReturnCorrectQuotient()
        {
            double result = _calculator.Divide(10, 2);
            Assert.AreEqual(5, result);
        }

        [TestMethod]
        public void Divide_ByZero_ShouldThrowException()
        {
            try
            {
                _calculator.Divide(10, 0);
                Assert.Fail("Expected DivideByZeroException was not thrown.");
            }
            catch (DivideByZeroException)
            {
                // Exception thrown correctly
            }
        }


    }
}
