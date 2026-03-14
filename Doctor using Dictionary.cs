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
        Dictionary<int, patient.Doctor> doctors = new Dictionary<int, patient.Doctor>();

        Console.Write("How many doctors do you want to enter? ");
        int count = int.Parse(Console.ReadLine());

        for (int i = 0; i < count; i++)
        {
            patient.Doctor d = new patient.Doctor();

            Console.WriteLine($"\nEnter details for Doctor {i + 1}:");

            Console.Write("Id: ");
            d.Id = int.Parse(Console.ReadLine());

            // Prevent duplicate Ids
            if (doctors.ContainsKey(d.Id))
            {
                Console.WriteLine("Doctor with this Id already exists. Try again.");
                i--; 
                continue;
            }

            Console.Write("Name: ");
            d.Name = Console.ReadLine();

            Console.Write("Specialization: ");
            d.Specialization = Console.ReadLine();

            Console.Write("Phone: ");
            d.Phone = Console.ReadLine();

            Console.Write("Experience (years): ");
            d.Experience = int.Parse(Console.ReadLine());

            doctors.Add(d.Id, d);
        }

        Console.WriteLine("\n--- Doctor List ---");
        foreach (var kvp in doctors)
        {
            var doc = kvp.Value;
            Console.WriteLine(
                $"Id: {doc.Id} | Name: {doc.Name} | Specialization: {doc.Specialization} | Phone: {doc.Phone} | Experience: {doc.Experience} years"
            );
        }
    }
}
