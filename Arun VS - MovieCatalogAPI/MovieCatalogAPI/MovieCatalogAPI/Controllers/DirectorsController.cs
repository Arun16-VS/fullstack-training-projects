using Microsoft.AspNetCore.Mvc;
using MovieCatalogAPI.Data;

namespace MovieCatalogAPI.Controllers
{
    [ApiController]
    [Route("api/directors")]
    public class DirectorsController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetDirectors()
        {
            return Ok(DataStore.Directors);
        }

        [HttpGet("{directorId}/movies")]
        public IActionResult GetMoviesByDirector(int directorId)
        {
            var movies = DataStore.Movies
                .Where(m => m.DirectorId == directorId)
                .ToList();

            return Ok(movies);
        }
    }
}