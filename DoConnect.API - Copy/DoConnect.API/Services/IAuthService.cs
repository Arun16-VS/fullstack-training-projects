using DoConnect.API.DTOs;

namespace DoConnect.API.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDTO> Login(LoginDTO dto);
        Task<AuthResponseDTO> Register(RegisterDTO dto);
    }
}