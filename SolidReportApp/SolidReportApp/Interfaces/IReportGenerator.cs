using System;
using System.Collections.Generic;
using System.Text;
using SolidReportApp.Models;

namespace SolidReportApp.Interfaces
{
    public interface IReportGenerator
    {
        string Generate(Report report);
    }
}