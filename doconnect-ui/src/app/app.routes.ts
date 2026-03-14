import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { QuestionsComponent } from './pages/questions/questions';
import { QuestionDetailComponent } from './pages/question-detail/question-detail';
import { AskQuestionComponent } from './pages/ask-question/ask-question';
import { AdminPendingQuestionsComponent } from './pages/admin-pending-questions/admin-pending-questions';
import { AdminPendingAnswersComponent } from './pages/admin-pending-answers/admin-pending-answers';
import { AdminNotificationsComponent } from './pages/admin-notifications/admin-notifications';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'questions', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'questions', component: QuestionsComponent },
  { path: 'questions/:id', component: QuestionDetailComponent },
  { path: 'ask-question', component: AskQuestionComponent, canActivate: [authGuard] },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: 'admin/pending-questions', component: AdminPendingQuestionsComponent, canActivate: [adminGuard] },
  { path: 'admin/pending-answers', component: AdminPendingAnswersComponent, canActivate: [adminGuard] },
  { path: 'admin/notifications', component: AdminNotificationsComponent, canActivate: [adminGuard] },
  { path: '**', redirectTo: 'questions' }
];
