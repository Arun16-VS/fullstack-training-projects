using System;
using System.Collections.Generic;

namespace patient
{
    internal class Doctor // custom type/entity/POCO class
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Specialization { get; set; }
        public string Phone { get; set; }
        public int Experience { get; set; }
    }
}

public class Program
{
    public static void Main()
    {
        List<patient.Doctor> doctors = new List<patient.Doctor>();

        Console.Write("How many doctors do you want to enter? ");
        int count = int.Parse(Console.ReadLine());

        for (int i = 0; i < count; i++)
        {
            patient.Doctor d = new patient.Doctor();

            Console.WriteLine($"\nEnter details for Doctor {i + 1}:");

            Console.Write("Id: ");
            d.Id = int.Parse(Console.ReadLine());

            Console.Write("Name: ");
            d.Name = Console.ReadLine();

            Console.Write("Specialization: ");
            d.Specialization = Console.ReadLine();

            Console.Write("Phone: ");
            d.Phone = Console.ReadLine();

            Console.Write("Experience (years): ");
            d.Experience = int.Parse(Console.ReadLine());

            doctors.Add(d);
        }

        Console.WriteLine("\n--- Doctor List ---");
        foreach (var doc in doctors)
        {
            Console.WriteLine(
                $"Id: {doc.Id} | Name: {doc.Name} | Specialization: {doc.Specialization} | Phone: {doc.Phone} | Experience: {doc.Experience} years"
            );
        }
    }
}
