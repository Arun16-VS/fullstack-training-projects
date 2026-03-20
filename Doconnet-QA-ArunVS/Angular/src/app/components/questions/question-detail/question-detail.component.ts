import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QuestionService, AnswerService, ImageService } from '../../../services/api.services';
import { AuthService } from '../../../services/auth.service';
import { Question, Answer } from '../../../models/models';

@Component({
  selector: 'app-question-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container">
      <div class="detail-page" *ngIf="!loading; else loader">
        <a routerLink="/questions" class="back-link">< All Questions</a>

        <div class="question-section" *ngIf="question">
          <div class="q-header">
            <div class="q-title-area">
              <div class="q-badges">
                <span *ngIf="question.isResolved" class="badge-resolved">Resolved</span>
                <span *ngIf="!question.isResolved" class="badge-unresolved">Open</span>
                <span *ngIf="question.approvalStatus === 'Pending'" class="badge-pending">Pending Approval</span>
                <span *ngIf="question.approvalStatus === 'Rejected'" class="badge-rejected">Rejected</span>
              </div>
              <h1>{{ question.title }}</h1>
              <div class="q-meta-row">
                <span class="text-muted">Asked by <strong class="author" [routerLink]="['/profile', question.userId]">{{ question.username }}</strong></span>
                <span class="text-muted">| {{ question.createdAt | date:'MMM d, yyyy' }}</span>
                <span class="text-muted">| {{ question.viewCount }} views</span>
              </div>
            </div>
          </div>

          <div class="content-row">
            <div class="vote-btn">
              <button (click)="voteQuestion('up')" [disabled]="questionVotePending" title="Upvote">!</button>
              <span class="count">{{ question.voteCount }}</span>
              <button (click)="voteQuestion('down')" [disabled]="questionVotePending" title="Downvote">-</button>
            </div>

            <div class="q-body-area">
              <div class="q-body-text">{{ question.body }}</div>

              <img *ngIf="question.imageUrl" [src]="question.imageUrl" [alt]="question.title" class="question-image">

              <div class="q-tags" *ngIf="question.tags">
                <span *ngFor="let tag of getTags(question.tags)" class="tag">{{ tag }}</span>
              </div>

              <div class="q-actions" *ngIf="isQuestionOwner">
                <button class="btn btn-ghost btn-sm" (click)="editMode = !editMode">Edit</button>
                <button class="btn btn-danger btn-sm" (click)="deleteQuestion()">Delete</button>
                <button *ngIf="!question.isResolved" class="btn btn-success btn-sm" (click)="markResolved()">Mark Resolved</button>
              </div>

              <div class="edit-form" *ngIf="editMode">
                <div class="form-group mt-16">
                  <label>Title</label>
                  <input type="text" [(ngModel)]="editTitle" class="form-control">
                </div>
                <div class="form-group">
                  <label>Body</label>
                  <textarea [(ngModel)]="editBody" class="form-control" rows="6"></textarea>
                </div>
                <div class="form-group">
                  <label>Image (optional)</label>
                  <div class="image-picker">
                    <label class="btn btn-ghost btn-sm upload-label" for="edit-question-image">Change Image</label>
                    <input id="edit-question-image" type="file" accept="image/*" (change)="onFileSelected($event)">
                    <button *ngIf="editImageUrl" type="button" class="btn btn-ghost btn-sm" (click)="removeImage()">Remove Image</button>
                  </div>
                  <img *ngIf="editImageUrl" [src]="editImageUrl" [alt]="editTitle" class="question-image edit-preview">
                </div>
                <div class="form-group">
                  <label>Tags</label>
                  <input type="text" [(ngModel)]="editTags" class="form-control">
                </div>
                <div class="flex gap-8">
                  <button class="btn btn-primary btn-sm" (click)="saveEdit()">Save</button>
                  <button class="btn btn-ghost btn-sm" (click)="cancelEdit()">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="answers-section">
          <h2>{{ answers.length }} {{ answers.length === 1 ? 'Answer' : 'Answers' }}</h2>

          <div class="answers-list" *ngIf="answers.length > 0">
            <div *ngFor="let a of answers" class="answer-card" [class.accepted]="a.isAccepted">
              <div class="accepted-banner" *ngIf="a.isAccepted">Accepted Answer</div>
              <div class="pending-banner" *ngIf="a.approvalStatus === 'Pending'">Pending Approval</div>
              <div class="rejected-banner" *ngIf="a.approvalStatus === 'Rejected'">Rejected</div>

              <div class="content-row">
                <div class="vote-btn">
                  <button (click)="voteAnswer(a, 'up')" [disabled]="isAnswerVotePending(a.answerId)">!</button>
                  <span class="count">{{ a.voteCount }}</span>
                  <button (click)="voteAnswer(a, 'down')" [disabled]="isAnswerVotePending(a.answerId)">-</button>
                  <button *ngIf="isQuestionOwner && !question?.isResolved"
                    class="accept-btn" title="Accept this answer"
                    (click)="acceptAnswer(a.answerId)">OK</button>
                </div>

                <div class="answer-body-area">
                  <div class="answer-body" *ngIf="editingAnswerId !== a.answerId">{{ a.body }}</div>
                  <img *ngIf="a.imageUrl" [src]="a.imageUrl" [alt]="'Answer image for ' + (question?.title || 'question')" class="question-image">

                  <div *ngIf="editingAnswerId === a.answerId">
                    <textarea [(ngModel)]="editAnswerBody" class="form-control" rows="5"></textarea>
                    <div class="flex gap-8 mt-8">
                      <button class="btn btn-primary btn-sm" (click)="saveAnswerEdit(a)">Save</button>
                      <button class="btn btn-ghost btn-sm" (click)="editingAnswerId = null">Cancel</button>
                    </div>
                  </div>

                  <div class="answer-meta">
                    <span class="text-muted">{{ a.username }} | {{ a.createdAt | date:'MMM d, yyyy' }}</span>
                    <div class="flex gap-8" *ngIf="currentUserId === a.userId || isAdmin">
                      <button class="btn btn-ghost btn-sm" (click)="startEditAnswer(a)">Edit</button>
                      <button class="btn btn-danger btn-sm" (click)="deleteAnswer(a.answerId)">Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="post-answer-section" *ngIf="isLoggedIn">
            <h3>Your Answer</h3>
            <div *ngIf="answerError" class="alert alert-error">{{ answerError }}</div>
            <textarea [(ngModel)]="newAnswerBody" class="form-control" rows="8"
              placeholder="Write a detailed answer..."></textarea>
            <div class="form-group mt-16">
              <label>Answer Image (optional)</label>
              <div class="image-picker">
                <label class="btn btn-ghost btn-sm upload-label" for="answer-image">Add Image</label>
                <input id="answer-image" type="file" accept="image/*" (change)="onAnswerFileSelected($event)">
                <button *ngIf="newAnswerImageUrl" type="button" class="btn btn-ghost btn-sm" (click)="removeAnswerImage()">Remove Image</button>
              </div>
              <img *ngIf="newAnswerImageUrl" [src]="newAnswerImageUrl" alt="Answer preview" class="question-image edit-preview">
            </div>
            <button class="btn btn-primary mt-16" (click)="postAnswer()" [disabled]="answerLoading || !newAnswerBody.trim()">
              {{ answerLoading ? 'Posting...' : 'Post Answer' }}
            </button>
          </div>

          <div class="login-prompt" *ngIf="!isLoggedIn">
            <a routerLink="/login" class="btn btn-primary">Login to Answer</a>
          </div>
        </div>
      </div>
    </div>

    <ng-template #loader><div class="spinner"></div></ng-template>
  `,
  styles: [`
    .detail-page { max-width: 920px; margin: 0 auto; padding: 32px 0 60px; }
    .back-link { color: var(--text-muted); text-decoration: none; font-size: 0.95rem; display: block; margin-bottom: 24px; }
    .back-link:hover { color: var(--accent); }
    .question-section { background: var(--bg-card); border: 1px solid var(--border); border-radius: 24px; padding: 30px; margin-bottom: 32px; box-shadow: var(--shadow); }
    .q-header { margin-bottom: 24px; }
    .q-badges { margin-bottom: 10px; }
    .q-header h1 { font-size: 2.1rem; line-height: 1.15; margin-bottom: 12px; }
    .q-meta-row { display: flex; gap: 12px; flex-wrap: wrap; font-size: 0.92rem; }
    .author { color: var(--accent); cursor: pointer; }
    .content-row { display: flex; gap: 20px; }
    .q-body-area, .answer-body-area { flex: 1; }
    .q-body-text, .answer-body { color: var(--text-primary); line-height: 1.7; white-space: pre-wrap; font-size: 1rem; }
    .question-image {
      width: 100%; max-width: 560px; margin-top: 18px; border-radius: 18px;
      border: 1px solid var(--border); box-shadow: var(--shadow);
    }
    .edit-preview { max-width: 320px; margin-top: 12px; }
    .image-picker { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
    .upload-label { cursor: pointer; }
    input[type="file"] { display: none; }
    .q-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 16px; }
    .q-actions { display: flex; gap: 8px; margin-top: 16px; flex-wrap: wrap; }
    .answers-section h2 { font-family: var(--font-display); font-size: 1.5rem; font-weight: 600; margin-bottom: 20px; color: var(--text-primary); }
    .answers-list { display: flex; flex-direction: column; gap: 16px; margin-bottom: 40px; }
    .answer-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 22px; padding: 24px; box-shadow: var(--shadow); }
    .answer-card.accepted { border-color: rgba(47, 133, 90, 0.3); background: rgba(47, 133, 90, 0.04); }
    .accepted-banner { color: var(--success); font-size: 0.9rem; font-weight: 700; margin-bottom: 16px; }
    .pending-banner, .badge-pending {
      color: #9a6700; background: rgba(154, 103, 0, 0.08); border: 1px solid rgba(154, 103, 0, 0.22);
      display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 999px; font-size: 0.8rem; font-weight: 700;
      margin-bottom: 12px;
    }
    .rejected-banner, .badge-rejected {
      color: var(--danger); background: rgba(192, 86, 91, 0.08); border: 1px solid rgba(192, 86, 91, 0.22);
      display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 999px; font-size: 0.8rem; font-weight: 700;
      margin-bottom: 12px;
    }
    .answer-meta { display: flex; justify-content: space-between; align-items: center; margin-top: 16px; flex-wrap: wrap; gap: 8px; }
    .accept-btn {
      background: rgba(47, 133, 90, 0.12); border: 1px solid rgba(47, 133, 90, 0.28);
      color: var(--success); min-width: 36px; height: 36px; border-radius: 8px;
      cursor: pointer; font-size: 0.8rem; font-weight: 700; transition: all 0.2s; display: flex; align-items: center; justify-content: center;
    }
    .accept-btn:hover { background: rgba(47, 133, 90, 0.22); }
    .post-answer-section { background: var(--bg-card); border: 1px solid var(--border); border-radius: 22px; padding: 28px; box-shadow: var(--shadow); }
    .post-answer-section h3 { font-family: var(--font-display); font-size: 1.25rem; font-weight: 600; margin-bottom: 16px; }
    .login-prompt { text-align: center; padding: 32px; }
    .edit-form { margin-top: 16px; background: var(--bg-secondary); border-radius: var(--radius-sm); padding: 16px; border: 1px solid var(--border); }
  `]
})
export class QuestionDetailComponent implements OnInit {
  question: Question | null = null;
  answers: Answer[] = [];
  loading = true;
  editMode = false;
  editTitle = '';
  editBody = '';
  editImageUrl = '';
  editTags = '';
  newAnswerBody = '';
  answerLoading = false;
  answerError = '';
  newAnswerImageUrl = '';
  questionVotePending = false;
  editingAnswerId: number | null = null;
  editAnswerBody = '';
  private answerVotePending = new Set<number>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private questionService: QuestionService,
    private answerService: AnswerService,
    private imageService: ImageService,
    public authService: AuthService
  ) {}

  get isLoggedIn() { return this.authService.isLoggedIn; }
  get isAdmin() { return this.authService.isAdmin; }
  get currentUserId() { return this.authService.currentUser?.userId; }
  get isQuestionOwner() { return this.question && this.currentUserId === this.question.userId; }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.questionService.getById(id).subscribe({
      next: (res) => {
        this.question = res.question;
        this.answers = res.answers;
        this.editTitle = res.question.title;
        this.editBody = res.question.body;
        this.editImageUrl = res.question.imageUrl || '';
        this.editTags = res.question.tags || '';
        this.loading = false;
      },
      error: () => this.router.navigate(['/questions'])
    });
  }

  getTags(tags?: string): string[] { return tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : []; }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.imageService.upload(file, 'question').subscribe({
      next: (res) => this.editImageUrl = res.url,
      error: () => this.answerError = 'Question image upload failed.'
    });
  }

  removeImage() {
    this.editImageUrl = '';
  }

  cancelEdit() {
    this.editMode = false;
    if (!this.question) return;
    this.editTitle = this.question.title;
    this.editBody = this.question.body;
    this.editImageUrl = this.question.imageUrl || '';
    this.editTags = this.question.tags || '';
  }

  voteQuestion(type: 'up' | 'down') {
    if (!this.isLoggedIn || this.questionVotePending) return;
    this.questionVotePending = true;
    this.questionService.vote(this.question!.questionId, type).subscribe({
      next: (r) => this.question!.voteCount = r.voteCount,
      error: () => this.questionVotePending = false,
      complete: () => this.questionVotePending = false
    });
  }

  saveEdit() {
    this.questionService.update(this.question!.questionId, {
      title: this.editTitle,
      body: this.editBody,
      imageUrl: this.editImageUrl,
      tags: this.editTags
    }).subscribe(() => {
      this.question!.title = this.editTitle;
      this.question!.body = this.editBody;
      this.question!.imageUrl = this.editImageUrl;
      this.question!.tags = this.editTags;
      this.editMode = false;
    });
  }

  deleteQuestion() {
    if (!confirm('Delete this question?')) return;
    this.questionService.delete(this.question!.questionId).subscribe(() => this.router.navigate(['/questions']));
  }

  markResolved() {
    this.questionService.resolve(this.question!.questionId).subscribe(() => this.question!.isResolved = true);
  }

  acceptAnswer(answerId: number) {
    this.questionService.resolve(this.question!.questionId, answerId).subscribe(() => {
      this.question!.isResolved = true;
      this.question!.acceptedAnswerId = answerId;
      this.answers.forEach(a => a.isAccepted = a.answerId === answerId);
    });
  }

  postAnswer() {
    if (!this.newAnswerBody.trim()) return;
    this.answerLoading = true;
    this.answerError = '';
    this.answerService.create({
      body: this.newAnswerBody,
      imageUrl: this.newAnswerImageUrl,
      questionId: this.question!.questionId
    }).subscribe({
      next: () => {
        if (!this.isAdmin) {
          alert('Answer submitted. It is waiting for admin approval.');
        }
        this.newAnswerBody = '';
        this.newAnswerImageUrl = '';
        this.answerLoading = false;
        this.ngOnInit();
      },
      error: (err) => { this.answerError = err.error?.message || 'Failed to post answer.'; this.answerLoading = false; }
    });
  }

  voteAnswer(a: Answer, type: 'up' | 'down') {
    if (!this.isLoggedIn || this.answerVotePending.has(a.answerId)) return;
    this.answerVotePending.add(a.answerId);
    this.answerService.vote(a.answerId, type).subscribe({
      next: (r) => a.voteCount = r.voteCount,
      error: () => this.answerVotePending.delete(a.answerId),
      complete: () => this.answerVotePending.delete(a.answerId)
    });
  }

  isAnswerVotePending(answerId: number) {
    return this.answerVotePending.has(answerId);
  }

  startEditAnswer(a: Answer) { this.editingAnswerId = a.answerId; this.editAnswerBody = a.body; }

  saveAnswerEdit(a: Answer) {
    this.answerService.update(a.answerId, { body: this.editAnswerBody, imageUrl: a.imageUrl }).subscribe(() => {
      a.body = this.editAnswerBody;
      this.editingAnswerId = null;
    });
  }

  deleteAnswer(id: number) {
    if (!confirm('Delete this answer?')) return;
    this.answerService.delete(id).subscribe(() => this.answers = this.answers.filter(a => a.answerId !== id));
  }

  onAnswerFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.imageService.upload(file, 'answer').subscribe({
      next: (res) => this.newAnswerImageUrl = res.url,
      error: () => this.answerError = 'Answer image upload failed.'
    });
  }

  removeAnswerImage() {
    this.newAnswerImageUrl = '';
  }
}
