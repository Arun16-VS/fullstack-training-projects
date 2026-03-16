import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { QuestionService } from '../../../services/api.services';

@Component({
  selector: 'app-ask-question',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="ask-page">
        <div class="ask-header">
          <a routerLink="/questions" class="back-link">< Back to Questions</a>
          <h1>Ask a Question</h1>
          <p class="text-muted">Share the issue clearly so others can help quickly.</p>
        </div>

        <div class="ask-layout">
          <div class="ask-form-wrap">
            <div *ngIf="error" class="alert alert-error">{{ error }}</div>

            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <div class="form-group">
                <label>Question Title *</label>
                <input type="text" formControlName="title" class="form-control"
                  [class.is-invalid]="submitted && f['title'].errors"
                  placeholder="What's your question? Be specific.">
                <small *ngIf="submitted && f['title'].errors?.['required']" class="field-error">Title is required</small>
                <small *ngIf="submitted && f['title'].errors?.['minlength']" class="field-error">Title must be at least 15 characters</small>
              </div>

              <div class="form-group">
                <label>Body / Details *</label>
                <textarea formControlName="body" class="form-control" rows="10"
                  [class.is-invalid]="submitted && f['body'].errors"
                  placeholder="Describe the issue, what you expected, and what you already tried."></textarea>
                <small *ngIf="submitted && f['body'].errors?.['required']" class="field-error">Question body is required</small>
              </div>

              <div class="form-group">
                <label>Image (optional)</label>
                <div class="image-picker">
                  <label class="btn btn-ghost btn-sm upload-label" for="question-image">Add Image</label>
                  <input id="question-image" type="file" accept="image/*" (change)="onFileSelected($event)">
                  <small class="hint">Use this for screenshots, errors, or UI issues.</small>
                </div>
                <div *ngIf="imagePreview" class="image-preview-wrap">
                  <img [src]="imagePreview" alt="Question preview" class="image-preview">
                  <button type="button" class="btn btn-ghost btn-sm" (click)="removeImage()">Remove Image</button>
                </div>
              </div>

              <div class="form-group">
                <label>Tags <span class="optional">(optional)</span></label>
                <input type="text" formControlName="tags" class="form-control"
                  placeholder="e.g. angular, csharp, sql">
                <small class="hint">Add up to 5 tags to describe the topic</small>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn btn-primary" [disabled]="loading">
                  {{ loading ? 'Posting...' : 'Post Question' }}
                </button>
                <a routerLink="/questions" class="btn btn-ghost">Cancel</a>
              </div>
            </form>
          </div>

          <div class="ask-tips">
            <h3>Before you post</h3>
            <ul>
              <li>Use the title to state the problem clearly</li>
              <li>Mention what you already tried</li>
              <li>Add code, screenshots, or error details when helpful</li>
              <li>Keep the question focused on one issue</li>
              <li>Add a few tags so others can find it quickly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ask-page { padding: 40px 0; max-width: 1040px; margin: 0 auto; }
    .ask-header { margin-bottom: 32px; }
    .back-link { color: var(--text-muted); text-decoration: none; font-size: 0.95rem; display: block; margin-bottom: 16px; }
    .back-link:hover { color: var(--accent); }
    .ask-header h1 { margin-bottom: 4px; }
    .ask-layout { display: grid; grid-template-columns: 1fr 300px; gap: 28px; }
    .ask-form-wrap { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 28px; box-shadow: var(--shadow); }
    .image-picker { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
    .upload-label { cursor: pointer; }
    input[type="file"] { display: none; }
    .image-preview-wrap { margin-top: 12px; display: flex; flex-direction: column; align-items: flex-start; gap: 10px; }
    .image-preview { width: 100%; max-width: 360px; border-radius: 14px; border: 1px solid var(--border); box-shadow: var(--shadow); object-fit: cover; }
    .form-actions { display: flex; gap: 12px; margin-top: 8px; }
    .optional { color: var(--text-muted); font-weight: 400; font-size: 0.8rem; }
    .hint { color: var(--text-muted); font-size: 0.82rem; margin-top: 4px; display: block; }
    .field-error { color: var(--danger); font-size: 0.78rem; margin-top: 4px; display: block; }
    .ask-tips {
      background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius);
      padding: 24px; height: fit-content; position: sticky; top: 80px; box-shadow: var(--shadow);
    }
    .ask-tips h3 { font-family: var(--font-display); font-size: 1.1rem; font-weight: 600; margin-bottom: 16px; color: var(--text-primary); }
    .ask-tips ul { list-style: disc; padding-left: 18px; display: flex; flex-direction: column; gap: 12px; }
    .ask-tips li { font-size: 0.95rem; color: var(--text-secondary); line-height: 1.5; }
    @media (max-width: 768px) {
      .ask-layout { grid-template-columns: 1fr; }
      .ask-tips { display: none; }
    }
  `]
})
export class AskQuestionComponent {
  form: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  imagePreview = '';

  constructor(private fb: FormBuilder, private questionService: QuestionService, private router: Router) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(15)]],
      body: ['', Validators.required],
      imageUrl: [''],
      tags: ['']
    });
  }

  get f() { return this.form.controls; }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = String(reader.result || '');
      this.form.patchValue({ imageUrl: this.imagePreview });
    };
    reader.readAsDataURL(file);
  }

  removeImage() {
    this.imagePreview = '';
    this.form.patchValue({ imageUrl: '' });
  }

  onSubmit() {
    this.submitted = true;
    this.error = '';
    if (this.form.invalid) return;
    this.loading = true;

    this.questionService.create(this.form.value).subscribe({
      next: (res) => this.router.navigate(['/questions', res.questionId]),
      error: (err) => { this.error = err.error?.message || 'Failed to post question.'; this.loading = false; }
    });
  }
}
