using System;
using System.Collections.Generic;
using System.Text;

namespace SolidReportApp.Models
{
    public class SalesReport : Report
    {
        public override string GenerateContent()
        {
            return $"Sales Report: {Title}\n{Content}";
        }
    }
}
