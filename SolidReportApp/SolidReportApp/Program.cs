using SolidReportApp.Models;
using SolidReportApp.Services;
using SolidReportApp.Formatters;

var report = new SalesReport
{
    Title = "2026 Q1",
    Content = "Revenue increased by 20%"
};

var generator = new ReportGenerator();
var formatter = new PdfFormatter();
var saver = new ReportSaver();

var service = new ReportService(generator, formatter, saver);

service.ProcessReport(report);