using DoConnect.API.DTOs;

namespace DoConnect.API.Services
{
    public interface IAnswerService
    {
        Task<List<AnswerResponseDTO>> GetAnswers(int questionId);
        Task<AnswerResponseDTO> CreateAnswer(int questionId, int userId, CreateAnswerDTO dto);
        Task ApproveAnswer(int id);
        Task RejectAnswer(int id);
        Task DeleteAnswer(int id);
        Task<List<AnswerResponseDTO>> GetPendingAnswers();
    }
}