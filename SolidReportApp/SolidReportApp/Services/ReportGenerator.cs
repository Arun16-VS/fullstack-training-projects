using System;
using System.Collections.Generic;
using System.Text;
using SolidReportApp.Interfaces;
using SolidReportApp.Models;

namespace SolidReportApp.Services
{
    public class ReportGenerator : IReportGenerator
    {
        public string Generate(Report report)
        {
            return report.GenerateContent();
        }
    }
}
