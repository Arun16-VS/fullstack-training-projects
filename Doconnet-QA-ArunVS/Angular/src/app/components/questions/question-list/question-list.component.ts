import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QuestionService } from '../../../services/api.services';
import { Question } from '../../../models/models';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-question-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container">
      <section *ngIf="showFeaturedIntro" class="hero-shell fade-in">
        <div class="hero-copy">
          <span class="hero-kicker">Built and presented by Arun</span>
          <h1>DoConnect Community Q&A and Collaboration Platform</h1>
          <p class="hero-lead">
            A people-first space to ask practical questions, share fixes, post screenshots,
            and turn everyday issues into useful solutions for the whole team.
          </p>

          <div class="hero-actions">
            <a *ngIf="isLoggedIn" routerLink="/questions/ask" class="btn btn-primary">Ask a Question</a>
            <a *ngIf="!isLoggedIn" routerLink="/register" class="btn btn-primary">Join the Community</a>
            <a routerLink="/questions" class="btn btn-ghost">Browse Live Questions</a>
          </div>

          <div class="topic-cloud">
            <span *ngFor="let topic of solutionAreas" class="topic-pill">{{ topic }}</span>
          </div>

          <div class="author-note">
            <strong>Author:</strong> Arun
            <span>Designed to make frontend, backend, database, UI, testing, and debugging questions easier to solve together.</span>
          </div>
        </div>

        <div class="hero-visual">
          <div class="visual-board">
            <svg viewBox="0 0 420 300" class="hero-svg" aria-hidden="true">
              <defs>
                <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#ffffff" />
                  <stop offset="100%" stop-color="#eef3fb" />
                </linearGradient>
              </defs>
              <rect x="18" y="22" rx="28" ry="28" width="384" height="256" fill="url(#panel)" stroke="#d9cdbb" stroke-width="2"/>
              <circle cx="68" cy="72" r="8" fill="#486fb2"/>
              <circle cx="98" cy="72" r="8" fill="#a66a2c"/>
              <circle cx="128" cy="72" r="8" fill="#2f855a"/>
              <rect x="54" y="102" rx="18" ry="18" width="138" height="78" fill="#f8fafc" stroke="#dfe7f4"/>
              <rect x="214" y="102" rx="18" ry="18" width="150" height="56" fill="#fef8ef" stroke="#ead8bf"/>
              <rect x="214" y="170" rx="18" ry="18" width="104" height="40" fill="#eef7f0" stroke="#cde8d5"/>
              <circle cx="88" cy="141" r="20" fill="#dbe6f8"/>
              <path d="M88 131c6 0 10 4 10 10s-4 10-10 10-10-4-10-10 4-10 10-10zm-16 34c4-8 12-12 16-12s12 4 16 12" fill="#486fb2"/>
              <path d="M226 123h98" stroke="#486fb2" stroke-width="8" stroke-linecap="round"/>
              <path d="M226 140h82" stroke="#8b7a68" stroke-width="6" stroke-linecap="round"/>
              <path d="M226 183h54" stroke="#2f855a" stroke-width="8" stroke-linecap="round"/>
              <circle cx="336" cy="207" r="28" fill="#486fb2" opacity="0.14"/>
              <circle cx="356" cy="226" r="10" fill="#486fb2"/>
            </svg>

            <div class="floating-card card-a">
              <span class="mini-tag">Frontend</span>
              <strong>UI issue?</strong>
              <p>Share a screenshot and get practical fixes.</p>
            </div>

            <div class="floating-card card-b">
              <span class="mini-tag">Backend</span>
              <strong>API or JWT problem?</strong>
              <p>Explain the flow and capture the response.</p>
            </div>

            <div class="floating-card card-c">
              <span class="mini-tag">Database</span>
              <strong>Schema, query, or migration doubt?</strong>
              <p>Turn it into a searchable team answer.</p>
            </div>
          </div>
        </div>
      </section>

      <section *ngIf="showFeaturedIntro" class="solution-showcase">
        <article *ngFor="let item of showcaseCards" class="showcase-card">
          <span class="showcase-label">{{ item.label }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.body }}</p>
        </article>
      </section>

      <div class="page-header">
        <div>
          <h2>{{ isLoggedIn ? 'Questions' : 'Community Questions' }}</h2>
          <p class="text-muted">{{ total }} questions shared in the platform</p>
        </div>
        <a *ngIf="isLoggedIn" routerLink="/questions/ask" class="btn btn-primary">Ask Question</a>
      </div>

      <div class="filters-bar">
        <div class="search-wrap">
          <span class="search-icon">Q</span>
          <input type="text" [(ngModel)]="searchQuery" (keyup.enter)="search()"
            placeholder="Search questions, issues, tags, or solutions..." class="search-input">
        </div>
        <div class="filter-group">
          <button class="filter-btn" [class.active]="resolvedFilter === null" (click)="setFilter(null)">All</button>
          <button class="filter-btn" [class.active]="resolvedFilter === false" (click)="setFilter(false)">Open</button>
          <button class="filter-btn" [class.active]="resolvedFilter === true" (click)="setFilter(true)">Resolved</button>
        </div>
      </div>

      <div *ngIf="searchQuery || tagFilter" class="active-filters">
        <span *ngIf="searchQuery" class="active-filter">
          Search: "{{ searchQuery }}" <button (click)="clearSearch()">x</button>
        </span>
        <span *ngIf="tagFilter" class="active-filter">
          Tag: {{ tagFilter }} <button (click)="clearTag()">x</button>
        </span>
      </div>

      <div *ngIf="loading" class="spinner"></div>

      <div *ngIf="!loading">
        <div *ngIf="questions.length === 0" class="empty-state">
          <div class="icon">?</div>
          <p>No questions found.</p>
          <a *ngIf="isLoggedIn" routerLink="/questions/ask" class="btn btn-primary">Ask the first question</a>
        </div>

        <div class="questions-list">
          <div *ngFor="let q of questions" class="question-card fade-in" [routerLink]="['/questions', q.questionId]">
            <div class="q-stats">
              <div class="stat">
                <span class="stat-value">{{ q.voteCount }}</span>
                <span class="stat-label">votes</span>
              </div>
              <div class="stat" [class.resolved]="q.isResolved">
                <span class="stat-value">{{ q.answerCount }}</span>
                <span class="stat-label">{{ q.isResolved ? 'resolved' : 'answers' }}</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ q.viewCount }}</span>
                <span class="stat-label">views</span>
              </div>
            </div>

            <div class="q-content">
              <div class="q-title-row">
                <h3 class="q-title">{{ q.title }}</h3>
                <span *ngIf="q.isResolved" class="badge-resolved">Resolved</span>
                <span *ngIf="q.approvalStatus === 'Pending'" class="badge-pending">Pending</span>
                <span *ngIf="q.approvalStatus === 'Rejected'" class="badge-rejected">Rejected</span>
              </div>

              <div class="q-preview-row" [class.with-image]="!!q.imageUrl">
                <div class="q-copy">
                  <p class="q-body">{{ q.body | slice:0:180 }}{{ q.body.length > 180 ? '...' : '' }}</p>
                  <div class="q-meta">
                    <div class="q-tags">
                      <span *ngFor="let tag of getTags(q.tags)" class="tag" (click)="filterByTag(tag, $event)">{{ tag }}</span>
                    </div>
                    <div class="q-author">
                      <span class="author-avatar">{{ q.username.charAt(0).toUpperCase() }}</span>
                      <span class="author-name" [routerLink]="['/profile', q.userId]" (click)="$event.stopPropagation()">{{ q.username }}</span>
                      <span class="q-date">| {{ q.createdAt | date:'MMM d' }}</span>
                    </div>
                  </div>
                </div>

                <img *ngIf="q.imageUrl" [src]="q.imageUrl" [alt]="q.title" class="q-thumb">
              </div>
            </div>
          </div>
        </div>

        <div class="pagination" *ngIf="totalPages > 1">
          <button [disabled]="currentPage === 1" (click)="goToPage(currentPage - 1)">< Prev</button>
          <button *ngFor="let p of pageNumbers" [class.active]="p === currentPage" (click)="goToPage(p)">{{ p }}</button>
          <button [disabled]="currentPage === totalPages" (click)="goToPage(currentPage + 1)">Next ></button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hero-shell {
      display: grid; grid-template-columns: 1.08fr 0.92fr; gap: 28px;
      padding: 28px; margin-bottom: 24px;
      background:
        radial-gradient(circle at top left, rgba(72,111,178,0.12), transparent 28%),
        radial-gradient(circle at bottom right, rgba(166,106,44,0.12), transparent 24%),
        linear-gradient(135deg, rgba(255,255,255,0.94), rgba(247,241,230,0.98));
      border: 1px solid var(--border); border-radius: 30px; box-shadow: var(--shadow);
    }
    .hero-kicker {
      display: inline-flex; align-items: center; gap: 8px;
      margin-bottom: 14px; padding: 6px 12px; border-radius: 999px;
      background: rgba(72,111,178,0.1); color: var(--accent);
      font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;
    }
    .hero-copy h1 { max-width: 720px; margin-bottom: 16px; font-size: 3.2rem; line-height: 1.03; }
    .hero-lead { max-width: 700px; color: var(--text-secondary); font-size: 1.08rem; line-height: 1.65; }
    .hero-actions { display: flex; gap: 12px; flex-wrap: wrap; margin: 22px 0 18px; }
    .topic-cloud { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 18px; }
    .topic-pill {
      padding: 6px 12px; border-radius: 999px; background: rgba(255,255,255,0.88);
      border: 1px solid var(--border); color: var(--text-secondary); font-size: 0.84rem; font-weight: 600;
    }
    .author-note {
      display: flex; flex-direction: column; gap: 6px;
      padding: 16px 18px; background: rgba(255,255,255,0.8);
      border: 1px solid rgba(203,188,166,0.6); border-radius: 18px;
      color: var(--text-secondary);
    }
    .author-note strong { color: var(--text-primary); }
    .hero-visual { display: flex; align-items: stretch; }
    .visual-board {
      position: relative; min-height: 100%; width: 100%;
      background: rgba(255,255,255,0.75); border: 1px solid rgba(217,205,187,0.9);
      border-radius: 26px; padding: 18px; overflow: hidden;
    }
    .hero-svg { width: 100%; height: auto; display: block; border-radius: 20px; }
    .floating-card {
      position: absolute; width: 180px; padding: 14px;
      background: rgba(255,255,255,0.96); border: 1px solid rgba(217,205,187,0.92);
      border-radius: 18px; box-shadow: 0 12px 28px rgba(82, 59, 34, 0.1);
    }
    .card-a { top: 18px; right: 16px; }
    .card-b { bottom: 96px; left: 18px; }
    .card-c { bottom: 18px; right: 26px; }
    .floating-card strong { display: block; margin: 8px 0 6px; font-size: 1rem; }
    .floating-card p { color: var(--text-secondary); font-size: 0.84rem; line-height: 1.45; }
    .mini-tag {
      display: inline-block; padding: 4px 10px; border-radius: 999px;
      background: var(--accent-glow); color: var(--accent); font-size: 0.72rem; font-weight: 700;
    }
    .solution-showcase {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;
    }
    .showcase-card {
      background: rgba(255,255,255,0.86); border: 1px solid var(--border);
      border-radius: 22px; padding: 18px; box-shadow: var(--shadow);
    }
    .showcase-label {
      display: inline-block; margin-bottom: 10px; padding: 4px 10px;
      border-radius: 999px; background: #eef3fb; color: var(--accent);
      font-size: 0.74rem; font-weight: 700;
    }
    .showcase-card h3 { font-size: 1.08rem; margin-bottom: 8px; }
    .showcase-card p { color: var(--text-secondary); font-size: 0.92rem; line-height: 1.55; }
    .page-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      padding: 12px 0 18px;
    }
    .page-header h2 { margin-bottom: 6px; font-size: 2rem; }
    .filters-bar {
      display: flex; gap: 16px; align-items: center; flex-wrap: wrap;
      background: var(--bg-card); border: 1px solid var(--border);
      border-radius: 20px; padding: 16px; margin-bottom: 20px; box-shadow: var(--shadow);
    }
    .search-wrap { flex: 1; min-width: 200px; position: relative; }
    .search-icon {
      position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
      font-size: 0.8rem; font-weight: 700; color: var(--accent);
    }
    .search-input {
      width: 100%; background: var(--bg-secondary); border: 1px solid var(--border);
      border-radius: var(--radius-sm); padding: 10px 14px 10px 36px;
      color: var(--text-primary); font-family: var(--font-body); font-size: 0.95rem;
      outline: none; transition: border-color 0.2s;
    }
    .search-input:focus { border-color: var(--accent); }
    .filter-group { display: flex; gap: 8px; }
    .filter-btn {
      padding: 8px 16px; border-radius: 12px; border: 1px solid var(--border);
      background: transparent; color: var(--text-secondary); cursor: pointer;
      font-size: 0.9rem; font-weight: 600; transition: all 0.2s; font-family: var(--font-body);
    }
    .filter-btn:hover { border-color: var(--accent); color: var(--accent); }
    .filter-btn.active { background: var(--accent); color: #fff; border-color: var(--accent); }
    .active-filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
    .active-filter {
      display: inline-flex; align-items: center; gap: 6px;
      background: var(--accent-glow); color: var(--accent);
      border: 1px solid rgba(72, 111, 178, 0.2); border-radius: 20px;
      padding: 4px 12px; font-size: 0.82rem;
    }
    .active-filter button {
      background: none; border: none; color: var(--accent); cursor: pointer; font-size: 1rem; padding: 0;
    }
    .questions-list { display: flex; flex-direction: column; gap: 14px; }
    .question-card {
      display: flex; gap: 24px; background: var(--bg-card);
      border: 1px solid var(--border); border-radius: 22px;
      padding: 22px; cursor: pointer; transition: all 0.2s; box-shadow: var(--shadow);
    }
    .question-card:hover { border-color: var(--accent); transform: translateY(-1px); }
    .q-stats { display: flex; flex-direction: column; gap: 14px; min-width: 64px; align-items: center; }
    .stat { display: flex; flex-direction: column; align-items: center; gap: 2px; }
    .stat-value { font-family: var(--font-mono); font-size: 1.2rem; font-weight: 600; color: var(--text-primary); }
    .stat-label { font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em; }
    .stat.resolved .stat-value { color: var(--success); }
    .q-content { flex: 1; min-width: 0; }
    .q-title-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; flex-wrap: wrap; }
    .q-title { font-size: 1.3rem; font-weight: 600; color: var(--text-primary); font-family: var(--font-display); }
    .badge-pending, .badge-rejected {
      display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 999px;
      font-size: 0.75rem; font-weight: 700;
    }
    .badge-pending { background: rgba(154, 103, 0, 0.08); color: #9a6700; border: 1px solid rgba(154, 103, 0, 0.22); }
    .badge-rejected { background: rgba(192, 86, 91, 0.08); color: var(--danger); border: 1px solid rgba(192, 86, 91, 0.22); }
    .q-preview-row { display: flex; gap: 18px; align-items: flex-start; }
    .q-preview-row.with-image .q-copy { flex: 1; }
    .q-copy { min-width: 0; }
    .q-body { color: var(--text-secondary); font-size: 0.98rem; margin-bottom: 14px; line-height: 1.55; }
    .q-thumb {
      width: 144px; height: 108px; object-fit: cover; border-radius: 16px;
      border: 1px solid var(--border); flex-shrink: 0;
    }
    .q-meta { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }
    .q-tags { display: flex; gap: 6px; flex-wrap: wrap; }
    .q-tags .tag { cursor: pointer; }
    .q-tags .tag:hover { background: rgba(72, 111, 178, 0.18); }
    .q-author { display: flex; align-items: center; gap: 8px; color: var(--text-muted); font-size: 0.88rem; }
    .author-avatar {
      width: 26px; height: 26px; border-radius: 8px;
      background: var(--accent-glow); color: var(--accent);
      display: flex; align-items: center; justify-content: center;
      font-size: 0.78rem; font-weight: 700;
    }
    .author-name { color: var(--text-secondary); font-weight: 600; }
    .q-date { color: var(--text-muted); }
    @media (max-width: 1100px) {
      .hero-shell { grid-template-columns: 1fr; }
      .solution-showcase { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 900px) {
      .q-preview-row { flex-direction: column; }
      .q-thumb { width: 100%; height: auto; max-height: 280px; }
      .floating-card { position: static; width: auto; margin-top: 12px; }
      .visual-board { display: flex; flex-direction: column; }
    }
    @media (max-width: 600px) {
      .solution-showcase { grid-template-columns: 1fr; }
      .q-stats { flex-direction: row; min-width: unset; }
      .question-card { flex-direction: column; }
      .page-header { flex-direction: column; gap: 16px; }
      .hero-copy h1 { font-size: 2.4rem; }
    }
  `]
})
export class QuestionListComponent implements OnInit {
  questions: Question[] = [];
  loading = true;
  total = 0;
  currentPage = 1;
  pageSize = 10;
  searchQuery = '';
  resolvedFilter: boolean | null = null;
  tagFilter = '';
  solutionAreas = ['Frontend', 'Backend', 'Database', 'API', 'JWT', 'UI/UX', 'Testing', 'Debugging'];
  showcaseCards = [
    {
      label: 'Frontend Help',
      title: 'UI, layout, forms, and routing issues',
      body: 'Ask about Angular components, responsive fixes, styling problems, and interaction bugs in a way other people can understand quickly.'
    },
    {
      label: 'Backend Logic',
      title: 'Controllers, APIs, and authentication flow',
      body: 'Share Web API issues such as JWT login, CRUD operations, role checks, and request/response problems.'
    },
    {
      label: 'Database Support',
      title: 'Queries, migrations, and schema design',
      body: 'Use the platform to discuss SQL queries, EF Core migrations, entity relationships, and LocalDB issues.'
    },
    {
      label: 'Project Memory',
      title: 'Turn one-time fixes into reusable solutions',
      body: 'Resolved answers become team memory, so the next person facing the same problem can find the fix faster.'
    }
  ];

  constructor(public questionService: QuestionService, public authService: AuthService) {}

  get isLoggedIn() { return this.authService.isLoggedIn; }
  get totalPages() { return Math.ceil(this.total / this.pageSize); }
  get showFeaturedIntro() { return !this.isLoggedIn && !this.searchQuery && !this.tagFilter && this.currentPage === 1; }
  get pageNumbers() {
    const pages = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, start + 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    const params: any = { page: this.currentPage, pageSize: this.pageSize };
    if (this.searchQuery) params.search = this.searchQuery;
    if (this.tagFilter) params.tag = this.tagFilter;
    if (this.resolvedFilter !== null) params.resolved = this.resolvedFilter;

    this.questionService.getAll(params).subscribe({
      next: (res) => { this.questions = res.questions; this.total = res.total; this.loading = false; },
      error: () => this.loading = false
    });
  }

  search() { this.currentPage = 1; this.load(); }
  setFilter(val: boolean | null) { this.resolvedFilter = val; this.currentPage = 1; this.load(); }
  filterByTag(tag: string, e: Event) { e.stopPropagation(); this.tagFilter = tag; this.currentPage = 1; this.load(); }
  clearSearch() { this.searchQuery = ''; this.load(); }
  clearTag() { this.tagFilter = ''; this.load(); }
  goToPage(p: number) { this.currentPage = p; this.load(); window.scrollTo(0, 0); }
  getTags(tags?: string): string[] { return tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : []; }
}
