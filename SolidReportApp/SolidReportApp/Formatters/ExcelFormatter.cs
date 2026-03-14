using System;
using System.Collections.Generic;
using System.Text;
using SolidReportApp.Interfaces;
using SolidReportApp.Models;

namespace SolidReportApp.Formatters
{
    public class ExcelFormatter : IReportFormatter
    {
        public string Format(Report report)
        {
            return $"[EXCEL FORMAT]\n{report.GenerateContent()}";
        }
    }
}