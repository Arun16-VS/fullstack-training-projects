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
      <div class="page-header">
        <div>
          <h1>Questions</h1>
          <p class="text-muted">{{ total }} questions in the community</p>
        </div>
        <a *ngIf="isLoggedIn" routerLink="/questions/ask" class="btn btn-primary">Ask Question</a>
      </div>

      <section *ngIf="showFeaturedIntro" class="featured-intro">
        <div class="intro-copy">
          <span class="eyebrow">How DoConnect Helps</span>
          <h2>Ask practical questions, share fixes, and keep a useful record for the team.</h2>
          <p>Browse real discussions before signing in. Once you join, you can post questions with screenshots, answer others, and track updates in one place.</p>
        </div>
        <div class="featured-grid">
          <article *ngFor="let item of featuredQuestions" class="featured-card">
            <span class="featured-tag">{{ item.tag }}</span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.body }}</p>
          </article>
        </div>
      </section>

      <div class="filters-bar">
        <div class="search-wrap">
          <span class="search-icon">Q</span>
          <input type="text" [(ngModel)]="searchQuery" (keyup.enter)="search()"
            placeholder="Search questions..." class="search-input">
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
    .page-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      padding: 40px 0 24px;
    }
    .page-header h1 { margin-bottom: 6px; font-size: 3rem; }
    .featured-intro {
      margin-bottom: 24px; padding: 28px;
      background: linear-gradient(135deg, rgba(255,255,255,0.92), rgba(247,241,230,0.96));
      border: 1px solid var(--border); border-radius: 24px; box-shadow: var(--shadow);
    }
    .eyebrow {
      display: inline-block; margin-bottom: 10px; padding: 4px 10px;
      border-radius: 999px; background: var(--bg-hover); color: var(--accent);
      font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;
    }
    .intro-copy h2 { max-width: 760px; margin-bottom: 10px; font-size: 2rem; line-height: 1.15; }
    .intro-copy p { max-width: 720px; color: var(--text-secondary); font-size: 1rem; }
    .featured-grid {
      margin-top: 22px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
    }
    .featured-card {
      background: rgba(255,255,255,0.82); border: 1px solid var(--border);
      border-radius: 18px; padding: 18px; min-height: 180px;
    }
    .featured-card h3 { font-family: var(--font-display); font-size: 1.15rem; margin: 10px 0 8px; }
    .featured-card p { color: var(--text-secondary); font-size: 0.95rem; }
    .featured-tag {
      display: inline-block; padding: 4px 10px; border-radius: 999px;
      background: #eef3fb; color: var(--accent); font-size: 0.75rem; font-weight: 600;
    }
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
    @media (max-width: 900px) {
      .featured-grid { grid-template-columns: 1fr; }
      .q-preview-row { flex-direction: column; }
      .q-thumb { width: 100%; height: auto; max-height: 280px; }
    }
    @media (max-width: 600px) {
      .q-stats { flex-direction: row; min-width: unset; }
      .question-card { flex-direction: column; }
      .page-header { flex-direction: column; gap: 16px; }
      .page-header h1 { font-size: 2.4rem; }
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
  featuredQuestions = [
    {
      tag: 'UI Feedback',
      title: 'Share screenshots when the issue is visual',
      body: 'Design or alignment problems are easier to understand when the team can see the exact screen.'
    },
    {
      tag: 'Code Help',
      title: 'Explain what changed and what broke',
      body: 'Good questions help others answer faster because they include the expected result and the current issue.'
    },
    {
      tag: 'Team Memory',
      title: 'Keep useful fixes easy to find later',
      body: 'Resolved discussions become a lightweight knowledge base for both users and admins.'
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
