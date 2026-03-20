using DoConnect.API.Data;
using DoConnect.API.DTOs;
using DoConnect.API.Hubs;
using DoConnect.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace DoConnect.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuestionsController : ControllerBase
    {
        private readonly DoConnectDbContext _context;
        private readonly IHubContext<NotificationHub> _hubContext;

        public QuestionsController(DoConnectDbContext context, IHubContext<NotificationHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? search,
            [FromQuery] string? tag,
            [FromQuery] bool? resolved,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var currentUserId = TryGetCurrentUserId();
            var isAdmin = IsAdminUser();

            var query = _context.Questions
                .Where(q => q.IsActive &&
                    (q.ApprovalStatus == "Approved" ||
                     (currentUserId.HasValue && (q.UserId == currentUserId.Value || isAdmin))))
                .Include(q => q.User)
                .Include(q => q.Answers)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(q => q.Title.Contains(search) || q.Body.Contains(search));

            if (!string.IsNullOrWhiteSpace(tag))
                query = query.Where(q => q.Tags != null && q.Tags.Contains(tag));

            if (resolved.HasValue)
                query = query.Where(q => q.IsResolved == resolved.Value);

            var total = await query.CountAsync();
            var questions = await query
                .OrderByDescending(q => q.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(q => new QuestionDto
                {
                    QuestionId = q.QuestionId,
                    Title = q.Title,
                    Body = q.Body,
                    ImageUrl = q.ImageUrl,
                    Tags = q.Tags,
                    ViewCount = q.ViewCount,
                    VoteCount = q.VoteCount,
                    IsResolved = q.IsResolved,
                    ApprovalStatus = q.ApprovalStatus,
                    CreatedAt = q.CreatedAt,
                    UpdatedAt = q.UpdatedAt,
                    UserId = q.UserId,
                    Username = q.User!.Username,
                    AnswerCount = q.Answers.Count(a =>
                        a.IsActive &&
                        (a.ApprovalStatus == "Approved" ||
                         (currentUserId.HasValue && (a.UserId == currentUserId.Value || isAdmin)))),
                    AcceptedAnswerId = q.AcceptedAnswerId
                })
                .ToListAsync();

            return Ok(new { total, page, pageSize, questions });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var currentUserId = TryGetCurrentUserId();
            var isAdmin = IsAdminUser();

            var question = await _context.Questions
                .Where(q => q.QuestionId == id && q.IsActive &&
                    (q.ApprovalStatus == "Approved" ||
                     (currentUserId.HasValue && (q.UserId == currentUserId.Value || isAdmin))))
                .Include(q => q.User)
                .Include(q => q.Answers.Where(a =>
                    a.IsActive &&
                    (a.ApprovalStatus == "Approved" ||
                     (currentUserId.HasValue && (a.UserId == currentUserId.Value || isAdmin)))))
                    .ThenInclude(a => a.User)
                .FirstOrDefaultAsync();

            if (question == null) return NotFound(new { message = "Question not found." });

            question.ViewCount++;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                question = new QuestionDto
                {
                    QuestionId = question.QuestionId,
                    Title = question.Title,
                    Body = question.Body,
                    ImageUrl = question.ImageUrl,
                    Tags = question.Tags,
                    ViewCount = question.ViewCount,
                    VoteCount = question.VoteCount,
                    IsResolved = question.IsResolved,
                    ApprovalStatus = question.ApprovalStatus,
                    CreatedAt = question.CreatedAt,
                    UpdatedAt = question.UpdatedAt,
                    UserId = question.UserId,
                    Username = question.User!.Username,
                    AnswerCount = question.Answers.Count,
                    AcceptedAnswerId = question.AcceptedAnswerId
                },
                answers = question.Answers
                    .Select(a => new AnswerDto
                    {
                        AnswerId = a.AnswerId,
                        Body = a.Body,
                        ImageUrl = a.ImageUrl,
                        VoteCount = a.VoteCount,
                        IsAccepted = a.IsAccepted,
                        ApprovalStatus = a.ApprovalStatus,
                        CreatedAt = a.CreatedAt,
                        UpdatedAt = a.UpdatedAt,
                        UserId = a.UserId,
                        Username = a.User!.Username,
                        QuestionId = a.QuestionId
                    })
                    .OrderByDescending(a => a.IsAccepted)
                    .ThenByDescending(a => a.VoteCount)
            });
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreateQuestionDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var approvalStatus = IsAdminUser() ? "Approved" : "Pending";

            var question = new Question
            {
                Title = dto.Title,
                Body = dto.Body,
                ImageUrl = dto.ImageUrl,
                Tags = dto.Tags,
                UserId = userId,
                ApprovalStatus = approvalStatus
            };

            _context.Questions.Add(question);
            await _context.SaveChangesAsync();
            await SyncQuestionImageAsync(question);

            if (approvalStatus == "Pending")
            {
                var adminIds = await GetAdminUserIdsAsync();
                await CreateAndDispatchNotificationsAsync(
                    adminIds,
                    $"New question '{question.Title}' is waiting for approval.",
                    "Approval",
                    question.QuestionId);
            }

            return CreatedAtAction(nameof(GetById), new { id = question.QuestionId }, new
            {
                message = approvalStatus == "Approved"
                    ? "Question created."
                    : "Question submitted and waiting for admin approval.",
                questionId = question.QuestionId,
                approvalStatus
            });
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateQuestionDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var role = User.FindFirstValue(ClaimTypes.Role);

            var question = await _context.Questions.FindAsync(id);
            if (question == null || !question.IsActive) return NotFound();

            if (question.UserId != userId && role != "Admin")
                return Forbid();

            if (dto.Title != null) question.Title = dto.Title;
            if (dto.Body != null) question.Body = dto.Body;
            if (dto.ImageUrl != null) question.ImageUrl = dto.ImageUrl;
            if (dto.Tags != null) question.Tags = dto.Tags;
            question.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            await SyncQuestionImageAsync(question);

            return Ok(new
            {
                message = "Question updated.",
                approvalStatus = question.ApprovalStatus
            });
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var role = User.FindFirstValue(ClaimTypes.Role);

            var question = await _context.Questions.FindAsync(id);
            if (question == null || !question.IsActive) return NotFound();

            if (question.UserId != userId && role != "Admin")
                return Forbid();

            question.IsActive = false;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Question deleted." });
        }

        [HttpPost("{id}/vote")]
        [Authorize]
        public async Task<IActionResult> Vote(int id, [FromQuery] string type)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var question = await _context.Questions.FindAsync(id);
            if (question == null || !question.IsActive || question.ApprovalStatus != "Approved")
                return NotFound();

            var voteValue = type switch
            {
                "up" => 1,
                "down" => -1,
                _ => 0
            };

            if (voteValue == 0)
                return BadRequest(new { message = "Invalid vote type." });

            var existingVote = await _context.QuestionVotes
                .FirstOrDefaultAsync(v => v.QuestionId == id && v.UserId == userId);

            if (existingVote == null)
            {
                _context.QuestionVotes.Add(new QuestionVote
                {
                    QuestionId = id,
                    UserId = userId,
                    Value = voteValue
                });
                question.VoteCount += voteValue;
            }
            else if (existingVote.Value != voteValue)
            {
                question.VoteCount -= existingVote.Value;
                existingVote.Value = voteValue;
                question.VoteCount += voteValue;
            }

            await _context.SaveChangesAsync();
            return Ok(new
            {
                voteCount = question.VoteCount,
                currentUserVote = voteValue
            });
        }

        [HttpPatch("{id}/resolve")]
        [Authorize]
        public async Task<IActionResult> MarkResolved(int id, [FromQuery] int? acceptedAnswerId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var question = await _context.Questions.FindAsync(id);
            if (question == null || !question.IsActive) return NotFound();
            if (question.UserId != userId) return Forbid();

            question.IsResolved = true;
            if (acceptedAnswerId.HasValue)
            {
                var answer = await _context.Answers.FindAsync(acceptedAnswerId.Value);
                if (answer == null || answer.QuestionId != id || answer.ApprovalStatus != "Approved")
                    return BadRequest(new { message = "Only approved answers can be accepted." });

                question.AcceptedAnswerId = acceptedAnswerId;
                answer.IsAccepted = true;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Question marked as resolved." });
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUser(int userId)
        {
            var currentUserId = TryGetCurrentUserId();
            var isAdmin = IsAdminUser();

            var questions = await _context.Questions
                .Where(q => q.UserId == userId && q.IsActive &&
                    (q.ApprovalStatus == "Approved" ||
                     (currentUserId.HasValue && (currentUserId.Value == userId || isAdmin))))
                .Include(q => q.User)
                .Include(q => q.Answers)
                .OrderByDescending(q => q.CreatedAt)
                .Select(q => new QuestionDto
                {
                    QuestionId = q.QuestionId,
                    Title = q.Title,
                    Body = q.Body,
                    ImageUrl = q.ImageUrl,
                    Tags = q.Tags,
                    VoteCount = q.VoteCount,
                    ViewCount = q.ViewCount,
                    IsResolved = q.IsResolved,
                    ApprovalStatus = q.ApprovalStatus,
                    CreatedAt = q.CreatedAt,
                    UserId = q.UserId,
                    Username = q.User!.Username,
                    AnswerCount = q.Answers.Count(a => a.IsActive && a.ApprovalStatus == "Approved")
                })
                .ToListAsync();

            return Ok(questions);
        }

        [HttpGet("pending")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetPending()
        {
            var questions = await _context.Questions
                .Where(q => q.IsActive && q.ApprovalStatus == "Pending")
                .Include(q => q.User)
                .OrderByDescending(q => q.CreatedAt)
                .Select(q => new QuestionDto
                {
                    QuestionId = q.QuestionId,
                    Title = q.Title,
                    Body = q.Body,
                    ImageUrl = q.ImageUrl,
                    Tags = q.Tags,
                    ViewCount = q.ViewCount,
                    VoteCount = q.VoteCount,
                    IsResolved = q.IsResolved,
                    ApprovalStatus = q.ApprovalStatus,
                    CreatedAt = q.CreatedAt,
                    UserId = q.UserId,
                    Username = q.User!.Username,
                    AnswerCount = q.Answers.Count(a => a.IsActive)
                })
                .ToListAsync();

            return Ok(questions);
        }

        [HttpPatch("{id}/approval")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> SetApproval(int id, [FromQuery] bool approve)
        {
            var question = await _context.Questions.FindAsync(id);
            if (question == null || !question.IsActive) return NotFound();

            question.ApprovalStatus = approve ? "Approved" : "Rejected";
            if (!approve)
            {
                question.IsResolved = false;
                question.AcceptedAnswerId = null;
            }

            await _context.SaveChangesAsync();

            var message = approve
                ? $"Your question '{question.Title}' was approved by admin."
                : $"Your question '{question.Title}' was rejected by admin.";

            await CreateAndDispatchNotificationsAsync(
                new[] { question.UserId },
                message,
                "Approval",
                question.QuestionId);

            return Ok(new
            {
                message = approve ? "Question approved." : "Question rejected.",
                approvalStatus = question.ApprovalStatus
            });
        }

        private int? TryGetCurrentUserId()
        {
            return int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId)
                ? userId
                : null;
        }

        private bool IsAdminUser()
        {
            return string.Equals(User.FindFirstValue(ClaimTypes.Role), "Admin", StringComparison.OrdinalIgnoreCase);
        }

        private async Task<List<int>> GetAdminUserIdsAsync()
        {
            return await _context.Users
                .Where(u => u.IsActive && u.Role == "Admin")
                .Select(u => u.UserId)
                .ToListAsync();
        }

        private async Task CreateAndDispatchNotificationsAsync(IEnumerable<int> userIds, string message, string type, int? questionId)
        {
            var distinctUserIds = userIds.Distinct().ToList();
            if (distinctUserIds.Count == 0) return;

            foreach (var userId in distinctUserIds)
            {
                _context.Notifications.Add(new Notification
                {
                    UserId = userId,
                    QuestionId = questionId,
                    Message = message,
                    Type = type
                });
            }

            await _context.SaveChangesAsync();

            foreach (var userId in distinctUserIds)
            {
                await _hubContext.Clients.Group($"user-{userId}").SendAsync("ReceiveNotification", message);
            }
        }

        private async Task SyncQuestionImageAsync(Question question)
        {
            var existingImages = await _context.Images
                .Where(i => i.QuestionId == question.QuestionId)
                .ToListAsync();

            if (string.IsNullOrWhiteSpace(question.ImageUrl))
            {
                if (existingImages.Count > 0)
                {
                    _context.Images.RemoveRange(existingImages);
                    await _context.SaveChangesAsync();
                }
                return;
            }

            var fileName = Path.GetFileName(question.ImageUrl);
            var image = existingImages.FirstOrDefault();

            if (image == null)
            {
                _context.Images.Add(new Image
                {
                    QuestionId = question.QuestionId,
                    FileName = string.IsNullOrWhiteSpace(fileName) ? $"question-{question.QuestionId}.png" : fileName,
                    FilePath = question.ImageUrl,
                    ContentType = GetContentType(question.ImageUrl)
                });
            }
            else
            {
                image.FileName = string.IsNullOrWhiteSpace(fileName) ? image.FileName : fileName;
                image.FilePath = question.ImageUrl;
                image.ContentType = GetContentType(question.ImageUrl);
            }

            await _context.SaveChangesAsync();
        }

        private static string GetContentType(string path)
        {
            var extension = Path.GetExtension(path).ToLowerInvariant();
            return extension switch
            {
                ".jpg" or ".jpeg" => "image/jpeg",
                ".gif" => "image/gif",
                ".webp" => "image/webp",
                _ => "image/png"
            };
        }
    }
}
