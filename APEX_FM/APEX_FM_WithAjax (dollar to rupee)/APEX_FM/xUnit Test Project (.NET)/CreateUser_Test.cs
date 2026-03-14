using FinanceManagementSystem.Models;
using Xunit;

namespace FinanceManagementSystem.Tests
{
    public class CreateUser_Tests
    {
        [Fact]
        public void CreateUser_Test()
        {
            var user = new User
            {
                Username = "Test",
                Email = "test@gmail.com"
            };

            Assert.NotNull(user);
        }
    }
}