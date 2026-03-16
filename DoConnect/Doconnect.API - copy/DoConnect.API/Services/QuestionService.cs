using DoConnect.API.Data;
using DoConnect.API.DTOs;
using DoConnect.API.Helpers;
using DoConnect.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DoConnect.API.Services
{
    public class QuestionService : IQuestionService
    {
        private readonly AppDbContext _db;
        private readonly IWebHostEnvironment _env;
        private readonly INotificationService _notif;

        public QuestionService(AppDbContext db, IWebHostEnvironment env, INotificationService notif)
        {
            _db = db;
            _env = env;
            _notif = notif;
        }

        public async Task<List<QuestionResponseDTO>> GetQuestions(string? search)
        {
            var query = _db.Questions
                .Include(q => q.User)
                .Include(q => q.Answers)
                .Where(q => q.Status == "Approved");

            if (!string.IsNullOrEmpty(search))
            {
                search = search.ToLower();
                query = query.Where(q =>
                    q.QuestionTitle.ToLower().Contains(search) ||
                    q.Topic.ToLower().Contains(search) ||
                    q.QuestionText.ToLower().Contains(search));
            }

            return await query
                .OrderByDescending(q => q.CreatedAt)
                .Select(q => MapToDTO(q))
                .ToListAsync();
        }

        public async Task<List<string>> GetTopics()
        {
            var topics = await _db.Questions
                .Select(q => q.Topic)
                .Where(topic => !string.IsNullOrWhiteSpace(topic))
                .Distinct()
                .OrderBy(topic => topic)
                .ToListAsync();

            return TopicCatalog.DefaultTopics
                .Concat(topics)
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .OrderBy(topic => topic)
                .ToList();
        }

        public async Task<QuestionResponseDTO> GetQuestion(int id)
        {
            var q = await _db.Questions
                .Include(q => q.User)
                .Include(q => q.Answers)
                .FirstOrDefaultAsync(q => q.QuestionId == id)
                ?? throw new Exception("Question not found");

            return MapToDTO(q);
        }

        public async Task<QuestionResponseDTO> CreateQuestion(int userId, CreateQuestionDTO dto)
        {
            string? imageUrl = null;
            if (dto.Image != null)
            {
                imageUrl = await SaveImage(dto.Image);
            }

            var question = new Question
            {
                UserId = userId,
                QuestionTitle = dto.QuestionTitle,
                QuestionText = dto.QuestionText,
                Topic = dto.Topic,
                ImageUrl = imageUrl,
                Status = "Pending"
            };

            _db.Questions.Add(question);
            await _db.SaveChangesAsync();

            await _notif.CreateNotification(
                $"New question posted: \"{dto.QuestionTitle}\"",
                "NewQuestion");

            var created = await _db.Questions
                .Include(q => q.User)
                .Include(q => q.Answers)
                .FirstAsync(q => q.QuestionId == question.QuestionId);

            return MapToDTO(created);
        }

        public async Task<QuestionResponseDTO> UpdateQuestion(int id, UpdateQuestionDTO dto)
        {
            var question = await _db.Questions
                .Include(q => q.User)
                .Include(q => q.Answers)
                .FirstOrDefaultAsync(q => q.QuestionId == id)
                ?? throw new Exception("Question not found");

            question.QuestionTitle = dto.QuestionTitle;
            question.QuestionText = dto.QuestionText;
            question.Topic = dto.Topic;

            if (dto.Image != null)
            {
                question.ImageUrl = await SaveImage(dto.Image);
            }

            await _db.SaveChangesAsync();

            return MapToDTO(question);
        }

        public async Task DeleteQuestion(int id)
        {
            var q = await _db.Questions.FindAsync(id)
                ?? throw new Exception("Question not found");
            _db.Questions.Remove(q);
            await _db.SaveChangesAsync();
        }

        public async Task ApproveQuestion(int id)
        {
            var q = await _db.Questions.FindAsync(id)
                ?? throw new Exception("Question not found");
            q.Status = "Approved";
            await _db.SaveChangesAsync();
        }

        public async Task RejectQuestion(int id)
        {
            var q = await _db.Questions.FindAsync(id)
                ?? throw new Exception("Question not found");
            q.Status = "Rejected";
            await _db.SaveChangesAsync();
        }

        public async Task<List<QuestionResponseDTO>> GetPendingQuestions()
        {
            return await _db.Questions
                .Include(q => q.User)
                .Include(q => q.Answers)
                .Where(q => q.Status == "Pending")
                .OrderByDescending(q => q.CreatedAt)
                .Select(q => MapToDTO(q))
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

        private static QuestionResponseDTO MapToDTO(Question q) => new()
        {
            QuestionId = q.QuestionId,
            UserId = q.UserId,
            Username = q.User?.Username ?? "",
            QuestionTitle = q.QuestionTitle,
            QuestionText = q.QuestionText,
            Topic = q.Topic,
            Status = q.Status,
            ImageUrl = q.ImageUrl,
            CreatedAt = q.CreatedAt,
            AnswerCount = q.Answers?.Count ?? 0
        };
    }
}
