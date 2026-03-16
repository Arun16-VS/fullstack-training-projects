using DoConnect.API.Data;
using DoConnect.API.DTOs;
using DoConnect.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DoConnect.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IQuestionService _questionService;
        private readonly IAnswerService _answerService;
        private readonly INotificationService _notificationService;
        private readonly AppDbContext _db;

        public AdminController(
            IQuestionService questionService,
            IAnswerService answerService,
            INotificationService notificationService,
            AppDbContext db)
        {
            _questionService = questionService;
            _answerService = answerService;
            _notificationService = notificationService;
            _db = db;
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var notifications = await _notificationService.GetNotifications();

            var dashboard = new AdminDashboardDTO
            {
                PendingQuestionCount = await _db.Questions.CountAsync(q => q.Status == "Pending"),
                PendingAnswerCount = await _db.Answers.CountAsync(a => a.Status == "Pending"),
                UnreadNotificationCount = notifications.Count(n => !n.IsRead),
                RecentNotifications = notifications.Take(6).ToList()
            };

            return Ok(dashboard);
        }

        [HttpGet("questions/pending")]
        public async Task<IActionResult> GetPendingQuestions()
        {
            var questions = await _questionService.GetPendingQuestions();
            return Ok(questions);
        }

        [HttpGet("answers/pending")]
        public async Task<IActionResult> GetPendingAnswers()
        {
            var answers = await _answerService.GetPendingAnswers();
            return Ok(answers);
        }

        [HttpGet("notifications")]
        public async Task<IActionResult> GetNotifications()
        {
            var notifications = await _notificationService.GetNotifications();
            return Ok(notifications);
        }

        [HttpPut("notifications/{id}/read")]
        public async Task<IActionResult> MarkNotificationRead(int id)
        {
            try
            {
                await _notificationService.MarkAsRead(id);
                return Ok(new { message = "Marked as read" });
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}
