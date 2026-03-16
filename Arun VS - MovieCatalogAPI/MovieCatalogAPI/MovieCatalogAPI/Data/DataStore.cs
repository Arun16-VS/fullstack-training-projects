using MovieCatalogAPI.Models;

namespace MovieCatalogAPI.Data
{
    public static class DataStore
    {
        public static List<Director> Directors = new List<Director>()
        {
            new Director { Id = 1, Name = "Christopher Nolan" },
            new Director { Id = 2, Name = "Steven Spielberg" }
        };

        public static List<Movie> Movies = new List<Movie>()
        {
            new Movie { Id = 1, Title = "Inception", ReleaseYear = 2010, DirectorId = 1 },
            new Movie { Id = 2, Title = "Jurassic Park", ReleaseYear = 1993, DirectorId = 2 }
        };
    }
}