using System.Security.Claims;
using DoConnect.API.DTOs;
using DoConnect.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DoConnect.API.Controllers
{
    [ApiController]
    [Route("api")]
    public class AnswersController : ControllerBase
    {
        private readonly IAnswerService _answerService;

        public AnswersController(IAnswerService answerService)
        {
            _answerService = answerService;
        }

        [HttpGet("questions/{questionId}/answers")]
        public async Task<IActionResult> GetAnswers(int questionId)
        {
            var answers = await _answerService.GetAnswers(questionId);
            return Ok(answers);
        }

        [Authorize]
        [HttpPost("questions/{questionId}/answers")]
        public async Task<IActionResult> CreateAnswer(int questionId, [FromForm] CreateAnswerDTO dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            try
            {
                var answer = await _answerService.CreateAnswer(questionId, userId, dto);
                return Ok(answer);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("answers/{id}/approve")]
        public async Task<IActionResult> ApproveAnswer(int id)
        {
            try
            {
                await _answerService.ApproveAnswer(id);
                return Ok(new { message = "Answer approved" });
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("answers/{id}/reject")]
        public async Task<IActionResult> RejectAnswer(int id)
        {
            try
            {
                await _answerService.RejectAnswer(id);
                return Ok(new { message = "Answer rejected" });
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("answers/{id}")]
        public async Task<IActionResult> DeleteAnswer(int id)
        {
            try
            {
                await _answerService.DeleteAnswer(id);
                return Ok(new { message = "Answer deleted" });
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}
