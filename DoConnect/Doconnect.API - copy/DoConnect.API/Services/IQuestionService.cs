using DoConnect.API.DTOs;

namespace DoConnect.API.Services
{
    public interface IQuestionService
    {
        Task<List<QuestionResponseDTO>> GetQuestions(string? search);
        Task<List<string>> GetTopics();
        Task<QuestionResponseDTO> GetQuestion(int id);
        Task<QuestionResponseDTO> CreateQuestion(int userId, CreateQuestionDTO dto);
        Task<QuestionResponseDTO> UpdateQuestion(int id, UpdateQuestionDTO dto);
        Task DeleteQuestion(int id);
        Task ApproveQuestion(int id);
        Task RejectQuestion(int id);
        Task<List<QuestionResponseDTO>> GetPendingQuestions();
    }
}
