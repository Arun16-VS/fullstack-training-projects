using Microsoft.AspNetCore.Mvc;
using MovieCatalogAPI.Models;
using MovieCatalogAPI.Data;

namespace MovieCatalogAPI.Controllers
{
    [ApiController]
    [Route("api/movies")]
    public class MoviesController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAllMovies()
        {
            return Ok(DataStore.Movies);
        }

        [HttpGet("{id}")]
        public IActionResult GetMovie(int id)
        {
            var movie = DataStore.Movies.FirstOrDefault(m => m.Id == id);

            if (movie == null)
                return NotFound();

            return Ok(movie);
        }

        [HttpPost]
        public IActionResult CreateMovie(Movie movie)
        {
            movie.Id = DataStore.Movies.Max(m => m.Id) + 1;
            DataStore.Movies.Add(movie);

            return CreatedAtAction(nameof(GetMovie), new { id = movie.Id }, movie);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateMovie(int id, Movie updatedMovie)
        {
            var movie = DataStore.Movies.FirstOrDefault(m => m.Id == id);

            if (movie == null)
                return NotFound();

            movie.Title = updatedMovie.Title;
            movie.ReleaseYear = updatedMovie.ReleaseYear;
            movie.DirectorId = updatedMovie.DirectorId;

            return Ok(movie);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteMovie(int id)
        {
            var movie = DataStore.Movies.FirstOrDefault(m => m.Id == id);

            if (movie == null)
                return NotFound();

            DataStore.Movies.Remove(movie);

            return NoContent();
        }
    }
}