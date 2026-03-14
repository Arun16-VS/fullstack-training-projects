using DoConnect.API.Data;
using DoConnect.API.DTOs;
using DoConnect.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DoConnect.API.Services
{
    public class AnswerService : IAnswerService
    {
        private readonly AppDbContext _db;
        private readonly IWebHostEnvironment _env;
        private readonly INotificationService _notif;

        public AnswerService(AppDbContext db, IWebHostEnvironment env, INotificationService notif)
        {
            _db = db;
            _env = env;
            _notif = notif;
        }

        public async Task<List<AnswerResponseDTO>> GetAnswers(int questionId)
        {
            return await _db.Answers
                .Include(a => a.User)
                .Where(a => a.QuestionId == questionId && a.Status == "Approved")
                .OrderBy(a => a.CreatedAt)
                .Select(a => MapToDTO(a))
                .ToListAsync();
        }

        public async Task<AnswerResponseDTO> CreateAnswer(int questionId, int userId, CreateAnswerDTO dto)
        {
            string? imageUrl = null;
            if (dto.Image != null)
            {
                imageUrl = await SaveImage(dto.Image);
            }

            var answer = new Answer
            {
                QuestionId = questionId,
                UserId = userId,
                AnswerText = dto.AnswerText,
                ImageUrl = imageUrl,
                Status = "Pending"
            };

            _db.Answers.Add(answer);
            await _db.SaveChangesAsync();

            var question = await _db.Questions.FindAsync(questionId);
            await _notif.CreateNotification(
                $"New answer on: \"{question?.QuestionTitle ?? "Unknown"}\"",
                "NewAnswer");

            var created = await _db.Answers
                .Include(a => a.User)
                .FirstAsync(a => a.AnswerId == answer.AnswerId);

            return MapToDTO(created);
        }

        public async Task ApproveAnswer(int id)
        {
            var a = await _db.Answers.FindAsync(id)
                ?? throw new Exception("Answer not found");
            a.Status = "Approved";
            await _db.SaveChangesAsync();
        }

        public async Task RejectAnswer(int id)
        {
            var a = await _db.Answers.FindAsync(id)
                ?? throw new Exception("Answer not found");
            a.Status = "Rejected";
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAnswer(int id)
        {
            var a = await _db.Answers.FindAsync(id)
                ?? throw new Exception("Answer not found");
            _db.Answers.Remove(a);
            await _db.SaveChangesAsync();
        }

        public async Task<List<AnswerResponseDTO>> GetPendingAnswers()
        {
            return await _db.Answers
                .Include(a => a.User)
                .Where(a => a.Status == "Pending")
                .OrderByDescending(a => a.CreatedAt)
                .Select(a => MapToDTO(a))
                .ToListAsync();
        }

        private async Task<string> SaveImage(IFormFile file)
        {
            var uploadsDir = Path.Combine(_env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot"), "uploads");
            Directory.CreateDirectory(uploadsDir);
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(uploadsDir, fileName);
            using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);
            return $"/uploads/{fileName}";
        }

        private static AnswerResponseDTO MapToDTO(Answer a) => new()
        {
            AnswerId = a.AnswerId,
            QuestionId = a.QuestionId,
            UserId = a.UserId,
            Username = a.User?.Username ?? "",
            AnswerText = a.AnswerText,
            Status = a.Status,
            ImageUrl = a.ImageUrl,
            CreatedAt = a.CreatedAt
        };
    }
}
