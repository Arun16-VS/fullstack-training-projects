using System;
using System.Collections.Generic;
using System.Text;
using SolidReportApp.Interfaces;
using SolidReportApp.Models;

namespace SolidReportApp.Formatters
{
    public class PdfFormatter : IReportFormatter
    {
        public string Format(Report report)
        {
            return $"[PDF FORMAT]\n{report.GenerateContent()}";
        }
    }
}
