using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DoConnect.API.Controllers
{
    public class ImageUploadRequest
    {
        public IFormFile? File { get; set; }
    }

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ImagesController : ControllerBase
    {
        [HttpPost("upload")]
        [RequestSizeLimit(10_000_000)]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Upload([FromForm] ImageUploadRequest request, [FromQuery] string entityType = "question")
        {
            var file = request.File;
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "Image file is required." });

            if (!file.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
                return BadRequest(new { message = "Only image files are allowed." });

            var folderName = entityType.Equals("answer", StringComparison.OrdinalIgnoreCase) ? "answers" : "questions";
            var uploadsRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", folderName);
            Directory.CreateDirectory(uploadsRoot);

            var extension = Path.GetExtension(file.FileName);
            var safeName = $"{Guid.NewGuid():N}{extension}";
            var filePath = Path.Combine(uploadsRoot, safeName);

            await using (var stream = System.IO.File.Create(filePath))
            {
                await file.CopyToAsync(stream);
            }

            var relativePath = $"/uploads/{folderName}/{safeName}";
            var absoluteUrl = $"{Request.Scheme}://{Request.Host}{relativePath}";

            return Ok(new
            {
                url = absoluteUrl,
                relativePath,
                fileName = safeName,
                contentType = file.ContentType
            });
        }
    }
}
