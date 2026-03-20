import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService, QuestionService, AnswerService } from '../../../services/api.services';
import { AdminStats, Answer, Question } from '../../../models/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <div class="admin-page fade-in">
        <div class="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p class="text-muted">Platform overview, moderation, and pending approvals</p>
          </div>
          <a routerLink="/admin/users" class="btn btn-primary">Manage Users</a>
        </div>

        <div class="stats-grid" *ngIf="stats">
          <div class="stat-card">
            <span class="stat-number">{{ stats.totalUsers }}</span>
            <span class="stat-label">Users</span>
            <span class="stat-sub">{{ stats.activeUsers }} active</span>
          </div>
          <div class="stat-card accent">
            <span class="stat-number">{{ stats.totalQuestions }}</span>
            <span class="stat-label">Questions</span>
            <span class="stat-sub">{{ stats.pendingQuestions }} pending</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">{{ stats.totalAnswers }}</span>
            <span class="stat-label">Answers</span>
            <span class="stat-sub">{{ stats.pendingAnswers }} pending</span>
          </div>
          <div class="stat-card success">
            <span class="stat-number">{{ resolveRate }}%</span>
            <span class="stat-label">Resolve Rate</span>
            <span class="stat-sub">{{ stats.resolvedQuestions }} resolved</span>
          </div>
        </div>

        <div class="section-title">Quick Actions</div>
        <div class="actions-grid">
          <a routerLink="/admin/users" class="action-card">
            <div>
              <div class="action-name">User Management</div>
              <div class="action-desc">Activate, deactivate, and review user accounts</div>
            </div>
          </a>
          <a routerLink="/notifications" class="action-card">
            <div>
              <div class="action-name">Notifications</div>
              <div class="action-desc">Check approval and activity alerts</div>
            </div>
          </a>
        </div>

        <div class="moderation-grid">
          <section class="panel">
            <div class="panel-header">
              <h2>Pending Questions</h2>
              <span class="panel-count">{{ pendingQuestions.length }}</span>
            </div>

            <div *ngIf="pendingQuestions.length === 0" class="empty-state">
              <p>No pending questions.</p>
            </div>

            <div *ngFor="let q of pendingQuestions" class="moderation-item">
              <div class="moderation-main">
                <a [routerLink]="['/questions', q.questionId]" class="item-title">{{ q.title }}</a>
                <p class="item-meta">By {{ q.username }} | {{ q.createdAt | date:'MMM d, yyyy' }}</p>
                <p class="item-body">{{ q.body | slice:0:140 }}{{ q.body.length > 140 ? '...' : '' }}</p>
              </div>
              <div class="moderation-actions">
                <button class="btn btn-primary btn-sm" (click)="approveQuestion(q)">Approve</button>
                <button class="btn btn-danger btn-sm" (click)="rejectQuestion(q)">Reject</button>
              </div>
            </div>
          </section>

          <section class="panel">
            <div class="panel-header">
              <h2>Pending Answers</h2>
              <span class="panel-count">{{ pendingAnswers.length }}</span>
            </div>

            <div *ngIf="pendingAnswers.length === 0" class="empty-state">
              <p>No pending answers.</p>
            </div>

            <div *ngFor="let a of pendingAnswers" class="moderation-item">
              <div class="moderation-main">
                <a [routerLink]="['/questions', a.questionId]" class="item-title">{{ a.questionTitle || ('Question #' + a.questionId) }}</a>
                <p class="item-meta">By {{ a.username }} | {{ a.createdAt | date:'MMM d, yyyy' }}</p>
                <p class="item-body">{{ a.body | slice:0:140 }}{{ a.body.length > 140 ? '...' : '' }}</p>
              </div>
              <div class="moderation-actions">
                <button class="btn btn-primary btn-sm" (click)="approveAnswer(a)">Approve</button>
                <button class="btn btn-danger btn-sm" (click)="rejectAnswer(a)">Reject</button>
              </div>
            </div>
          </section>
        </div>

        <div class="section-title">Recent Approved Questions</div>
        <div class="recent-list" *ngIf="recentQuestions.length > 0">
          <div *ngFor="let q of recentQuestions" class="recent-item">
            <div class="recent-info">
              <a [routerLink]="['/questions', q.questionId]" class="recent-title">{{ q.title }}</a>
              <span class="text-muted text-sm">by {{ q.username }} | {{ q.createdAt | date:'MMM d' }}</span>
            </div>
            <div class="recent-stats">
              <span class="stat-chip">{{ q.answerCount }} ans</span>
              <span class="stat-chip">{{ q.viewCount }} views</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-page { padding: 40px 0; }
    .admin-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; gap: 16px; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
    .stat-card, .panel, .action-card, .recent-list {
      background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow);
    }
    .stat-card { padding: 20px; display: flex; flex-direction: column; gap: 4px; }
    .stat-card.accent { border-color: rgba(108,142,255,0.3); background: rgba(108,142,255,0.05); }
    .stat-card.success { border-color: rgba(47,133,90,0.28); background: rgba(47,133,90,0.05); }
    .stat-number { font-family: var(--font-mono); font-size: 1.8rem; font-weight: 600; }
    .stat-label { font-size: 0.84rem; color: var(--text-secondary); }
    .stat-sub { font-size: 0.78rem; color: var(--text-muted); }
    .section-title { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); font-weight: 600; margin-bottom: 14px; margin-top: 8px; }
    .actions-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 28px; }
    .action-card { display: block; padding: 18px 20px; text-decoration: none; color: var(--text-primary); }
    .action-name { font-weight: 600; margin-bottom: 4px; }
    .action-desc { color: var(--text-muted); font-size: 0.84rem; }
    .moderation-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 32px; }
    .panel { padding: 20px; }
    .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .panel-header h2 { font-size: 1rem; margin: 0; }
    .panel-count { background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 999px; padding: 4px 10px; font-size: 0.78rem; color: var(--text-secondary); }
    .moderation-item { border-top: 1px solid var(--border); padding: 16px 0; }
    .moderation-item:first-of-type { border-top: none; padding-top: 0; }
    .item-title { font-weight: 600; color: var(--text-primary); text-decoration: none; }
    .item-meta { color: var(--text-muted); font-size: 0.82rem; margin: 6px 0; }
    .item-body { color: var(--text-secondary); font-size: 0.9rem; line-height: 1.5; }
    .moderation-actions { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
    .recent-list { overflow: hidden; }
    .recent-item { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid var(--border); gap: 12px; }
    .recent-item:last-child { border-bottom: none; }
    .recent-title { color: var(--text-primary); text-decoration: none; }
    .recent-title:hover, .item-title:hover { color: var(--accent); }
    .recent-info { display: flex; flex-direction: column; gap: 4px; }
    .recent-stats { display: flex; align-items: center; gap: 8px; }
    .stat-chip { background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 8px; padding: 3px 8px; font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono); }
    @media (max-width: 900px) {
      .stats-grid { grid-template-columns: 1fr 1fr; }
      .actions-grid, .moderation-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  stats: AdminStats | null = null;
  recentQuestions: Question[] = [];
  pendingQuestions: Question[] = [];
  pendingAnswers: Answer[] = [];

  constructor(
    private userService: UserService,
    private questionService: QuestionService,
    private answerService: AnswerService
  ) {}

  get resolveRate() {
    if (!this.stats || !this.stats.totalQuestions) return 0;
    return Math.round((this.stats.resolvedQuestions / this.stats.totalQuestions) * 100);
  }

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.userService.getStats().subscribe(s => this.stats = s);
    this.questionService.getAll({ page: 1, pageSize: 8 }).subscribe(r => this.recentQuestions = r.questions);
    this.questionService.getPending().subscribe(r => this.pendingQuestions = r);
    this.answerService.getPending().subscribe(r => this.pendingAnswers = r);
  }

  approveQuestion(question: Question) {
    this.questionService.setApproval(question.questionId, true).subscribe(() => this.loadDashboard());
  }

  rejectQuestion(question: Question) {
    this.questionService.setApproval(question.questionId, false).subscribe(() => this.loadDashboard());
  }

  approveAnswer(answer: Answer) {
    this.answerService.setApproval(answer.answerId, true).subscribe(() => this.loadDashboard());
  }

  rejectAnswer(answer: Answer) {
    this.answerService.setApproval(answer.answerId, false).subscribe(() => this.loadDashboard());
  }
}
