using System;
using System.Collections.Generic;
using System.Text;

namespace SolidReportApp.Models
{
    public abstract class Report
    {
        public required string Title { get; set; }
        public required string Content { get; set; }

        public abstract string GenerateContent();
    }
}