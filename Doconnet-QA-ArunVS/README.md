# DoConnect
### Community Q&A and Collaboration Platform

DoConnect is a full-stack capstone project built with Angular and ASP.NET Core Web API. It helps users ask technical questions, post answers, attach screenshots, receive notifications, review other users, and connect with the community through a clean Q&A platform.

---

## Project Structure

```text
Doconnet-QA-ArunVS/
|-- API/                              # ASP.NET Core Web API (.NET 10)
|   |-- Controllers/
|   |   |-- AuthController.cs         # Register, login, current user
|   |   |-- QuestionsController.cs    # CRUD, vote, resolve, search
|   |   |-- AnswersController.cs      # CRUD, vote
|   |   |-- ImagesController.cs       # Image upload support
|   |   |-- UsersController.cs        # Profile update, admin management, connect
|   |   |-- NotificationsController.cs
|   |   |-- ReviewsController.cs
|   |-- Data/
|   |   |-- DoConnectDbContext.cs
|   |-- DTOs/
|   |   |-- Dtos.cs
|   |-- Hubs/
|   |   |-- NotificationHub.cs        # SignalR notifications
|   |-- Migrations/
|   |-- Models/
|   |   |-- User.cs
|   |   |-- Question.cs
|   |   |-- Answer.cs
|   |   |-- Notification.cs
|   |   |-- Review.cs
|   |   |-- UserConnection.cs
|   |   |-- Image.cs
|   |   |-- QuestionVote.cs
|   |   `-- AnswerVote.cs
|   |-- Program.cs
|   |-- appsettings.json
|   `-- DoConnect.API.csproj
|
`-- Angular/                          # Angular 19 frontend
    |-- src/app/
    |   |-- components/
    |   |   |-- auth/                # Login, register
    |   |   |-- questions/           # List, detail, ask question
    |   |   |-- admin/               # Dashboard, user management
    |   |   |-- profile/             # Profile, reviews, connect
    |   |   `-- shared/              # Notifications and shared UI
    |   |-- guards/                  # AuthGuard, AdminGuard
    |   |-- interceptors/            # JWT interceptor
    |   |-- models/                  # TypeScript models
    |   `-- services/                # API service layer
    |-- angular.json
    `-- package.json
```

---

## Setup and Run

### Backend

Prerequisites:
- .NET 10 SDK
- SQL Server LocalDB

Go to the API folder:

```powershell
cd "C:\Users\arunv\captsone_WP\DoConnect\Doconnet-QA-ArunVS\API"
```

Set the local environment values if needed:

```powershell
$env:DOTNET_CLI_HOME="C:\Users\arunv\captsone_WP\.dotnet"
$env:DOTNET_SKIP_FIRST_TIME_EXPERIENCE="1"
```

Apply migrations:

```powershell
dotnet ef database update
```

Run the API:

```powershell
dotnet run
```

API URL:
- `https://localhost:7001`

Swagger URL:
- `https://localhost:7001/swagger`

Database configuration:
- Server: `(localdb)\MSSQLLocalDB`
- Database: `DatabaseDB`

### Frontend

Prerequisites:
- Node.js 18+

Go to the Angular folder:

```powershell
cd "C:\Users\arunv\captsone_WP\DoConnect\Doconnet-QA-ArunVS\Angular"
```

Install dependencies:

```powershell
npm install
```

Run the frontend:

```powershell
npm start
```

Frontend URL:
- `http://localhost:4200`

---

## Database and Configuration Files

- Database script: `Database_Schema_DoConnect.sql`
- API configuration: `API/appsettings.json`
- Database server: `(localdb)\MSSQLLocalDB`
- Database name: `DatabaseDB`

---

## Default Admin Credentials

| Email | Password |
|-------|----------|
| `admin@doconnect.com` | `Admin@123` |

---

## Current Project Coverage

| Area | Status |
|------|--------|
| User registration and login | Completed |
| JWT-based authentication and session handling | Completed |
| Question CRUD | Completed |
| Answer CRUD | Completed |
| One-vote-per-user logic for questions and answers | Completed |
| Resolve question with accepted answer | Completed |
| Admin dashboard and user management | Completed |
| Swagger API testing | Completed |
| Notifications with SignalR | Completed |
| User reviews | Completed |
| Profile picture support | Completed |
| Question image upload support | Completed |
| Answer image upload support | Completed |
| Public questions page before login | Completed |
| Public about page from brand logo | Completed |
| User connection feature | Completed |
| Admin moderation for pending questions and answers | Completed |
| Approval and rejection workflow | Completed |
| Responsive frontend updates | Completed |

---

## Tech Stack

### Backend
- ASP.NET Core Web API
- .NET 10
- Entity Framework Core
- SQL Server LocalDB
- JWT Bearer Authentication
- SignalR
- BCrypt
- Swagger

### Frontend
- Angular 19
- TypeScript
- Reactive Forms
- Angular Router
- HttpClient
- RxJS

---

## Key Features

- Full CRUD support for questions, answers, and users
- JWT authentication with role-based access for `Admin` and `User`
- Public questions browsing before login
- Search, filter, and pagination support on questions
- Real-time notifications using SignalR
- Voting system for questions and answers with one active vote per user
- Accepted answer flow to mark questions as resolved
- Optional question and answer image upload for screenshots and issue references
- User profile image and bio update support
- User-to-user connect feature
- Reviews and ratings between users
- Admin dashboard with user and platform statistics
- Admin moderation for pending questions and answers
- Approval and rejection workflow for community content
- Public landing experience before login with custom home section
- About platform page describing why DoConnect was created and by whom
- Responsive UI with client-side validation

---

## API Highlights

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/questions`
- `POST /api/questions`
- `POST /api/answers`
- `GET /api/users/{id}`
- `POST /api/users/{id}/connect`
- `GET /api/notifications`
- `POST /api/reviews`

Full API testing can be done from Swagger:
- `https://localhost:7001/swagger`

---

## Notes

- This project was configured for local execution using SQL Server LocalDB.
- The final UI was updated to a lighter theme with cleaner typography and improved profile/question flows.
- Recent updates added moderation, image upload APIs, public homepage/about flow, notification badge handling, and single-vote-per-user tracking.
- The report and future sprint planning are maintained separately in the project documentation.
