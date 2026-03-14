using System;
using System.Collections.Generic;
using System.Text;
using SolidReportApp.Interfaces;
using System;

namespace SolidReportApp.Services
{
    public class ReportSaver : IReportSaver
    {
        public void Save(string content)
        {
            Console.WriteLine("Saving Report...");
            Console.WriteLine(content);
        }
    }
}
