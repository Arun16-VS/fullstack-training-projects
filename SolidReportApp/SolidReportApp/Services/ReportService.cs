using System;
using System.Collections.Generic;
using System.Text;
using SolidReportApp.Interfaces;
using SolidReportApp.Models;

namespace SolidReportApp.Services
{
    public class ReportService
    {
        private readonly IReportGenerator _generator;
        private readonly IReportFormatter _formatter;
        private readonly IReportSaver _saver;

        public ReportService(
            IReportGenerator generator,
            IReportFormatter formatter,
            IReportSaver saver)
        {
            _generator = generator;
            _formatter = formatter;
            _saver = saver;
        }

        public void ProcessReport(Report report)
        {
            var formatted = _formatter.Format(report);
            _saver.Save(formatted);
        }
    }
}