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
    public class AnswersController : ControllerBase
    {
        private readonly DoConnectDbContext _context;
        private readonly IHubContext<NotificationHub> _hubContext;

        public AnswersController(DoConnectDbContext context, IHubContext<NotificationHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        [HttpGet("question/{questionId}")]
        public async Task<IActionResult> GetByQuestion(int questionId)
        {
            var currentUserId = TryGetCurrentUserId();
            var isAdmin = IsAdminUser();

            var answers = await _context.Answers
                .Where(a => a.QuestionId == questionId &&
                            a.IsActive &&
                            (a.ApprovalStatus == "Approved" ||
                             (currentUserId.HasValue && (a.UserId == currentUserId.Value || isAdmin))))
                .Include(a => a.User)
                .OrderByDescending(a => a.IsAccepted)
                .ThenByDescending(a => a.VoteCount)
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
                    QuestionId = a.QuestionId,
                    QuestionTitle = a.Question!.Title
                })
                .ToListAsync();

            return Ok(answers);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreateAnswerDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var isAdmin = IsAdminUser();

            var question = await _context.Questions.FindAsync(dto.QuestionId);
            if (question == null || !question.IsActive)
                return NotFound(new { message = "Question not found." });

            var answer = new Answer
            {
                Body = dto.Body,
                ImageUrl = dto.ImageUrl,
                QuestionId = dto.QuestionId,
                UserId = userId,
                ApprovalStatus = isAdmin ? "Approved" : "Pending"
            };

            _context.Answers.Add(answer);
            await _context.SaveChangesAsync();
            await SyncAnswerImageAsync(answer);

            if (isAdmin)
            {
                if (question.UserId != userId)
                {
                    await CreateAndDispatchNotificationsAsync(
                        new[] { question.UserId },
                        $"Your question '{question.Title}' received a new answer.",
                        "Answer",
                        question.QuestionId);
                }
            }
            else
            {
                var adminIds = await GetAdminUserIdsAsync();
                await CreateAndDispatchNotificationsAsync(
                    adminIds,
                    $"A new answer on '{question.Title}' is waiting for approval.",
                    "Approval",
                    question.QuestionId);
            }

            return CreatedAtAction(nameof(GetByQuestion), new { questionId = dto.QuestionId }, new
            {
                message = isAdmin
                    ? "Answer posted."
                    : "Answer submitted and waiting for admin approval.",
                answerId = answer.AnswerId,
                approvalStatus = answer.ApprovalStatus
            });
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateAnswerDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var isAdmin = IsAdminUser();

            var answer = await _context.Answers
                .Include(a => a.Question)
                .FirstOrDefaultAsync(a => a.AnswerId == id);

            if (answer == null || !answer.IsActive) return NotFound();

            if (answer.UserId != userId && !isAdmin) return Forbid();

            answer.Body = dto.Body;
            if (dto.ImageUrl != null) answer.ImageUrl = dto.ImageUrl;
            answer.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            await SyncAnswerImageAsync(answer);

            return Ok(new
            {
                message = "Answer updated.",
                approvalStatus = answer.ApprovalStatus
            });
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var role = User.FindFirstValue(ClaimTypes.Role);

            var answer = await _context.Answers.FindAsync(id);
            if (answer == null || !answer.IsActive) return NotFound();

            if (answer.UserId != userId && role != "Admin") return Forbid();

            answer.IsActive = false;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Answer deleted." });
        }

        [HttpPost("{id}/vote")]
        [Authorize]
        public async Task<IActionResult> Vote(int id, [FromQuery] string type)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var answer = await _context.Answers.FindAsync(id);
            if (answer == null || !answer.IsActive || answer.ApprovalStatus != "Approved") return NotFound();

            var voteValue = type switch
            {
                "up" => 1,
                "down" => -1,
                _ => 0
            };

            if (voteValue == 0)
                return BadRequest(new { message = "Invalid vote type." });

            var existingVote = await _context.AnswerVotes
                .FirstOrDefaultAsync(v => v.AnswerId == id && v.UserId == userId);

            if (existingVote == null)
            {
                _context.AnswerVotes.Add(new AnswerVote
                {
                    AnswerId = id,
                    UserId = userId,
                    Value = voteValue
                });
                answer.VoteCount += voteValue;
            }
            else if (existingVote.Value != voteValue)
            {
                answer.VoteCount -= existingVote.Value;
                existingVote.Value = voteValue;
                answer.VoteCount += voteValue;
            }

            await _context.SaveChangesAsync();
            return Ok(new
            {
                voteCount = answer.VoteCount,
                currentUserVote = voteValue
            });
        }

        [HttpGet("pending")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetPending()
        {
            var answers = await _context.Answers
                .Where(a => a.IsActive && a.ApprovalStatus == "Pending")
                .Include(a => a.User)
                .Include(a => a.Question)
                .OrderByDescending(a => a.CreatedAt)
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
                    QuestionId = a.QuestionId,
                    QuestionTitle = a.Question!.Title
                })
                .ToListAsync();

            return Ok(answers);
        }

        [HttpPatch("{id}/approval")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> SetApproval(int id, [FromQuery] bool approve)
        {
            var answer = await _context.Answers
                .Include(a => a.Question)
                .FirstOrDefaultAsync(a => a.AnswerId == id);

            if (answer == null || !answer.IsActive) return NotFound();

            answer.ApprovalStatus = approve ? "Approved" : "Rejected";
            if (!approve)
            {
                answer.IsAccepted = false;
                if (answer.Question?.AcceptedAnswerId == answer.AnswerId)
                {
                    answer.Question.AcceptedAnswerId = null;
                    answer.Question.IsResolved = false;
                }
            }

            await _context.SaveChangesAsync();

            var notifications = new List<int> { answer.UserId };
            var ownerMessage = approve
                ? $"A new answer on your question '{answer.Question!.Title}' was approved."
                : $"Your answer on '{answer.Question!.Title}' was rejected by admin.";

            if (approve && answer.Question!.UserId != answer.UserId)
            {
                notifications.Add(answer.Question.UserId);
            }

            await CreateAndDispatchNotificationsAsync(
                notifications,
                ownerMessage,
                approve ? "Answer" : "Approval",
                answer.QuestionId);

            return Ok(new
            {
                message = approve ? "Answer approved." : "Answer rejected.",
                approvalStatus = answer.ApprovalStatus
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

        private async Task SyncAnswerImageAsync(Answer answer)
        {
            var existingImages = await _context.Images
                .Where(i => i.AnswerId == answer.AnswerId)
                .ToListAsync();

            if (string.IsNullOrWhiteSpace(answer.ImageUrl))
            {
                if (existingImages.Count > 0)
                {
                    _context.Images.RemoveRange(existingImages);
                    await _context.SaveChangesAsync();
                }
                return;
            }

            var fileName = Path.GetFileName(answer.ImageUrl);
            var image = existingImages.FirstOrDefault();

            if (image == null)
            {
                _context.Images.Add(new Image
                {
                    AnswerId = answer.AnswerId,
                    FileName = string.IsNullOrWhiteSpace(fileName) ? $"answer-{answer.AnswerId}.png" : fileName,
                    FilePath = answer.ImageUrl,
                    ContentType = GetContentType(answer.ImageUrl)
                });
            }
            else
            {
                image.FileName = string.IsNullOrWhiteSpace(fileName) ? image.FileName : fileName;
                image.FilePath = answer.ImageUrl;
                image.ContentType = GetContentType(answer.ImageUrl);
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
